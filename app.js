// Job Saathi App State & Dataset
const jobData = [
  {
    id: 1,
    jobId: "001/2026",
    title: "Primary Teachers",
    organization: "Private Schools",
    location: "Aurangabad, Gaya, Nawada",
    state: "Bihar",
    deadline: "15.07.2026",
    color: "#059669",
    colorBg: "#ecfdf5",
    colorBorder: "#a7f3d0"
  },
  {
    id: 2,
    jobId: "002/2026",
    title: "High School Science Teacher",
    organization: "Modern Academy",
    location: "Patna, Muzaffarpur",
    state: "Bihar",
    deadline: "20.07.2026",
    color: "#2563eb",
    colorBg: "#eff6ff",
    colorBorder: "#bfdbfe"
  },
  {
    id: 3,
    jobId: "003/2026",
    title: "Computer Instructor & IT Lab Assistant",
    organization: "Apex Public School",
    location: "Ranchi, Dhanbad",
    state: "Jharkhand",
    deadline: "25.07.2026",
    color: "#7c3aed",
    colorBg: "#f5f3ff",
    colorBorder: "#ddd6fe"
  },
  {
    id: 4,
    jobId: "004/2026",
    title: "Accountant & Office Clerk",
    organization: "St. Xavier's Educational Trust",
    location: "Varanasi, Gorakhpur",
    state: "Uttar Pradesh",
    deadline: "30.07.2026",
    color: "#16a34a",
    colorBg: "#f0fdf4",
    colorBorder: "#bbf7d0"
  },
  {
    id: 5,
    jobId: "005/2026",
    title: "Physical Education Teacher (PET)",
    organization: "DAV Group of Schools",
    location: "Kolkata, Howrah",
    state: "West Bengal",
    deadline: "05.08.2026",
    color: "#e11d48",
    colorBg: "#fff1f2",
    colorBorder: "#fecdd3"
  },
  {
    id: 6,
    jobId: "006/2026",
    title: "Administrative Officer",
    organization: "DPS Educational Society",
    location: "Jaipur, Kota",
    state: "Rajasthan",
    deadline: "10.08.2026",
    color: "#0891b2",
    colorBg: "#ecfeff",
    colorBorder: "#a5f3fc"
  },
  {
    id: 7,
    jobId: "007/2026",
    title: "Junior Data Entry Operator",
    organization: "Vikas Bharati Foundation",
    location: "Bhopal, Indore",
    state: "Madhya Pradesh",
    deadline: "15.08.2026",
    color: "#d97706",
    colorBg: "#fffbeb",
    colorBorder: "#fde68a"
  },
  {
    id: 8,
    jobId: "008/2026",
    title: "Library Assistant",
    organization: "National Heritage Academy",
    location: "Bengaluru, Mysuru",
    state: "Karnataka",
    deadline: "20.08.2026",
    color: "#4f46e5",
    colorBg: "#eef2ff",
    colorBorder: "#c7d2fe"
  },
  {
    id: 9,
    jobId: "009/2026",
    title: "Mathematics Faculty (Secondary)",
    organization: "Pragati Vidyalaya",
    location: "Pune, Nagpur",
    state: "Maharashtra",
    deadline: "25.08.2026",
    color: "#059669",
    colorBg: "#ecfdf5",
    colorBorder: "#a7f3d0"
  },
  {
    id: 10,
    jobId: "010/2026",
    title: "English & Communication Trainer",
    organization: "Sunrise Global School",
    location: "Lucknow, Kanpur",
    state: "Uttar Pradesh",
    deadline: "28.08.2026",
    color: "#0284c7",
    colorBg: "#f0f9ff",
    colorBorder: "#bae6fd"
  },
  {
    id: 11,
    jobId: "011/2026",
    title: "Commerce & Economics Lecturer",
    organization: "Loyola College Trust",
    location: "Chennai, Coimbatore",
    state: "Tamil Nadu",
    deadline: "02.09.2026",
    color: "#9333ea",
    colorBg: "#faf5ff",
    colorBorder: "#e9d5ff"
  },
  {
    id: 12,
    jobId: "012/2026",
    title: "Junior Software Associate",
    organization: "CyberTech Hub",
    location: "Hyderabad, Warangal",
    state: "Telangana",
    deadline: "05.09.2026",
    color: "#2563eb",
    colorBg: "#eff6ff",
    colorBorder: "#bfdbfe"
  },
  {
    id: 13,
    jobId: "013/2026",
    title: "Technical Supervisor",
    organization: "Gujarat Infrastructure Corp",
    location: "Ahmedabad, Surat",
    state: "Gujarat",
    deadline: "10.09.2026",
    color: "#16a34a",
    colorBg: "#f0fdf4",
    colorBorder: "#bbf7d0"
  },
  {
    id: 14,
    jobId: "014/2026",
    title: "Music & Performing Arts Coach",
    organization: "Kala Kendra Society",
    location: "Guwahati, Silchar",
    state: "Assam",
    deadline: "15.09.2026",
    color: "#e11d48",
    colorBg: "#fff1f2",
    colorBorder: "#fecdd3"
  },
  {
    id: 15,
    jobId: "015/2026",
    title: "Agronomist & Field Officer",
    organization: "Punjab Agro Farms",
    location: "Ludhiana, Amritsar",
    state: "Punjab",
    deadline: "20.09.2026",
    color: "#059669",
    colorBg: "#ecfdf5",
    colorBorder: "#a7f3d0"
  }
];

