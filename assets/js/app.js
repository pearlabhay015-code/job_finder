// Sample Jobs Database
    const sampleJobs = [
      {
        id: 1,
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
        id: 2,
        title: "ESG & Climate Resilience Director",
        org: "Terra Impact Foundation",
        type: "premium",
        sector: "Climate",
        location: "Bengaluru",
        exp: "8-12 Years",
        deadline: "4 Days Left",
        posted: "1 day ago",
        desc: "Value Member Exclusive: Direct oversight of carbon-offset grants and CSR ESG advisory services for Fortune 500 corporate foundations."
      },
      {
        id: 3,
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
        id: 4,
        title: "CSR Lead - Social Governance & Grants",
        org: "Tata Sustainability Group",
        type: "standard",
        sector: "CSR",
        location: "Mumbai",
        exp: "5-8 Years",
        deadline: "15 Days Left",
        posted: "2 days ago",
        desc: "Oversee Section 135 CSR compliance budgets, partner NGO due diligence, and quarterly board reporting."
      },
      {
        id: 5,
        title: "Chief of Party - WASH Sustainable Mission",
        org: "WaterAid India",
        type: "premium",
        sector: "Health",
        location: "New Delhi",
        exp: "12+ Years",
        deadline: "2 Days Left",
        posted: "Just now",
        desc: "Value Member Exclusive: Senior leadership role directing a multi-state clean water initiative funded by international multilateral donors."
      },
      {
        id: 6,
        title: "RFP: Supply & Installation of Solar Microgrids",
        org: "Clean Power Trust",
        type: "rfp",
        sector: "Climate",
        location: "Jharkhand",
        exp: "Vendor Tender",
        deadline: "22 Days Left",
        posted: "4 days ago",
        desc: "Turnkey procurement tender for solar microgrid installations in off-grid tribal villages."
      }
    ];

    const sampleExperts = [
      { name: "Dr. Ananya Sharma", role: "Public Health Lead", exp: "11 Yrs Exp", tags: ["USAID", "Epidemiology"] },
      { name: "Rajesh K. Verma", role: "Climate Finance Advisor", exp: "9 Yrs Exp", tags: ["ESG", "GEF Grants"] },
      { name: "Priya Menon", role: "M&E Director", exp: "14 Yrs Exp", tags: ["World Bank", "SPSS"] },
      { name: "Arjun Mehta", role: "CSR Policy Lead", exp: "7 Yrs Exp", tags: ["Section 135", "CSR"] }
    ];

    let currentTab = 'all';

    window.onload = function() {
      applySavedTheme();
      renderJobs(sampleJobs);
      renderExperts(sampleExperts);
      updateCounts();
    };

    // Render Alternating Soft White & Deep Glass Black Cards
    function renderJobs(jobs) {
      const container = document.getElementById('jobs-container');

      if(jobs.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-20 text-center text-slate-400">
            <i class="fa-solid fa-folder-open text-4xl mb-3"></i>
            <p class="text-base font-semibold">No matching opportunities found for your criteria.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = jobs.map((job, index) => {
        // ALTERNATING CARD LOGIC (Even index = Soft Off-White Card, Odd index = Deep Black Glass Card)
        const isWhiteCard = index % 2 === 0;

        let tagText = '';
        if(job.type === 'premium') {
          tagText = '<i class="fa-solid fa-crown text-appleAmber mr-1.5"></i> VALUE MEMBER EXCLUSIVE';
        } else if(job.type === 'rfp') {
          tagText = 'RFP / TENDER';
        } else {
          tagText = 'STANDARD OPPORTUNITY';
        }

        if(isWhiteCard) {
          // CARD TYPE A: Soft Off-White Card (#f4f4f7) with crisp dark text
          return `
            <div onclick="openJobDrawer(${job.id})" class="bg-[#f4f4f7] p-7 sm:p-8 rounded-3xl flex flex-col justify-between cursor-pointer group hover:scale-[1.01] hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs font-extrabold tracking-wider ${job.type === 'premium' ? 'text-amber-600' : 'text-slate-500'}">
                  <span>${tagText}</span>
                  <span class="text-slate-400 font-medium">${job.posted}</span>
                </div>

                <!-- Clean Title Heading (Dark Slate) -->
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-appleBlue transition-colors leading-tight">
                  ${job.title}
                </h3>
                
                <p class="text-base text-slate-700 font-bold mt-2">${job.org}</p>
                
                <p class="text-sm text-slate-600 mt-4 line-clamp-3 leading-relaxed font-normal">
                  ${job.desc}
                </p>
              </div>

              <div class="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-sm text-slate-700 font-semibold">
                <span class="flex items-center space-x-2">
                  <i class="fa-solid fa-location-dot text-slate-500 text-xs"></i>
                  <span>${job.location}</span>
                </span>
                <span class="text-appleBlue font-bold text-sm flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Inspect</span>
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </span>
              </div>
            </div>
          `;
        } else {
          // CARD TYPE B: Deep Glass Black Card (#0d0d12) with soft off-white text
          return `
            <div onclick="openJobDrawer(${job.id})" class="apple-dark-card p-7 sm:p-8 rounded-3xl flex flex-col justify-between cursor-pointer group hover:scale-[1.01] hover:border-white/25 transition-all">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs font-extrabold tracking-wider ${job.type === 'premium' ? 'text-appleAmber' : 'text-slate-400'}">
                  <span>${tagText}</span>
                  <span class="text-slate-500 font-medium">${job.posted}</span>
                </div>

                <!-- Clean Title Heading (Soft Off-White) -->
                <h3 class="text-xl sm:text-2xl font-black text-slate-100 group-hover:text-appleBlue transition-colors leading-tight">
                  ${job.title}
                </h3>
                
                <p class="text-base text-slate-300 font-semibold mt-2">${job.org}</p>
                
                <p class="text-sm text-slate-400 mt-4 line-clamp-3 leading-relaxed">
                  ${job.desc}
                </p>
              </div>

              <div class="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-slate-300 font-medium">
                <span class="flex items-center space-x-2">
                  <i class="fa-solid fa-location-dot text-slate-500 text-xs"></i>
                  <span>${job.location}</span>
                </span>
                <span class="text-appleBlue font-bold text-sm flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Inspect</span>
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </span>
              </div>
            </div>
          `;
        }
      }).join('');
    }

    // Render Experts Roster
    function renderExperts(experts) {
      const container = document.getElementById('experts-container');
      container.innerHTML = experts.map(exp => `
        <div class="expert-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span class="expert-label">Featured profile</span>
            <h4 class="text-lg font-bold text-slate-900 mt-3">${exp.name}</h4>
            <p class="text-sm text-slate-600 mt-0.5">${exp.role}</p>
            <span class="inline-block mt-2 text-xs text-appleGreen font-semibold">${exp.exp}</span>

            <div class="flex flex-wrap gap-1.5 mt-4">
              ${exp.tags.map(t=>`<span class="expert-tag">${t}</span>`).join('')}
            </div>
          </div>
          <button onclick="scrollToPricing()" class="expert-button mt-6 w-full py-2.5 rounded-full text-xs font-bold transition">
            Request Contact
          </button>
        </div>
      `).join('');
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

    function handleSearch() {
      const query = document.getElementById('search-input').value.toLowerCase();
      const sector = document.getElementById('sector-filter').value;
      const location = document.getElementById('location-filter').value;

      const filtered = sampleJobs.filter(job => {
        const matchesTab = currentTab === 'all' || job.type === currentTab;
        const matchesQuery = job.title.toLowerCase().includes(query) || job.org.toLowerCase().includes(query) || job.desc.toLowerCase().includes(query);
        const matchesSector = sector === "" || job.sector === sector;
        const matchesLocation = location === "" || job.location.includes(location);

        return matchesTab && matchesQuery && matchesSector && matchesLocation;
      });

      renderJobs(filtered);
    }

    function setQuickSearch(val) {
      document.getElementById('search-input').value = val;
      handleSearch();
    }

    function updateCounts() {
      document.getElementById('count-all').innerText = sampleJobs.length;
      document.getElementById('count-standard').innerText = sampleJobs.filter(j => j.type === 'standard').length;
      document.getElementById('count-premium').innerText = sampleJobs.filter(j => j.type === 'premium').length;
      document.getElementById('count-rfp').innerText = sampleJobs.filter(j => j.type === 'rfp').length;
    }

    // Drawer Slide Controller
    function openJobDrawer(id) {
      const job = sampleJobs.find(j => j.id === id);
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
      const savedTheme = localStorage.getItem('helping-hands-theme');
      const useLightTheme = savedTheme === 'light';
      document.body.classList.toggle('light-theme', useLightTheme);
      document.documentElement.classList.toggle('light-theme', useLightTheme);
      updateThemeToggle(useLightTheme);
    }

    function toggleTheme() {
      const useLightTheme = !document.body.classList.contains('light-theme');
      document.body.classList.toggle('light-theme', useLightTheme);
      document.documentElement.classList.toggle('light-theme', useLightTheme);
      localStorage.setItem('helping-hands-theme', useLightTheme ? 'light' : 'dark');
      updateThemeToggle(useLightTheme);
    }

    function updateThemeToggle(useLightTheme) {
      const button = document.getElementById('theme-toggle');
      if (!button) return;
      button.setAttribute('aria-label', useLightTheme ? 'Switch to dark theme' : 'Switch to light theme');
      button.innerHTML = `<i class="fa-solid fa-${useLightTheme ? 'moon' : 'sun'} text-sm"></i>`;
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    function handlePostSubmit(e) {
      e.preventDefault();
      alert("Opportunity submitted for manual moderation queue.");
      closeModal('post-job-modal');
    }
