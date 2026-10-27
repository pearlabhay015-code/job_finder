const PROFILE_API_BASE = window.location.port === '3000' ? '' : 'http://localhost:3000';
const inviteToken = new URLSearchParams(window.location.search).get('token') || '';

const loadingPanel = document.getElementById('loading-panel');
const profilePanel = document.getElementById('profile-panel');
const successPanel = document.getElementById('success-panel');
const invalidPanel = document.getElementById('invalid-panel');
const invalidMessage = document.getElementById('invalid-message');
const useridForm = document.getElementById('userid-form');
const otpForm = document.getElementById('otp-form');
const passwordForm = document.getElementById('profile-password-form');
const useridMessage = document.getElementById('userid-message');
const otpMessage = document.getElementById('otp-message');
const profileEmail = document.getElementById('profile-email');
const profileMessage = document.getElementById('profile-message');
let profileUserid = '';

function setMessage(element, message, type = '') {
  element.textContent = message;
  element.className = `message ${type}`.trim();
}

function showInvalid(message) {
  loadingPanel.hidden = true;
  profilePanel.hidden = true;
  successPanel.hidden = true;
  invalidPanel.hidden = false;
  invalidMessage.textContent = message;
}

async function profileRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${PROFILE_API_BASE}${path}`, { ...options, headers });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || 'The request could not be completed.');
  return result;
}

function moveToLogin() {
  window.location.href = 'admin.html';
}

useridForm.addEventListener('submit', async event => {
  event.preventDefault();
  profileUserid = document.getElementById('profile-userid').value.trim();
  setMessage(useridMessage, 'Sending OTP…');
  try {
    const result = await profileRequest('/api/admin/invite/send-otp', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken, username: profileUserid })
    });
    setMessage(useridMessage, result.message || 'OTP sent to your email.', 'success');
    useridForm.hidden = true;
    otpForm.hidden = false;
    document.getElementById('profile-otp').focus();
  } catch (error) {
    setMessage(useridMessage, error.message, 'error');
  }
});

otpForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(otpMessage, 'Verifying email…');
  const otp = document.getElementById('profile-otp').value.trim();
  try {
    const result = await profileRequest('/api/admin/invite/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken, username: profileUserid, otp })
    });
    setMessage(otpMessage, result.message || 'Email verified.', 'success');
    otpForm.hidden = true;
    passwordForm.hidden = false;
    document.getElementById('profile-password').focus();
  } catch (error) {
    setMessage(otpMessage, error.message, 'error');
  }
});

document.getElementById('back-to-userid-button').addEventListener('click', () => {
  otpForm.reset();
  setMessage(otpMessage, '');
  otpForm.hidden = true;
  useridForm.hidden = false;
});

document.getElementById('back-to-otp-button').addEventListener('click', () => {
  passwordForm.reset();
  setMessage(profileMessage, '');
  passwordForm.hidden = true;
  otpForm.hidden = false;
});

passwordForm.addEventListener('submit', async event => {
  event.preventDefault();
  setMessage(profileMessage, 'Creating admin profile…');
  const password = document.getElementById('profile-password').value;
  const confirmPassword = document.getElementById('profile-confirm-password').value;
  try {
    const result = await profileRequest('/api/admin/invite/complete', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken, username: profileUserid, password, confirmPassword })
    });
    passwordForm.reset();
    profilePanel.hidden = true;
    successPanel.hidden = false;
    window.setTimeout(moveToLogin, 2200);
    document.querySelector('#success-panel .muted').textContent = result.message || 'Your admin profile was created successfully. You will be moved to the admin login page.';
  } catch (error) {
    setMessage(profileMessage, error.message, 'error');
  }
});

document.getElementById('go-to-login-button').addEventListener('click', moveToLogin);

if (!inviteToken) {
  showInvalid('This admin invitation link is missing its security token. Ask an existing admin to send a new invitation.');
} else {
  profileRequest(`/api/admin/invite?token=${encodeURIComponent(inviteToken)}`)
    .then(result => {
      profileEmail.value = result.email;
      loadingPanel.hidden = true;
      profilePanel.hidden = false;
    })
    .catch(error => showInvalid(error.message));
}