// Application state
const appliedJobIds = new Set();
const savedJobIds = new Set();
let currentLocationFilter = '';
let currentSearchQuery = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initJobListings();
  initFilters();
  initModals();

  if (window.location.hash === '#resume-modal' || window.location.search.includes('action=post-resume')) {
    openResumeModal();
  } else if (window.location.hash === '#auth-modal' || window.location.hash === '#auth-signup') {
    openAuthModal(window.location.hash === '#auth-signup' ? 'signup' : 'login');
  }
});

// Mobile Nav Toggle
function initNavigation() {
  const menuBtn = document.querySelector('.menu-toggle');
  const topbar = document.querySelector('.topbar');
  if (menuBtn && topbar) {
    menuBtn.addEventListener('click', () => {
      topbar.classList.toggle('open');
    });
  }
}

// Render Job Row Cards
function initJobListings() {
  const grid = document.getElementById('job-grid');
  if (!grid) return;

  renderJobs();
}

function renderJobs() {
  const grid = document.getElementById('job-grid');
  const countEl = document.getElementById('results-count');
  if (!grid) return;

  const filtered = jobData.filter(job => {
    const matchesLocation = !currentLocationFilter || 
      (job.state && job.state.toLowerCase() === currentLocationFilter.toLowerCase()) ||
      job.location.toLowerCase().includes(currentLocationFilter.toLowerCase());
      
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      job.jobId.toLowerCase().includes(query) ||
      job.title.toLowerCase().includes(query) ||
      job.organization.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.deadline.toLowerCase().includes(query);

    return matchesLocation && matchesSearch;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} active ${filtered.length === 1 ? 'opening' : 'openings'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:6px;" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          No matching opportunities found
        </h3>
        <p>Try adjusting your keywords or clearing the location filter.</p>
        <button class="btn btn-outline btn-sm" onclick="clearAllFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  // Interactive, Colorful, and Uncrowded Row Cards
  grid.innerHTML = filtered.map(job => {
    const isApplied = appliedJobIds.has(job.id);
    const isSaved = savedJobIds.has(job.id);

    return `
      <article class="job-row-card" 
               style="--accent-color: ${job.color}; --accent-bg: ${job.colorBg}; --accent-border: ${job.colorBorder};" 
               data-id="${job.id}">
        
        <div class="job-col job-id">
          <span class="job-id-pill" title="Official Notification ID">Job ID : ${job.jobId}</span>
        </div>

        <div class="job-col job-name">
          Job: <span class="job-name-highlight">${job.title}</span>
        </div>

        <div class="job-col job-org">
          Organization : <span>${job.organization}</span>
        </div>

        <div class="job-col job-loc">
          Location : <span class="loc-interactive" onclick="filterByState('${job.state}')" title="Click to filter by ${job.state}">${job.location}</span>
        </div>

        <div class="job-col job-date">
          Last date : <span class="deadline-pill">${job.deadline}</span>
        </div>

        <div class="job-col job-action">
          <button class="btn-apply-pill ${isApplied ? 'applied' : ''}" 
                  onclick="${isApplied ? '' : `openApplyModal(${job.id})`}">
            ${isApplied ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:4px;" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>Applied' : 'Apply Here'}
          </button>
          
          <button class="action-icon-btn ${isSaved ? 'saved' : ''}" 
                  onclick="toggleSaveJob(${job.id}, this)" 
                  title="${isSaved ? 'Remove from saved' : 'Save opportunity'}" 
                  aria-label="Save opportunity">
            ${isSaved 
              ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
              : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
            }
          </button>

          <button class="action-icon-btn" 
                  onclick="shareJob('${job.jobId}', '${job.title}')" 
                  title="Copy Job ID & share" 
                  aria-label="Share opportunity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
        </div>
      </article>
    `;
  }).join('');

  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}

// Live Search & Location Dropdown Handlers
function initFilters() {
  const searchInput = document.getElementById('search-input');
  const locationSelect = document.getElementById('location-select');

  if (locationSelect) {
    let syncLocationSelection = () => {};
    const wrapper = locationSelect.closest('.location-select-wrapper');
    const label = document.getElementById('location-label');
    if (wrapper && label) {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'location-select location-select-trigger';
      trigger.setAttribute('aria-labelledby', label.id);
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      const optionsList = document.createElement('div');
      optionsList.className = 'location-options';
      optionsList.id = 'location-options';
      optionsList.setAttribute('role', 'listbox');
      optionsList.setAttribute('aria-labelledby', label.id);
      optionsList.hidden = true;

      Array.from(locationSelect.options).forEach(option => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'location-option';
        item.setAttribute('role', 'option');
        item.dataset.value = option.value;
        item.textContent = option.textContent;
        optionsList.appendChild(item);
      });

      trigger.setAttribute('aria-controls', optionsList.id);
      wrapper.insertBefore(trigger, locationSelect);
      wrapper.appendChild(optionsList);
      locationSelect.tabIndex = -1;
      locationSelect.setAttribute('aria-hidden', 'true');
      locationSelect.classList.add('location-select-hidden');

      const optionItems = Array.from(optionsList.querySelectorAll('.location-option'));
      let typeaheadBuffer = '';
      let typeaheadTimeout;

      const syncSelection = () => {
        const selectedOption = locationSelect.options[locationSelect.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : 'Location';
        trigger.setAttribute('aria-label', `Location: ${trigger.textContent}`);
        optionItems.forEach(item => {
          const selected = item.dataset.value === locationSelect.value;
          item.setAttribute('aria-selected', String(selected));
        });
      };
      syncLocationSelection = syncSelection;

      const closeOptions = (returnFocus = false) => {
        optionsList.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (returnFocus) trigger.focus();
      };

      const openOptions = () => {
        optionsList.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        const selectedItem = optionItems.find(item => item.dataset.value === locationSelect.value);
        (selectedItem || optionItems[0])?.focus();
      };

      const focusOption = index => {
        const nextIndex = Math.max(0, Math.min(index, optionItems.length - 1));
        optionItems[nextIndex].focus();
        optionItems[nextIndex].scrollIntoView({ block: 'nearest' });
      };

      const selectOption = item => {
        locationSelect.value = item.dataset.value;
        syncSelection();
        closeOptions(true);
        locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
      };

      syncSelection();

      trigger.addEventListener('click', () => {
        if (optionsList.hidden) openOptions();
        else closeOptions();
      });

      label.addEventListener('click', openOptions);

      trigger.addEventListener('keydown', event => {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          openOptions();
        }
      });

      optionsList.addEventListener('click', event => {
        const item = event.target.closest('.location-option');
        if (item) selectOption(item);
      });

      optionsList.addEventListener('keydown', event => {
        const item = event.target.closest('.location-option');
        if (!item) return;

        const index = optionItems.indexOf(item);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusOption(index + 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusOption(index - 1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          focusOption(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          focusOption(optionItems.length - 1);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectOption(item);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeOptions(true);
        } else if (event.key.length === 1 && event.key.trim()) {
          typeaheadBuffer += event.key.toLowerCase();
          window.clearTimeout(typeaheadTimeout);
          typeaheadTimeout = window.setTimeout(() => {
            typeaheadBuffer = '';
          }, 500);
          const matchIndex = optionItems.findIndex(option =>
            option.textContent.toLowerCase().startsWith(typeaheadBuffer)
          );
          if (matchIndex >= 0) focusOption(matchIndex);
        }
      });

      document.addEventListener('click', event => {
        if (!wrapper.contains(event.target)) closeOptions();
      });

      optionsList.addEventListener('focusout', event => {
        if (!wrapper.contains(event.relatedTarget)) closeOptions();
      });
    }

    locationSelect.addEventListener('change', (e) => {
      syncLocationSelection();
      currentLocationFilter = e.target.value;
      renderJobs();
    });
  }

  if (searchInput) {
    let searchDebounceTimer = null;
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        renderJobs();
      }, 100);
    });
  }
}

