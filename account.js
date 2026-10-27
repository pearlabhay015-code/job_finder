const ACCOUNT_API_BASE_URL = window.location.port === '3000' ? '' : 'http://localhost:3000';

function accountToken() {
  try {
    return localStorage.getItem('job-saathi-account-token')
      || sessionStorage.getItem('job-saathi-account-token')
      || '';
  } catch (error) {
    return '';
  }
}

function logoutUser() {
  try {
    localStorage.removeItem('job-saathi-account-token');
    sessionStorage.removeItem('job-saathi-account-token');
  } catch (error) {}
  window.location.href = 'index.html';
}

window.logoutUser = logoutUser;

const APPLICATION_STATUS_LABELS = {
  applied: 'Applied',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Completed',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
};
const WITHDRAWABLE_APPLICATION_STATUSES = new Set([
  'applied',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'interview_completed',
  'offered'
]);

function applicationStatusLabel(application) {
  if (application.status === 'payment_pending' && application.paymentStatus !== 'paid') return 'Payment Pending';
  return APPLICATION_STATUS_LABELS[application.status] || 'Applied';
}

function applicationDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

function renderApplications(applications) {
  const container = document.getElementById('account-applications');
  const section = document.querySelector('.account-applications-section');
  if (!container) return;
  if (section) section.hidden = false;
  container.replaceChildren();

  const records = Array.isArray(applications) ? applications : [];
  if (!records.length) {
    const empty = document.createElement('p');
    empty.className = 'account-empty-saved';
    empty.textContent = 'No applications yet. Apply for a job to track it here.';
    container.appendChild(empty);
    return;
  }

  records.forEach(application => {
    const card = document.createElement('article');
    card.className = 'account-application';
    card.dataset.applicationId = application.id;

    const title = document.createElement('h3');
    title.textContent = application.jobTitle || 'Untitled job';

    const organization = document.createElement('p');
    organization.className = 'account-saved-organization';
    organization.textContent = application.organization || 'Organization not available';

    const details = document.createElement('div');
    details.className = 'account-application-details';
    const location = document.createElement('span');
    location.textContent = [application.district, application.state].filter(Boolean).join(', ') || application.location || 'Location not available';
    const jobCode = document.createElement('span');
    jobCode.textContent = application.jobCode ? `Job ${application.jobCode}` : 'Job ID unavailable';
    details.append(location, jobCode);

    const footer = document.createElement('div');
    footer.className = 'account-application-footer';
    const date = document.createElement('span');
    date.textContent = `${application.statusUpdatedAt ? 'Updated' : 'Submitted'} ${applicationDate(application.statusUpdatedAt || application.paidAt || application.createdAt)}`;
    const status = document.createElement('span');
    const statusClass = String(application.status || 'applied').replace(/[^a-z0-9_-]/gi, '-');
    status.className = `account-application-status status-${statusClass}`;
    status.textContent = applicationStatusLabel(application);
    footer.append(date, status);

    if (WITHDRAWABLE_APPLICATION_STATUSES.has(application.status) && application.withdrawalRequest?.status !== 'pending') {
      const withdrawButton = document.createElement('button');
      withdrawButton.type = 'button';
      withdrawButton.className = 'account-withdraw-button';
      withdrawButton.dataset.applicationId = application.id;
      withdrawButton.textContent = 'Withdraw';
      footer.appendChild(withdrawButton);
    }

    card.append(title, organization, details, footer);
    if (application.withdrawalRequest?.status === 'pending') {
      const withdrawalNote = document.createElement('p');
      withdrawalNote.className = 'account-application-withdrawal';
      withdrawalNote.textContent = 'Withdrawal request sent to admin for approval.';
      card.appendChild(withdrawalNote);
    } else if (application.withdrawalRequest?.refundStatus === 'processed') {
      const refundNote = document.createElement('p');
      refundNote.className = 'account-application-withdrawal account-application-refund';
      refundNote.textContent = 'Refund initiated to the original payment method.';
      card.appendChild(refundNote);
    }
    container.appendChild(card);
  });
}

