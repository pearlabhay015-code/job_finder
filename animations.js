/**
 * Mera Job Saathi - Device-Adaptive Performance Animations Engine
 * Features:
 * - Fluid Apple-grade deceleration curves with hardware-accelerated transforms
 * - Zero-lag scroll performance optimized for phones, tablets, and desktop
 * - Bidirectional reactivity (triggers on scroll down and scroll up)
 * - Micro-staggering to prevent visual delay on touch devices
 * - Reflow-free IntersectionObserver without forced layout thrashing
 */
(function () {
  'use strict';

  // Mark document ready for animation styling
  document.documentElement.classList.add('anim-ready');

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const isTouchDevice = () => window.innerWidth <= 840 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  let observer = null;
  const observedSet = new WeakSet();

  // Selectors registered for scroll reveals
  const AUTO_TARGET_SELECTORS = [
    '.hero-pill',
    '.hero-title',
    '.hero-subtitle',
    '.resume-banner',
    '.toolbar-section',
    '.listings-section .section-header',
    '.job-row-card',
    '.contact-hero .hero-pill',
    '.contact-hero h1',
    '.contact-hero p',
    '.contact-card',
    '.contact-form-card',
    '.community-section-header',
    '.community-channel-card',
    'footer .footer-content'
  ];

  function registerElements() {
    const compact = isTouchDevice();

    AUTO_TARGET_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains('anim-reveal')) {
          el.classList.add('anim-reveal');
        }
      });
    });

    // Device-adaptive stagger: compact screens use tighter timing to eliminate sluggish feel
    const cardStep = compact ? 0.04 : 0.07;
    const commStep = compact ? 0.05 : 0.09;
    const jobStep = compact ? 0.025 : 0.045;
    const jobMod = compact ? 4 : 7;

    document.querySelectorAll('.contact-cards-column .contact-card').forEach((card, i) => {
      card.style.transitionDelay = `${(i + 1) * cardStep}s`;
    });

    document.querySelectorAll('.community-channel-card').forEach((card, i) => {
      card.style.transitionDelay = `${(i + 1) * commStep}s`;
    });

    document.querySelectorAll('.job-row-card').forEach((card, i) => {
      card.style.transitionDelay = `${(i % jobMod) * jobStep}s`;
    });
  }

  function initObserver() {
    registerElements();

    // Generous rootMargin so items begin animating smoothly before hitting screen boundaries
    const options = {
      root: null,
      rootMargin: '30px 0px 30px 0px',
      threshold: [0, 0.08]
    };

    observer = new IntersectionObserver((entries) => {
      const vh = window.innerHeight || 800;
      const resetBuffer = isTouchDevice() ? Math.min(220, vh * 0.35) : 100;

      entries.forEach((entry) => {
        const el = entry.target;
        const rect = entry.boundingClientRect;

        if (entry.isIntersecting) {
          // Entering viewport (down or up) -> reveal
          el.classList.add('is-in-view');
        } else {
          // Scrolled well outside screen boundaries -> reset for bidirectional re-entry
          const isFarAbove = rect.bottom < -resetBuffer;
          const isFarBelow = rect.top > (vh + resetBuffer);

          if (isFarAbove || isFarBelow) {
            el.classList.remove('is-in-view');
          }
        }
      });
    }, options);

    observeAll();
  }

  function observeAll() {
    if (!observer) return;
    document.querySelectorAll('.anim-reveal').forEach((el) => {
      if (!observedSet.has(el)) {
        observedSet.add(el);
        observer.observe(el);
      }
    });
  }

  function triggerInitialLanding() {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      topbar.classList.add('anim-topbar-reveal');
      requestAnimationFrame(() => {
        topbar.classList.add('is-in-view');
      });
    }

    // Reveal above-the-fold hero elements immediately
    requestAnimationFrame(() => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('.hero-pill, .hero-title, .hero-subtitle, .contact-hero *').forEach((el) => {
        if (el.classList.contains('anim-reveal')) {
          el.classList.add('is-in-view');
        }
      });
    });
  }

  // Global hook for dynamically rendered content (search queries, filters)
  window.refreshScrollAnimations = function () {
    registerElements();
    observeAll();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initObserver();
      triggerInitialLanding();
    });
  } else {
    initObserver();
    triggerInitialLanding();
  }
})();