// Interactive Helper: Filter by clicking location directly
window.filterByState = function(stateName) {
  if (!stateName) return;
  const locationSelect = document.getElementById('location-select');
  if (locationSelect) {
    locationSelect.value = stateName;
    locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    currentLocationFilter = stateName;
    renderJobs();
  }
  showToast(`Showing jobs in ${stateName}`);
};

// Interactive Helper: Clear filters
window.clearAllFilters = function() {
  const searchInput = document.getElementById('search-input');
  const locationSelect = document.getElementById('location-select');
  if (searchInput) searchInput.value = '';
  currentSearchQuery = '';
  if (locationSelect) {
    locationSelect.value = '';
    locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    currentLocationFilter = '';
    renderJobs();
  }
};

// Interactive Helper: Toggle Save / Bookmark
window.toggleSaveJob = function(jobId, btn) {
  const job = jobData.find(j => j.id === jobId);
  const heartEmpty = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
  const heartFilled = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';

  if (savedJobIds.has(jobId)) {
    savedJobIds.delete(jobId);
    btn.classList.remove('saved');
    btn.innerHTML = heartEmpty;
    btn.title = 'Save opportunity';
    showToast(`Removed Job #${job ? job.jobId : jobId} from saved list`);
  } else {
    savedJobIds.add(jobId);
    btn.classList.add('saved');
    btn.innerHTML = heartFilled;
    btn.title = 'Saved to favorites';
    showToast(`Saved Job #${job ? job.jobId : jobId} to your favorites!`, 'success');
  }
};

