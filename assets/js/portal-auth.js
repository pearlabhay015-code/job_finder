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

  function renderMobileDock() {
    let dock = document.getElementById('portal-mobile-dock');
    if (!dock) {
      dock = document.createElement('nav');
      dock.id = 'portal-mobile-dock';
      dock.className = 'portal-mobile-dock';
      dock.setAttribute('aria-label', 'Mobile navigation');
      document.body.appendChild(dock);
    }

    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isJobs = currentPath.endsWith('jobs.html');
    const isRecruiters = currentPath.endsWith('recruiters.html');
    const isResources = currentPath.endsWith('resources.html');
    const isAccount = currentPath.endsWith('account.html');

    const token = getAuthToken();
    const isLoggedIn = Boolean(token);

    dock.innerHTML = `
      <a href="index.html" class="portal-dock-item ${isHome ? 'is-active' : ''}" data-nav="home">
        <i class="fa-solid fa-house"></i>
        <span class="portal-dock-label">Home</span>
      </a>
      <a href="jobs.html" class="portal-dock-item ${isJobs ? 'is-active' : ''}" data-nav="jobs">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="portal-dock-label">Find Jobs</span>
      </a>
      <a href="recruiters.html" class="portal-dock-item ${isRecruiters ? 'is-active' : ''}" data-nav="recruiters">
        <i class="fa-solid fa-briefcase"></i>
        <span class="portal-dock-label">Recruiters</span>
      </a>
      <a href="resources.html" class="portal-dock-item ${isResources ? 'is-active' : ''}" data-nav="resources">
        <i class="fa-solid fa-book-open"></i>
        <span class="portal-dock-label">Resources</span>
      </a>
      <a href="account.html${isLoggedIn ? '' : '?mode=login'}" class="portal-dock-item ${isAccount ? 'is-active' : ''}" data-nav="account">
        <i class="fa-solid fa-user"></i>
        <span class="portal-dock-label">${isLoggedIn ? 'Account' : 'Log in'}</span>
      </a>
    `;
    // Preserve in-page mode switching while letting page links navigate immediately.
    dock.querySelectorAll('.portal-dock-item').forEach(item => {
      item.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href) return;

        // If it's already the current active item, do nothing
        if (this.classList.contains('is-active')) {
          e.preventDefault();
          return;
        }

        // If on account.html and switching mode
        if (href.startsWith('account.html?mode=') && window.location.pathname.endsWith('account.html')) {
          e.preventDefault();
          dock.querySelectorAll('.portal-dock-item').forEach(el => el.classList.remove('is-active'));
          this.classList.add('is-active');
          const mode = href.includes('mode=signup') ? 'signup' : 'login';
          if (typeof window.setAuthMode === 'function') {
            window.setAuthMode(mode);
          }
          return;
        }
      });
    });
  }

  window.renderMobileDock = renderMobileDock;

  function initPortalNavigation() {
    renderMobileDock();
    updateNavbarAuth();
    const mainContent = document.querySelector('.portal-page');
    if (mainContent) {
      mainContent.classList.add('portal-page-entering');
    }
  }

  // Run immediately if DOM ready, otherwise on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalNavigation);
  } else {
    initPortalNavigation();
  }

  // Sync across tabs
  window.addEventListener('storage', function (e) {
    if (e.key === 'job-saathi-account-token') {
      initPortalNavigation();
    }
  });
})();
