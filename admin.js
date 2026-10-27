const ADMIN_API_BASE = window.location.port === '3000' ? '' : 'http://localhost:3000';
const ADMIN_TOKEN_KEY = 'job-saathi-admin-token';
let adminToken = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
let recoveryIdentifier = '';
let resetToken = '';

const APPLICATION_STATUS_OPTIONS = [
  ['applied', 'Applied'],
  ['under_review', 'Under Review'],
  ['shortlisted', 'Shortlisted'],
  ['interview_scheduled', 'Interview Scheduled'],
  ['interview_completed', 'Interview Completed'],
  ['offered', 'Offered'],
  ['hired', 'Hired'],
  ['rejected', 'Rejected'],
  ['withdrawn', 'Withdrawn']
];
const APPLICATION_STATUS_LABELS = Object.fromEntries(APPLICATION_STATUS_OPTIONS);

const loginPanel = document.getElementById('login-panel');
const forgotPanel = document.getElementById('forgot-panel');
const otpPanel = document.getElementById('otp-panel');
const resetPanel = document.getElementById('reset-panel');
const dashboardPanel = document.getElementById('dashboard-panel');
const logoutButton = document.getElementById('logout-button');
const loginForm = document.getElementById('login-form');
const forgotForm = document.getElementById('forgot-form');
const otpForm = document.getElementById('otp-form');
const resetForm = document.getElementById('reset-form');
const jobForm = document.getElementById('job-form');
const adminInviteForm = document.getElementById('admin-invite-form');
const jobsBody = document.getElementById('jobs-body');
const loginMessage = document.getElementById('login-message');
const forgotMessage = document.getElementById('forgot-message');
const otpMessage = document.getElementById('otp-message');
const resetMessage = document.getElementById('reset-message');
const jobMessage = document.getElementById('job-message');
const adminInviteMessage = document.getElementById('admin-invite-message');
const stateSelect = document.getElementById('job-state');
const districtSelect = document.getElementById('job-district');
const dashboardSections = [...document.querySelectorAll('.dashboard-section')];
const dashboardNavButtons = [...document.querySelectorAll('.dashboard-nav-button')];
const totalJobs = document.getElementById('total-jobs');
const applicationAlertCard = document.getElementById('application-alert-card');
const applicationAlertTitle = document.getElementById('application-alert-title');
const applicationAlertText = document.getElementById('application-alert-text');
const applicationAlertTime = document.getElementById('application-alert-time');
const withdrawalAlertCard = document.getElementById('withdrawal-alert-card');
const withdrawalAlertTitle = document.getElementById('withdrawal-alert-title');
const withdrawalAlertText = document.getElementById('withdrawal-alert-text');
const withdrawalAlertTime = document.getElementById('withdrawal-alert-time');
const withdrawalRequestsNavButton = document.getElementById('withdrawal-requests-nav-button');
const withdrawalRequestNotification = document.getElementById('withdrawal-request-notification');
const withdrawalRequestCount = document.getElementById('withdrawal-request-count');
const applicationsBody = document.getElementById('applications-body');
const applicationMessage = document.getElementById('application-message');
const withdrawalsBody = document.getElementById('withdrawals-body');
const withdrawalMessage = document.getElementById('withdrawal-message');
let locationData = [];
let applicationRefreshTimer = null;

function setMessage(element, message, type = '') {
  element.textContent = message;
  element.className = `message ${type}`.trim();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

async function adminRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

  const response = await fetch(`${ADMIN_API_BASE}${path}`, { ...options, headers });
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(result?.error || 'The request could not be completed.');
  return result;
}

function showOnly(panel) {
  [loginPanel, forgotPanel, otpPanel, resetPanel, dashboardPanel].forEach(item => {
    item.hidden = item !== panel;
  });
  logoutButton.hidden = panel !== dashboardPanel;
}

function showDashboard() {
  showOnly(dashboardPanel);
  showDashboardSection('overview-section');
  loadJobs();
  if (!applicationRefreshTimer) applicationRefreshTimer = window.setInterval(loadJobs, 10000);
}

function showDashboardSection(sectionId) {
  dashboardSections.forEach(section => {
    section.hidden = section.id !== sectionId;
  });
  dashboardNavButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.dashboardSection === sectionId);
  });
  if (sectionId === 'manage-jobs-section' || sectionId === 'manage-applications-section' || sectionId === 'withdrawal-requests-section') loadJobs();
}