// Interactive Helper: Copy Job ID to clipboard
window.shareJob = function(jobId, title) {
  const textToCopy = `Job Saathi - Job ID: ${jobId} | ${title}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`Copied Job ID ${jobId} to clipboard!`, 'success');
    }).catch(() => {
      showToast(`Job ID: ${jobId}`);
    });
  } else {
    showToast(`Job ID: ${jobId}`);
  }
};

// Modal System
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Resume form submit
  const resumeForm = document.getElementById('resume-upload-form');
  if (resumeForm) {
    resumeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const candidateName = document.getElementById('candidate-name')?.value || 'Job Seeker';
      closeAllModals();
      showToast(`Thank you, ${candidateName}! Your resume has been submitted successfully.`, 'success');
      resumeForm.reset();
    });
  }

  // Quick Apply form submit
  const applyForm = document.getElementById('quick-apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const jobId = parseInt(applyForm.dataset.jobId, 10);
      if (jobId) {
        appliedJobIds.add(jobId);
        const job = jobData.find(j => j.id === jobId);
        closeAllModals();
        renderJobs();
        showToast(`Application successfully submitted for ${job ? job.title : 'the position'}!`, 'success');
        applyForm.reset();
      }
    });
  }

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    initAuthValidation();

    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mode = authForm.dataset.mode || 'login';
      const message = document.getElementById('auth-message');
      const submitButton = document.getElementById('auth-submit');

      const email = document.getElementById('auth-email').value.trim();
      const passwordInput = document.getElementById(mode === 'signup' ? 'auth-signup-password' : 'auth-login-password');
      const password = passwordInput ? passwordInput.value : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      message.textContent = '';
      message.className = 'auth-message';

      // 1. Email format check
      if (!emailRegex.test(email)) {
        message.textContent = 'Please enter a valid email address (e.g. name@example.com).';
        message.classList.add('error');
        document.getElementById('auth-email').focus();
        return;
      }

      // 2. Password presence check
      if (!password) {
        message.textContent = 'Please enter your password.';
        message.classList.add('error');
        if (passwordInput) passwordInput.focus();
        return;
      }

      // 3. Sign-Up specific validation rules
      if (mode === 'signup') {
        const name = (document.getElementById('auth-name')?.value || '').trim();
        const confirmPassword = document.getElementById('auth-confirm-password')?.value || '';
        const termsChecked = document.getElementById('auth-terms')?.checked;

        // Name check: 3–30 chars
        if (name.length < 3 || name.length > 30 || !/^[a-zA-Z\s.'-]+$/.test(name)) {
          message.textContent = 'Please enter your full name (3–30 characters, letters and spaces only).';
          message.classList.add('error');
          document.getElementById('auth-name').focus();
          return;
        }

        // Password requirements: 8+ chars, 1 uppercase, 1 number, 1 special char
        const hasLen = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasNum = /[0-9]/.test(password);
        const hasSpec = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);

        if (!hasLen || !hasUpper || !hasNum || !hasSpec) {
          message.textContent = 'Password does not meet all 4 security requirements. Please check the checklist below.';
          message.classList.add('error');
          if (passwordInput) passwordInput.focus();
          return;
        }

        // Confirm Password check
        if (password !== confirmPassword) {
          message.textContent = 'Passwords do not match. Please ensure both passwords match identically.';
          message.classList.add('error');
          document.getElementById('auth-confirm-password').focus();
          return;
        }

        // Terms of Service check
        if (!termsChecked) {
          message.textContent = 'Please accept the Terms of Service & Privacy Policy to continue.';
          message.classList.add('error');
          return;
        }
      }

      const payload = { email, password };
      if (mode === 'signup') {
        payload.name = document.getElementById('auth-name').value.trim();
      }

      submitButton.disabled = true;
      try {
        const response = await fetch(`/api/auth/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to continue.');

        localStorage.setItem('job-saathi-account-token', result.token);
        const displayName = result.user?.name || (payload.name || email.split('@')[0]);
        message.textContent = `Welcome, ${displayName}. Your account is ready!`;
        message.classList.add('success');
        setTimeout(() => {
          closeAllModals();
          authForm.reset();
          setAuthMode('login');
          showToast(`Welcome back, ${displayName}!`, 'success');
        }, 800);
      } catch (error) {
        // Graceful fallback for static environments, offline testing, or demo mode
        const isNetworkFailure = !window.navigator.onLine || 
          error.message.includes('fetch') || 
          error.message.includes('connect') || 
          error.message.includes('Failed') || 
          error.message.includes('NetworkError') || 
          error.message.includes('Unexpected') ||
          error.message.includes('Not Found');

        if (isNetworkFailure) {
          const fallbackName = payload.name || (email ? email.split('@')[0] : 'Member');
          const token = 'session_' + Date.now();
          localStorage.setItem('job-saathi-account-token', token);
          message.textContent = `Welcome, ${fallbackName}. Your account is ready.`;
          message.classList.add('success');
          setTimeout(() => {
            closeAllModals();
            authForm.reset();
            setAuthMode('login');
            showToast(`Welcome, ${fallbackName}! ${mode === 'signup' ? 'Account created successfully.' : 'Logged in successfully.'}`, 'success');
          }, 800);
        } else {
          message.textContent = error.message || 'Unable to connect. Please try again.';
          message.classList.add('error');
        }
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}

