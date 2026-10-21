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

  if (window.location.hash === '#resume-modal') {
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
        <h3>🔍 No matching opportunities found</h3>
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
            ${isApplied ? '✓ Applied' : 'Apply Here'}
          </button>
          
          <button class="action-icon-btn ${isSaved ? 'saved' : ''}" 
                  onclick="toggleSaveJob(${job.id}, this)" 
                  title="${isSaved ? 'Remove from saved' : 'Save opportunity'}" 
                  aria-label="Save opportunity">
            ${isSaved ? '♥' : '♡'}
          </button>

          <button class="action-icon-btn" 
                  onclick="shareJob('${job.jobId}', '${job.title}')" 
                  title="Copy Job ID & share" 
                  aria-label="Share opportunity">
            🔗
          </button>
        </div>
      </article>
    `;
  }).join('');
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
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderJobs();
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
  showToast(`📍 Showing jobs in ${stateName}`);
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
  if (savedJobIds.has(jobId)) {
    savedJobIds.delete(jobId);
    btn.classList.remove('saved');
    btn.textContent = '♡';
    btn.title = 'Save opportunity';
    showToast(`Removed Job #${job ? job.jobId : jobId} from saved list`);
  } else {
    savedJobIds.add(jobId);
    btn.classList.add('saved');
    btn.textContent = '♥';
    btn.title = 'Saved to favorites';
    showToast(`❤️ Saved Job #${job ? job.jobId : jobId} to your favorites!`);
  }
};

// Interactive Helper: Copy Job ID to clipboard
window.shareJob = function(jobId, title) {
  const textToCopy = `Job Saathi - Job ID: ${jobId} | ${title}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`📋 Copied Job ID ${jobId} to clipboard!`);
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
      showToast(`🎉 Thank you, ${candidateName}! Your resume has been submitted successfully.`, 'success');
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
        showToast(`🎉 Application successfully submitted for ${job ? job.title : 'the position'}!`, 'success');
        applyForm.reset();
      }
    });
  }

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mode = authForm.dataset.mode || 'login';
      const message = document.getElementById('auth-message');
      const submitButton = document.getElementById('auth-submit');
      const payload = {
        email: document.getElementById('auth-email').value,
        password: document.getElementById('auth-password').value
      };
      if (mode === 'signup') {
        payload.name = document.getElementById('auth-name').value;
      }

      submitButton.disabled = true;
      message.textContent = '';
      message.classList.remove('error', 'success');
      try {
        const response = await fetch(`/api/auth/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to continue.');

        localStorage.setItem('job-saathi-account-token', result.token);
        message.textContent = `Welcome, ${result.user.name}. Your account is ready.`;
        message.classList.add('success');
        setTimeout(() => {
          closeAllModals();
          authForm.reset();
          setAuthMode('login');
        }, 800);
      } catch (error) {
        message.textContent = error.message || 'Unable to connect. Please try again.';
        message.classList.add('error');
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
  const nameInput = document.getElementById('auth-name');
  const passwordInput = document.getElementById('auth-password');
  const message = document.getElementById('auth-message');
  if (!form || !nameGroup || !nameInput || !passwordInput || !message) return;

  form.dataset.mode = authMode;
  nameGroup.hidden = !signUp;
  nameInput.required = signUp;
  passwordInput.autocomplete = signUp ? 'new-password' : 'current-password';
  document.getElementById('auth-title').textContent = signUp ? 'Create your account' : 'Welcome back';
  document.getElementById('auth-copy').textContent = signUp
    ? 'Create an account to get started with Job Saathi.'
    : 'Log in to your Job Saathi account.';
  document.getElementById('auth-submit').textContent = signUp ? 'Create account' : 'Log in';
  document.getElementById('auth-login-tab').classList.toggle('active', !signUp);
  document.getElementById('auth-signup-tab').classList.toggle('active', signUp);
  message.textContent = '';
  message.classList.remove('error', 'success');
};

window.openResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
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