function showLogin(message = '', type = '') {
  showOnly(loginPanel);
  setMessage(loginMessage, message, type);
}

async function loadLocationOptions() {
  const response = await fetch('data/india_states_districts.json');
  if (!response.ok) throw new Error('State and district data could not be loaded.');
  locationData = await response.json();
  stateSelect.innerHTML = '<option value="">Select state or UT</option>' + locationData
    .map(state => `<option value="${escapeHtml(state.name)}" data-code="${escapeHtml(state.code)}">${escapeHtml(state.name)}</option>`)
    .join('');
}

function updateDistrictOptions() {
  const selectedState = locationData.find(state => state.name === stateSelect.value);
  const districts = selectedState?.districts || [];
  districtSelect.disabled = !selectedState;
  districtSelect.innerHTML = selectedState
    ? '<option value="">Select district</option>' + districts
        .map(district => `<option value="${escapeHtml(district.name)}">${escapeHtml(district.name)}</option>`)
        .join('')
    : '<option value="">Select a state first</option>';
}

async function loadJobs() {
  try {
    const result = await adminRequest('/api/admin/data');
    const jobs = Array.isArray(result?.jobs) ? result.jobs : [];
    if (totalJobs) totalJobs.textContent = jobs.length;
    renderApplications(result?.applications);
    renderWithdrawalRequests(result?.applications);
    renderApplicationAlert(result?.applications);
    renderWithdrawalAlert(result?.applications);
    if (!jobs.length) {
      jobsBody.innerHTML = '<tr><td colspan="8" class="empty-cell">No jobs added yet.</td></tr>';
      return;
    }

    jobsBody.innerHTML = jobs.map(job => `
      <tr>
        <td>${escapeHtml(job.jobId)}</td>
        <td>${escapeHtml(job.title)}</td>
        <td>${escapeHtml(job.organization)}</td>
        <td>${escapeHtml(job.location)}</td>
        <td>${escapeHtml(job.state)}</td>
        <td>${escapeHtml(job.district)}</td>
        <td>${escapeHtml(job.deadline)}</td>
        <td><button class="button button-danger delete-job" type="button" data-id="${Number(job.id)}">Delete</button></td>
      </tr>
    `).join('');
  } catch (error) {
    if (error.message.toLowerCase().includes('admin')) {
      adminToken = '';
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      showLogin('Your admin session has expired. Please log in again.', 'error');
      return;
    }
    setMessage(jobMessage, error.message, 'error');
  }
}

function applicationStatusLabel(status, paymentStatus) {
  if (status === 'payment_pending' && paymentStatus !== 'paid') return 'Payment Pending';
  return APPLICATION_STATUS_LABELS[status] || 'Applied';
}

function formatApplicationDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

function renderApplications(applications) {
  if (!applicationsBody) return;
  const records = Array.isArray(applications) ? applications : [];
  if (!records.length) {
    applicationsBody.innerHTML = '<tr><td colspan="6" class="empty-cell">No applications yet.</td></tr>';
    return;
  }

  applicationsBody.innerHTML = records.map(application => {
    const isPaymentPending = application.status === 'payment_pending' && application.paymentStatus !== 'paid';
    const options = APPLICATION_STATUS_OPTIONS.map(([value, label]) =>
      `<option value="${value}" ${application.status === value ? 'selected' : ''}>${label}</option>`
    ).join('');
    const withdrawalNotice = application.withdrawalRequest?.status === 'pending'
      ? '<span class="withdrawal-request-badge">Withdrawal Requested</span>'
      : '';
    const statusCell = isPaymentPending
      ? '<span class="status-pill status-pending">Payment Pending</span>'
      : `<div class="application-status-editor">
          <select class="application-status-select" data-id="${escapeHtml(application.id)}" aria-label="Status for ${escapeHtml(application.name || 'application')}">${options}</select>
          <button class="button button-primary update-application-status" type="button" data-id="${escapeHtml(application.id)}">Save</button>
        </div>${withdrawalNotice}`;

    return `
      <tr>
        <td><strong>${escapeHtml(application.name || 'Unknown applicant')}</strong><span class="table-secondary">${escapeHtml(application.email || 'No email')}</span></td>
        <td><strong>${escapeHtml(application.jobTitle || 'Untitled job')}</strong><span class="table-secondary">${escapeHtml(application.jobCode || '')}</span></td>
        <td>${escapeHtml(application.phone || '—')}</td>
        <td>${statusCell}</td>
        <td><span class="status-pill ${application.paymentStatus === 'paid' || application.paymentStatus === 'free' ? 'status-paid' : 'status-pending'}">${escapeHtml(application.paymentStatus || '—')}</span></td>
        <td>${escapeHtml(formatApplicationDate(application.paidAt || application.createdAt))}</td>
      </tr>
    `;
  }).join('');
}