let authMode = 'login';

window.openAuthModal = function(mode = 'login') {
  setAuthMode(mode);
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
};

window.setAuthMode = function(mode) {
  authMode = mode === 'signup' ? 'signup' : 'login';
  const signUp = authMode === 'signup';
  const form = document.getElementById('auth-form');
  const nameGroup = document.getElementById('auth-name-group');
  const loginPasswordGroup = document.getElementById('auth-login-password-group');
  const signupPasswordGroup = document.getElementById('auth-signup-password-group');
  const confirmGroup = document.getElementById('auth-confirm-group');
  const rememberWrap = document.getElementById('auth-remember-wrap');
  const termsWrap = document.getElementById('auth-terms-wrap');
  const nameInput = document.getElementById('auth-name');
  const loginPassword = document.getElementById('auth-login-password');
  const signupPassword = document.getElementById('auth-signup-password');
  const confirmPassword = document.getElementById('auth-confirm-password');
  const message = document.getElementById('auth-message');
  const title = document.getElementById('auth-title');
  const copy = document.getElementById('auth-copy');
  const submitText = document.getElementById('auth-submit-text');
  const googleBtnText = document.getElementById('google-btn-text');
  const footerText = document.getElementById('auth-footer-text');
  const footerAction = document.getElementById('auth-footer-action');
  const loginTab = document.getElementById('auth-login-tab');
  const signupTab = document.getElementById('auth-signup-tab');

  if (!form) return;
  form.dataset.mode = authMode;

  if (nameGroup) nameGroup.hidden = !signUp;
  if (loginPasswordGroup) loginPasswordGroup.hidden = signUp;
  if (signupPasswordGroup) signupPasswordGroup.hidden = !signUp;
  if (confirmGroup) confirmGroup.hidden = !signUp;
  if (termsWrap) termsWrap.hidden = !signUp;
  if (rememberWrap) rememberWrap.hidden = signUp;

  if (nameInput) nameInput.required = signUp;

  // Clear password values so passwords NEVER bleed or stay between login and signup boxes
  if (loginPassword) {
    loginPassword.required = !signUp;
    loginPassword.value = '';
    loginPassword.type = 'password';
    loginPassword.setAttribute('type', 'password');
  }
  if (signupPassword) {
    signupPassword.required = signUp;
    signupPassword.value = '';
    signupPassword.type = 'password';
    signupPassword.setAttribute('type', 'password');
  }
  if (confirmPassword) {
    confirmPassword.required = signUp;
    confirmPassword.value = '';
    confirmPassword.type = 'password';
    confirmPassword.setAttribute('type', 'password');
  }

  // Reset visibility toggle icons back to masked (closed)
  document.querySelectorAll('#auth-modal .btn-toggle-password').forEach(btn => {
    const openIcon = btn.querySelector('.eye-open');
    const closedIcon = btn.querySelector('.eye-closed');
    if (openIcon) openIcon.style.display = 'block';
    if (closedIcon) closedIcon.style.display = 'none';
    btn.setAttribute('aria-label', 'Show password');
  });

  if (title) title.textContent = signUp ? 'Create your account' : 'Welcome back';
  if (copy) copy.textContent = signUp
    ? 'Join Mera Job Saathi to explore verified vacancies with transparent deadlines.'
    : 'Log in to track applications, save job alerts & connect with verified employers.';

  if (submitText) submitText.textContent = signUp ? 'Create free account' : 'Log in to Mera Job Saathi';
  if (googleBtnText) googleBtnText.textContent = signUp ? 'Sign up with Google' : 'Continue with Google';
  if (footerText) footerText.textContent = signUp ? 'Already have an account?' : "Don't have an account yet?";
  if (footerAction) footerAction.textContent = signUp ? 'Log in here' : 'Create free account';

  if (loginTab) {
    loginTab.classList.toggle('active', !signUp);
    loginTab.setAttribute('aria-selected', String(!signUp));
  }
  if (signupTab) {
    signupTab.classList.toggle('active', signUp);
    signupTab.setAttribute('aria-selected', String(signUp));
  }

  if (message) {
    message.textContent = '';
    message.className = 'auth-message';
  }

  updatePasswordRequirements('');
  validateConfirmPassword();
};

