// Sample Jobs Database
    const sampleJobs = [
      {
        id: "amazon-1",
        title: "Senior UI Designer",
        org: "Amazon",
        company: "Amazon",
        date: "Jul 14, 2025",
        posted: "Jul 14, 2025",
        logo: "amazon",
        logoBg: "bg-black text-white",
        tags: ["Full time", "Contract", "Senior level"],
        salary: "$100K - $130K",
        applicants: 94,
        sent: 45,
        type: "standard",
        sector: "Media & Design",
        location: "Remote / Seattle",
        exp: "Senior level",
        deadline: "Open",
        desc: "Design next-generation consumer interfaces, intuitive e-commerce customer experiences, and high-fidelity interaction prototypes."
      },
      {
        id: "google-1",
        title: "Product Designer",
        org: "Google",
        company: "Google",
        date: "Jul 13, 2025",
        posted: "Jul 13, 2025",
        isFeatured: true,
        logo: "google",
        logoBg: "bg-white text-slate-900",
        tags: ["Part time", "Distant"],
        salary: "$30K - $120K",
        applicants: 34,
        sent: 10,
        type: "premium",
        sector: "Media & Design",
        location: "Distant / Mountain View",
        exp: "Mid-Senior",
        deadline: "Open",
        desc: "Drive product design systems and user experience frameworks across cloud ecosystem workflows and collaborative AI tools."
      },
      {
        id: "facebook-1",
        title: "UX Designer",
        org: "Facebook",
        company: "Facebook",
        date: "Jul 12, 2025",
        posted: "Jul 12, 2025",
        logo: "facebook",
        logoBg: "bg-[#1877f2] text-white",
        tags: ["Full time", "Distant", "Junior level"],
        salary: "$100K - $170K",
        applicants: 109,
        sent: 30,
        type: "standard",
        sector: "Media & Design",
        location: "Distant / Menlo Park",
        exp: "Junior level",
        deadline: "Open",
        desc: "Craft seamless social interfaces, community tools, and user interaction funnels connecting millions of global users."
      },
      {
        id: "apple-1",
        title: "UI/UX Designer",
        org: "Apple",
        company: "Apple",
        date: "June 9, 2025",
        posted: "June 9, 2025",
        logo: "apple",
        logoBg: "bg-black text-white",
        tags: ["Full time", "Remote", "Freelance"],
        salary: "$140K - $180K",
        applicants: 312,
        sent: 143,
        type: "premium",
        sector: "Media & Design",
        location: "Remote / Cupertino",
        exp: "Senior level",
        deadline: "Open",
        desc: "Sculpt minimalist, deeply refined human interfaces and tactile user experiences for flagship platforms and applications."
      },
      {
        id: "openai-1",
        title: "Customer Specialist",
        org: "OpenAI",
        company: "OpenAI",
        date: "June 9, 2025",
        posted: "June 9, 2025",
        logo: "openai",
        logoBg: "bg-black text-white",
        tags: ["Part time", "Hybrid", "Shift-Based"],
        salary: "$30K - $50K",
        applicants: 24,
        sent: 9,
        type: "standard",
        sector: "Customer Support",
        location: "Hybrid / San Francisco",
        exp: "Entry-Mid",
        deadline: "Open",
        desc: "Partner with developers and enterprise clients leveraging frontier AI models, offering world-class technical insights and onboarding."
      },
      {
        id: "dribbble-1",
        title: "Frontend Developer",
        org: "Dribbble",
        company: "Dribbble",
        date: "June 2, 2025",
        posted: "June 2, 2025",
        logo: "dribbble",
        logoBg: "bg-[#ea4c89] text-white",
        tags: ["Contract", "On-Site", "Flexible Hours"],
        salary: "$80K - $130K",
        applicants: 98,
        sent: 26,
        type: "standard",
        sector: "Engineering",
        location: "On-Site / Remote",
        exp: "Mid level",
        deadline: "Open",
        desc: "Build highly responsive, animation-rich web applications that inspire and empower millions of world-class creators."
      },
      {
        id: "aliexpress-1",
        title: "Lead Brand Strategist",
        org: "AliExpress",
        company: "AliExpress",
        date: "Apr 21, 2025",
        posted: "Apr 21, 2025",
        logo: "aliexpress",
        logoBg: "bg-[#ff4747] text-white",
        tags: ["Full time", "Remote"],
        salary: "$95K - $125K",
        applicants: 76,
        sent: 18,
        type: "standard",
        sector: "Marketing",
        location: "Remote / Global",
        exp: "Senior level",
        deadline: "Open",
        desc: "Define brand narratives, campaign architecture, and regional expansion strategy across international retail touchpoints."
      },
      {
        id: "youtube-1",
        title: "Motion Design Engineer",
        org: "YouTube",
        company: "YouTube",
        date: "Apr 19, 2025",
        posted: "Apr 19, 2025",
        logo: "youtube",
        logoBg: "bg-[#ff0000] text-white",
        tags: ["Full time", "Hybrid"],
        salary: "$130K - $160K",
        applicants: 142,
        sent: 55,
        type: "standard",
        sector: "Media & Design",
        location: "Hybrid / San Bruno",
        exp: "Senior level",
        deadline: "Open",
        desc: "Bring video interfaces and dynamic motion states to life across creator tools, smart displays, and mobile surfaces."
      },
      {
        id: "spotify-1",
        title: "Senior Product Architect",
        org: "Spotify",
        company: "Spotify",
        date: "Apr 9, 2025",
        posted: "Apr 9, 2025",
        logo: "spotify",
        logoBg: "bg-[#1db954] text-white",
        tags: ["Full time", "Remote"],
        salary: "$150K - $190K",
        applicants: 210,
        sent: 84,
        type: "premium",
        sector: "Engineering",
        location: "Remote / Stockholm",
        exp: "Principal",
        deadline: "Open",
        desc: "Architect scalable audio discovery, streaming infrastructure, and collaborative playlist listening features."
      },
      {
        id: "job-1",
        title: "Senior Public Health Specialist",
        org: "Global Health Alliance",
        type: "standard", // standard, premium, rfp
        sector: "Health",
        location: "New Delhi",
        exp: "7-10 Years",
        deadline: "12 Days Left",
        posted: "2 hours ago",
        desc: "Leading field operations for maternal healthcare initiatives across North India. Expertise in USAID donor compliance and M&E metrics required."
      },
      {
        id: "job-2",
        title: "ESG & Climate Resilience Director",
        org: "Terra Impact Foundation",
        type: "premium",
        sector: "Climate",
        location: "Bengaluru, Karnataka",
        exp: "8-12 Years",
        deadline: "4 Days Left",
        posted: "1 day ago",
        desc: "Value Member Exclusive: Direct oversight of carbon-offset grants and CSR ESG advisory services for Fortune 500 corporate foundations."
      },
      {
        id: "job-3",
        title: "RFP: Mid-Term Evaluation of Digital Literacy Pilot",
        org: "UNICEF Partner Network",
        type: "rfp",
        sector: "Education",
        location: "Remote / Bihar",
        exp: "Consultancy Firm",
        deadline: "18 Days Left",
        posted: "3 hours ago",
        desc: "Request for Proposals: Inviting sealed bids from technical research agencies for a quantitative end-line impact assessment of youth digital centers."
      },
      {
        id: "job-4",
        title: "CSR Lead - Social Governance & Grants",
        org: "Tata Sustainability Group",
        type: "standard",
        sector: "CSR",
        location: "Mumbai, Maharashtra",
        exp: "5-8 Years",
        deadline: "15 Days Left",
        posted: "2 days ago",
        desc: "Oversee Section 135 CSR compliance budgets, partner NGO due diligence, and quarterly board reporting."
      },
      {
        id: "job-5",
        title: "Chief of Party - WASH Sustainable Mission",
        org: "WaterAid India",
        type: "premium",
        sector: "WASH",
        location: "New Delhi",
        exp: "12+ Years",
        deadline: "2 Days Left",
        posted: "Just now",
        desc: "Value Member Exclusive: Senior leadership role directing a multi-state clean water initiative funded by international multilateral donors."
      },
      {
        id: "job-6",
        title: "RFP: Supply & Installation of Solar Microgrids",
        org: "Clean Power Trust",
        type: "rfp",
        sector: "Renewable Energy",
        location: "Ranchi, Jharkhand",
        exp: "Vendor Tender",
        deadline: "22 Days Left",
        posted: "4 days ago",
        desc: "Turnkey procurement tender for solar microgrid installations in off-grid tribal villages across Jharkhand."
      },
      {
        id: "job-7",
        title: "Program Officer - Child Protection & Education",
        org: "Save the Children",
        type: "standard",
        sector: "Child Rights",
        location: "Jaipur, Rajasthan",
        exp: "3-6 Years",
        deadline: "9 Days Left",
        posted: "5 hours ago",
        desc: "Coordinate district-level community child rights protection committees and adolescent girl schooling retention programs in western Rajasthan."
      },
      {
        id: "job-8",
        title: "Head of Sustainable Agritech & FPO Linkages",
        org: "AgriImpact India",
        type: "premium",
        sector: "Agriculture",
        location: "Ludhiana, Punjab",
        exp: "8-10 Years",
        deadline: "7 Days Left",
        posted: "1 day ago",
        desc: "Value Member Exclusive: Drive regenerative farming adoption and direct farmer producer organization (FPO) market linkages across northern states."
      },
      {
        id: "job-9",
        title: "Disaster Response Coordinator - Flood Relief",
        org: "Oxfam India",
        type: "standard",
        sector: "Disaster Relief",
        location: "Guwahati, Assam",
        exp: "4-7 Years",
        deadline: "14 Days Left",
        posted: "3 days ago",
        desc: "Lead emergency flood response operations, cash-for-work deployment, and rapid community relief logistics in the Brahmaputra river basin."
      },
      {
        id: "job-10",
        title: "Lead Civic Tech & Open Data Architect",
        org: "Centre for GovTech Solutions",
        type: "premium",
        sector: "Tech4Good",
        location: "Hyderabad, Telangana",
        exp: "6-9 Years",
        deadline: "11 Days Left",
        posted: "6 hours ago",
        desc: "Value Member Exclusive: Architect open-source digital public infrastructure (DPI) tools and citizen feedback dashboards for state government ministries."
      },
      {
        id: "job-11",
        title: "RFP: Comprehensive Rural Livelihoods Baseline Survey",
        org: "State Rural Livelihood Mission",
        type: "rfp",
        sector: "Livelihoods",
        location: "Bhubaneswar, Odisha",
        exp: "Research Agency",
        deadline: "25 Days Left",
        posted: "2 days ago",
        desc: "Request for Proposals: Inviting empaneled research institutions to conduct household livelihood asset mapping across 12 tribal blocks."
      },
      {
        id: "job-12",
        title: "Women Legal Empowerment & Advocacy Lead",
        org: "Breakthrough Trust",
        type: "standard",
        sector: "Gender Rights",
        location: "Lucknow, Uttar Pradesh",
        exp: "5-8 Years",
        deadline: "16 Days Left",
        posted: "3 days ago",
        desc: "Drive legal aid camps, grassroots rights awareness campaigns, and gender-based violence helpline counseling systems across eastern UP."
      },
      {
        id: "job-13",
        title: "Wildlife Habitat Conservationist",
        org: "Himalayan Ecology Foundation",
        type: "standard",
        sector: "Animal Welfare",
        location: "Dehradun, Uttarakhand",
        exp: "4-6 Years",
        deadline: "19 Days Left",
        posted: "4 days ago",
        desc: "Manage alpine wildlife corridors, human-wildlife conflict resolution mechanisms, and community eco-tourism models in Himalayan foothills."
      },
      {
        id: "job-14",
        title: "Senior Clean Energy Finance Specialist",
        org: "Gujarat Green Energy Mission",
        type: "premium",
        sector: "Renewable Energy",
        location: "Gandhinagar, Gujarat",
        exp: "9-12 Years",
        deadline: "5 Days Left",
        posted: "1 day ago",
        desc: "Value Member Exclusive: Structure concessional climate finance facilities and solar park investment mechanisms with international development banks."
      },
      {
        id: "job-15",
        title: "Public Health & Mental Health Program Manager",
        org: "MindCare Foundation India",
        type: "standard",
        sector: "Mental Health",
        location: "Kochi, Kerala",
        exp: "4-8 Years",
        deadline: "13 Days Left",
        posted: "3 days ago",
        desc: "Design community mental health screening protocols and school counseling curricula with Kerala health department officials."
      },
      {
        id: "job-16",
        title: "RFP: Smart City Solid Waste Management Consultancy",
        org: "Urban Development Authority",
        type: "rfp",
        sector: "Urban Planning",
        location: "Chennai, Tamil Nadu",
        exp: "Urban Planning Firm",
        deadline: "30 Days Left",
        posted: "Just now",
        desc: "Request for Proposals: Consulting firms requested for circular economy waste processing and sensor-based route optimization in metropolitan zones."
      },
      {
        id: "job-17",
        title: "Director of Impact Investment & Social Finance",
        org: "Aavishkaar Capital Partners",
        type: "premium",
        sector: "Social Enterprise",
        location: "Kolkata, West Bengal",
        exp: "10-15 Years",
        deadline: "8 Days Left",
        posted: "1 day ago",
        desc: "Value Member Exclusive: Oversee series A/B social enterprise pipeline investments in eastern and north-eastern India across healthcare and fintech."
      },
      {
        id: "job-18",
        title: "Senior Public Policy & Legislative Fellow",
        org: "Centre for Policy Research",
        type: "standard",
        sector: "Public Policy",
        location: "New Delhi",
        exp: "6-9 Years",
        deadline: "10 Days Left",
        posted: "2 days ago",
        desc: "Lead policy white-papers, parliamentarian briefings, and data-driven governance analysis on fiscal decentralization."
      }
    ];

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

    function matchLocation(jobLoc, selectedLoc) {
      if (!selectedLoc || selectedLoc === 'all' || selectedLoc === '') return true;
      const jLoc = (jobLoc || '').toLowerCase();
      const sLoc = selectedLoc.toLowerCase().trim();
      if (sLoc === 'remote') return jLoc.includes('remote');
      if (jLoc.includes(sLoc)) return true;
      const aliases = locationAliases[sLoc];
      if (aliases && aliases.some(alias => jLoc.includes(alias))) return true;
      return false;
    }

    function matchSector(jobSec, selectedSec) {
      if (!selectedSec || selectedSec === 'all' || selectedSec === '') return true;
      const jSec = (jobSec || '').toLowerCase().trim();
      const sSec = selectedSec.toLowerCase().trim();
      return jSec.includes(sSec) || sSec.includes(jSec);
    }

    function matchQuery(job, query) {
      if (!query) return true;
      const q = query.toLowerCase().trim();
      const title = (job.title || '').toLowerCase();
      const org = (job.org || job.organization || '').toLowerCase();
      const desc = (job.desc || job.description || '').toLowerCase();
      const sector = (job.sector || '').toLowerCase();
      const location = (job.location || '').toLowerCase();
      return title.includes(q) || org.includes(q) || desc.includes(q) || sector.includes(q) || location.includes(q);
    }

    function normalizeJob(job) {
      return {
        id: job.id,
        title: job.title || '',
        org: job.org || job.organization || job.company || 'Organization',
        company: job.company || job.org || 'Organization',
        type: job.type || 'standard',
        sector: job.sector || '',
        location: job.location || '',
        exp: job.exp || job.experience || 'Not specified',
        deadline: job.deadline || 'Open until filled',
        posted: job.posted || job.date || 'Recently',
        date: job.date || job.posted || 'Jul 14, 2025',
        desc: job.desc || job.description || '',
        isFeatured: Boolean(job.isFeatured || job.id === 'google-1'),
        logo: job.logo || '',
        logoBg: job.logoBg || '',
        tags: job.tags || [],
        salary: job.salary || '',
        applicants: job.applicants || 42,
        sent: job.sent || 15
      };
    }

    function getJobAgeMinutes(job) {
      const talentryOrder = {
        'amazon-1': 1,
        'google-1': 2,
        'facebook-1': 3,
        'apple-1': 4,
        'openai-1': 5,
        'dribbble-1': 6,
        'aliexpress-1': 7,
        'youtube-1': 8,
        'spotify-1': 9
      };
      if (talentryOrder[job.id]) return talentryOrder[job.id];

      if (job.createdAt) {
        const diff = (Date.now() - new Date(job.createdAt).getTime()) / 60000;
        if (!isNaN(diff)) return 100 + diff;
      }
      const posted = (job.posted || '').toLowerCase().trim();
      if (posted.includes('just now')) return 100;
      const numMatch = posted.match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0]) : 999;
      if (posted.includes('minute')) return 100 + num;
      if (posted.includes('hour')) return 100 + num * 60;
      if (posted.includes('day')) return 100 + num * 1440;
      if (posted.includes('week')) return 100 + num * 10080;
      if (posted.includes('month')) return 100 + num * 43200;
      return 999999;
    }

    let currentTab = 'all';
    let currentJobsList = sampleJobs.map(normalizeJob).sort((a, b) => getJobAgeMinutes(a) - getJobAgeMinutes(b));

    function isJobsPage() {
      const p = window.location.pathname.toLowerCase();
      return p.endsWith('jobs.html') || p.includes('jobs.html');
    }

    function submitHeroSearch(overrideQ) {
      const searchInput = document.getElementById('search-input');
      const query = overrideQ !== undefined ? overrideQ : (searchInput ? searchInput.value.trim() : '');
      const sectorFilter = document.getElementById('sector-filter');
      const sector = sectorFilter ? sectorFilter.value : '';
      const locationFilter = document.getElementById('location-filter');
      const location = locationFilter ? locationFilter.value : '';

      if (isJobsPage()) {
        if (overrideQ !== undefined && searchInput) {
          searchInput.value = overrideQ;
        }
        handleSearch();
        return;
      }

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (sector) params.append('sector', sector);
      if (location) params.append('location', location);

      const qs = params.toString();
      const targetUrl = `jobs.html${qs ? '?' + qs : ''}`;

      // Smooth and fluid page exit animation
      if (document.body) {
        document.body.classList.add('page-leaving');
        window.setTimeout(() => {
          window.location.href = targetUrl;
        }, 180);
      } else {
        window.location.href = targetUrl;
      }
    }

    function focusOrToggleSearch(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      focusSearchBar();
    }

    function focusSearchBar() {
      const input = document.getElementById('search-input');
      const sentinel = document.getElementById('search-bar-sticky-sentinel');
      if (input) {
        closeMobileMenu();
        if (sentinel) sentinel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestAnimationFrame(() => {
          input.focus({ preventScroll: true });
          input.select();
        });
      } else if (!isJobsPage()) {
        submitHeroSearch();
      }
    }

    function initJobsPageFromUrl() {
      if (!isJobsPage()) return;
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const sector = params.get('sector');
      const location = params.get('location');
      const type = params.get('type');
      const sort = params.get('sort');

      if (q) {
        const input = document.getElementById('search-input');
        if (input) input.value = q;
      }

      if (sector) {
        const secInput = document.getElementById('sector-filter');
        const secLabel = document.getElementById('sector-display-label');
        const secIcon = document.getElementById('sector-display-icon');
        if (secInput) secInput.value = sector;
        const options = Array.from(document.querySelectorAll('#sector-dropdown-menu .search-option'));
        const matched = options.find(o => (o.dataset.sectorVal || '').toLowerCase() === sector.toLowerCase());
        if (matched) {
          const textSpan = matched.querySelector('.search-option-left span');
          if (textSpan && secLabel) secLabel.textContent = textSpan.textContent;
          const iconEl = matched.querySelector('.search-option-left i');
          if (iconEl && secIcon) secIcon.className = iconEl.className;
        } else if (secLabel) {
          secLabel.textContent = sector;
        }
        options.forEach(opt => {
          const isMatch = (opt.dataset.sectorVal || '').toLowerCase() === sector.toLowerCase();
          opt.classList.toggle('is-selected', isMatch);
        });
      }

      if (location) {
        const locInput = document.getElementById('location-filter');
        const locLabel = document.getElementById('location-display-label');
        const locIcon = document.getElementById('location-display-icon');
        if (locInput) locInput.value = location;
        const options = Array.from(document.querySelectorAll('#location-dropdown-menu .search-option'));
        const matched = options.find(o => (o.dataset.locationVal || '').toLowerCase() === location.toLowerCase());
        if (matched) {
          const textSpan = matched.querySelector('.search-option-left span');
          if (textSpan && locLabel) locLabel.textContent = textSpan.textContent;
          const iconEl = matched.querySelector('.search-option-left i');
          if (iconEl && locIcon) locIcon.className = iconEl.className;
        } else if (locLabel) {
          locLabel.textContent = location;
        }
        options.forEach(opt => {
          const isMatch = (opt.dataset.locationVal || '').toLowerCase() === location.toLowerCase();
          opt.classList.toggle('is-selected', isMatch);
        });
      }

      if (type && ['all', 'standard', 'premium', 'rfp'].includes(type)) {
        currentTab = type;
        document.querySelectorAll('.tab-pill').forEach(btn => {
          btn.className = "tab-pill px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-slate-100 transition-all";
        });
        const activeBtn = document.getElementById(`tab-${type}`);
        if (activeBtn) {
          activeBtn.className = "tab-pill px-5 py-2 rounded-full text-sm font-bold bg-slate-200 text-slate-950 transition-all shadow-sm";
        }
      }

      if (sort) {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = sort;
      }
    }

    window.onload = function() {
      applySavedTheme();
      initJobsPageFromUrl();
      handleSearch();
      initStickySearchBar();
      document.body.classList.add('page-ready');
      enablePageTransitions();
      loadPublicSettings();
    };

    function initStickySearchBar() {
      const sentinel = document.getElementById('search-bar-sticky-sentinel');
      const bar = document.getElementById('search-bar-container');
      const placeholder = document.getElementById('search-bar-placeholder');
      if (!sentinel || !bar) return;

      const dockThreshold = 76; // 64px navbar + 12px minimal gap
      let isDocked = false;

      function updateDock() {
        if (window.innerWidth < 768) {
          if (isDocked) {
            isDocked = false;
            if (placeholder) {
              placeholder.classList.add('hidden');
              placeholder.style.height = '0px';
            }
            bar.classList.remove('is-docked');
          }
          return;
        }

        const rect = sentinel.getBoundingClientRect();
        const shouldDock = rect.top <= dockThreshold;
        if (shouldDock && !isDocked) {
          isDocked = true;
          if (placeholder) {
            placeholder.style.height = `${bar.offsetHeight}px`;
            placeholder.classList.remove('hidden');
          }
          bar.classList.add('is-docked');
        } else if (!shouldDock && isDocked) {
          isDocked = false;
          if (placeholder) {
            placeholder.classList.add('hidden');
            placeholder.style.height = '0px';
          }
          bar.classList.remove('is-docked');
        }
      }

      window.addEventListener('scroll', updateDock, { passive: true });
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) closeMobileSearch();
        if (isDocked && placeholder) placeholder.style.height = `${bar.offsetHeight}px`;
        updateDock();
      }, { passive: true });
      updateDock();
    }

    // Smooth internal page navigation transition
    function enablePageTransitions() {
      document.querySelectorAll('a[data-page-link], a[href$=".html"]').forEach(link => {
        link.addEventListener('click', event => {
          const href = link.getAttribute('href');
          if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !href || link.target === '_blank') return;
          event.preventDefault();
          document.body.classList.add('page-leaving');
          window.setTimeout(() => { window.location.href = href; }, 180);
        });
      });
    }

    async function loadPublicSettings() {
      try {
        const response = await fetch('/api/public');
        if (!response.ok) return;
        const { settings } = await response.json();
        const repeatPrice = document.getElementById('repeat-post-price');
        if (repeatPrice && settings.jobPostingFee !== undefined) repeatPrice.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: settings.currency || 'INR', maximumFractionDigits: 0 }).format(settings.jobPostingFee);
      } catch (_) { /* The static preview retains its safe CMS-configured fallback price. */ }
    }

    // Render Alternating Soft White & Deep Glass Black Cards
    function renderJobs(jobs) {
      const container = document.getElementById('jobs-container');
      if (!container) return;

      if(jobs.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center text-slate-400">
            <div class="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4 text-sky-400">
              <i class="fa-solid fa-magnifying-glass text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No matching opportunities found</h3>
            <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">We couldn't find any opportunities matching your search criteria. Clear your filters to see all latest openings.</p>
            <button onclick="clearAllFilters()" class="px-6 py-2.5 rounded-full bg-[#111317] dark:bg-white text-white dark:text-slate-900 font-semibold text-sm transition">
              Show All Opportunities
            </button>
          </div>
        `;
        return;
      }

      function getCompanyLogoHtml(brand, org) {
        const b = (brand || org || '').toLowerCase();
        if (b.includes('amazon')) {
          return `<div class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-amazon text-sm"></i></div>`;
        }
        if (b.includes('google')) {
          return `<div class="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center p-1.5 shadow-xs"><svg viewBox="0 0 24 24" class="w-4 h-4"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg></div>`;
        }
        if (b.includes('facebook') || b.includes('meta')) {
          return `<div class="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-facebook-f text-sm"></i></div>`;
        }
        if (b.includes('apple')) {
          return `<div class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-apple text-sm"></i></div>`;
        }
        if (b.includes('openai')) {
          return `<div class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs p-2"><svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6668zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813l-.0048 6.7219zm1.1448-2.6176l2.55-1.4716 2.55 1.4716v2.9431l-2.55 1.4716-2.55-1.4716z"/></svg></div>`;
        }
        if (b.includes('dribbble')) {
          return `<div class="w-9 h-9 rounded-full bg-[#ea4c89] text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-dribbble text-sm"></i></div>`;
        }
        if (b.includes('aliexpress')) {
          return `<div class="w-9 h-9 rounded-full bg-[#ff4747] text-white flex items-center justify-center font-bold text-[11px] shadow-xs">AE</div>`;
        }
        if (b.includes('youtube')) {
          return `<div class="w-9 h-9 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-youtube text-sm"></i></div>`;
        }
        if (b.includes('spotify')) {
          return `<div class="w-9 h-9 rounded-full bg-[#1db954] text-white flex items-center justify-center shadow-xs"><i class="fa-brands fa-spotify text-sm"></i></div>`;
        }
        return `<div class="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs"><i class="fa-solid fa-briefcase text-xs"></i></div>`;
      }

      container.innerHTML = jobs.map((job) => {
        const isFeatured = job.isFeatured || job.id === 'google-1';
        const cardClass = isFeatured ? 'talentry-card-featured' : 'talentry-card';
        const logoHtml = getCompanyLogoHtml(job.logo, job.org || job.company);
        const tags = job.tags || ['Full time', job.sector || 'Specialist', job.exp || 'Open'];
        const tagText = tags.join(' <span class="mx-1 text-slate-400">&bull;</span> ');
        const dateStr = job.date || job.posted || 'Jul 14, 2025';
        const applicants = job.applicants || 42;
        const sentCount = job.sent || 15;
        const salaryText = job.salary || (job.exp && job.exp.includes('Years') ? '$90K - $130K' : '$80K - $120K');

        return `
          <div onclick="openJobDrawer('${job.id}')" class="${cardClass} rounded-2xl p-5 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 transition-all">
            <div>
              <!-- Top Row: Logo, Date Pill, Bookmark -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2.5">
                  ${logoHtml}
                  <span class="text-[11px] font-medium px-2.5 py-1 rounded-full ${isFeatured ? 'bg-white/15 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}">
                    ${dateStr}
                  </span>
                </div>
                <div>
                  ${isFeatured 
                    ? `<button type="button" aria-label="Bookmarked" class="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:scale-105 transition"><i class="fa-solid fa-bookmark text-xs"></i></button>`
                    : `<button type="button" aria-label="Bookmark" class="w-7 h-7 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center hover:scale-105 transition"><i class="fa-regular fa-bookmark text-xs"></i></button>`
                  }
                </div>
              </div>

              <!-- Company Name + Verified Badge -->
              <div class="flex items-center gap-1.5 text-xs font-semibold ${isFeatured ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'}">
                <span>${job.org || job.company}</span>
                <i class="fa-solid fa-circle-check text-emerald-500 text-[11px]"></i>
              </div>

              <!-- Job Title -->
              <h3 class="text-base sm:text-lg font-bold tracking-tight mt-1 mb-2 ${isFeatured ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-appleBlue'} transition-colors leading-snug">
                ${job.title}
              </h3>

              <!-- Metadata / Tags -->
              <p class="text-xs ${isFeatured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} font-normal truncate">
                ${tagText}
              </p>

              <!-- Salary -->
              <p class="text-xs sm:text-sm font-semibold mt-2.5 ${isFeatured ? 'text-slate-100' : 'text-slate-700 dark:text-slate-200'}">
                ${salaryText}
              </p>
            </div>

            <!-- Footer: Metrics & Details Button -->
            <div class="mt-5 pt-3.5 border-t ${isFeatured ? 'border-white/15' : 'border-slate-100 dark:border-white/10'} flex items-center justify-between text-xs">
              <div class="flex items-center gap-3.5 ${isFeatured ? 'text-slate-300' : 'text-slate-400 dark:text-slate-400'} font-medium">
                <span class="flex items-center gap-1.5">
                  <i class="fa-regular fa-user text-[11px]"></i>
                  <span>${applicants}</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <i class="fa-solid fa-bars-staggered text-[11px]"></i>
                  <span>${sentCount}</span>
                </span>
              </div>
              <div>
                <button type="button" class="px-4 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${isFeatured ? 'bg-white text-slate-950 font-bold hover:bg-slate-100' : 'talentry-primary-btn shadow-xs'}">
                  Details
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Tab Filter Logic
    function switchTab(type) {
      currentTab = type;

      document.querySelectorAll('.tab-pill').forEach(btn => {
        btn.className = "tab-pill px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-slate-100 transition-all";
      });

      const activeBtn = document.getElementById(`tab-${type}`);
      if(activeBtn) {
        activeBtn.className = "tab-pill px-5 py-2 rounded-full text-sm font-bold bg-slate-200 text-slate-950 transition-all shadow-sm";
      }

      handleSearch();
    }

    async function handleSearch() {
      const searchInput = document.getElementById('search-input');
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const sectorFilter = document.getElementById('sector-filter');
      const sector = sectorFilter ? sectorFilter.value : '';
      const locationFilter = document.getElementById('location-filter');
      const location = locationFilter ? locationFilter.value : '';

      // Live search backend / database API integration
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (sector) params.append('sector', sector);
      if (location) params.append('location', location);
      if (currentTab && currentTab !== 'all') params.append('type', currentTab);

      let jobsToRender = [];

      try {
        const response = await fetch(`/api/jobs?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data && Array.isArray(data.jobs)) {
          jobsToRender = data.jobs.map(normalizeJob);
        } else {
          throw new Error('Fallback to local');
        }
      } catch (_) {
        // Local graceful fallback with state alias and sector matching
        const filtered = sampleJobs.filter(job => {
          const matchesTab = currentTab === 'all' || job.type === currentTab;
          const matchesQ = matchQuery(job, query);
          const matchesSec = matchSector(job.sector, sector);
          const matchesLoc = matchLocation(job.location, location);
          return matchesTab && matchesQ && matchesSec && matchesLoc;
        });
        jobsToRender = filtered.map(normalizeJob);
      }

      // Auto-sort by newest opportunities by default whenever jobs are found
      const sortSelect = document.getElementById('sort-select');
      const sortBy = sortSelect ? sortSelect.value : 'newest';
      if (sortBy === 'deadline') {
        jobsToRender.sort((a, b) => {
          const da = parseInt((a.deadline || '').match(/\d+/) || [999][0]);
          const db = parseInt((b.deadline || '').match(/\d+/) || [999][0]);
          return da - db;
        });
      } else if (sortBy === 'alpha') {
        jobsToRender.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else {
        // Auto-show newest opportunities first by default
        jobsToRender.sort((a, b) => getJobAgeMinutes(a) - getJobAgeMinutes(b));
      }

      currentJobsList = jobsToRender;
      renderJobs(currentJobsList);
      updateCounts(currentJobsList);

      const resultsCount = document.getElementById('results-count');
      if (resultsCount) resultsCount.textContent = currentJobsList.length;

      renderActiveFilters(query, sector, location, currentTab);

      if (isJobsPage()) {
        const cleanParams = new URLSearchParams();
        if (query) cleanParams.append('q', query);
        if (sector) cleanParams.append('sector', sector);
        if (location) cleanParams.append('location', location);
        if (currentTab && currentTab !== 'all') cleanParams.append('type', currentTab);
        if (sortBy && sortBy !== 'newest') cleanParams.append('sort', sortBy);
        const qs = cleanParams.toString();
        window.history.replaceState({}, '', `jobs.html${qs ? '?' + qs : ''}`);
      }
    }

    function renderActiveFilters(query, sector, location, tab) {
      const wrap = document.getElementById('active-filters-wrap');
      const container = document.getElementById('active-filters-container');
      if (!wrap || !container) return;

      const chips = [];
      if (query) {
        chips.push(`<span class="filter-chip" onclick="clearActiveFilter('query')"><span>"${query}"</span><i class="fa-solid fa-xmark text-[10px]"></i></span>`);
      }
      if (sector) {
        chips.push(`<span class="filter-chip" onclick="clearActiveFilter('sector')"><span>Sector: ${sector}</span><i class="fa-solid fa-xmark text-[10px]"></i></span>`);
      }
      if (location) {
        chips.push(`<span class="filter-chip" onclick="clearActiveFilter('location')"><span>Location: ${location}</span><i class="fa-solid fa-xmark text-[10px]"></i></span>`);
      }
      if (tab && tab !== 'all') {
        const tabLabels = { standard: 'Standard Only', premium: 'Value Exclusive', rfp: 'RFPs & Tenders' };
        chips.push(`<span class="filter-chip" onclick="clearActiveFilter('tab')"><span>${tabLabels[tab] || tab}</span><i class="fa-solid fa-xmark text-[10px]"></i></span>`);
      }

      if (chips.length > 0) {
        container.innerHTML = chips.join('');
        wrap.classList.remove('hidden');
      } else {
        container.innerHTML = '';
        wrap.classList.add('hidden');
      }
    }

    function clearActiveFilter(type) {
      if (type === 'query') {
        const input = document.getElementById('search-input');
        if (input) input.value = '';
      } else if (type === 'sector') {
        selectSector('', 'All Sectors', 'fa-shapes');
      } else if (type === 'location') {
        selectLocation('', 'All Locations', 'fa-earth-americas');
      } else if (type === 'tab') {
        switchTab('all');
      }
      handleSearch();
    }

    function clearAllFilters() {
      const input = document.getElementById('search-input');
      if (input) input.value = '';
      selectSector('', 'All Sectors', 'fa-shapes');
      selectLocation('', 'All Locations', 'fa-earth-americas');
      switchTab('all');
      handleSearch();
    }

    function setQuickSearch(val) {
      const input = document.getElementById('search-input');
      if (input) input.value = val;
      if (isJobsPage()) {
        handleSearch();
      } else {
        submitHeroSearch(val);
      }
    }

    function updateCounts(pool) {
      const source = pool || currentJobsList || sampleJobs;
      const counts = {
        'count-all': source.length,
        'count-standard': source.filter(j => j.type === 'standard').length,
        'count-premium': source.filter(j => j.type === 'premium').length,
        'count-rfp': source.filter(j => j.type === 'rfp').length
      };
      Object.entries(counts).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) element.innerText = value;
      });
    }

    // Drawer Slide Controller
    function openJobDrawer(id) {
      const job = (currentJobsList && currentJobsList.find(j => String(j.id) === String(id))) ||
                  sampleJobs.find(j => String(j.id) === String(id));
      if(!job) return;

      document.getElementById('drawer-title').innerText = job.title;
      document.getElementById('drawer-org').innerText = job.org;
      document.getElementById('drawer-location').innerText = job.location;
      document.getElementById('drawer-exp').innerText = job.exp;
      document.getElementById('drawer-deadline').innerText = job.deadline;
      document.getElementById('drawer-desc').innerText = job.desc;

      const badge = document.getElementById('drawer-badge');
      const gateBox = document.getElementById('drawer-gate-box');
      const actionContainer = document.getElementById('drawer-action-container');

      if(job.type === 'premium') {
        badge.innerText = "VALUE MEMBER EXCLUSIVE";
        badge.className = "px-3 py-1 rounded-full text-xs font-black bg-appleAmber/20 text-appleAmber border border-appleAmber/40";
        gateBox.classList.remove('hidden');

        actionContainer.innerHTML = `
          <button onclick="closeDrawer(); scrollToPricing();" class="px-6 py-3 rounded-full bg-appleAmber hover:bg-amber-500 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-appleAmber/20 flex items-center space-x-2">
            <i class="fa-solid fa-crown text-sm"></i>
            <span>Unlock with Value Pass</span>
          </button>
        `;
      } else {
        badge.innerText = job.type.toUpperCase();
        badge.className = "px-3 py-1 rounded-full text-xs font-black bg-white/10 text-slate-200";
        gateBox.classList.add('hidden');

        actionContainer.innerHTML = `
          <button onclick="alert('Redirecting to direct NGO portal application link...'); closeDrawer();" class="px-6 py-3 rounded-full bg-appleBlue hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-appleBlue/20">
            Apply Direct
          </button>
        `;
      }

      // Show drawer
      document.getElementById('drawer-backdrop').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('drawer-backdrop').classList.add('opacity-100');
        document.getElementById('drawer-panel').classList.remove('translate-x-full');
      }, 10);
    }

    function closeDrawer() {
      document.getElementById('drawer-panel').classList.add('translate-x-full');
      document.getElementById('drawer-backdrop').classList.remove('opacity-100');
      setTimeout(() => {
        document.getElementById('drawer-backdrop').classList.add('hidden');
      }, 300);
    }

    // Pricing Switcher
    function setBilling(plan) {
      const priceVal = document.getElementById('price-value');
      const periodVal = document.getElementById('period-value');
      const btnMonthly = document.getElementById('toggle-monthly');
      const btnAnnual = document.getElementById('toggle-annual');

      if(plan === 'annual') {
        priceVal.innerText = '₹2,499';
        periodVal.innerText = '/ 12 months';
        btnAnnual.className = "px-5 py-2 rounded-full bg-slate-200 text-slate-950 font-bold transition";
        btnMonthly.className = "px-5 py-2 rounded-full text-slate-300 hover:text-slate-100 transition";
      } else {
        priceVal.innerText = '₹1,499';
        periodVal.innerText = '/ 6 months';
        btnMonthly.className = "px-5 py-2 rounded-full bg-slate-200 text-slate-950 font-bold transition";
        btnAnnual.className = "px-5 py-2 rounded-full text-slate-300 hover:text-slate-100 transition";
      }
    }

    function scrollToPricing() {
      document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' });
    }

    function openMembershipCheckout() {
      alert("In production, this opens Razorpay payment gateway for Value Pass subscription.");
    }

    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
    }

    function applySavedTheme() {
      const savedTheme = localStorage.getItem('job-saathi-theme');
      setTheme(savedTheme && ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'light', false);
    }

    function setTheme(theme, save = true) {
      const useLightTheme = theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
      document.body.classList.toggle('light-theme', useLightTheme);
      document.documentElement.classList.toggle('light-theme', useLightTheme);
      document.documentElement.dataset.themePreference = theme;
      document.querySelectorAll('[data-theme-option]').forEach(option => {
        const isMatch = option.dataset.themeOption === theme;
        option.classList.toggle('is-selected', isMatch);
        option.setAttribute('aria-checked', String(isMatch));
      });
      document.querySelectorAll('[data-mobile-theme-option]').forEach(option => {
        const isMatch = option.dataset.mobileThemeOption === theme;
        option.classList.toggle('is-selected', isMatch);
        option.setAttribute('aria-checked', String(isMatch));
      });
      updateThemeToggleUI(theme);
      closeThemeMenu();
      if (save) {
        localStorage.setItem('job-saathi-theme', theme);
      }
    }

    function updateThemeToggleUI(theme) {
      const container = document.getElementById('theme-toggle-icon');
      if (!container) return;
      if (theme === 'light') {
        container.className = 'inline-flex items-center justify-center w-4 h-4 text-amber-500';
        container.innerHTML = `<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
      } else if (theme === 'dark') {
        container.className = 'inline-flex items-center justify-center w-4 h-4 text-sky-400';
        container.innerHTML = `<i class="fa-solid fa-moon text-xs"></i>`;
      } else {
        container.className = 'inline-flex items-center justify-center w-4 h-4 text-sky-400';
        container.innerHTML = `<i class="fa-solid fa-circle-half-stroke text-xs"></i>`;
      }
    }

    function toggleThemeMenu(event) {
      if (event) event.stopPropagation();
      closeAllSearchDropdowns();
      const menu = document.getElementById('theme-menu');
      const button = document.getElementById('theme-toggle');
      if (!menu || !button) return;
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
    }

    function closeThemeMenu() {
      const menu = document.getElementById('theme-menu');
      const button = document.getElementById('theme-toggle');
      if (!menu || !button) return;
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      button.classList.remove('is-open');
    }

    /* Interactive Search Dropdowns (Sector & Location) */
    function toggleSearchDropdown(type, event) {
      if (event) event.stopPropagation();
      closeThemeMenu();
      const menu = document.getElementById(`${type}-dropdown-menu`);
      const btn = document.getElementById(`${type}-select-btn`);
      if (!menu || !btn) return;
      const isOpen = !menu.classList.contains('hidden');

      const otherType = type === 'sector' ? 'location' : 'sector';
      closeSearchDropdown(otherType);

      menu.classList.toggle('hidden', isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.classList.toggle('is-open', !isOpen);
    }

    function closeSearchDropdown(type) {
      const menu = document.getElementById(`${type}-dropdown-menu`);
      const btn = document.getElementById(`${type}-select-btn`);
      if (menu) menu.classList.add('hidden');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-open');
      }
    }

    function closeAllSearchDropdowns() {
      closeSearchDropdown('sector');
      closeSearchDropdown('location');
    }

    function selectSector(value, label, iconClass, event) {
      if (event) event.stopPropagation();
      const input = document.getElementById('sector-filter');
      const labelEl = document.getElementById('sector-display-label');
      const iconEl = document.getElementById('sector-display-icon');
      if (input) input.value = value;
      if (labelEl) labelEl.textContent = label;
      if (iconEl && iconClass) iconEl.className = `fa-solid ${iconClass} text-xs text-sky-400 shrink-0`;

      document.querySelectorAll('#sector-dropdown-menu .search-option').forEach(opt => {
        const isMatch = opt.dataset.sectorVal === value;
        opt.classList.toggle('is-selected', isMatch);
      });

      closeSearchDropdown('sector');
      if (isJobsPage()) {
        handleSearch();
      }
    }

    function selectLocation(value, label, iconClass, event) {
      if (event) event.stopPropagation();
      const input = document.getElementById('location-filter');
      const labelEl = document.getElementById('location-display-label');
      const iconEl = document.getElementById('location-display-icon');
      if (input) input.value = value;
      if (labelEl) labelEl.textContent = label;
      if (iconEl && iconClass) iconEl.className = `fa-solid ${iconClass} text-xs text-rose-400 shrink-0`;

      document.querySelectorAll('#location-dropdown-menu .search-option').forEach(opt => {
        const isMatch = opt.dataset.locationVal === value;
        opt.classList.toggle('is-selected', isMatch);
      });

      closeSearchDropdown('location');
      if (isJobsPage()) {
        handleSearch();
      }
    }

    function toggleMobileSearch() { focusSearchBar(); }

    function closeMobileSearch() {
      document.body.classList.remove('mobile-search-open');
      closeAllSearchDropdowns();
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu.classList.contains('hidden')) openMobileMenu(); else closeMobileMenu();
    }

    function openMobileMenu() {
      closeMobileSearch();
      const menu = document.getElementById('mobile-menu');
      const backdrop = document.getElementById('mobile-menu-backdrop');
      const toggle = document.getElementById('mobile-menu-toggle');
      if (!menu || !backdrop || !toggle) return;
      menu.classList.remove('hidden');
      backdrop.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      toggle.innerHTML = '<i class="fa-solid fa-xmark text-base"></i>';
      document.body.classList.add('mobile-menu-open');
    }

    function closeMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      const backdrop = document.getElementById('mobile-menu-backdrop');
      if (!menu || !backdrop) return;
      menu.classList.add('hidden');
      backdrop.classList.add('hidden');
      const toggle = document.getElementById('mobile-menu-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.innerHTML = '<i class="fa-solid fa-bars text-sm"></i>';
      }
      document.body.classList.remove('mobile-menu-open');
    }

    document.addEventListener('click', event => {
      const wrap = document.querySelector('.theme-menu-wrap');
      if (wrap && !wrap.contains(event.target)) {
        closeThemeMenu();
      }

      const searchWrap = event.target.closest('.search-dropdown-wrap');
      if (!searchWrap) {
        closeAllSearchDropdowns();
      }
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const menu = document.getElementById('theme-menu');
        const wasOpen = menu && !menu.classList.contains('hidden');
        closeThemeMenu();
        closeAllSearchDropdowns();
        closeMobileMenu();
        closeMobileSearch();
        if (wasOpen) {
          const button = document.getElementById('theme-toggle');
          if (button) button.focus();
        }
      }
    });

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if ((localStorage.getItem('job-saathi-theme') || 'system') === 'system') applySavedTheme();
    });

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    let authMode = 'login';
    let accountToken = localStorage.getItem('job-saathi-account-token') || '';

    function openAuthModal(mode) { setAuthMode(mode); openModal('auth-modal'); }

    function setAuthMode(mode) {
      authMode = mode;
      const signUp = mode === 'signup';
      document.getElementById('auth-name').classList.toggle('hidden', !signUp);
      document.getElementById('auth-title').textContent = signUp ? 'Create your account' : 'Welcome back';
      document.getElementById('auth-copy').textContent = signUp ? 'Your first recruiter job post is free.' : 'Log in to manage your job postings.';
      document.getElementById('auth-submit').textContent = signUp ? 'Create account' : 'Log in';
      document.getElementById('auth-login-tab').className = `auth-tab flex-1 py-2 rounded-full text-sm font-semibold ${signUp ? 'text-slate-300' : 'bg-slate-200 text-slate-950'}`;
      document.getElementById('auth-signup-tab').className = `auth-tab flex-1 py-2 rounded-full text-sm font-semibold ${signUp ? 'bg-slate-200 text-slate-950' : 'text-slate-300'}`;
      document.getElementById('auth-message').textContent = '';
    }

    async function submitAuth(event) {
      event.preventDefault();
      const payload = { email: document.getElementById('auth-email').value, password: document.getElementById('auth-password').value };
      if (authMode === 'signup') payload.name = document.getElementById('auth-name').value;
      const message = document.getElementById('auth-message');
      try {
        const response = await fetch(`/api/auth/${authMode === 'signup' ? 'signup' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to continue.');
        accountToken = result.token;
        localStorage.setItem('job-saathi-account-token', accountToken);
        message.className = 'text-sm text-appleGreen'; message.textContent = `Welcome, ${result.user.name}. Your account is ready.`;
        setTimeout(() => closeModal('auth-modal'), 800);
      } catch (error) { message.className = 'text-sm text-red-400'; message.textContent = error.message; }
    }

    function handlePostSubmit(e) {
      e.preventDefault();
      alert("Opportunity submitted for the manual moderation queue. Job posting is free.");
      closeModal('post-job-modal');
    }

    window.toggleMobileSearch = toggleMobileSearch;
    window.closeMobileSearch = closeMobileSearch;
    window.focusSearchBar = focusSearchBar;