function renderWithdrawalRequests(applications) {
  if (!withdrawalsBody) return;
  const requests = (Array.isArray(applications) ? applications : [])
    .filter(application => ['pending', 'approved'].includes(application.withdrawalRequest?.status))
    .sort((left, right) => new Date(right.withdrawalRequest.requestedAt || 0) - new Date(left.withdrawalRequest.requestedAt || 0));
  const pendingRequests = requests.filter(application =>
    application.withdrawalRequest.status === 'pending' && application.status !== 'withdrawn'
  );
  if (withdrawalRequestCount) {
    withdrawalRequestCount.textContent = String(pendingRequests.length);
    withdrawalRequestCount.setAttribute('aria-label', `${pendingRequests.length} pending withdrawal request${pendingRequests.length === 1 ? '' : 's'}`);
  }
  if (withdrawalRequestNotification) withdrawalRequestNotification.hidden = pendingRequests.length === 0;
  if (withdrawalRequestsNavButton) withdrawalRequestsNavButton.classList.toggle('has-pending-notifications', pendingRequests.length > 0);
  if (!requests.length) {
    withdrawalsBody.innerHTML = '<tr><td colspan="6" class="empty-cell">No withdrawal requests yet.</td></tr>';
    return;
  }

  withdrawalsBody.innerHTML = requests.map(application => {
    const requestStatus = application.withdrawalRequest.status;
    const paymentText = requestStatus === 'pending'
      ? application.paymentStatus === 'paid'
        ? '<span class="status-pill status-paid">Paid — refund on approval</span>'
        : '<span class="status-pill status-pending">Free — no refund</span>'
      : application.withdrawalRequest.refundStatus === 'processed'
        ? '<span class="status-pill status-paid">Refund processed</span>'
        : application.paymentStatus === 'paid'
          ? '<span class="status-pill status-pending">Paid — refund review</span>'
          : '<span class="status-pill status-pending">Free — no refund</span>';
    const action = requestStatus === 'pending' && application.status !== 'withdrawn'
      ? `<button class="button button-primary approve-withdrawal" type="button" data-id="${escapeHtml(application.id)}">Approve &amp; withdraw</button>`
      : '<span class="status-pill status-approved">Approved</span>';
    return `
      <tr>
        <td><strong>${escapeHtml(application.name || 'Unknown applicant')}</strong><span class="table-secondary">${escapeHtml(application.email || 'No email')}</span></td>
        <td><strong>${escapeHtml(application.jobTitle || 'Untitled job')}</strong><span class="table-secondary">${escapeHtml(application.jobCode || '')}</span></td>
        <td><span class="status-pill status-${escapeHtml(application.status || 'applied')}">${escapeHtml(applicationStatusLabel(application.status, application.paymentStatus))}</span></td>
        <td>${paymentText}</td>
        <td>${escapeHtml(formatApplicationDate(application.withdrawalRequest.requestedAt))}</td>
        <td>${action}</td>
      </tr>
    `;
  }).join('');
}

function renderApplicationAlert(applications) {
  if (!applicationAlertCard) return;
  const submitted = (Array.isArray(applications) ? applications : [])
    .filter(application => application.status === 'applied')
    .sort((left, right) => new Date(right.paidAt || right.createdAt || 0) - new Date(left.paidAt || left.createdAt || 0));
  const latest = submitted[0];
  if (!latest) {
    applicationAlertCard.hidden = true;
    applicationAlertCard.classList.remove('application-alert-blink');
    return;
  }

  applicationAlertCard.hidden = false;
  if (applicationAlertTitle) applicationAlertTitle.textContent = `${latest.name || 'One person'} applied successfully`;
  if (applicationAlertText) applicationAlertText.textContent = `${latest.jobTitle || 'A job'} (${latest.jobCode || 'Job'}) is ready for review.`;
  if (applicationAlertTime) applicationAlertTime.textContent = latest.paidAt ? `Payment completed: ${new Date(latest.paidAt).toLocaleString()}` : 'Payment completed';
  applicationAlertCard.classList.remove('application-alert-blink');
  window.requestAnimationFrame(() => applicationAlertCard.classList.add('application-alert-blink'));
}