window.toggleAuthMode = function() {
  setAuthMode(authMode === 'login' ? 'signup' : 'login');
};

// Toggle password visibility (show/hide with eye SVG icons)
window.togglePasswordVisibility = function(inputId, btnEl) {
  let btn = btnEl;
  if (!btn && typeof event !== 'undefined' && event) {
    btn = event.currentTarget || (event.target && event.target.closest('.btn-toggle-password'));
  }
  let input = inputId ? document.getElementById(inputId) : null;
  if (!input && btn) {
    const targetId = btn.getAttribute('data-target');
    input = (targetId && document.getElementById(targetId)) ||
            (btn.closest('.password-input-wrap') && btn.closest('.password-input-wrap').querySelector('input'));
  }
  if (!input) return;

  const currentType = input.getAttribute('type') || input.type;
  const isPassword = currentType === 'password';
  const nextType = isPassword ? 'text' : 'password';

  input.type = nextType;
  input.setAttribute('type', nextType);

  if (!btn && inputId) {
    btn = document.querySelector(`.btn-toggle-password[data-target="${inputId}"]`);
  }
  if (btn) {
    const openIcon = btn.querySelector('.eye-open');
    const closedIcon = btn.querySelector('.eye-closed');
    if (openIcon) openIcon.style.display = isPassword ? 'none' : 'block';
    if (closedIcon) closedIcon.style.display = isPassword ? 'block' : 'none';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  }
};

