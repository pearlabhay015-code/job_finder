// Job Saathi App State & Job Dataset
const jobData = [
  {
    id: 1,
    title: "Frontend React Developer",
    company: "TechNova Solutions",
    location: "Bangalore (Hybrid)",
    type: "Full-time",
    category: "tech",
    salary: "₹8 - 14 LPA",
    deadline: "22 Oct 2026",
    daysLeft: 3,
    urgent: true,
    description: "Build delightful user interfaces with modern React, TypeScript, and responsive CSS for high-impact enterprise SaaS products.",
    logo: "💻",
    logoBg: "#eff6ff",
    logoColor: "#2563eb",
    themeColor: "#3b82f6"
  },
  {
    id: 2,
    title: "UI/UX Product Designer",
    company: "Creative Pulse Studio",
    location: "Remote / Pan-India",
    type: "Full-time",
    category: "design",
    salary: "₹7 - 12 LPA",
    deadline: "25 Oct 2026",
    daysLeft: 6,
    urgent: false,
    description: "Design clean web & mobile user flows, design systems, and prototypes for fast-growing Indian consumer tech apps.",
    logo: "🎨",
    logoBg: "#fdf2f8",
    logoColor: "#db2777",
    themeColor: "#ec4899"
  },
  {
    id: 3,
    title: "Program Coordinator - Education",
    company: "Shiksha Foundation (NGO)",
    location: "New Delhi",
    type: "On-site",
    category: "ngo",
    salary: "₹4.5 - 7 LPA",
    deadline: "28 Oct 2026",
    daysLeft: 9,
    urgent: false,
    description: "Coordinate grassroot educational workshops, manage field volunteers, and measure child literacy initiatives across schools.",
    logo: "🌱",
    logoBg: "#ecfdf5",
    logoColor: "#059669",
    themeColor: "#10b981"
  },
  {
    id: 4,
    title: "Digital Growth & Content Strategist",
    company: "NextGen Brands",
    location: "Mumbai (Hybrid)",
    type: "Full-time",
    category: "marketing",
    salary: "₹6 - 10 LPA",
    deadline: "20 Oct 2026",
    daysLeft: 1,
    urgent: true,
    description: "Lead organic social media campaigns, SEO articles, and influencer marketing programs to accelerate user acquisition.",
    logo: "🚀",
    logoBg: "#fffbeb",
    logoColor: "#d97706",
    themeColor: "#f59e0b"
  },
  {
    id: 5,
    title: "Backend Node.js Engineer",
    company: "ZenoPay Systems",
    location: "Pune / Remote",
    type: "Full-time",
    category: "tech",
    salary: "₹10 - 18 LPA",
    deadline: "02 Nov 2026",
    daysLeft: 14,
    urgent: false,
    description: "Architect secure high-throughput REST APIs, database schemas, and payment integrations using Node.js, Express, and PostgreSQL.",
    logo: "⚡",
    logoBg: "#f5f3ff",
    logoColor: "#7c3aed",
    themeColor: "#8b5cf6"
  },
  {
    id: 6,
    title: "Operations & Community Manager",
    company: "Youth Uplift Society",
    location: "Hyderabad",
    type: "Full-time",
    category: "operations",
    salary: "₹5 - 8 LPA",
    deadline: "05 Nov 2026",
    daysLeft: 17,
    urgent: false,
    description: "Streamline day-to-day partner communications, organize community webinars, and oversee skill-building workshops.",
    logo: "🤝",
    logoBg: "#fff1f1",
    logoColor: "#e11d48",
    themeColor: "#ff5757"
  }
];

// Application state
const appliedJobIds = new Set();
const savedJobIds = new Set();
let currentFilter = 'all';
let currentSearchQuery = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initJobListings();
  initFilters();
  initModals();

  if (window.location.hash === '#resume-modal') {
    openResumeModal();
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

// Render Job Cards
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
    const matchesCategory = currentFilter === 'all' || job.category === currentFilter;
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} active ${filtered.length === 1 ? 'opening' : 'openings'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>🔍 No matching jobs found</h3>
        <p>Try searching for different keywords or select "All Opportunities" to view all active listings.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(job => {
    const isApplied = appliedJobIds.has(job.id);
    const isSaved = savedJobIds.has(job.id);
    
    // Deadline badge styling
    let deadlineClass = 'deadline-tag normal';
    let deadlineLabel = `⏳ Deadline: ${job.deadline}`;
    if (job.urgent) {
      deadlineClass = 'deadline-tag';
      deadlineLabel = `🔥 Deadline: ${job.deadline} (${job.daysLeft}d left)`;
    } else if (job.daysLeft <= 7) {
      deadlineClass = 'deadline-tag soon';
      deadlineLabel = `⏰ Deadline: ${job.deadline} (${job.daysLeft}d left)`;
    }

    return `
      <article class="job-card" style="--card-color: ${job.themeColor};" data-id="${job.id}">
        <div class="job-top">
          <div class="company-logo" style="background: ${job.logoBg}; color: ${job.logoColor};">
            ${job.logo}
          </div>
          <div class="job-meta-top">
            <div class="company-name">
              <span>${job.company}</span>
            </div>
            <h3 class="job-title">${job.title}</h3>
          </div>
          <button class="save-job-btn ${isSaved ? 'saved' : ''}" 
                  onclick="toggleSaveJob(${job.id}, this)" 
                  title="${isSaved ? 'Remove from saved' : 'Save job'}"
                  aria-label="Save job">
            ${isSaved ? '♥' : '♡'}
          </button>
        </div>

        <div class="job-details-pills">
          <span class="pill pill-type">💼 ${job.type}</span>
          <span class="pill pill-location">📍 ${job.location}</span>
          <span class="pill pill-salary">💰 ${job.salary}</span>
        </div>

        <p class="job-description-snippet">${job.description}</p>

        <div class="job-footer">
          <div class="${deadlineClass}" title="Application deadline">
            ${deadlineLabel}
          </div>
          <button class="apply-btn ${isApplied ? 'applied' : ''}" 
                  onclick="openApplyModal(${job.id})" 
                  ${isApplied ? 'disabled' : ''}>
            ${isApplied ? '✓ Applied' : 'Apply Now →'}
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// Filter and Live Search Handlers
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderJobs();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderJobs();
    });
  }
}

// Toggle Save / Bookmark
window.toggleSaveJob = function(jobId, btn) {
  if (savedJobIds.has(jobId)) {
    savedJobIds.delete(jobId);
    btn.classList.remove('saved');
    btn.textContent = '♡';
    showToast('Job removed from your saved list');
  } else {
    savedJobIds.add(jobId);
    btn.classList.add('saved');
    btn.textContent = '♥';
    showToast('❤️ Job saved to your favorites!');
  }
};

// Modal System
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const applyModal = document.getElementById('apply-modal');
  
  // Close modals when clicking overlay or close buttons
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
      showToast(`🎉 Thank you, ${candidateName}! Your resume has been posted successfully.`, 'success');
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
        showToast(`🎉 Application successfully sent to ${job ? job.company : 'employer'}!`, 'success');
        applyForm.reset();
      }
    });
  }
}

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
    if (jobTitleEl) jobTitleEl.textContent = job.title;
    if (companyEl) companyEl.textContent = `Applying to ${job.company} • Deadline: ${job.deadline}`;
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
  }, 3800);
}