function renderSavedJobs(savedJobs) {
  const container = document.getElementById('account-saved-jobs');
  if (!container) return;
  container.replaceChildren();

  if (!Array.isArray(savedJobs) || !savedJobs.length) {
    const empty = document.createElement('p');
    empty.className = 'account-empty-saved';
    empty.textContent = 'No liked jobs yet. Tap the heart on a job to save it here.';
    container.appendChild(empty);
    return;
  }

  savedJobs.forEach(job => {
    const card = document.createElement('article');
    card.className = 'account-saved-job';

    const title = document.createElement('h3');
    title.textContent = job.title || 'Untitled job';

    const organization = document.createElement('p');
    organization.className = 'account-saved-organization';
    organization.textContent = job.organization || 'Organization not available';

    const location = document.createElement('span');
    location.textContent = [job.district, job.state].filter(Boolean).join(', ') || job.location || 'Location not available';

    const deadline = document.createElement('span');
    deadline.className = 'account-saved-deadline';
    deadline.textContent = `Apply by ${job.deadline || job.lastDate || 'date not available'}`;

    const meta = document.createElement('div');
    meta.className = 'account-saved-meta';
    meta.append(location, deadline);

    card.append(title, organization, meta);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('account-loading');
  const errorBox = document.getElementById('account-error');
  const details = document.getElementById('account-details');
  const token = accountToken();

  if (!token) {
    window.location.href = 'index.html#auth-modal';
    return;
  }

  try {
    const response = await fetch(`${ACCOUNT_API_BASE_URL}/api/account`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to load your account.');

    const user = result.user || {};
    const setAccountValue = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value || 'Not added yet';
    };

    setAccountValue('account-name', user.name);
    setAccountValue('account-email', user.email);
    setAccountValue('account-phone', user.phone);
    setAccountValue('account-address', user.address);
    setAccountValue('account-state', user.state);
    setAccountValue('account-district', user.district);
    setAccountValue('account-pincode', user.pincode);

    const resumeNames = (Array.isArray(result.resumes) ? result.resumes : [])
      .map(record => record?.resume?.originalName || record?.resume?.name)
      .filter(Boolean);
    setAccountValue('account-resume', resumeNames.length ? resumeNames.join(', ') : 'Not uploaded yet');
    renderApplications(result.applications);
    renderSavedJobs(result.savedJobs);
    loading.hidden = true;
    details.hidden = false;
  } catch (error) {
    try {
      localStorage.removeItem('job-saathi-account-token');
      sessionStorage.removeItem('job-saathi-account-token');
    } catch (storageError) {}
    loading.hidden = true;
    errorBox.textContent = `${error.message} Please log in again.`;
    errorBox.hidden = false;
    window.setTimeout(() => { window.location.href = 'index.html#auth-modal'; }, 1200);
  }
});

document.getElementById('account-applications')?.addEventListener('click', async event => {
  const button = event.target.closest('.account-withdraw-button');
  if (!button) return;
  if (!window.confirm('Withdraw this application?')) return;

  button.disabled = true;
  button.textContent = 'Withdrawing…';
  try {
    const response = await fetch(`${ACCOUNT_API_BASE_URL}/api/applications/${encodeURIComponent(button.dataset.applicationId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accountToken()}`
      },
      body: JSON.stringify({ status: 'withdrawn' })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to withdraw the application.');

    const card = button.closest('.account-application');
    const withdrawalNote = document.createElement('p');
    withdrawalNote.className = 'account-application-withdrawal';
    withdrawalNote.textContent = 'Withdrawal request sent to admin for approval.';
    card?.appendChild(withdrawalNote);
    button.remove();
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Withdraw';
    window.alert(error.message || 'Unable to withdraw the application.');
  }
});
