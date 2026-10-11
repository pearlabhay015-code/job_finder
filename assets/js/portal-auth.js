/**
 * Job Saathi Portal - Navigation Auth State Management
 * Toggles "My Account" nav link and "Log in" / "Sign up" buttons based on user session.
 */
(function () {
  function getAuthToken() {
    try {
      return localStorage.getItem('job-saathi-account-token') || '';
    } catch (e) {
      return '';
    }
  }

  function updateNavbarAuth() {
    const token = getAuthToken();
    const isLoggedIn = Boolean(token);

    // 1. "My Account" option in the navbar
    const accountNavItems = document.querySelectorAll('.portal-nav-account, [data-auth="member-nav"]');
    accountNavItems.forEach(el => {
      el.hidden = !isLoggedIn;
      if (!isLoggedIn) {
        el.style.display = 'none';
      } else {
        el.style.removeProperty('display');
      }
    });

    // 2. Guest buttons / links in the navbar (Log in / Sign up)
    const guestItems = document.querySelectorAll('.portal-action-login, .portal-action-signup, .portal-action-guest, .portal-nav-guest, [data-auth="guest"]');
    guestItems.forEach(el => {
      el.hidden = isLoggedIn;
      if (isLoggedIn) {
        el.style.display = 'none';
      } else {
        el.style.removeProperty('display');
      }
    });

    // 3. Member buttons / links (Log out, Account action)
    const memberItems = document.querySelectorAll('.portal-action-logout, .portal-action-account, [data-auth="member-action"]');
    memberItems.forEach(el => {
      el.hidden = !isLoggedIn;
      if (!isLoggedIn) {
        el.style.display = 'none';
      } else {
        el.style.removeProperty('display');
      }
    });
  }

  window.portalLogout = function () {
    try {
      localStorage.removeItem('job-saathi-account-token');
    } catch (e) {}
    updateNavbarAuth();
    if (window.location.pathname.endsWith('account.html') || window.location.pathname.endsWith('/account')) {
      window.location.href = 'account.html?mode=login';
    }
  };

  // If user clicks Log in or Sign up while already on account.html, switch mode smoothly
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (!target) return;
    const href = target.getAttribute('href') || '';
    if (href.startsWith('account.html?mode=') && window.location.pathname.endsWith('account.html')) {
      const mode = href.includes('mode=signup') ? 'signup' : 'login';
      if (typeof window.setAuthMode === 'function') {
        e.preventDefault();
        window.setAuthMode(mode);
      }
    }
  });

  window.updateNavbarAuth = updateNavbarAuth;

  // Run immediately if DOM already has navbar, otherwise on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
  } else {
    updateNavbarAuth();
  }

  // Sync across tabs
  window.addEventListener('storage', function (e) {
    if (e.key === 'job-saathi-account-token') {
      updateNavbarAuth();
    }
  });
})();