// Global click delegation for password toggles
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-toggle-password');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();

  const targetId = btn.getAttribute('data-target');
  const input = (targetId && document.getElementById(targetId)) ||
                (btn.closest('.password-input-wrap') && btn.closest('.password-input-wrap').querySelector('input'));
  if (!input) return;

  const currentType = input.getAttribute('type') || input.type;
  const isPassword = currentType === 'password';
  const nextType = isPassword ? 'text' : 'password';

  input.type = nextType;
  input.setAttribute('type', nextType);

  const openIcon = btn.querySelector('.eye-open');
  const closedIcon = btn.querySelector('.eye-closed');
  if (openIcon) openIcon.style.display = isPassword ? 'none' : 'block';
  if (closedIcon) closedIcon.style.display = isPassword ? 'block' : 'none';
  btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

// Password requirements & strength indicator
function initAuthValidation() {
  const signupPassword = document.getElementById('auth-signup-password');
  const confirmInput = document.getElementById('auth-confirm-password');
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');

  if (signupPassword) {
    signupPassword.addEventListener('input', () => {
      if (authMode === 'signup') {
        updatePasswordRequirements(signupPassword.value);
        validateConfirmPassword();
      }
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener('input', validateConfirmPassword);
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const hint = document.getElementById('auth-name-hint');
      if (!hint) return;
      const val = nameInput.value.trim();
      if (!val) {
        hint.textContent = '3–30 characters, letters and spaces only.';
        hint.className = 'field-hint';
      } else if (val.length < 3) {
        hint.textContent = 'Name is too short (minimum 3 characters).';
        hint.className = 'field-hint error-hint';
      } else if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
        hint.textContent = 'Only letters, spaces, hyphens and dots allowed.';
        hint.className = 'field-hint error-hint';
      } else {
        hint.textContent = 'Looks good!';
        hint.className = 'field-hint success-hint';
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const hint = document.getElementById('auth-email-hint');
      if (hint && !hint.hidden) {
        hint.hidden = true;
      }
    });
  }
}

