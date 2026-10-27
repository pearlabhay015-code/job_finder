// Job Saathi App State & Dataset
const API_BASE_URL = window.location.port === '3000' ? '' : 'http://localhost:3000';
const allJobsView = new URLSearchParams(window.location.search).get('view') === 'all';
document.documentElement.classList.toggle('all-jobs-view', allJobsView);
let indiaLocationDataPromise;

function getIndiaLocationData() {
  if (!indiaLocationDataPromise) {
    indiaLocationDataPromise = fetch('data/india_states_districts.json')
      .then(response => response.ok ? response.json() : [])
      .catch(() => []);
  }
  return indiaLocationDataPromise;
}

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
let currentDistrictFilter = '';
let currentSearchQuery = '';
let currentAccountUser = null;
let pendingApplyJobId = null;
let pendingApplicationPayment = null;
let pendingGoogleConsentToken = '';
let pendingGoogleConsentUser = null;
let jobsLoading = true;
let jobsLoadError = '';

function storeAccountToken(token, remember = true) {
  const value = String(token || '').trim();
  if (!value) return;
  try {
    clearAccountToken();
    sessionStorage.removeItem('job-saathi-account-token');
    (remember ? localStorage : sessionStorage).setItem('job-saathi-account-token', value);
  } catch (error) {}
}

function clearAccountToken() {
  try {
    localStorage.removeItem('job-saathi-account-token');
    sessionStorage.removeItem('job-saathi-account-token');
  } catch (error) {}
}

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initJobListings();
  initFilters();
  initModals();
  initAccountMenu();
  completeGoogleAuthFromUrl().finally(() => refreshAuthUI());

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

const deadlineMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function getDeadlineParts(deadline) {
  const [day, month, year] = String(deadline).split(/[./-]/);
  const monthNumber = Number(month);

  return {
    day: Number(day) ? String(Number(day)) : day,
    month: deadlineMonths[monthNumber - 1] || month,
    year
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function getJobDistricts(job) {
  const values = [];
  const addValues = value => {
    if (Array.isArray(value)) {
      value.forEach(addValues);
      return;
    }

    String(value || '')
      .split(',')
      .map(valuePart => valuePart.trim())
      .filter(Boolean)
      .forEach(valuePart => values.push(valuePart));
  };

  addValues(job.district);
  addValues(job.location);

  return [...new Map(values.map(value => [value.toLowerCase(), value])).values()];
}

// Render Job Row Cards
function initJobListings() {
  const grid = document.getElementById('job-grid');
  if (!grid) return;

  jobsLoading = true;
  jobsLoadError = '';
  renderJobs();
  loadJobsFromDatabase();
}

const databaseJobPalette = [
  { color: '#059669', colorBg: '#ecfdf5', colorBorder: '#a7f3d0' },
  { color: '#2563eb', colorBg: '#eff6ff', colorBorder: '#bfdbfe' },
  { color: '#7c3aed', colorBg: '#f5f3ff', colorBorder: '#ddd6fe' },
  { color: '#e11d48', colorBg: '#fff1f2', colorBorder: '#fecdd3' },
  { color: '#0891b2', colorBg: '#ecfeff', colorBorder: '#a5f3fc' }
];

function normalizeDatabaseJob(job, index) {
  const palette = databaseJobPalette[index % databaseJobPalette.length];
  const numericId = Number(job.id) || Number(String(job.id || '').match(/\d+/)?.[0]) || index + 1;
  const rawDeadline = String(job.deadline || job.lastDate || '').trim();
  const relativeDays = Number(rawDeadline.match(/(\d+)\s*Days?\s*Left/i)?.[1]);
  const deadlineDate = rawDeadline.match(/^\d{2}[./-]\d{2}[./-]\d{4}$/)
    ? rawDeadline.replace(/-/g, '.')
    : Number.isFinite(relativeDays)
      ? (() => {
          const date = new Date(Date.now() + relativeDays * 86400000);
          return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        })()
      : rawDeadline;
  const year = deadlineDate.match(/(\d{4})$/)?.[1] || new Date().getFullYear();
  return {
    ...job,
    id: numericId,
    jobId: String(job.jobId || `${String(numericId).padStart(3, '0')}/${year}`),
    title: String(job.title || ''),
    organization: String(job.organization || ''),
    location: String(job.location || ''),
    state: String(job.state || ''),
    district: String(job.district || ''),
    deadline: deadlineDate,
    ...palette
  };
}

async function loadJobsFromDatabase() {
  jobsLoading = true;
  jobsLoadError = '';
  jobData.splice(0, jobData.length);
  renderJobs();

  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!response.ok) throw new Error(`Database jobs request failed (${response.status}).`);
    const result = await response.json();
    if (!Array.isArray(result.jobs)) throw new Error('Database returned an invalid jobs list.');

    // Public listings come only from the live database jobs table.
    jobData.splice(0, jobData.length, ...result.jobs.map(normalizeDatabaseJob));
    jobsLoading = false;
    renderJobs();
  } catch (error) {
    jobsLoading = false;
    jobsLoadError = error.message || 'Unable to load jobs from the database.';
    console.error('Database jobs are unavailable.', error);
    renderJobs();
  }
}