function renderWithdrawalAlert(applications) {
  if (!withdrawalAlertCard) return;
  const requests = (Array.isArray(applications) ? applications : [])
    .filter(application => application.withdrawalRequest?.status === 'pending' && application.status !== 'withdrawn')
    .sort((left, right) => new Date(right.withdrawalRequest.requestedAt || 0) - new Date(left.withdrawalRequest.requestedAt || 0));
  const latest = requests[0];
  if (!latest) {
    withdrawalAlertCard.hidden = true;
    withdrawalAlertCard.classList.remove('application-alert-blink');
    return;
  }
  withdrawalAlertCard.hidden = false;
  if (withdrawalAlertTitle) withdrawalAlertTitle.textContent = `${requests.length} withdrawal request${requests.length === 1 ? '' : 's'} need approval`;
  if (withdrawalAlertText) withdrawalAlertText.textContent = `${latest.name || 'A jobseeker'} requested withdrawal from ${latest.jobTitle || 'a job'}.`;
  if (withdrawalAlertTime) withdrawalAlertTime.textContent = `Requested: ${formatApplicationDate(latest.withdrawalRequest.requestedAt)}`;
  withdrawalAlertCard.classList.remove('application-alert-blink');
  window.requestAnimationFrame(() => withdrawalAlertCard.classList.add('application-alert-blink'));
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(loginMessage, 'Logging in…');
  const identifier = document.getElementById('admin-identifier').value.trim();
  const password = document.getElementById('admin-password').value;
  try {
    const result = await adminRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    adminToken = result.token;
    localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    loginForm.reset();
    showDashboard();
  } catch (error) {
    setMessage(loginMessage, error.message, 'error');
  }
});

document.getElementById('forgot-link').addEventListener('click', () => {
  recoveryIdentifier = document.getElementById('admin-identifier').value.trim();
  document.getElementById('forgot-identifier').value = recoveryIdentifier;
  setMessage(forgotMessage, '');
  showOnly(forgotPanel);
});

forgotForm.addEventListener('submit', async event => {
  event.preventDefault();
  recoveryIdentifier = document.getElementById('forgot-identifier').value.trim();
  setMessage(forgotMessage, 'Sending OTP…');
  try {
    const result = await adminRequest('/api/admin/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier: recoveryIdentifier })
    });
    document.getElementById('otp-copy').textContent = result.message || 'Enter the six-digit OTP sent to your admin email.';
    setMessage(otpMessage, '');
    showOnly(otpPanel);
  } catch (error) {
    setMessage(forgotMessage, error.message, 'error');
  }
});

otpForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(otpMessage, 'Verifying OTP…');
  const otp = document.getElementById('admin-otp').value.trim();
  try {
    const result = await adminRequest('/api/admin/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier: recoveryIdentifier, otp })
    });
    resetToken = result.resetToken;
    setMessage(resetMessage, '');
    showOnly(resetPanel);
  } catch (error) {
    setMessage(otpMessage, error.message, 'error');
  }
});

resetForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(resetMessage, 'Updating password…');
  const password = document.getElementById('new-admin-password').value;
  const confirmPassword = document.getElementById('confirm-admin-password').value;
  try {
    const result = await adminRequest('/api/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify({ identifier: recoveryIdentifier, resetToken, password, confirmPassword })
    });
    resetForm.reset();
    otpForm.reset();
    resetToken = '';
    recoveryIdentifier = '';
    showLogin(result.message || 'Password updated. You can now log in.', 'success');
  } catch (error) {
    setMessage(resetMessage, error.message, 'error');
  }
});

jobForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(jobMessage, 'Saving job…');
  const formData = new FormData(jobForm);
  const payload = Object.fromEntries(formData.entries());
  try {
    const result = await adminRequest('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    jobForm.reset();
    setMessage(jobMessage, `Job ${result.job.jobId} was added successfully.`, 'success');
    await loadJobs();
  } catch (error) {
    setMessage(jobMessage, error.message, 'error');
  }
});

adminInviteForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(adminInviteMessage, 'Sending invitation link…');
  const formData = new FormData(adminInviteForm);
  const payload = Object.fromEntries(formData.entries());
  try {
    const result = await adminRequest('/api/admin/invites', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    adminInviteForm.reset();
    setMessage(adminInviteMessage, result.message || 'Invitation link sent successfully.', 'success');
  } catch (error) {
    setMessage(adminInviteMessage, error.message, 'error');
  }
});

jobsBody.addEventListener('click', async event => {
  const button = event.target.closest('.delete-job');
  if (!button) return;
  if (!window.confirm('Delete this job from the database?')) return;
  try {
    await adminRequest(`/api/admin/jobs/${button.dataset.id}`, { method: 'DELETE' });
    setMessage(jobMessage, 'Job deleted.', 'success');
    await loadJobs();
  } catch (error) {
    setMessage(jobMessage, error.message, 'error');
  }
});

applicationsBody.addEventListener('click', async event => {
  const button = event.target.closest('.update-application-status');
  if (!button) return;
  const select = button.closest('tr')?.querySelector('.application-status-select');
  if (!select) return;

  button.disabled = true;
  setMessage(applicationMessage, 'Updating application status…');
  try {
    await adminRequest(`/api/admin/applications/${encodeURIComponent(button.dataset.id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status: select.value })
    });
    setMessage(applicationMessage, `Application status changed to ${applicationStatusLabel(select.value)}.`, 'success');
    await loadJobs();
  } catch (error) {
    setMessage(applicationMessage, error.message, 'error');
  } finally {
    button.disabled = false;
  }
});

withdrawalsBody.addEventListener('click', async event => {
  const button = event.target.closest('.approve-withdrawal');
  if (!button) return;
  if (!window.confirm('Approve this withdrawal request? Paid applications will be refunded through Razorpay.')) return;

  button.disabled = true;
  setMessage(withdrawalMessage, 'Approving withdrawal…');
  try {
    const result = await adminRequest(`/api/admin/applications/${encodeURIComponent(button.dataset.id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'withdrawn' })
    });
    const request = result.record?.withdrawalRequest || {};
    const message = request.refundStatus === 'processed'
      ? 'Application withdrawn. Refund initiated to the original payment method.'
      : request.refundMessage || 'Application withdrawn. No refund was required.';
    setMessage(withdrawalMessage, message, 'success');
    await loadJobs();
  } catch (error) {
    setMessage(withdrawalMessage, error.message, 'error');
  } finally {
    button.disabled = false;
  }
});

document.getElementById('back-to-login-from-forgot').addEventListener('click', () => showLogin());
document.getElementById('back-to-login-from-otp').addEventListener('click', () => showLogin());
dashboardNavButtons.forEach(button => {
  button.addEventListener('click', () => showDashboardSection(button.dataset.dashboardSection));
});
document.getElementById('open-create-job').addEventListener('click', () => showDashboardSection('create-job-section'));
document.getElementById('open-manage-jobs').addEventListener('click', () => showDashboardSection('manage-jobs-section'));
document.getElementById('clear-admin-invite-button').addEventListener('click', () => {
  adminInviteForm.reset();
  setMessage(adminInviteMessage, '');
});
stateSelect.addEventListener('change', updateDistrictOptions);
document.getElementById('clear-button').addEventListener('click', () => {
  jobForm.reset();
  updateDistrictOptions();
  setMessage(jobMessage, '');
});
document.getElementById('refresh-button').addEventListener('click', loadJobs);
document.getElementById('refresh-applications-button').addEventListener('click', loadJobs);
document.getElementById('refresh-withdrawals-button').addEventListener('click', loadJobs);

logoutButton.addEventListener('click', () => {
  adminToken = '';
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  if (applicationRefreshTimer) {
    window.clearInterval(applicationRefreshTimer);
    applicationRefreshTimer = null;
  }
  showLogin('You have been logged out.', 'success');
});

loadLocationOptions().catch(error => setMessage(jobMessage, error.message, 'error'));
if (adminToken) showDashboard();
else showLogin();