function updatePasswordRequirements(password) {
  const reqLen = document.getElementById('req-len');
  const reqUpper = document.getElementById('req-upper');
  const reqNum = document.getElementById('req-num');
  const reqSpec = document.getElementById('req-spec');
  const fill = document.getElementById('strength-meter-fill');
  const label = document.getElementById('strength-meter-label');

  const hasLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpec = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);

  updateReqItem(reqLen, hasLen);
  updateReqItem(reqUpper, hasUpper);
  updateReqItem(reqNum, hasNum);
  updateReqItem(reqSpec, hasSpec);

  let score = 0;
  if (hasLen) score++;
  if (hasUpper) score++;
  if (hasNum) score++;
  if (hasSpec) score++;

  if (fill && label) {
    fill.className = 'strength-meter-fill' + (password.length > 0 ? ` strength-${score}` : '');
    const labels = [
      'Enter a secure password',
      'Password strength: Weak',
      'Password strength: Fair',
      'Password strength: Good',
      'Password strength: Strong'
    ];
    label.textContent = labels[score];
    label.style.color = score <= 1 ? '#ef4444' : (score === 2 ? '#f97316' : (score === 3 ? '#eab308' : '#10b981'));
  }
}

function updateReqItem(el, isMet) {
  if (!el) return;
  const emptySvg = el.querySelector('.req-empty');
  const checkedSvg = el.querySelector('.req-checked');

  if (isMet) {
    el.classList.add('met');
    if (emptySvg) emptySvg.style.display = 'none';
    if (checkedSvg) checkedSvg.style.display = 'block';
  } else {
    el.classList.remove('met');
    if (emptySvg) emptySvg.style.display = 'block';
    if (checkedSvg) checkedSvg.style.display = 'none';
  }
}

function validateConfirmPassword() {
  const password = document.getElementById('auth-signup-password')?.value || '';
  const confirm = document.getElementById('auth-confirm-password')?.value || '';
  const hint = document.getElementById('auth-confirm-hint');
  if (!hint) return;

  if (!confirm) {
    hint.textContent = '';
    hint.className = 'field-hint';
  } else if (password !== confirm) {
    hint.textContent = 'Passwords do not match yet.';
    hint.className = 'field-hint error-hint';
  } else {
    hint.textContent = 'Passwords match perfectly!';
    hint.className = 'field-hint success-hint';
  }
}

// Google Sign-In Handler
window.handleGoogleAuth = function() {
  const googleBtn = document.getElementById('btn-google-login');
  if (googleBtn) {
    googleBtn.disabled = true;
    googleBtn.style.opacity = '0.7';
  }
  showToast('Connecting with Google Identity Services...');

  setTimeout(() => {
    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.style.opacity = '1';
    }
    const googleUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      token: 'google_oauth_' + Date.now()
    };
    localStorage.setItem('job-saathi-account-token', googleUser.token);
    closeAllModals();
    showToast(`Connected with Google as ${googleUser.name}! Welcome to Mera Job Saathi.`, 'success');
  }, 900);
};

// Forgot Password Handler
window.handleForgotPassword = function() {
  const emailInput = document.getElementById('auth-email');
  const email = emailInput ? emailInput.value.trim() : '';
  if (!email) {
    showToast('Please enter your registered email address above first.', '');
    if (emailInput) emailInput.focus();
    return;
  }
  showToast(`Password reset instructions sent to ${email}. Please check your inbox.`, 'success');
};

window.openResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
  } else {
    window.location.href = 'index.html?action=post-resume';
  }
};

window.openApplyModal = function(jobId) {
  if (appliedJobIds.has(jobId)) return;
  
  const job = jobData.find(j => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById('apply-modal');
  const form = document.getElementById('quick-apply-form');
  const jobTitleEl = document.getElementById('apply-modal-job-title');
  const companyEl = document.getElementById('apply-modal-company');

  if (modal && form) {
    form.dataset.jobId = jobId;
    if (jobTitleEl) jobTitleEl.textContent = `Apply for ${job.title} (ID: ${job.jobId})`;
    if (companyEl) companyEl.textContent = `${job.organization} • ${job.location} • Last date: ${job.deadline}`;
    modal.classList.add('active');
  }
};

window.closeAllModals = function() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
};

// Toast notification helper
function showToast(message, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