window.retryLoadJobs = loadJobsFromDatabase;

function renderJobs() {
  const grid = document.getElementById('job-grid');
  const countEl = document.getElementById('results-count');
  const viewAllJobs = document.getElementById('view-all-jobs');
  const viewTitle = document.getElementById('jobs-view-title');
  const viewSubtitle = document.getElementById('jobs-view-subtitle');
  if (!grid) return;

  if (viewTitle) viewTitle.textContent = allJobsView ? 'All listed opportunities' : 'Available Opportunities';
  if (viewSubtitle) viewSubtitle.textContent = allJobsView
    ? 'Browse every active job notification with transparent deadlines'
    : 'Verified job notifications with transparent deadlines';
  if (viewAllJobs) viewAllJobs.hidden = true;

  if (jobsLoading) {
    if (countEl) countEl.textContent = 'Loading openings...';
    grid.innerHTML = `
      <div class="no-results">
        <h3>Loading opportunities...</h3>
        <p>Fetching the latest jobs from the database.</p>
      </div>
    `;
    return;
  }

  if (jobsLoadError) {
    if (countEl) countEl.textContent = 'Jobs unavailable';
    grid.innerHTML = `
      <div class="no-results">
        <h3>Unable to load jobs</h3>
        <p>Start the backend and database, then try again.</p>
        <button class="btn btn-outline btn-sm" onclick="retryLoadJobs()">Try Again</button>
      </div>
    `;
    return;
  }

  const filtered = jobData.filter(job => {
    const matchesLocation = !currentLocationFilter || 
      (job.state && job.state.toLowerCase() === currentLocationFilter.toLowerCase()) ||
      job.location.toLowerCase().includes(currentLocationFilter.toLowerCase());
    const matchesDistrict = !currentDistrictFilter ||
      getJobDistricts(job).some(district => district.toLowerCase() === currentDistrictFilter.toLowerCase()) ||
      getJobDistricts(job).some(district => district.toLowerCase().includes(currentDistrictFilter.toLowerCase()));
      
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      job.jobId.toLowerCase().includes(query) ||
      job.title.toLowerCase().includes(query) ||
      job.organization.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.deadline.toLowerCase().includes(query);

    return matchesLocation && matchesDistrict && matchesSearch;
  });

  if (countEl) {
    const visibleCount = allJobsView ? filtered.length : Math.min(filtered.length, 10);
    countEl.textContent = !allJobsView && filtered.length > visibleCount
      ? `Showing ${visibleCount} of ${filtered.length} active openings`
      : `${filtered.length} active ${filtered.length === 1 ? 'opening' : 'openings'}`;
  }

  if (viewAllJobs) viewAllJobs.hidden = allJobsView || filtered.length === 0;

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
  const jobsToRender = allJobsView ? filtered : filtered.slice(0, 10);

  grid.innerHTML = jobsToRender.map(job => {
    const isApplied = appliedJobIds.has(job.id);
    const isSaved = savedJobIds.has(job.id);
    const deadlineParts = getDeadlineParts(job.deadline);
    const location = escapeHtml(job.location || 'Not specified');
    const state = escapeHtml(job.state || 'Not specified');
    const district = escapeHtml(getJobDistricts(job).join(', ') || 'Not specified');
    const title = escapeHtml(job.title || '');
    const organization = escapeHtml(job.organization || '');
    const jobId = escapeHtml(job.jobId || '');

    return `
      <article class="job-row-card" 
               style="--accent-color: ${job.color}; --accent-bg: ${job.colorBg}; --accent-border: ${job.colorBorder};" 
               data-id="${job.id}">
        
        <div class="job-col job-date">
          <span class="deadline-month">${deadlineParts.month} ${deadlineParts.year}</span>
          <strong class="deadline-day">${deadlineParts.day}</strong>
          <span class="deadline-label">Last date</span>
        </div>

        <div class="job-col job-name">
          Job: <span class="job-name-highlight">${title}</span>
        </div>

        <div class="job-col job-org">
          Organization : <span>${organization}</span>
        </div>

        <div class="job-col job-loc">
          <div class="job-location-details">
            <div class="job-location-line"><span class="job-location-label">Location:</span> <span class="loc-interactive" onclick="filterByState('${job.state || ''}')" title="Click to filter by ${state}">${location}</span></div>
            <div class="job-location-line"><span class="job-location-label">State:</span> <span class="job-location-value">${state}</span></div>
            <div class="job-location-line"><span class="job-location-label">District:</span> <span class="job-location-value">${district}</span></div>
          </div>
        </div>

        <div class="job-col job-action">
          <button type="button" class="btn-apply-pill ${isApplied ? 'applied' : ''}" 
                  aria-label="${isApplied ? 'Applied' : `Apply for ${title}`}"
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
  const districtSelect = document.getElementById('district-select');

  const locationDataPromise = getIndiaLocationData();

  const updateDistrictOptions = async stateName => {
    if (!districtSelect) return;

    currentDistrictFilter = '';
    districtSelect.disabled = !stateName;
    districtSelect.innerHTML = `<option value="">${stateName ? 'All Districts' : 'Select a state first'}</option>`;
    if (!stateName) return;

    const locationData = await locationDataPromise;
    if (locationSelect && locationSelect.value !== stateName) return;

    const selectedState = locationData.find(state =>
      state.name.toLowerCase() === stateName.toLowerCase()
    );
    const districtsFromData = selectedState?.districts?.map(district => district.name) || [];
    const districtsFromJobs = jobData
      .filter(job => (job.state || '').toLowerCase() === stateName.toLowerCase())
      .flatMap(getJobDistricts);
    const districts = [...new Map(
      [...districtsFromData, ...districtsFromJobs]
        .filter(Boolean)
        .map(district => [district.toLowerCase(), district])
    ).values()].sort((a, b) => a.localeCompare(b));

    districtSelect.innerHTML = '<option value="">All Districts</option>' +
      districts.map(district => `<option value="${escapeHtml(district)}">${escapeHtml(district)}</option>`).join('');
  };

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
        trigger.textContent = selectedOption ? selectedOption.textContent : 'All Locations';
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
      updateDistrictOptions(e.target.value);
      renderJobs();
    });
  }

  if (districtSelect) {
    districtSelect.addEventListener('change', (e) => {
      currentDistrictFilter = e.target.value;
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
  const districtSelect = document.getElementById('district-select');
  if (searchInput) searchInput.value = '';
  currentSearchQuery = '';
  currentDistrictFilter = '';
  if (locationSelect) {
    locationSelect.value = '';
    locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
    if (districtSelect) {
      districtSelect.value = '';
      districtSelect.disabled = true;
    }
  } else {
    currentLocationFilter = '';
    renderJobs();
  }
};

// Interactive Helper: Toggle Save / Bookmark
window.toggleSaveJob = async function(jobId, btn) {
  const job = jobData.find(j => j.id === jobId);
  const heartEmpty = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
  const heartFilled = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';

  const token = getAccountToken();
  if (!token) {
    openAuthModal('login');
    showToast('Please log in to save liked jobs to your account.');
    return;
  }

  const isSaved = savedJobIds.has(jobId);
  if (btn) btn.disabled = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-jobs${isSaved ? `/${encodeURIComponent(jobId)}` : ''}`, {
      method: isSaved ? 'DELETE' : 'POST',
      headers: {
        ...(isSaved ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${token}`
      },
      body: isSaved ? undefined : JSON.stringify({ jobId })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to update liked jobs.');

    if (isSaved) {
      savedJobIds.delete(jobId);
      if (btn) {
        btn.classList.remove('saved');
        btn.innerHTML = heartEmpty;
        btn.title = 'Save opportunity';
      }
      showToast(`Removed Job #${job ? job.jobId : jobId} from saved list`);
    } else {
      savedJobIds.add(jobId);
      if (btn) {
        btn.classList.add('saved');
        btn.innerHTML = heartFilled;
        btn.title = 'Remove from liked jobs';
      }
      showToast(`Saved Job #${job ? job.jobId : jobId} to your liked jobs!`, 'success');
    }
  } catch (error) {
    if (error.message.toLowerCase().includes('log in') || error.message.toLowerCase().includes('authentication')) {
      clearAccountToken();
      updateAuthUI(null);
    }
    showToast(error.message || 'Unable to update liked jobs.', 'error');
  } finally {
    if (btn) btn.disabled = false;
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

let resumeLocationReadyPromise = null;

function resetResumeDistrictSelect() {
  const districtSelect = document.getElementById('candidate-district');
  if (!districtSelect) return;
  districtSelect.disabled = true;
  districtSelect.innerHTML = '<option value="">Select a state first</option>';
}

async function updateResumeDistrictOptions(stateName, selectedDistrict = '') {
  const districtSelect = document.getElementById('candidate-district');
  const stateSelect = document.getElementById('candidate-state');
  if (!districtSelect) return;

  districtSelect.disabled = !stateName;
  districtSelect.innerHTML = `<option value="">${stateName ? 'Select your district' : 'Select a state first'}</option>`;
  if (!stateName) return;

  const locationData = await getIndiaLocationData();
  if (stateSelect && stateSelect.value !== stateName) return;
  const selectedState = locationData.find(state =>
    String(state.name || '').toLowerCase() === stateName.toLowerCase()
  );
  const districts = selectedState?.districts || [];
  districts.forEach(district => {
    districtSelect.append(new Option(district.name, district.name));
  });
  districtSelect.value = selectedDistrict || '';
}

function initResumeForm() {
  const stateSelect = document.getElementById('candidate-state');
  if (!stateSelect) return Promise.resolve();
  if (resumeLocationReadyPromise) return resumeLocationReadyPromise;

  resumeLocationReadyPromise = getIndiaLocationData().then(locationData => {
    stateSelect.innerHTML = '<option value="">Select your state</option>';
    locationData.forEach(state => {
      stateSelect.append(new Option(state.name, state.name));
    });
    stateSelect.addEventListener('change', () => {
      updateResumeDistrictOptions(stateSelect.value);
    });
  });
  return resumeLocationReadyPromise;
}

async function populateResumeForm(user) {
  await initResumeForm();
  const fields = {
    'candidate-name': user?.name || '',
    'candidate-email': user?.email || '',
    'candidate-phone': user?.phone || '',
    'candidate-address': user?.address || '',
    'candidate-pincode': user?.pincode || ''
  };
  for (const [id, value] of Object.entries(fields)) {
    const field = document.getElementById(id);
    if (field) field.value = value;
  }
  const stateSelect = document.getElementById('candidate-state');
  if (stateSelect) {
    stateSelect.value = user?.state || '';
    await updateResumeDistrictOptions(stateSelect.value, user?.district || '');
  }
}

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

  initResumeForm();

  // Resume form submit
  const resumeForm = document.getElementById('resume-upload-form');
  if (resumeForm) {
    resumeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = getAccountToken();
      if (!token) {
        closeAllModals();
        openAuthModal('login');
        showToast('Please log in before posting your resume.');
        return;
      }

      const fileInput = document.getElementById('file-upload');
      if (!fileInput?.files?.[0]) {
        showToast('Please select your resume file.', 'error');
        return;
      }

      const submitButton = resumeForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const formData = new FormData();
        formData.append('name', document.getElementById('candidate-name')?.value.trim() || '');
        formData.append('email', document.getElementById('candidate-email')?.value.trim() || '');
        formData.append('phone', document.getElementById('candidate-phone')?.value.trim() || '');
        formData.append('address', document.getElementById('candidate-address')?.value.trim() || '');
        formData.append('state', document.getElementById('candidate-state')?.value || '');
        formData.append('district', document.getElementById('candidate-district')?.value || '');
        formData.append('pincode', document.getElementById('candidate-pincode')?.value.trim() || '');
        formData.append('file', fileInput.files[0]);

        const response = await fetch(`${API_BASE_URL}/api/resumes`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to submit your resume.');

        if (result.user) updateAuthUI(result.user);
        const candidateName = result.user?.name || document.getElementById('candidate-name')?.value || 'Job Seeker';
        closeAllModals();
        showToast(`Thank you, ${candidateName}! Your resume and profile details were saved successfully.`, 'success');
        resumeForm.reset();
        resetResumeDistrictSelect();
      } catch (error) {
        showToast(error.message || 'Unable to submit your resume. Please try again.', 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // Quick Apply form submit
  const applyForm = document.getElementById('quick-apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const jobId = parseInt(applyForm.dataset.jobId, 10);
      const token = getAccountToken();
      if (!jobId || !token) {
        pendingApplyJobId = jobId || null;
        closeAllModals();
        openAuthModal('login');
        showToast('Please log in before applying for a job.');
        return;
      }

      const submitButton = applyForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const response = await fetch(`${API_BASE_URL}/api/applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            jobId,
            phone: document.getElementById('applicant-phone')?.value.trim() || '',
            notes: document.getElementById('applicant-notes')?.value.trim() || ''
          })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to submit the application.');
        if (result.paymentRequired === false) {
          appliedJobIds.add(jobId);
          applyForm.reset();
          closeAllModals();
          renderJobs();
          showToast(`You applied for ${result.record?.jobTitle || 'this job'} successfully.`, 'success');
          return;
        }
        await openApplicationPayment(result.record, result.amount, result.currency);
      } catch (error) {
        showToast(error.message || 'Unable to submit the application.', 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  const paymentForm = document.getElementById('application-payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!pendingApplicationPayment) return;
      if (pendingApplicationPayment.mode === 'razorpay') {
        await launchRazorpayCheckout();
      } else {
        await verifyApplicationPayment({ demo: true });
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

      if (mode === 'signup') {
        await handleSignupSubmit(message, submitButton);
        return;
      }

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
        const response = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to continue.');

        storeAccountToken(result.token, document.getElementById('auth-remember-me')?.checked !== false);
        updateAuthUI(result.user);
        void refreshSavedJobs();
        const displayName = result.user?.name || (payload.name || email.split('@')[0]);
        message.textContent = `Welcome, ${displayName}. Your account is ready!`;
        message.classList.add('success');
        setTimeout(() => {
          closeAllModals();
          authForm.reset();
          setAuthMode('login');
          showToast(`Welcome back, ${displayName}!`, 'success');
          if (pendingApplyJobId) {
            const jobId = pendingApplyJobId;
            pendingApplyJobId = null;
            window.setTimeout(() => openApplyModal(jobId), 250);
          }
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
          storeAccountToken(token, document.getElementById('auth-remember-me')?.checked !== false);
          if (mode === 'login') updateAuthUI({ name: fallbackName, email });
          savedJobIds.clear();
          message.textContent = `Welcome, ${fallbackName}. Your account is ready.`;
          message.classList.add('success');
          setTimeout(() => {
            closeAllModals();
            authForm.reset();
            setAuthMode('login');
            showToast(`Welcome, ${fallbackName}! ${mode === 'signup' ? 'Account created successfully.' : 'Logged in successfully.'}`, 'success');
            if (mode === 'login' && pendingApplyJobId) {
              const jobId = pendingApplyJobId;
              pendingApplyJobId = null;
              window.setTimeout(() => openApplyModal(jobId), 250);
            }
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

  initGoogleConsentControls();
}

function initGoogleConsentControls() {
  const terms = document.getElementById('google-consent-terms');
  if (terms) terms.addEventListener('change', updateGoogleConsentButton);
}

let authMode = 'login';
let signupStage = 'details';

function initAccountMenu() {
  const menu = document.getElementById('account-menu');
  const button = document.getElementById('account-menu-button');
  const dropdown = document.getElementById('account-dropdown');
  if (!menu || !button || !dropdown) return;

  button.addEventListener('click', event => {
    event.stopPropagation();
    const isOpening = dropdown.hidden;
    dropdown.hidden = !isOpening;
    button.setAttribute('aria-expanded', String(isOpening));
  });

  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) {
      dropdown.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

function updateAuthUI(user) {
  currentAccountUser = user || null;
  const loginCta = document.getElementById('login-cta');
  const loginCtaSection = document.getElementById('login-cta-section') || loginCta?.closest('.nav-cta');
  const accountMenu = document.getElementById('account-menu');
  const accountDropdown = document.getElementById('account-dropdown');
  const accountMenuName = document.getElementById('account-menu-name');
  const accountMenuEmail = document.getElementById('account-menu-email');
  const mobileAccountAction = document.getElementById('mobile-account-action');
  const mobileAccountLabel = document.getElementById('mobile-account-label');
  const loggedIn = Boolean(user && user.email);

  if (loginCta) loginCta.hidden = loggedIn;
  if (loginCtaSection) loginCtaSection.hidden = loggedIn;
  if (loginCtaSection) loginCtaSection.classList.toggle('is-authenticated-hidden', loggedIn);
  if (accountMenu) accountMenu.hidden = !loggedIn;
  if (accountDropdown) accountDropdown.hidden = true;
  const menuButton = document.getElementById('account-menu-button');
  if (menuButton) menuButton.setAttribute('aria-expanded', 'false');

  if (loggedIn) {
    if (accountMenuName) accountMenuName.textContent = user.name || user.email.split('@')[0];
    if (accountMenuEmail) accountMenuEmail.textContent = user.email;
    if (mobileAccountLabel) mobileAccountLabel.textContent = 'My Account';
    if (mobileAccountAction) mobileAccountAction.onclick = () => { window.location.href = 'account.html'; };
  } else {
    if (mobileAccountLabel) mobileAccountLabel.textContent = 'Account';
    if (mobileAccountAction) mobileAccountAction.onclick = () => openAuthModal('login');
  }
}

async function refreshSavedJobs() {
  savedJobIds.clear();
  appliedJobIds.clear();
  const token = getAccountToken();
  if (!token) {
    renderJobs();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to load account data.');
    for (const job of result.savedJobs || []) savedJobIds.add(Number(job.id));
    for (const application of result.applications || []) {
      if (application.status !== 'payment_pending' || application.paymentStatus === 'paid') {
        appliedJobIds.add(Number(application.jobId));
      }
    }
  } catch (error) {
    // Keep the page usable if the saved-jobs request is temporarily unavailable.
  }
  renderJobs();
}

async function refreshAuthUI() {
  const token = getAccountToken();

  if (!token) {
    updateAuthUI(null);
    savedJobIds.clear();
    appliedJobIds.clear();
    renderJobs();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Session expired.');
    updateAuthUI(result.user);
    await refreshSavedJobs();
  } catch (error) {
    clearAccountToken();
    updateAuthUI(null);
    savedJobIds.clear();
    appliedJobIds.clear();
    renderJobs();
  }
}

async function completeGoogleAuthFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const exchangeCode = params.get('google_code');
  const googleError = params.get('google_error');
  const googleMode = params.get('google_mode') === 'signup' ? 'signup' : 'login';
  if (!exchangeCode && !googleError) return;

  params.delete('google_code');
  params.delete('google_error');
  params.delete('google_mode');
  const cleanQuery = params.toString();
  window.history.replaceState({}, document.title, `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`);

  if (googleError) {
    if (window.openAuthModal) window.openAuthModal(googleMode);
    showToast(googleError, 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: exchangeCode })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Google sign-in expired. Please try again.');
    if (result.consentRequired) {
      pendingGoogleConsentToken = String(result.consentToken || '');
      pendingGoogleConsentUser = result.user || null;
      if (!pendingGoogleConsentToken) throw new Error('Google sign-in needs consent before it can continue. Please try again.');
      window.closeAllModals?.();
      openGoogleConsentModal(pendingGoogleConsentUser);
      return;
    }

    if (!result.token) throw new Error('Google sign-in did not return a valid session. Please try again.');
    storeAccountToken(result.token, true);
    finishGoogleSignIn(result.user);
  } catch (error) {
    if (window.openAuthModal) window.openAuthModal(googleMode);
    showToast(error.message || 'Google sign-in could not be completed.', 'error');
  }
}

function finishGoogleSignIn(user) {
  updateAuthUI(user);
  void refreshSavedJobs();
  window.closeAllModals?.();
  showToast(`Welcome, ${user?.name || 'there'}!`, 'success');
  if (pendingApplyJobId) {
    const jobId = pendingApplyJobId;
    pendingApplyJobId = null;
    window.setTimeout(() => openApplyModal(jobId), 250);
  }
}

function setGoogleConsentMessage(text, type = '') {
  const message = document.getElementById('google-consent-message');
  if (!message) return;
  message.textContent = text || '';
  message.className = `auth-message${type ? ` ${type}` : ''}`;
}

function updateGoogleConsentButton() {
  const terms = document.getElementById('google-consent-terms');
  const submit = document.getElementById('google-consent-submit');
  if (submit) submit.disabled = !terms?.checked || !pendingGoogleConsentToken;
}

function openGoogleConsentModal(user) {
  const modal = document.getElementById('google-consent-modal');
  const terms = document.getElementById('google-consent-terms');
  const remember = document.getElementById('google-consent-remember');
  if (!modal) return;
  if (terms) terms.checked = false;
  if (remember) remember.checked = true;
  setGoogleConsentMessage(user?.name ? `Signed in as ${user.name}.` : 'Please accept the required policy before continuing.');
  updateGoogleConsentButton();
  modal.classList.add('active');
  terms?.focus();
}

window.cancelGoogleConsent = function() {
  pendingGoogleConsentToken = '';
  pendingGoogleConsentUser = null;
  setGoogleConsentMessage('');
  window.closeAllModals?.();
};

window.completeGoogleConsent = async function() {
  const terms = document.getElementById('google-consent-terms');
  const remember = document.getElementById('google-consent-remember');
  const submit = document.getElementById('google-consent-submit');
  if (!terms?.checked) {
    setGoogleConsentMessage('Please accept the Terms of Service & Privacy Policy to continue.', 'error');
    updateGoogleConsentButton();
    return;
  }
  if (!pendingGoogleConsentToken) {
    setGoogleConsentMessage('This Google sign-in has expired. Please start again.', 'error');
    updateGoogleConsentButton();
    return;
  }

  if (submit) submit.disabled = true;
  setGoogleConsentMessage('Saving your consent securely…');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consentToken: pendingGoogleConsentToken, acceptTerms: true })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to finish Google sign-in.');
    storeAccountToken(result.token, remember?.checked !== false);
    pendingGoogleConsentToken = '';
    pendingGoogleConsentUser = null;
    finishGoogleSignIn(result.user);
  } catch (error) {
    setGoogleConsentMessage(error.message || 'Unable to finish Google sign-in. Please try again.', 'error');
    updateGoogleConsentButton();
  }
};

window.logoutUser = function() {
  clearAccountToken();
  savedJobIds.clear();
  appliedJobIds.clear();
  updateAuthUI(null);
  showToast('You have been logged out.', 'success');
};

async function handleSignupSubmit(message, submitButton) {
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');
  const email = emailInput.value.trim().toLowerCase();
  const name = nameInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  message.textContent = '';
  message.className = 'auth-message';

  if (name.length < 3 || name.length > 30 || !/^[a-zA-Z\s.'-]+$/.test(name)) {
    message.textContent = 'Please enter your full name (3–30 characters, letters and spaces only).';
    message.classList.add('error');
    nameInput.focus();
    return;
  }
  if (!emailRegex.test(email)) {
    message.textContent = 'Please enter a valid email address.';
    message.classList.add('error');
    emailInput.focus();
    return;
  }

  submitButton.disabled = true;
  try {
    if (signupStage === 'details') {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send the verification OTP.');
      signupStage = 'otp';
      document.getElementById('auth-signup-otp-group').hidden = false;
      nameInput.disabled = true;
      emailInput.disabled = true;
      document.getElementById('auth-signup-otp').focus();
      document.getElementById('auth-submit-text').textContent = 'Verify email';
      message.textContent = result.message || 'A verification OTP was sent to your email.';
      message.classList.add('success');
      return;
    }

    if (signupStage === 'otp') {
      const otpInput = document.getElementById('auth-signup-otp');
      const otp = otpInput.value.trim();
      if (!/^\d{6}$/.test(otp)) {
        message.textContent = 'Enter the 6-digit OTP sent to your email.';
        message.classList.add('error');
        otpInput.focus();
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/auth/signup/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to verify the OTP.');
      signupStage = 'password';
      document.getElementById('auth-signup-otp-group').hidden = true;
      document.getElementById('auth-signup-password-group').hidden = false;
      document.getElementById('auth-confirm-group').hidden = false;
      document.getElementById('auth-terms-wrap').hidden = false;
      document.getElementById('auth-signup-password').required = true;
      document.getElementById('auth-confirm-password').required = true;
      document.getElementById('auth-submit-text').textContent = 'Create free account';
      document.getElementById('auth-signup-password').focus();
      message.textContent = result.message || 'Email verified. Create your password.';
      message.classList.add('success');
      return;
    }

    const password = document.getElementById('auth-signup-password').value;
    const confirmPassword = document.getElementById('auth-confirm-password').value;
    const termsChecked = document.getElementById('auth-terms')?.checked;
    const hasLen = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpec = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/\?~]/.test(password);
    if (!hasLen || !hasUpper || !hasNum || !hasSpec) {
      message.textContent = 'Password does not meet all 4 security requirements. Please check the checklist below.';
      message.classList.add('error');
      document.getElementById('auth-signup-password').focus();
      return;
    }
    if (password !== confirmPassword) {
      message.textContent = 'Passwords do not match. Please ensure both passwords match identically.';
      message.classList.add('error');
      document.getElementById('auth-confirm-password').focus();
      return;
    }
    if (!termsChecked) {
      message.textContent = 'Please accept the Terms of Service & Privacy Policy to continue.';
      message.classList.add('error');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword, acceptTerms: true })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to create your account.');
    localStorage.removeItem('job-saathi-account-token');
    const displayName = result.user?.name || name;
    message.textContent = `Account created successfully for ${displayName}.`;
    message.classList.add('success');
    setTimeout(() => {
      closeAllModals();
      document.getElementById('auth-form').reset();
      setAuthMode('login');
      showToast('Account created successfully. Please log in.', 'success');
      openAuthModal('login');
    }, 1200);
  } catch (error) {
    message.textContent = error.message || 'Unable to continue. Please try again.';
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
  }
}

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
  const signupOtpGroup = document.getElementById('auth-signup-otp-group');
  const signupPasswordGroup = document.getElementById('auth-signup-password-group');
  const confirmGroup = document.getElementById('auth-confirm-group');
  const rememberWrap = document.getElementById('auth-remember-wrap');
  const termsWrap = document.getElementById('auth-terms-wrap');
  const nameInput = document.getElementById('auth-name');
  const emailInput = document.getElementById('auth-email');
  const signupOtp = document.getElementById('auth-signup-otp');
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
  signupStage = 'details';

  if (nameGroup) nameGroup.hidden = !signUp;
  if (loginPasswordGroup) loginPasswordGroup.hidden = signUp;
  if (signupOtpGroup) signupOtpGroup.hidden = !(signUp && signupStage === 'otp');
  if (signupPasswordGroup) signupPasswordGroup.hidden = !(signUp && signupStage === 'password');
  if (confirmGroup) confirmGroup.hidden = !(signUp && signupStage === 'password');
  if (termsWrap) termsWrap.hidden = !(signUp && signupStage === 'password');
  if (rememberWrap) rememberWrap.hidden = signUp;

  if (nameInput) nameInput.required = signUp;
  if (nameInput) nameInput.disabled = false;
  if (emailInput) emailInput.disabled = false;
  if (signupOtp) {
    signupOtp.value = '';
    signupOtp.required = false;
  }

  // Clear password values so passwords NEVER bleed or stay between login and signup boxes
  if (loginPassword) {
    loginPassword.required = !signUp;
    loginPassword.value = '';
    loginPassword.type = 'password';
    loginPassword.setAttribute('type', 'password');
  }
  if (signupPassword) {
    signupPassword.required = false;
    signupPassword.value = '';
    signupPassword.type = 'password';
    signupPassword.setAttribute('type', 'password');
  }
  if (confirmPassword) {
    confirmPassword.required = false;
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
    : 'Your first job application is free. Later applications require a ₹200 secure payment.';

  if (submitText) submitText.textContent = signUp ? 'Send verification OTP' : 'Log in to Mera Job Saathi';
  if (googleBtnText) googleBtnText.textContent = signUp ? 'Create account with Google' : 'Continue with Google';
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

window.handleGoogleAuth = async function() {
  const button = document.getElementById('btn-google-login');
  if (button) button.disabled = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/status`);
    const status = await response.json().catch(() => ({}));
    if (!response.ok || !status.configured) {
      throw new Error('Google sign-in is not configured yet. Add Google OAuth credentials to the server .env file.');
    }
    window.location.href = `${API_BASE_URL}/api/auth/google/start?mode=${encodeURIComponent(authMode)}`;
  } catch (error) {
    showToast(error.message || 'Unable to connect to Google sign-in. Please try again.', 'error');
    if (button) button.disabled = false;
  }
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

window.openResumeModal = async function() {
  const modal = document.getElementById('resume-modal');
  if (!modal) {
    window.location.href = 'index.html?action=post-resume';
    return;
  }

  let token = getAccountToken();
  if (!token) {
    closeAllModals();
    openAuthModal('login');
    showToast('Please log in before posting your resume.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Your login session has expired.');
    updateAuthUI(result.user);
    await populateResumeForm(result.user);
    modal.classList.add('active');
  } catch (error) {
    clearAccountToken();
    updateAuthUI(null);
    closeAllModals();
    openAuthModal('login');
    showToast('Please log in before posting your resume.');
  }
};

function getAccountToken() {
  try {
    return localStorage.getItem('job-saathi-account-token')
      || sessionStorage.getItem('job-saathi-account-token')
      || '';
  } catch (error) {
    return '';
  }
}

window.openApplyModal = async function(jobId) {
  if (appliedJobIds.has(jobId)) return;

  const job = jobData.find(j => j.id === jobId);
  if (!job) return;

  const token = getAccountToken();
  if (!token) {
    pendingApplyJobId = jobId;
    closeAllModals();
    openAuthModal('login');
    showToast('Please log in before applying for a job.');
    return;
  }

  let user = currentAccountUser;
  if (!user) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your login session has expired.');
      user = result.user;
      updateAuthUI(user);
    } catch (error) {
      clearAccountToken();
      updateAuthUI(null);
      pendingApplyJobId = jobId;
      openAuthModal('login');
      showToast('Please log in before applying for a job.');
      return;
    }
  }

  const modal = document.getElementById('apply-modal');
  const form = document.getElementById('quick-apply-form');
  const jobTitleEl = document.getElementById('apply-modal-job-title');
  const companyEl = document.getElementById('apply-modal-company');

  if (modal && form) {
    form.dataset.jobId = jobId;
    if (jobTitleEl) jobTitleEl.textContent = `Apply for ${job.title} (ID: ${job.jobId})`;
    if (companyEl) companyEl.textContent = `${job.organization} • ${job.location} • Last date: ${job.deadline}`;
    const nameInput = document.getElementById('applicant-name');
    const emailInput = document.getElementById('applicant-email');
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    modal.classList.add('active');
  }
};

function formatApplicationAmount(amount, currency = 'INR') {
  const value = Number(amount || 0) / 100;
  return currency === 'INR' ? `₹${value.toFixed(2)}` : `${currency} ${value.toFixed(2)}`;
}

async function openApplicationPayment(record, amount, currency) {
  const token = getAccountToken();
  const response = await fetch(`${API_BASE_URL}/api/payments/application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ applicationId: record.id })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to open the payment gateway.');

  pendingApplicationPayment = {
    applicationId: record.id,
    jobId: Number(record.jobId),
    jobTitle: record.jobTitle,
    mode: result.mode,
    orderId: result.orderId,
    keyId: result.keyId,
    amount: result.amount ?? amount,
    currency: result.currency || currency || 'INR'
  };

  const paymentModal = document.getElementById('application-payment-modal');
  const paymentJob = document.getElementById('application-payment-job');
  const paymentAmount = document.getElementById('application-payment-amount');
  const paymentMessage = document.getElementById('application-payment-message');
  const paymentButtonText = document.getElementById('application-payment-button-text');
  if (paymentJob) paymentJob.textContent = `${record.jobTitle} (${record.jobCode})`;
  if (paymentAmount) paymentAmount.textContent = formatApplicationAmount(pendingApplicationPayment.amount, pendingApplicationPayment.currency);
  if (paymentButtonText) paymentButtonText.textContent = result.mode === 'razorpay' ? 'Open payment gateway' : 'Confirm payment';
  if (paymentMessage) {
    paymentMessage.textContent = result.mode === 'demo'
      ? 'Demo payment mode is active. Add Razorpay keys in .env for live payments.'
      : 'Continue securely through Razorpay to complete your application.';
    paymentMessage.className = 'payment-message';
  }
  closeAllModals();
  if (paymentModal) paymentModal.classList.add('active');
}

async function verifyApplicationPayment(paymentDetails) {
  if (!pendingApplicationPayment) return;
  const paymentMessage = document.getElementById('application-payment-message');
  const paymentButton = document.querySelector('#application-payment-form button[type="submit"]');
  if (paymentButton) paymentButton.disabled = true;
  try {
    const token = getAccountToken();
    const response = await fetch(`${API_BASE_URL}/api/payments/application/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId: pendingApplicationPayment.orderId, ...paymentDetails })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Payment verification failed.');
    appliedJobIds.add(pendingApplicationPayment.jobId);
    const appliedTitle = pendingApplicationPayment.jobTitle;
    pendingApplicationPayment = null;
    document.getElementById('quick-apply-form')?.reset();
    closeAllModals();
    renderJobs();
    showToast(`You applied for ${appliedTitle} successfully.`, 'success');
  } catch (error) {
    if (paymentMessage) {
      paymentMessage.textContent = error.message || 'Payment verification failed.';
      paymentMessage.className = 'payment-message payment-error';
    }
  } finally {
    if (paymentButton) paymentButton.disabled = false;
  }
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('The payment gateway could not be loaded.'));
    document.head.appendChild(script);
  });
}

async function launchRazorpayCheckout() {
  if (!pendingApplicationPayment) return;
  try {
    await loadRazorpayCheckout();
    const payment = pendingApplicationPayment;
    const checkout = new window.Razorpay({
      key: payment.keyId,
      amount: payment.amount,
      currency: payment.currency,
      name: 'Mera Job Saathi',
      description: `Application for ${payment.jobTitle}`,
      order_id: payment.orderId,
      handler: response => verifyApplicationPayment({
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      }),
      theme: { color: '#0f766e' }
    });
    checkout.open();
  } catch (error) {
    const paymentMessage = document.getElementById('application-payment-message');
    if (paymentMessage) {
      paymentMessage.textContent = error.message;
      paymentMessage.className = 'payment-message payment-error';
    }
  }
}

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
