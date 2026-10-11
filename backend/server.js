/* Job Saathi CMS API — no external packages required. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const dataFile = path.join(root, 'data', 'cms.json');
const uploadDir = path.join(root, 'uploads');
const adminPassword = process.env.CMS_ADMIN_PASSWORD || 'change-me';
const sessions = new Set();
const userSessions = new Map();
const priorityPaymentOrders = new Map();

const initialData = {
  settings: {
    brandName: 'Job Saathi',
    heroTitle: 'Purpose-driven careers.',
    heroSubtitle: 'Engineered to perfection.',
    heroDescription: 'Discover verified opportunities across UN Agencies, Top NGOs, ESG Foundations, and CSR Tenders.',
    jobPostingFee: 4999,
    priorityResumeFee: 299,
    priorityApplicationFee: 99,
    currency: 'INR',
    paymentProvider: 'razorpay'
  },
  jobs: [],
  users: [],
  applications: [],
  resumes: [],
  sectors: ['Health', 'Climate', 'Education', 'CSR'],
  locations: ['New Delhi', 'Mumbai', 'Bengaluru', 'Remote']
};

function loadData() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  data.users ||= [];
  data.applications ||= [];
  data.resumes ||= [];
  data.settings.jobPostingFee ??= 4999;
  data.settings.priorityResumeFee ??= 299;
  data.settings.priorityApplicationFee ??= 99;
  for (const user of data.users) {
    user.freeBasicResumeUsed ??= false;
    user.priorityCredits ??= { resume: 0, application: 0 };
  }
  return data;
}
function saveData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }
function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}
function body(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
function jsonBody(req) {
  return body(req).then(raw => raw.length ? JSON.parse(raw.toString('utf8')) : {});
}
function isAdmin(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return sessions.has(token);
}
function adminOnly(req, res) {
  if (isAdmin(req)) return true;
  send(res, 401, { error: 'Admin authentication is required.' });
  return false;
}
function id() { return crypto.randomUUID(); }
function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) { return { salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') }; }
function currentUser(req, data) { const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); return data.users.find(user => user.id === userSessions.get(token)); }
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, jobPostCount: user.jobPostCount || 0, freeBasicResumeUsed: Boolean(user.freeBasicResumeUsed), priorityCredits: user.priorityCredits || { resume: 0, application: 0 } };
}
function requireUser(req, res, data) {
  const user = currentUser(req, data);
  if (!user) { send(res, 401, { error: 'Please register or log in to continue.', code: 'authentication_required' }); return null; }
  return user;
}
function priorityKind(input) { return input === 'priority_application' ? 'application' : input === 'priority_resume' ? 'resume' : null; }
function priorityAmount(data, kind) { return Math.round(Number(kind === 'resume' ? data.settings.priorityResumeFee : data.settings.priorityApplicationFee) * 100); }
function addPriorityCredit(user, kind) { user.priorityCredits ||= { resume: 0, application: 0 }; user.priorityCredits[kind] = Number(user.priorityCredits[kind] || 0) + 1; }
function consumePriorityCredit(user, kind) { user.priorityCredits ||= { resume: 0, application: 0 }; if (Number(user.priorityCredits[kind] || 0) < 1) return false; user.priorityCredits[kind] -= 1; return true; }
function cleanJob(job) {
  const required = ['title', 'organization', 'location', 'sector', 'description'];
  for (const key of required) if (!String(job[key] || '').trim()) throw new Error(`${key} is required.`);
  return {
    id: job.id || id(), title: String(job.title).trim(), organization: String(job.organization).trim(),
    location: String(job.location).trim(), sector: String(job.sector).trim(), description: String(job.description).trim(),
    type: ['standard', 'premium', 'rfp'].includes(job.type) ? job.type : 'standard',
    experience: String(job.experience || 'Not specified').trim(), deadline: String(job.deadline || '').trim(),
    status: job.status === 'draft' ? 'draft' : 'published', createdAt: job.createdAt || new Date().toISOString()
  };
}
function parseMultipart(req, raw) {
  const boundary = (req.headers['content-type'] || '').match(/boundary=(.+)$/)?.[1];
  if (!boundary) throw new Error('Expected multipart form data.');
  const result = { fields: {}, file: null };
  for (const part of raw.toString('binary').split(`--${boundary}`)) {
    const split = part.indexOf('\r\n\r\n');
    if (split < 0) continue;
    const headers = part.slice(0, split); const value = part.slice(split + 4, -2);
    const name = headers.match(/name="([^"]+)"/)?.[1]; if (!name) continue;
    const filename = headers.match(/filename="([^"]*)"/)?.[1];
    if (filename) {
      const safe = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, safe), Buffer.from(value, 'binary'));
      result.file = { name: safe, originalName: filename };
    } else result.fields[name] = value;
  }
  return result;
}
function serveStatic(res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = path.normalize(path.join(root, requested));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return false;
  const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg' }[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type }); fs.createReadStream(file).pipe(res); return true;
}

const locationAliases = {
  'delhi': ['delhi', 'new delhi', 'ncr', 'noida', 'gurugram', 'gurgaon'],
  'maharashtra': ['maharashtra', 'mumbai', 'pune', 'nagpur', 'thane', 'navi mumbai'],
  'karnataka': ['karnataka', 'bengaluru', 'bangalore', 'mysore', 'hubli'],
  'tamil nadu': ['tamil nadu', 'chennai', 'coimbatore', 'madurai'],
  'telangana': ['telangana', 'hyderabad', 'secunderabad'],
  'west bengal': ['west bengal', 'kolkata', 'howrah'],
  'gujarat': ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'gandhinagar'],
  'rajasthan': ['rajasthan', 'jaipur', 'jodhpur', 'udaipur'],
  'uttar pradesh': ['uttar pradesh', 'lucknow', 'noida', 'kanpur', 'varanasi', 'agra'],
  'bihar': ['bihar', 'patna', 'gaya'],
  'jharkhand': ['jharkhand', 'ranchi', 'jamshedpur'],
  'madhya pradesh': ['madhya pradesh', 'bhopal', 'indore'],
  'kerala': ['kerala', 'kochi', 'thiruvananthapuram', 'cochin'],
  'odisha': ['odisha', 'orissa', 'bhubaneswar', 'cuttack'],
  'punjab': ['punjab', 'chandigarh', 'ludhiana', 'amritsar'],
  'haryana': ['haryana', 'gurugram', 'gurgaon', 'faridabad', 'panipat', 'chandigarh'],
  'chandigarh': ['chandigarh'],
  'andhra pradesh': ['andhra pradesh', 'visakhapatnam', 'vijayawada', 'tirupati'],
  'assam': ['assam', 'guwahati'],
  'jammu and kashmir': ['jammu', 'kashmir', 'srinagar'],
  'uttarakhand': ['uttarakhand', 'dehradun', 'rishikesh', 'haridwar'],
  'himachal pradesh': ['himachal pradesh', 'shimla', 'dharamshala'],
  'goa': ['goa', 'panaji']
};

function matchesLocation(jobLoc, target) {
  if (!target || target === 'all') return true;
  const j = (jobLoc || '').toLowerCase();
  const t = target.toLowerCase();
  if (t === 'remote') return j.includes('remote');
  if (j.includes(t)) return true;
  const aliases = locationAliases[t];
  if (aliases && aliases.some(a => j.includes(a))) return true;
  return false;
}

function matchesSector(jobSec, target) {
  if (!target || target === 'all') return true;
  const j = (jobSec || '').toLowerCase();
  const t = target.toLowerCase();
  return j.includes(t) || t.includes(j);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`); const pathname = url.pathname;
  try {
    if (req.method === 'GET' && pathname === '/api/public') {
      const data = loadData(); return send(res, 200, { settings: data.settings, sectors: data.sectors, locations: data.locations });
    }
    if (req.method === 'GET' && pathname === '/api/jobs') {
      const data = loadData();
      const q = (url.searchParams.get('q') || '').toLowerCase().trim();
      const location = (url.searchParams.get('location') || '').toLowerCase().trim();
      const sector = (url.searchParams.get('sector') || '').toLowerCase().trim();
      const type = (url.searchParams.get('type') || '').toLowerCase().trim();
      const jobs = data.jobs.filter(job => job.status === 'published').filter(job => {
        const matchesQ = !q || [job.title, job.organization, job.description, job.sector, job.location].join(' ').toLowerCase().includes(q);
        const matchesLoc = matchesLocation(job.location, location);
        const matchesSec = matchesSector(job.sector, sector);
        const matchesType = !type || type === 'all' || job.type === type;
        return matchesQ && matchesLoc && matchesSec && matchesType;
      });
      jobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return send(res, 200, { jobs, total: jobs.length });
    }
    if (req.method === 'POST' && pathname === '/api/auth/signup') {
      const input = await jsonBody(req); const email = String(input.email || '').trim().toLowerCase(); const name = String(input.name || '').trim(); const password = String(input.password || '');
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return send(res, 400, { error: 'Name, valid email, and an 8-character password are required.' });
      const data = loadData(); if (data.users.some(user => user.email === email)) return send(res, 409, { error: 'An account already exists for this email.' });
      const secret = passwordHash(password); const user = { id: id(), name, email, passwordHash: secret.hash, passwordSalt: secret.salt, jobPostCount: 0, freeBasicResumeUsed: false, priorityCredits: { resume: 0, application: 0 }, createdAt: new Date().toISOString() }; data.users.push(user); saveData(data);
      const token = crypto.randomBytes(32).toString('hex'); userSessions.set(token, user.id); return send(res, 201, { token, user: publicUser(user) });
    }
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const input = await jsonBody(req); const data = loadData(); const user = data.users.find(entry => entry.email === String(input.email || '').trim().toLowerCase());
      if (!user || passwordHash(String(input.password || ''), user.passwordSalt).hash !== user.passwordHash) return send(res, 401, { error: 'Incorrect email or password.' });
      const token = crypto.randomBytes(32).toString('hex'); userSessions.set(token, user.id); return send(res, 200, { token, user: publicUser(user) });
    }
    if (req.method === 'GET' && pathname === '/api/auth/me') { const data = loadData(); const user = currentUser(req, data); return user ? send(res, 200, { user: publicUser(user) }) : send(res, 401, { error: 'Please log in.' }); }
    if (req.method === 'GET' && pathname === '/api/account') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const owns = record => record.userId === user.id;
      return send(res, 200, { user: publicUser(user), resumes: data.resumes.filter(owns), applications: data.applications.filter(owns) });
    }
    if (req.method === 'GET' && pathname === '/api/admin/data') { if (!adminOnly(req, res)) return; return send(res, 200, loadData()); }
    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const input = await jsonBody(req); const supplied = String(input.password || ''); if (supplied.length !== adminPassword.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(adminPassword))) return send(res, 401, { error: 'Incorrect password.' });
      const token = crypto.randomBytes(32).toString('hex'); sessions.add(token); return send(res, 200, { token });
    }
    if (req.method === 'PUT' && pathname === '/api/admin/settings') {
      if (!adminOnly(req, res)) return; const input = await jsonBody(req); const data = loadData(); data.settings = { ...data.settings, ...input }; saveData(data); return send(res, 200, { settings: data.settings });
    }
    if (req.method === 'POST' && pathname === '/api/admin/jobs') {
      if (!adminOnly(req, res)) return; const data = loadData(); const job = cleanJob(await jsonBody(req)); data.jobs.unshift(job); saveData(data); return send(res, 201, { job });
    }
    if (req.method === 'PUT' && /^\/api\/admin\/jobs\//.test(pathname)) {
      if (!adminOnly(req, res)) return; const data = loadData(); const index = data.jobs.findIndex(job => job.id === pathname.split('/').pop()); if (index < 0) return send(res, 404, { error: 'Job not found.' });
      data.jobs[index] = cleanJob({ ...data.jobs[index], ...(await jsonBody(req)) }); saveData(data); return send(res, 200, { job: data.jobs[index] });
    }
    if (req.method === 'DELETE' && /^\/api\/admin\/jobs\//.test(pathname)) {
      if (!adminOnly(req, res)) return; const data = loadData(); data.jobs = data.jobs.filter(job => job.id !== pathname.split('/').pop()); saveData(data); return send(res, 204, {});
    }
    if (req.method === 'POST' && (pathname === '/api/resumes' || pathname === '/api/applications')) {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const parsed = parseMultipart(req, await body(req));
      if (!parsed.file) return send(res, 400, { error: 'A resume file is required.' });
      const isResume = pathname === '/api/resumes';
      const preference = String(parsed.fields.preference || 'basic').toLowerCase() === 'priority' ? 'priority' : 'basic';
      if (!isResume && preference === 'basic' && String(parsed.fields.jobTier || 'basic') !== 'basic') return send(res, 403, { error: 'Priority opportunities require a priority application credit.', code: 'priority_payment_required' });
      if (preference === 'priority') {
        const kind = isResume ? 'resume' : 'application';
        if (!consumePriorityCredit(user, kind)) return send(res, 402, { error: 'Priority access requires payment before you can continue.', code: 'priority_payment_required', kind: `priority_${kind}` });
      } else if (isResume) {
        if (user.freeBasicResumeUsed) return send(res, 402, { error: 'Your one free basic resume post has been used. Choose priority posting to continue.', code: 'priority_payment_required', kind: 'priority_resume' });
        user.freeBasicResumeUsed = true;
      }
      const record = { id: id(), userId: user.id, name: user.name, email: user.email, preference, ...parsed.fields, resume: parsed.file, createdAt: new Date().toISOString() };
      if (isResume) data.resumes.unshift(record); else data.applications.unshift(record);
      saveData(data); return send(res, 201, { record, user: publicUser(user) });
    }
    if (req.method === 'POST' && pathname === '/api/payments/priority') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const kind = priorityKind((await jsonBody(req)).kind);
      if (!kind) return send(res, 400, { error: 'Choose a valid priority service.' });
      const amount = priorityAmount(data, kind); const receipt = `priority_${kind}_${Date.now()}`;
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        const orderId = `demo_${id()}`; priorityPaymentOrders.set(orderId, { userId: user.id, kind, amount, demo: true });
        return send(res, 200, { mode: 'demo', orderId, amount, currency: data.settings.currency, kind, message: 'Demo payment is enabled. Add Razorpay keys for live checkout.' });
      }
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
      const order = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, currency: data.settings.currency, receipt }) }).then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error?.description || 'Unable to start payment.'); return result; });
      priorityPaymentOrders.set(order.id, { userId: user.id, kind, amount, demo: false });
      return send(res, 200, { mode: 'razorpay', orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, amount, currency: data.settings.currency, kind });
    }
    if (req.method === 'POST' && pathname === '/api/payments/priority/verify') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const input = await jsonBody(req); const order = priorityPaymentOrders.get(String(input.orderId || ''));
      if (!order || order.userId !== user.id) return send(res, 400, { error: 'Payment order was not found.' });
      if (order.demo) {
        if (input.demo !== true) return send(res, 400, { error: 'Demo payment confirmation is required.' });
      } else {
        const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${input.orderId}|${input.paymentId}`).digest('hex');
        if (!input.signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(String(input.signature)))) return send(res, 400, { error: 'Payment verification failed.' });
      }
      addPriorityCredit(user, order.kind); priorityPaymentOrders.delete(String(input.orderId)); saveData(data);
      return send(res, 200, { message: 'Priority access is active.', user: publicUser(user), kind: `priority_${order.kind}` });
    }
    if (req.method === 'POST' && pathname === '/api/payments/job-posting') {
      const data = loadData(); const user = currentUser(req, data); if (!user) return send(res, 401, { error: 'Please log in before posting a job.' }); const amount = user.jobPostCount === 0 ? 0 : Math.round(Number(data.settings.jobPostingFee || 0) * 100);
      if (amount <= 0) return send(res, 200, { mode: 'free', amount: 0, currency: data.settings.currency, message: 'Job posting is free. No payment is required.' });
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return send(res, 200, { mode: 'demo', amount, currency: data.settings.currency, message: 'Add Razorpay keys to activate live checkout.' });
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
      const order = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, currency: data.settings.currency, receipt: `job_${Date.now()}` }) }).then(r => r.json());
      return send(res, 200, { mode: 'razorpay', orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, amount, currency: data.settings.currency });
    }
    if (!serveStatic(res, pathname)) send(res, 404, { error: 'Not found.' });
  } catch (error) { send(res, 400, { error: error.message || 'Request failed.' }); }
}).listen(process.env.PORT || 3000, () => console.log('Job Saathi CMS running at http://localhost:3000'));
