/* Job Saathi CMS API. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const {
  initializeDatabase,
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  getUserByEmail,
  createUserAccount,
  acceptUserConsent,
  updateUserProfile,
  incrementUserLoginCount,
  claimFirstUserLogin,
  getAdminByIdentifier,
  updateAdminPassword,
  createPasswordSecret,
  createAdminInvite,
  getActiveAdminInvite,
  deleteAdminInvite,
  completeAdminInvite
} = require('./db');

const root = path.resolve(__dirname, '..');
const dataFile = path.join(root, 'data', 'cms.json');
const uploadDir = path.join(root, 'uploads');
const sessions = new Set();
const userSessions = new Map();
const userSignupChallenges = new Map();
const priorityPaymentOrders = new Map();
const applicationPaymentOrders = new Map();
const adminResetChallenges = new Map();
const adminInviteOtpChallenges = new Map();
const googleOAuthStates = new Map();
const googleAuthCodes = new Map();
const pendingGoogleConsentSessions = new Map();
const TERMS_VERSION = String(process.env.TERMS_VERSION || 'v1').trim() || 'v1';
const PRIVACY_POLICY_VERSION = String(process.env.PRIVACY_POLICY_VERSION || 'v1').trim() || 'v1';

const initialData = {
  settings: {
    brandName: 'Job Saathi',
    heroTitle: 'Purpose-driven careers.',
    heroSubtitle: 'Engineered to perfection.',
    heroDescription: 'Discover verified opportunities across UN Agencies, Top NGOs, ESG Foundations, and CSR Tenders.',
    jobPostingFee: 4999,
    priorityResumeFee: 299,
    priorityApplicationFee: 200,
    currency: 'INR',
    paymentProvider: 'razorpay'
  },
  jobs: [],
  users: [],
  applications: [],
  resumes: [],
  savedJobs: [],
  sectors: ['Health', 'Climate', 'Education', 'CSR'],
  locations: ['New Delhi', 'Mumbai', 'Bengaluru', 'Remote']
};

// These are the statuses visible to jobseekers and managed by administrators.
// `payment_pending` remains an internal pre-submission state for paid applications.
const APPLICATION_STATUSES = Object.freeze([
  'applied',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'interview_completed',
  'offered',
  'hired',
  'rejected',
  'withdrawn'
]);
const APPLICATION_STATUS_SET = new Set(APPLICATION_STATUSES);

function normalizeApplicationStatus(status, paymentStatus) {
  const normalized = String(status || '').trim().toLowerCase();
  if (normalized === 'successful') return 'applied';
  if (APPLICATION_STATUS_SET.has(normalized)) return normalized;
  return paymentStatus === 'paid' ? 'applied' : 'payment_pending';
}

function loadData() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  data.users ||= [];
  data.applications ||= [];
  data.resumes ||= [];
  data.savedJobs ||= [];
  data.settings.jobPostingFee ??= 4999;
  data.settings.priorityResumeFee ??= 299;
  data.settings.priorityApplicationFee ??= 200;
  let applicationStatusesChanged = false;
  for (const application of data.applications) {
    const normalizedStatus = normalizeApplicationStatus(application.status, application.paymentStatus);
    if (application.status !== normalizedStatus) {
      application.status = normalizedStatus;
      applicationStatusesChanged = true;
    }

    // Older versions changed an application to `withdrawn` immediately.
    // Reopen those legacy records as approval requests so the admin can review
    // them under Withdrawal requests before any refund is attempted.
    if (application.status === 'withdrawn' && !application.withdrawalRequest) {
      application.status = 'applied';
      application.withdrawalRequest = {
        status: 'pending',
        requestedAt: application.statusUpdatedAt || application.createdAt || new Date().toISOString(),
        requestedBy: application.userId,
        migratedFromLegacyWithdrawal: true
      };
      applicationStatusesChanged = true;
    }
    if (application.status === 'withdrawn' && application.withdrawalRequest?.status === 'pending') {
      application.withdrawalRequest.status = 'approved';
      application.withdrawalRequest.reviewedAt ||= application.statusUpdatedAt || application.withdrawalRequest.requestedAt;
      application.withdrawalRequest.refundStatus ||= application.paymentStatus === 'paid' ? 'manual_review' : 'not_applicable';
      application.withdrawalRequest.refundMessage ||= application.paymentStatus === 'paid'
        ? 'Previously withdrawn; verify the refund manually before closing this request.'
        : 'Free application; no refund is required.';
      applicationStatusesChanged = true;
    }
  }
  for (const user of data.users) {
    user.loginCount ??= 0;
    user.freeJobAccessUsed ??= data.applications.some(application =>
      String(application.userId) === String(user.id) &&
      (application.paymentStatus === 'free' ||
        application.paymentId === 'free_first_login' ||
        application.paymentId === 'free_first_job_access')
    );
    user.freeBasicResumeUsed ??= false;
    user.priorityCredits ??= { resume: 0, application: 0 };
  }
  if (applicationStatusesChanged) saveData(data);
  return data;
}
function saveData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }
function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function formatJob(job) {
  const rawDate = job.last_date instanceof Date
    ? job.last_date.toISOString().slice(0, 10)
    : String(job.last_date || '').slice(0, 10);
  const [year, month, day] = rawDate.split('-');
  return {
    id: job.job_id,
    jobId: `${String(job.job_id).padStart(3, '0')}/${year || new Date().getFullYear()}`,
    title: job.title,
    organization: job.organization,
    location: job.location,
    state: job.state,
    district: job.district,
    lastDate: rawDate,
    deadline: day && month && year ? `${day}.${month}.${year}` : rawDate
  };
}

function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function jobDeadline(job) {
  return String(job?.last_date || '').slice(0, 10);
}

function jobHasExpired(job) {
  const deadline = jobDeadline(job);
  return Boolean(deadline) && deadline < todayInIndia();
}

async function savedJobsForUser(userId, data) {
  const jobs = await listJobs();
  const jobsById = new Map(jobs.map(job => [String(job.job_id), job]));
  const userKey = String(userId);
  const activeRecords = data.savedJobs
    .filter(record => String(record.userId) === userKey)
    .filter(record => {
      const job = jobsById.get(String(record.jobId));
      return job && !jobHasExpired(job);
    });
  const activeJobIds = new Set(activeRecords.map(record => String(record.jobId)));
  const beforeCleanup = data.savedJobs.length;
  data.savedJobs = data.savedJobs.filter(record =>
    String(record.userId) !== userKey || activeJobIds.has(String(record.jobId))
  );
  if (data.savedJobs.length !== beforeCleanup) saveData(data);

  return activeRecords
    .map(record => jobsById.get(String(record.jobId)))
    .filter(Boolean)
    .map(formatJob);
}

function normalizeJobInput(input) {
  const value = input || {};
  const required = ['title', 'organization', 'location', 'state', 'district'];
  for (const field of required) {
    if (!String(value[field] || '').trim()) throw new Error(`${field} is required.`);
  }

  let lastDate = String(value.last_date || value.lastDate || '').trim();
  if (!lastDate && String(value.deadline || '').trim()) lastDate = String(value.deadline).trim();
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(lastDate)) {
    const [day, month, year] = lastDate.split('.');
    lastDate = `${year}-${month}-${day}`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDate)) {
    throw new Error('last_date is required in YYYY-MM-DD format.');
  }

  return {
    title: String(value.title).trim(),
    organization: String(value.organization).trim(),
    location: String(value.location).trim(),
    state: String(value.state).trim(),
    district: String(value.district).trim(),
    last_date: lastDate
  };
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
function sameSecret(left, right) {
  const first = Buffer.from(String(left));
  const second = Buffer.from(String(right));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
}
function hashResetValue(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function otpExpiryMs() { return Math.max(1, Number(process.env.OTP_EXPIRY_MINUTES || 10)) * 60 * 1000; }
function hasStrongPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?~]/.test(password);
}
function hasStrongAdminPassword(password) { return hasStrongPassword(password); }
function smtpIsConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}
function smtpTransporter() {
  if (!smtpIsConfigured()) throw new Error('SMTP email settings are not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and MAIL_FROM to .env.');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  });
}
async function sendAdminEmail({ to, subject, text, html, replyTo }) {
  const transporter = smtpTransporter();
  const message = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  };
  if (replyTo) message.replyTo = replyTo;
  await transporter.sendMail(message);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendContactMessageEmail({ name, email, subject, message }) {
  const recipient = String(process.env.CONTACT_EMAIL || 'myappointers@gmail.com').trim();
  const topicLabels = {
    'job-help': 'Help with Job Application',
    resume: 'Resume Posting Question',
    employer: 'Employer / School Recruiter Inquiry',
    feedback: 'Platform Feedback & Suggestions'
  };
  const topic = topicLabels[subject] || subject;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');

  await sendAdminEmail({
    to: recipient,
    replyTo: email,
    subject: `Contact form: ${topic}`,
    text: `New contact form message\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
    html: `<h2>New contact form message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Topic:</strong> ${safeTopic}</p><p><strong>Message:</strong><br />${safeMessage}</p>`
  });
}
async function sendAdminOtpEmail(email, otp) {
  await sendAdminEmail({
    to: email,
    subject: 'Job Saathi admin password reset OTP',
    text: `Your Job Saathi admin password reset OTP is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
    html: `<p>Your Job Saathi admin password reset OTP is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p><p>This OTP expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>`
  });
}
async function sendAdminInviteOtpEmail(email, otp) {
  const expiry = process.env.OTP_EXPIRY_MINUTES || 10;
  await sendAdminEmail({
    to: email,
    subject: 'Job Saathi admin email verification OTP',
    text: `Your Job Saathi admin email verification OTP is ${otp}. It expires in ${expiry} minutes.`,
    html: `<p>Your Job Saathi admin email verification OTP is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p><p>This OTP expires in ${expiry} minutes.</p>`
  });
}
async function sendUserSignupOtpEmail(email, otp) {
  const expiry = process.env.OTP_EXPIRY_MINUTES || 10;
  await sendAdminEmail({
    to: email,
    subject: 'Mera Job Saathi email verification OTP',
    text: `Your Mera Job Saathi email verification OTP is ${otp}. It expires in ${expiry} minutes.`,
    html: `<p>Your Mera Job Saathi email verification OTP is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p><p>This OTP expires in ${expiry} minutes.</p>`
  });
}
async function sendAdminInviteEmail(email, inviteUrl) {
  const expiry = process.env.ADMIN_INVITE_EXPIRY_MINUTES || 30;
  await sendAdminEmail({
    to: email,
    subject: 'Create your Job Saathi admin account',
    text: `You have been invited to create a Job Saathi admin account. Open this link within ${expiry} minutes: ${inviteUrl}`,
    html: `<p>You have been invited to create a Job Saathi admin account.</p><p><a href="${inviteUrl}">Create your admin profile</a></p><p>This link expires in ${expiry} minutes and can be used only once.</p>`
  });
}
function adminInviteExpiryMs() {
  return Math.max(1, Number(process.env.ADMIN_INVITE_EXPIRY_MINUTES || 30)) * 60 * 1000;
}
function validEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function googleOAuthConfigured() {
  return Boolean(String(process.env.GOOGLE_CLIENT_ID || '').trim() && String(process.env.GOOGLE_CLIENT_SECRET || '').trim());
}
function googleRedirectUri(req) {
  if (String(process.env.GOOGLE_REDIRECT_URI || '').trim()) return String(process.env.GOOGLE_REDIRECT_URI).trim();
  const protocol = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  return `${protocol}://${req.headers.host || 'localhost:3000'}/api/auth/google/callback`;
}
function googleSuccessUrl() {
  const configured = String(process.env.GOOGLE_SUCCESS_URL || '').trim();
  if (configured) return configured;
  const baseUrl = String(process.env.APP_BASE_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
  return `${baseUrl}/index.html`;
}
function pruneGoogleAuthMemory() {
  const now = Date.now();
  for (const [key, value] of googleOAuthStates) if (value.expiresAt <= now) googleOAuthStates.delete(key);
  for (const [key, value] of googleAuthCodes) if (value.expiresAt <= now) googleAuthCodes.delete(key);
  for (const [key, value] of pendingGoogleConsentSessions) if (value.expiresAt <= now) pendingGoogleConsentSessions.delete(key);
}
function redirectToGoogleResult(res, params = {}) {
  try {
    const target = new URL(googleSuccessUrl());
    for (const [key, value] of Object.entries(params)) target.searchParams.set(key, String(value));
    res.writeHead(302, { Location: target.toString(), 'Cache-Control': 'no-store' });
    res.end();
  } catch (error) {
    send(res, 500, { error: 'Google sign-in could not complete.' });
  }
}
async function fetchGoogleJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error_description || payload.error || 'Google sign-in request failed.');
  return payload;
}
async function authenticateGoogleProfile(profile, mode = 'login') {
  const email = String(profile.email || '').trim().toLowerCase();
  if (!profile.sub || !validEmail(email) || profile.email_verified === false || profile.verified_email === false) {
    throw new Error('Google did not provide a verified email address.');
  }

  const fallbackName = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  const name = String(profile.name || `${profile.given_name || ''} ${profile.family_name || ''}` || fallbackName)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || fallbackName;
  let account = await getUserByEmail(email);
  if (!account && mode === 'login') {
    const error = new Error('No account exists for this Google email. Choose “Create Account” and then “Create account with Google” first.');
    error.code = 'GOOGLE_ACCOUNT_NOT_FOUND';
    throw error;
  }
  if (account && mode === 'signup') {
    const error = new Error('An account already exists for this Google email. Choose “Log in” and then “Continue with Google”.');
    error.code = 'GOOGLE_ACCOUNT_EXISTS';
    throw error;
  }
  if (!account) {
    const secret = createPasswordSecret(crypto.randomBytes(32).toString('hex'));
    account = await createUserAccount({ name, email, passwordHash: secret.hash, passwordSalt: secret.salt });
  }
  if (!account) throw new Error('Google account could not be created.');

  const data = loadData();
  const consentAlreadyAccepted = Boolean(
    account.terms_accepted_at &&
    account.terms_version === TERMS_VERSION &&
    account.privacy_policy_version === PRIVACY_POLICY_VERSION
  );
  let user = mirrorDatabaseUser(data, account);

  // A Google account must accept the current Terms and Privacy Policy before
  // it receives an authenticated session. Existing consented accounts can
  // continue directly; new and legacy accounts wait in a short-lived,
  // protected consent session instead.
  if (consentAlreadyAccepted) {
    const updatedAccount = Number(user.loginCount || 0) === 0
      ? await claimFirstUserLogin(account.user_id)
      : await incrementUserLoginCount(account.user_id);
    if (!updatedAccount) {
      const nextAccount = await incrementUserLoginCount(account.user_id);
      if (!nextAccount) throw new Error('Unable to record your Google login.');
      user = mirrorDatabaseUser(data, nextAccount);
    } else {
      user = mirrorDatabaseUser(data, updatedAccount);
    }
  }
  saveData(data);

  const token = crypto.randomBytes(32).toString('hex');
  if (!consentAlreadyAccepted) {
    pendingGoogleConsentSessions.set(token, {
      userId: account.user_id,
      user: publicUser(user),
      expiresAt: Date.now() + 10 * 60 * 1000
    });
    return { consentRequired: true, consentToken: token, user: publicUser(user) };
  }

  userSessions.set(token, user.id);
  return { consentRequired: false, token, user: publicUser(user) };
}
function adminBaseUrl(req) {
  const configured = String(process.env.APP_BASE_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  const protocol = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  return `${protocol}://${req.headers.host || 'localhost:3000'}`;
}
function currentUser(req, data) { const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); return data.users.find(user => user.id === userSessions.get(token)); }
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    state: user.state || '',
    district: user.district || '',
    pincode: user.pincode || '',
    termsAcceptedAt: user.termsAcceptedAt || null,
    termsVersion: user.termsVersion || null,
    privacyPolicyVersion: user.privacyPolicyVersion || null,
    jobPostCount: user.jobPostCount || 0,
    freeBasicResumeUsed: Boolean(user.freeBasicResumeUsed),
    priorityCredits: user.priorityCredits || { resume: 0, application: 0 }
  };
}
function mirrorDatabaseUser(data, account) {
  const accountId = String(account.user_id);
  let user = data.users.find(entry => entry.id === accountId || entry.email === account.email);
  if (!user) {
    user = {
      id: accountId,
      name: account.name,
      email: account.email,
      passwordHash: account.password_hash,
      passwordSalt: account.password_salt,
      loginCount: Number(account.login_count || 0),
      phone: account.phone || '',
      address: account.address || '',
      state: account.state || '',
      district: account.district || '',
      pincode: account.pincode || '',
      termsAcceptedAt: account.terms_accepted_at || null,
      termsVersion: account.terms_version || null,
      privacyPolicyVersion: account.privacy_policy_version || null,
      freeJobAccessUsed: false,
      jobPostCount: 0,
      freeBasicResumeUsed: false,
      priorityCredits: { resume: 0, application: 0 },
      createdAt: account.created_at || new Date().toISOString()
    };
    data.users.push(user);
  } else {
    user.id = accountId;
    user.name = account.name;
    user.email = account.email;
    user.passwordHash = account.password_hash;
    user.passwordSalt = account.password_salt;
    user.loginCount = Number(account.login_count || 0);
    user.phone = account.phone || '';
    user.address = account.address || '';
    user.state = account.state || '';
    user.district = account.district || '';
    user.pincode = account.pincode || '';
    user.termsAcceptedAt = account.terms_accepted_at || null;
    user.termsVersion = account.terms_version || null;
    user.privacyPolicyVersion = account.privacy_policy_version || null;
  }
  return user;
}
function requireUser(req, res, data) {
  const user = currentUser(req, data);
  if (!user) { send(res, 401, { error: 'Please register or log in to continue.', code: 'authentication_required' }); return null; }
  return user;
}
function priorityKind(input) { return input === 'priority_application' ? 'application' : input === 'priority_resume' ? 'resume' : null; }
function priorityAmount(data, kind) { return Math.round(Number(kind === 'resume' ? data.settings.priorityResumeFee : data.settings.priorityApplicationFee) * 100); }
async function refundApplicationPayment(application) {
  if (application.paymentStatus !== 'paid') {
    return { status: 'not_applicable', message: 'This application used the free application benefit.' };
  }

  // Demo payments do not move real money, so there is nothing to refund.
  const paymentId = String(application.paymentId || '');
  if (application.paymentMode === 'demo' || paymentId === 'demo' || paymentId.startsWith('demo_')) {
    return { status: 'not_applicable', message: 'Demo payment completed; no real refund was required.' };
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !paymentId.startsWith('pay_')) {
    throw new Error('A live Razorpay payment ID and Razorpay keys are required to issue this refund.');
  }

  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: { reason: 'Application withdrawal', application_id: String(application.id) } })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.description || 'Razorpay could not issue the refund.');
  return {
    status: 'processed',
    refundId: result.id,
    refundAmount: result.amount,
    refundedAt: new Date().toISOString(),
    message: 'Refund initiated to the original payment method.'
  };
}
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
  const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg' }[path.extname(file)] || 'application/octet-stream';
  const noStore = ['.html', '.js'].includes(path.extname(file));
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': noStore ? 'no-store, must-revalidate' : 'public, max-age=3600'
  });
  fs.createReadStream(file).pipe(res); return true;
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`); const pathname = url.pathname;
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      });
      return res.end();
    }
    if (req.method === 'GET' && pathname === '/api/public') {
      const data = loadData(); return send(res, 200, { settings: data.settings, sectors: data.sectors, locations: data.locations });
    }
    if (req.method === 'GET' && pathname === '/api/jobs') {
      const q = (url.searchParams.get('q') || '').toLowerCase().trim();
      const location = (url.searchParams.get('location') || '').toLowerCase().trim();
      const jobs = (await listJobs({ q, location })).map(formatJob);
      return send(res, 200, { jobs, total: jobs.length });
    }
    if (req.method === 'POST' && pathname === '/api/contact') {
      const input = await jsonBody(req);
      const name = String(input.name || '').trim();
      const email = String(input.email || '').trim().toLowerCase();
      const subject = String(input.subject || '').trim();
      const message = String(input.message || '').trim();
      if (name.length < 2 || name.length > 80) return send(res, 400, { error: 'Enter your name between 2 and 80 characters.' });
      if (!validEmail(email)) return send(res, 400, { error: 'Enter a valid email address.' });
      if (!/^[a-z0-9-]{2,40}$/.test(subject)) return send(res, 400, { error: 'Choose a valid topic.' });
      if (message.length < 5 || message.length > 5000) return send(res, 400, { error: 'Enter a message between 5 and 5000 characters.' });
      try {
        await sendContactMessageEmail({ name, email, subject, message });
      } catch (error) {
        console.error(`Contact email failed: ${error.message}`);
        return send(res, 503, { error: 'The message could not be sent right now. Please try again later.' });
      }
      return send(res, 200, { message: 'Your message was sent successfully.' });
    }
    if (req.method === 'GET' && pathname === '/api/auth/google/status') {
      return send(res, 200, { configured: googleOAuthConfigured() });
    }
    if (req.method === 'GET' && pathname === '/api/auth/google/start') {
      if (!googleOAuthConfigured()) return send(res, 503, { error: 'Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.' });
      pruneGoogleAuthMemory();
      const state = crypto.randomBytes(32).toString('hex');
      googleOAuthStates.set(state, {
        mode: url.searchParams.get('mode') === 'signup' ? 'signup' : 'login',
        expiresAt: Date.now() + 10 * 60 * 1000
      });
      const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authorizationUrl.search = new URLSearchParams({
        client_id: String(process.env.GOOGLE_CLIENT_ID).trim(),
        redirect_uri: googleRedirectUri(req),
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'online',
        prompt: 'select_account'
      }).toString();
      res.writeHead(302, { Location: authorizationUrl.toString(), 'Cache-Control': 'no-store' });
      return res.end();
    }
    if (req.method === 'GET' && pathname === '/api/auth/google/callback') {
      pruneGoogleAuthMemory();
      const stateValue = String(url.searchParams.get('state') || '');
      const state = googleOAuthStates.get(stateValue);
      googleOAuthStates.delete(stateValue);
      if (!state || state.expiresAt < Date.now()) return redirectToGoogleResult(res, { google_error: 'Google sign-in expired. Please try again.' });
      if (url.searchParams.get('error')) return redirectToGoogleResult(res, { google_error: 'Google sign-in was cancelled.', google_mode: state.mode });

      const authorizationCode = String(url.searchParams.get('code') || '');
      if (!authorizationCode) return redirectToGoogleResult(res, { google_error: 'Google did not return an authorization code.' });
      try {
        const tokenPayload = await fetchGoogleJson('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: authorizationCode,
            client_id: String(process.env.GOOGLE_CLIENT_ID).trim(),
            client_secret: String(process.env.GOOGLE_CLIENT_SECRET).trim(),
            redirect_uri: googleRedirectUri(req),
            grant_type: 'authorization_code'
          })
        });
        if (!tokenPayload.access_token) throw new Error('Google did not return an access token.');
        const profile = await fetchGoogleJson('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: { Authorization: `Bearer ${tokenPayload.access_token}` }
        });
        const session = await authenticateGoogleProfile(profile, state.mode);
        const exchangeCode = crypto.randomBytes(32).toString('hex');
        googleAuthCodes.set(exchangeCode, {
          ...session,
          expiresAt: Date.now() + 2 * 60 * 1000
        });
        return redirectToGoogleResult(res, { google_code: exchangeCode });
      } catch (error) {
        console.error(`Google sign-in failed: ${error.message}`);
        const userMessage = ['GOOGLE_ACCOUNT_NOT_FOUND', 'GOOGLE_ACCOUNT_EXISTS'].includes(error.code)
          ? error.message
          : 'Google sign-in could not be completed. Please try again.';
        return redirectToGoogleResult(res, { google_error: userMessage, google_mode: state.mode });
      }
    }
    if (req.method === 'POST' && pathname === '/api/auth/google/exchange') {
      pruneGoogleAuthMemory();
      const input = await jsonBody(req);
      const exchangeCode = String(input.code || '').trim();
      const session = googleAuthCodes.get(exchangeCode);
      googleAuthCodes.delete(exchangeCode);
      if (!session || session.expiresAt < Date.now()) return send(res, 400, { error: 'Google sign-in expired. Please try again.' });
      return send(res, 200, {
        token: session.token || null,
        consentRequired: Boolean(session.consentRequired),
        consentToken: session.consentToken || null,
        user: session.user
      });
    }
    if (req.method === 'POST' && pathname === '/api/auth/google/consent') {
      pruneGoogleAuthMemory();
      const input = await jsonBody(req);
      const consentToken = String(input.consentToken || '').trim();
      const pending = pendingGoogleConsentSessions.get(consentToken);
      if (!pending || pending.expiresAt < Date.now()) {
        pendingGoogleConsentSessions.delete(consentToken);
        return send(res, 400, { error: 'Google sign-in expired. Please start again.' });
      }
      if (input.acceptTerms !== true) return send(res, 400, { error: 'You must accept the Terms of Service and Privacy Policy.' });

      const consentedAccount = await acceptUserConsent(pending.userId, {
        termsVersion: TERMS_VERSION,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION
      });
      if (!consentedAccount) return send(res, 404, { error: 'Your account could not be found. Please start again.' });

      const data = loadData();
      let user = mirrorDatabaseUser(data, consentedAccount);
      const updatedAccount = Number(user.loginCount || 0) === 0
        ? await claimFirstUserLogin(consentedAccount.user_id)
        : await incrementUserLoginCount(consentedAccount.user_id);
      if (updatedAccount) {
        user = mirrorDatabaseUser(data, updatedAccount);
      } else {
        const nextAccount = await incrementUserLoginCount(consentedAccount.user_id);
        if (!nextAccount) return send(res, 500, { error: 'Unable to record your Google login.' });
        user = mirrorDatabaseUser(data, nextAccount);
      }
      saveData(data);

      const token = crypto.randomBytes(32).toString('hex');
      userSessions.set(token, user.id);
      pendingGoogleConsentSessions.delete(consentToken);
      return send(res, 200, { token, user: publicUser(user) });
    }
    if (req.method === 'POST' && pathname === '/api/auth/signup/send-otp') {
      const input = await jsonBody(req);
      const name = String(input.name || '').trim();
      const email = String(input.email || '').trim().toLowerCase();
      if (name.length < 3 || name.length > 30 || !/^[a-zA-Z\s.'-]+$/.test(name)) return send(res, 400, { error: 'Enter a valid full name between 3 and 30 characters.' });
      if (!validEmail(email)) return send(res, 400, { error: 'Enter a valid email address.' });
      if (await getUserByEmail(email)) return send(res, 409, { error: 'An account already exists for this email.' });

      const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
      userSignupChallenges.set(email, {
        name,
        email,
        otpHash: hashResetValue(otp),
        expiresAt: Date.now() + otpExpiryMs(),
        attempts: 0,
        verified: false
      });
      try {
        await sendUserSignupOtpEmail(email, otp);
      } catch (error) {
        userSignupChallenges.delete(email);
        return send(res, 503, { error: error.message });
      }
      return send(res, 200, { message: `A verification OTP was sent to ${email}.` });
    }
    if (req.method === 'POST' && pathname === '/api/auth/signup/verify-otp') {
      const input = await jsonBody(req);
      const email = String(input.email || '').trim().toLowerCase();
      const otp = String(input.otp || '').trim();
      const challenge = userSignupChallenges.get(email);
      if (!challenge || challenge.expiresAt < Date.now()) {
        userSignupChallenges.delete(email);
        return send(res, 400, { error: 'The OTP is invalid or expired. Request a new OTP.' });
      }
      challenge.attempts += 1;
      if (challenge.attempts > 5) {
        userSignupChallenges.delete(email);
        return send(res, 429, { error: 'Too many incorrect OTP attempts. Request a new OTP.' });
      }
      if (!sameSecret(hashResetValue(otp), challenge.otpHash)) return send(res, 400, { error: 'Incorrect OTP.' });
      challenge.verified = true;
      challenge.passwordExpiresAt = Date.now() + 15 * 60 * 1000;
      return send(res, 200, { message: 'Email verified. Create your password.' });
    }
    if (req.method === 'POST' && pathname === '/api/auth/signup') {
      const input = await jsonBody(req);
      const email = String(input.email || '').trim().toLowerCase();
      const name = String(input.name || '').trim();
      const password = String(input.password || '');
      const confirmPassword = String(input.confirmPassword || '');
      if (input.acceptTerms !== true) return send(res, 400, { error: 'Please accept the Terms of Service and Privacy Policy.' });
      const challenge = userSignupChallenges.get(email);
      if (!challenge || !challenge.verified || challenge.name !== name || challenge.passwordExpiresAt < Date.now()) return send(res, 400, { error: 'Verify your email with OTP before creating the password.' });
      if (!hasStrongPassword(password)) return send(res, 400, { error: 'Password must be 8+ characters with an uppercase letter, number, and special character.' });
      if (password !== confirmPassword) return send(res, 400, { error: 'Passwords do not match.' });
      if (await getUserByEmail(email)) {
        userSignupChallenges.delete(email);
        return send(res, 409, { error: 'An account already exists for this email.' });
      }

      try {
        const secret = createPasswordSecret(password);
        const account = await createUserAccount({ name, email, passwordHash: secret.hash, passwordSalt: secret.salt });
        const consentedAccount = await acceptUserConsent(account.user_id, {
          termsVersion: TERMS_VERSION,
          privacyPolicyVersion: PRIVACY_POLICY_VERSION
        });
        const data = loadData();
        const user = mirrorDatabaseUser(data, consentedAccount || account);
        saveData(data);
        const token = crypto.randomBytes(32).toString('hex');
        userSessions.set(token, user.id);
        userSignupChallenges.delete(email);
        return send(res, 201, { token, user: publicUser(user) });
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return send(res, 409, { error: 'An account already exists for this email.' });
        throw error;
      }
    }
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const input = await jsonBody(req);
      const email = String(input.email || '').trim().toLowerCase();
      const data = loadData();
      let account = await getUserByEmail(email);
      let user = null;
      if (account) {
        if (!sameSecret(createPasswordSecret(String(input.password || ''), account.password_salt).hash, account.password_hash)) return send(res, 401, { error: 'Incorrect email or password.' });
        user = mirrorDatabaseUser(data, account);
        saveData(data);
      } else {
        user = data.users.find(entry => entry.email === email);
        if (!user || !sameSecret(passwordHash(String(input.password || ''), user.passwordSalt).hash, user.passwordHash)) return send(res, 401, { error: 'Incorrect email or password.' });
      }

      // Login itself stays free. Count each successful login so the
      // application endpoint can make only the first login session free.
      if (account) {
        const updatedAccount = Number(user.loginCount || 0) === 0
          ? await claimFirstUserLogin(account.user_id)
          : await incrementUserLoginCount(account.user_id);
        if (!updatedAccount) {
          // A concurrent request may have claimed the first login. Count this
          // successful login as the next login instead of granting another
          // free first-login session.
          const nextAccount = await incrementUserLoginCount(account.user_id);
          if (!nextAccount) return send(res, 500, { error: 'Unable to record your login.' });
          user = mirrorDatabaseUser(data, nextAccount);
        } else {
          user = mirrorDatabaseUser(data, updatedAccount);
        }
      } else {
        user.loginCount = Number(user.loginCount || 0) + 1;
      }
      saveData(data);
      const token = crypto.randomBytes(32).toString('hex');
      userSessions.set(token, user.id);
      return send(res, 200, {
        token,
        user: publicUser(user),
        firstLogin: Number(user.loginCount || 0) === 1
      });
    }
    if (req.method === 'GET' && pathname === '/api/auth/me') { const data = loadData(); const user = currentUser(req, data); return user ? send(res, 200, { user: publicUser(user) }) : send(res, 401, { error: 'Please log in.' }); }
    if (req.method === 'GET' && pathname === '/api/account') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const owns = record => record.userId === user.id;
      const savedJobs = await savedJobsForUser(user.id, data);
      return send(res, 200, { user: publicUser(user), resumes: data.resumes.filter(owns), applications: data.applications.filter(owns), savedJobs });
    }
    if (req.method === 'GET' && pathname === '/api/saved-jobs') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      return send(res, 200, { savedJobs: await savedJobsForUser(user.id, data) });
    }
    if (req.method === 'POST' && pathname === '/api/saved-jobs') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const input = await jsonBody(req);
      const jobId = Number(input.jobId);
      if (!Number.isInteger(jobId)) return send(res, 400, { error: 'A valid job is required.' });

      const jobs = await listJobs();
      const job = jobs.find(entry => Number(entry.job_id) === jobId);
      if (!job) return send(res, 404, { error: 'This job is no longer available.' });
      if (jobHasExpired(job)) return send(res, 410, { error: 'This job deadline has passed.' });

      await savedJobsForUser(user.id, data);
      const alreadySaved = data.savedJobs.some(record =>
        String(record.userId) === String(user.id) && Number(record.jobId) === jobId
      );
      if (!alreadySaved) {
        data.savedJobs.push({ userId: user.id, jobId, savedAt: new Date().toISOString() });
        saveData(data);
      }
      return send(res, 200, { saved: true, job: formatJob(job) });
    }
    if (req.method === 'DELETE' && /^\/api\/saved-jobs\/\d+$/.test(pathname)) {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const jobId = Number(pathname.split('/').pop());
      const before = data.savedJobs.length;
      data.savedJobs = data.savedJobs.filter(record =>
        !(String(record.userId) === String(user.id) && Number(record.jobId) === jobId)
      );
      if (data.savedJobs.length !== before) saveData(data);
      return send(res, 200, { saved: false });
    }
    if (req.method === 'GET' && pathname === '/api/admin/data') {
      if (!adminOnly(req, res)) return;
      const data = loadData();
      data.jobs = (await listJobs()).map(formatJob);
      return send(res, 200, data);
    }
    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const input = await jsonBody(req);
      const account = await getAdminByIdentifier(input.identifier || input.email || input.username);
      const supplied = String(input.password || '');
      if (!account || !sameSecret(passwordHash(supplied, account.password_salt).hash, account.password_hash)) return send(res, 401, { error: 'Incorrect admin ID/email or password.' });
      const token = crypto.randomBytes(32).toString('hex'); sessions.add(token); return send(res, 200, { token });
    }
    if (req.method === 'POST' && pathname === '/api/admin/invites') {
      if (!adminOnly(req, res)) return;
      const input = await jsonBody(req);
      const email = String(input.email || '').trim().toLowerCase();
      if (!validEmail(email)) return send(res, 400, { error: 'Enter a valid admin email address.' });
      if (await getAdminByIdentifier(email)) return send(res, 409, { error: 'An admin account already exists for this email.' });

      const token = crypto.randomBytes(32).toString('hex');
      const inviteId = await createAdminInvite({
        email,
        tokenHash: hashResetValue(token),
        expiresAt: new Date(Date.now() + adminInviteExpiryMs())
      });
      const inviteUrl = `${adminBaseUrl(req)}/admin-profile.html?token=${encodeURIComponent(token)}`;
      try {
        await sendAdminInviteEmail(email, inviteUrl);
      } catch (error) {
        await deleteAdminInvite(inviteId);
        return send(res, 503, { error: error.message });
      }
      return send(res, 200, { message: `An admin profile link was sent to ${email}.` });
    }
    if (req.method === 'GET' && pathname === '/api/admin/invite') {
      const token = String(url.searchParams.get('token') || '').trim();
      const invite = token ? await getActiveAdminInvite(hashResetValue(token)) : null;
      if (!invite) return send(res, 400, { error: 'This admin invitation link is invalid or expired.' });
      if (await getAdminByIdentifier(invite.email)) return send(res, 409, { error: 'An admin account already exists for this email.' });
      return send(res, 200, { email: invite.email });
    }
    if (req.method === 'POST' && pathname === '/api/admin/invite/send-otp') {
      const input = await jsonBody(req);
      const token = String(input.token || '').trim();
      const username = String(input.username || '').trim();
      const invite = token ? await getActiveAdminInvite(hashResetValue(token)) : null;
      if (!invite) return send(res, 400, { error: 'This admin invitation link is invalid or expired.' });
      if (!/^[A-Za-z0-9._-]{3,50}$/.test(username)) return send(res, 400, { error: 'User ID must be 3–50 characters and use only letters, numbers, dot, underscore, or hyphen.' });
      if (await getAdminByIdentifier(invite.email)) return send(res, 409, { error: 'An admin account already exists for this email.' });
      if (await getAdminByIdentifier(username)) return send(res, 409, { error: 'That User ID is already in use. Choose another User ID.' });

      const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
      const challengeKey = hashResetValue(token);
      adminInviteOtpChallenges.set(challengeKey, {
        email: invite.email,
        username,
        otpHash: hashResetValue(otp),
        expiresAt: Date.now() + otpExpiryMs(),
        attempts: 0,
        verified: false
      });
      try {
        await sendAdminInviteOtpEmail(invite.email, otp);
      } catch (error) {
        adminInviteOtpChallenges.delete(challengeKey);
        return send(res, 503, { error: error.message });
      }
      return send(res, 200, { message: `A verification OTP was sent to ${invite.email}.` });
    }
    if (req.method === 'POST' && pathname === '/api/admin/invite/verify-otp') {
      const input = await jsonBody(req);
      const token = String(input.token || '').trim();
      const username = String(input.username || '').trim();
      const otp = String(input.otp || '').trim();
      const invite = token ? await getActiveAdminInvite(hashResetValue(token)) : null;
      const challengeKey = hashResetValue(token);
      const challenge = adminInviteOtpChallenges.get(challengeKey);
      if (!invite || !challenge || challenge.email !== invite.email || challenge.username !== username || challenge.expiresAt < Date.now()) {
        adminInviteOtpChallenges.delete(challengeKey);
        return send(res, 400, { error: 'The OTP is invalid or expired. Request a new OTP.' });
      }
      challenge.attempts += 1;
      if (challenge.attempts > 5) {
        adminInviteOtpChallenges.delete(challengeKey);
        return send(res, 429, { error: 'Too many incorrect OTP attempts. Request a new OTP.' });
      }
      if (!sameSecret(hashResetValue(otp), challenge.otpHash)) return send(res, 400, { error: 'Incorrect OTP.' });
      challenge.verified = true;
      challenge.verifiedAt = Date.now();
      return send(res, 200, { message: 'Email verified. You can now create your password.' });
    }
    if (req.method === 'POST' && pathname === '/api/admin/invite/complete') {
      const input = await jsonBody(req);
      const token = String(input.token || '').trim();
      const username = String(input.username || '').trim();
      const password = String(input.password || '');
      const confirmPassword = String(input.confirmPassword || '');
      const challengeKey = hashResetValue(token);
      const invite = token ? await getActiveAdminInvite(challengeKey) : null;
      const challenge = adminInviteOtpChallenges.get(challengeKey);
      if (!invite || !challenge || !challenge.verified || challenge.username !== username || challenge.expiresAt < Date.now()) {
        return send(res, 400, { error: 'Verify the email OTP before creating your password.' });
      }
      if (!hasStrongAdminPassword(password)) return send(res, 400, { error: 'Password must be 8+ characters with an uppercase letter, number, and special character.' });
      if (password !== confirmPassword) return send(res, 400, { error: 'Passwords do not match.' });

      const secret = createPasswordSecret(password);
      const result = await completeAdminInvite({
        tokenHash: challengeKey,
        username,
        passwordHash: secret.hash,
        passwordSalt: secret.salt
      });
      if (result.status === 'invalid') return send(res, 400, { error: 'This admin invitation link is invalid or expired.' });
      if (result.status === 'exists') return send(res, 409, { error: 'An admin account already exists for this email.' });
      adminInviteOtpChallenges.delete(challengeKey);
      return send(res, 201, { message: 'Admin profile created successfully. You can now log in.' });
    }
    if (req.method === 'POST' && pathname === '/api/admin/forgot-password') {
      const input = await jsonBody(req);
      const identifier = String(input.identifier || input.email || input.username || '').trim();
      if (!identifier) return send(res, 400, { error: 'Enter your admin ID or email.' });

      const account = await getAdminByIdentifier(identifier);
      if (!account) return send(res, 200, { message: 'If the admin account exists, a reset OTP has been sent.' });

      const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
      const challenge = {
        accountId: account.id,
        email: account.email,
        otpHash: hashResetValue(otp),
        expiresAt: Date.now() + otpExpiryMs(),
        attempts: 0,
        resetTokenHash: null,
        resetExpiresAt: 0
      };
      adminResetChallenges.set(String(account.id), challenge);
      try {
        await sendAdminOtpEmail(account.email, otp);
      } catch (error) {
        adminResetChallenges.delete(String(account.id));
        return send(res, 503, { error: error.message });
      }
      return send(res, 200, { message: `A reset OTP was sent to ${account.email}.` });
    }
    if (req.method === 'POST' && pathname === '/api/admin/verify-otp') {
      const input = await jsonBody(req);
      const account = await getAdminByIdentifier(input.identifier || input.email || input.username);
      const challenge = account && adminResetChallenges.get(String(account.id));
      if (!challenge || challenge.expiresAt < Date.now()) {
        if (account) adminResetChallenges.delete(String(account.id));
        return send(res, 400, { error: 'The OTP is invalid or expired. Request a new OTP.' });
      }
      challenge.attempts += 1;
      if (challenge.attempts > 5) {
        adminResetChallenges.delete(String(account.id));
        return send(res, 429, { error: 'Too many incorrect OTP attempts. Request a new OTP.' });
      }
      if (!sameSecret(hashResetValue(input.otp), challenge.otpHash)) return send(res, 400, { error: 'Incorrect OTP.' });

      const resetToken = crypto.randomBytes(32).toString('hex');
      challenge.resetTokenHash = hashResetValue(resetToken);
      challenge.resetExpiresAt = Date.now() + 15 * 60 * 1000;
      return send(res, 200, { resetToken, message: 'OTP verified. Create your new password.' });
    }
    if (req.method === 'POST' && pathname === '/api/admin/reset-password') {
      const input = await jsonBody(req);
      const account = await getAdminByIdentifier(input.identifier || input.email || input.username);
      const challenge = account && adminResetChallenges.get(String(account.id));
      const password = String(input.password || '');
      const confirmPassword = String(input.confirmPassword || '');
      if (!account || !challenge || challenge.resetExpiresAt < Date.now() || !sameSecret(hashResetValue(input.resetToken), challenge.resetTokenHash || '')) {
        return send(res, 400, { error: 'Your password reset session is invalid or expired. Start again.' });
      }
      if (!hasStrongAdminPassword(password)) {
        return send(res, 400, { error: 'Password must be 8+ characters with an uppercase letter, number, and special character.' });
      }
      if (password !== confirmPassword) return send(res, 400, { error: 'Passwords do not match.' });

      const secret = createPasswordSecret(password);
      await updateAdminPassword(account.id, secret.hash, secret.salt);
      adminResetChallenges.delete(String(account.id));
      sessions.clear();
      return send(res, 200, { message: 'Password updated. You can now log in.' });
    }
    if (req.method === 'PUT' && pathname === '/api/admin/settings') {
      if (!adminOnly(req, res)) return; const input = await jsonBody(req); const data = loadData(); data.settings = { ...data.settings, ...input }; saveData(data); return send(res, 200, { settings: data.settings });
    }
    if (req.method === 'POST' && pathname === '/api/admin/jobs') {
      if (!adminOnly(req, res)) return;
      const job = await createJob(normalizeJobInput(await jsonBody(req)));
      return send(res, 201, { job: formatJob(job) });
    }
    if (req.method === 'PUT' && /^\/api\/admin\/jobs\//.test(pathname)) {
      if (!adminOnly(req, res)) return;
      const jobId = Number(pathname.split('/').pop());
      if (!Number.isInteger(jobId)) return send(res, 400, { error: 'Invalid job ID.' });
      const job = await updateJob(jobId, normalizeJobInput(await jsonBody(req)));
      if (!job) return send(res, 404, { error: 'Job not found.' });
      return send(res, 200, { job: formatJob(job) });
    }
    if (req.method === 'DELETE' && /^\/api\/admin\/jobs\//.test(pathname)) {
      if (!adminOnly(req, res)) return;
      const jobId = Number(pathname.split('/').pop());
      if (!Number.isInteger(jobId)) return send(res, 400, { error: 'Invalid job ID.' });
      const deleted = await deleteJob(jobId);
      if (!deleted) return send(res, 404, { error: 'Job not found.' });
      return send(res, 204, {});
    }
    if (req.method === 'PUT' && /^\/api\/applications\/[^/]+$/.test(pathname)) {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const applicationId = decodeURIComponent(pathname.split('/').pop());
      const application = data.applications.find(entry => String(entry.id) === applicationId && String(entry.userId) === String(user.id));
      if (!application) return send(res, 404, { error: 'Application was not found.' });
      const input = await jsonBody(req);
      if (String(input.status || '').trim().toLowerCase() !== 'withdrawn') {
        return send(res, 400, { error: 'Jobseekers can only change an application to Withdrawn.' });
      }
      if (application.status === 'payment_pending' && application.paymentStatus !== 'paid') {
        return send(res, 409, { error: 'Complete the application payment before withdrawing it.' });
      }
      if (['hired', 'rejected', 'withdrawn'].includes(application.status)) {
        return send(res, 409, { error: 'This application can no longer be withdrawn.' });
      }
      if (application.withdrawalRequest?.status === 'pending') {
        return send(res, 409, { error: 'Your withdrawal request is already waiting for admin approval.' });
      }
      application.withdrawalRequest = {
        status: 'pending',
        requestedAt: new Date().toISOString(),
        requestedBy: user.id
      };
      saveData(data);
      return send(res, 200, { message: 'Your withdrawal request was sent to the admin for approval.', record: application });
    }
    if (req.method === 'PUT' && /^\/api\/admin\/applications\/[^/]+$/.test(pathname)) {
      if (!adminOnly(req, res)) return;
      const applicationId = decodeURIComponent(pathname.split('/').pop());
      const data = loadData();
      const application = data.applications.find(entry => String(entry.id) === applicationId);
      if (!application) return send(res, 404, { error: 'Application was not found.' });
      if (application.status === 'payment_pending' && application.paymentStatus !== 'paid') {
        return send(res, 409, { error: 'Complete the application payment before changing its status.' });
      }

      const input = await jsonBody(req);
      const nextStatus = String(input.status || '').trim().toLowerCase();
      if (!APPLICATION_STATUS_SET.has(nextStatus)) {
        return send(res, 400, { error: `Choose one of: ${APPLICATION_STATUSES.join(', ')}.` });
      }

      if (application.withdrawalRequest?.status === 'pending' && nextStatus !== 'withdrawn') {
        return send(res, 409, { error: 'Approve or resolve the pending withdrawal request before changing this status.' });
      }
      if (nextStatus === 'withdrawn') {
        if (application.withdrawalRequest?.status !== 'pending') {
          return send(res, 409, { error: 'The jobseeker must request withdrawal before the admin can approve it.' });
        }
        let refund;
        try {
          refund = await refundApplicationPayment(application);
        } catch (error) {
          application.withdrawalRequest.refundStatus = 'failed';
          application.withdrawalRequest.refundError = error.message;
          saveData(data);
          return send(res, 502, { error: error.message, code: 'refund_failed' });
        }
        application.withdrawalRequest.status = 'approved';
        application.withdrawalRequest.reviewedAt = new Date().toISOString();
        application.withdrawalRequest.refundStatus = refund.status;
        if (refund.refundId) application.withdrawalRequest.refundId = refund.refundId;
        if (refund.refundAmount != null) application.withdrawalRequest.refundAmount = refund.refundAmount;
        if (refund.refundedAt) application.withdrawalRequest.refundedAt = refund.refundedAt;
        if (refund.message) application.withdrawalRequest.refundMessage = refund.message;
      }

      application.status = nextStatus;
      application.statusUpdatedAt = new Date().toISOString();
      saveData(data);
      return send(res, 200, { record: application });
    }
    if (req.method === 'POST' && pathname === '/api/applications') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const input = await jsonBody(req);
      const jobId = Number(input.jobId);
      const phone = String(input.phone || '').trim();
      if (!Number.isInteger(jobId)) return send(res, 400, { error: 'A valid job is required.' });
      if (phone.length < 7) return send(res, 400, { error: 'Enter a valid phone number.' });

      const jobs = await listJobs();
      const job = jobs.find(entry => Number(entry.job_id) === jobId);
      if (!job) return send(res, 404, { error: 'This job is no longer available.' });
      const jobView = formatJob(job);
      const alreadyApplied = data.applications.find(application =>
        String(application.userId) === String(user.id) &&
        Number(application.jobId) === jobId &&
        (application.status !== 'payment_pending' || application.paymentStatus === 'paid')
      );
      if (alreadyApplied) return send(res, 409, { error: 'You have already applied for this job.' });

      // Each account gets one free job application. All later applications
      // require the existing ₹200 Razorpay application payment flow.
      const freeJobAccess = !Boolean(user.freeJobAccessUsed);
      if (freeJobAccess) user.freeJobAccessUsed = true;
      const createdAt = new Date().toISOString();

      const record = {
        id: id(),
        userId: user.id,
        name: user.name,
        email: user.email,
        phone,
        notes: String(input.notes || '').trim(),
        jobId: jobView.id,
        jobCode: jobView.jobId,
        jobTitle: jobView.title,
        organization: jobView.organization,
        location: jobView.location,
        state: jobView.state,
        district: jobView.district,
        status: freeJobAccess ? 'applied' : 'payment_pending',
        paymentStatus: freeJobAccess ? 'free' : 'pending',
        paymentMode: freeJobAccess ? 'free' : undefined,
        paymentId: freeJobAccess ? 'free_first_job_access' : undefined,
        paidAt: freeJobAccess ? createdAt : undefined,
        createdAt
      };
      data.applications.unshift(record);
      saveData(data);
      return send(res, 201, {
        record,
        user: publicUser(user),
        paymentRequired: !freeJobAccess,
        amount: freeJobAccess ? 0 : Math.round(Number(data.settings.priorityApplicationFee || 200) * 100),
        currency: data.settings.currency
      });
    }
    if (req.method === 'POST' && pathname === '/api/resumes') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const parsed = parseMultipart(req, await body(req));
      if (!parsed.file) return send(res, 400, { error: 'A resume file is required.' });
      const profile = {
        phone: String(parsed.fields.phone || '').trim(),
        address: String(parsed.fields.address || '').trim(),
        state: String(parsed.fields.state || '').trim(),
        district: String(parsed.fields.district || '').trim(),
        pincode: String(parsed.fields.pincode || '').trim()
      };
      if (!/^[+0-9()\s-]{7,20}$/.test(profile.phone)) return send(res, 400, { error: 'Enter a valid phone number.' });
      if (profile.address.length < 5 || profile.address.length > 500) return send(res, 400, { error: 'Enter a valid address.' });
      if (!profile.state) return send(res, 400, { error: 'Select your state.' });
      if (!profile.district) return send(res, 400, { error: 'Select your district.' });
      if (!/^\d{6}$/.test(profile.pincode)) return send(res, 400, { error: 'Enter a valid 6-digit pincode.' });
      const preference = String(parsed.fields.preference || 'basic').toLowerCase() === 'priority' ? 'priority' : 'basic';
      if (preference === 'priority') {
        if (!consumePriorityCredit(user, 'resume')) return send(res, 402, { error: 'Priority access requires payment before you can continue.', code: 'priority_payment_required', kind: 'priority_resume' });
      } else {
        if (user.freeBasicResumeUsed) return send(res, 402, { error: 'Your one free basic resume post has been used. Choose priority posting to continue.', code: 'priority_payment_required', kind: 'priority_resume' });
        user.freeBasicResumeUsed = true;
      }
      const updatedAccount = await updateUserProfile(Number(user.id), profile);
      if (!updatedAccount) return send(res, 500, { error: 'Your account profile could not be updated.' });
      Object.assign(user, profile);
      const record = {
        id: id(),
        userId: user.id,
        name: user.name,
        email: user.email,
        ...profile,
        preference,
        resume: parsed.file,
        createdAt: new Date().toISOString()
      };
      data.resumes.unshift(record);
      saveData(data); return send(res, 201, { record, user: publicUser(user) });
    }
    if (req.method === 'POST' && pathname === '/api/payments/application') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const input = await jsonBody(req);
      const applicationId = String(input.applicationId || '').trim();
      const application = data.applications.find(entry => entry.id === applicationId && entry.userId === user.id);
      if (!application) return send(res, 404, { error: 'Application was not found.' });
      if (application.status !== 'payment_pending' || application.paymentStatus === 'paid') return send(res, 409, { error: 'This application has already been paid.' });

      const amount = Math.round(Number(data.settings.priorityApplicationFee || 200) * 100);
      const receipt = `application_${application.id}`;
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        const orderId = `demo_${id()}`;
        applicationPaymentOrders.set(orderId, { applicationId, userId: user.id, amount, demo: true });
        return send(res, 200, { mode: 'demo', orderId, amount, currency: data.settings.currency, applicationId, message: 'Demo payment is enabled. Add Razorpay keys for live checkout.' });
      }
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
      const order = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: data.settings.currency, receipt })
      }).then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.description || 'Unable to start payment.');
        return result;
      });
      applicationPaymentOrders.set(order.id, { applicationId, userId: user.id, amount, demo: false });
      return send(res, 200, { mode: 'razorpay', orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, amount, currency: data.settings.currency, applicationId });
    }
    if (req.method === 'POST' && pathname === '/api/payments/application/verify') {
      const data = loadData(); const user = requireUser(req, res, data); if (!user) return;
      const input = await jsonBody(req);
      const order = applicationPaymentOrders.get(String(input.orderId || ''));
      if (!order || order.userId !== user.id) return send(res, 400, { error: 'Payment order was not found.' });
      if (order.demo) {
        if (input.demo !== true) return send(res, 400, { error: 'Demo payment confirmation is required.' });
      } else {
        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${input.orderId}|${input.paymentId}`).digest('hex');
        const supplied = String(input.signature || '');
        if (!supplied || supplied.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) return send(res, 400, { error: 'Payment verification failed.' });
      }
      const application = data.applications.find(entry => entry.id === order.applicationId && entry.userId === user.id);
      if (!application) return send(res, 404, { error: 'Application was not found.' });
      if (application.status !== 'payment_pending') return send(res, 409, { error: 'This application has already been submitted.' });
      application.status = 'applied';
      application.paymentStatus = 'paid';
      application.paymentMode = order.demo ? 'demo' : 'razorpay';
      application.paymentId = String(input.paymentId || order.orderId || input.orderId || 'demo');
      application.paidAt = new Date().toISOString();
      saveData(data);
      applicationPaymentOrders.delete(String(input.orderId || ''));
      return send(res, 200, { message: 'Application submitted successfully.', record: application, user: publicUser(user) });
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
});

const port = Number(process.env.PORT || 3000);
server.listen(port, async () => {
  console.log(`Job Saathi CMS running at http://localhost:${port}`);
  try {
    await initializeDatabase();
    console.log('MySQL database connected and jobs table is ready.');
  } catch (error) {
    console.error(`MySQL is not available yet: ${error.message}`);
    console.error('Start MySQL in XAMPP, then restart the Node server. Public jobs come only from the MySQL jobs table.');
  }
});
