/**
 * Mera Job Saathi - Theme Manager
 * System theme automatically applies on first load (new session).
 * Preserves the active/toggled theme across site navigation (Home, Contact, etc.).
 * The mode toggle switches between Light and Dark mode, while the palette
 * picker changes the active color preset with the same fluid transition.
 */
(function () {
  const STORAGE_KEY = 'job-saathi-theme';
  const MANUAL_KEY = 'job-saathi-manual';
  const COLOR_STORAGE_KEY = 'job-saathi-color-theme';
  const COLOR_THEMES = ['saffron', 'ocean', 'forest', 'rose', 'violet', 'sunset', 'mint', 'midnight', 'amber', 'mono'];
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let transitionTimer = null;

  function getSystemTheme() {
    return (mediaQuery && mediaQuery.matches) ? 'dark' : 'light';
  }

  function getInitialTheme() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {}

    // First time loaded in this session: adapt to device system theme
    const system = getSystemTheme();
    try {
      sessionStorage.setItem(STORAGE_KEY, system);
    } catch (e) {}
    return system;
  }

  let currentTheme = getInitialTheme();
  let currentColorTheme = getInitialColorTheme();

  function getInitialColorTheme() {
    try {
      const stored = sessionStorage.getItem(COLOR_STORAGE_KEY);
      if (COLOR_THEMES.includes(stored)) return stored;
    } catch (e) {}
    return 'saffron';
  }

  function applyTheme(theme, animate = false, isUserAction = false) {
    currentTheme = theme;
    const root = document.documentElement;

    if (animate) {
      root.classList.add('theme-transitioning');
    }

    root.setAttribute('data-theme', theme);

    try {
      sessionStorage.setItem(STORAGE_KEY, theme);
      if (isUserAction) {
        sessionStorage.setItem(MANUAL_KEY, '1');
      }
    } catch (e) {}

    // Keep mobile browser toolbar/status bar color matched
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'dark' ? '#0d121d' : '#f4f4f2';

    // Update theme controls and their accessibility labels
    updateToggleButtons(theme);
    updatePaletteButtons(currentColorTheme);

    if (animate) {
      if (transitionTimer) clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 420);
    }
  }

  function updateToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    buttons.forEach((btn) => {
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
      btn.dataset.currentTheme = theme;
    });
  }

  function updatePaletteButtons(colorTheme) {
    const paletteButton = document.querySelector('.theme-palette-btn');
    const paletteMenu = document.querySelector('.theme-palette-menu');
    const activeLabel = colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1);

    if (paletteButton) {
      paletteButton.setAttribute('title', `Choose color theme (current: ${activeLabel})`);
      paletteButton.setAttribute('aria-label', `Choose color theme (current: ${activeLabel})`);
      paletteButton.dataset.currentColorTheme = colorTheme;
    }

    if (paletteMenu) {
      paletteMenu.querySelectorAll('.theme-option').forEach(option => {
        const selected = option.dataset.colorTheme === colorTheme;
        option.setAttribute('aria-checked', String(selected));
      });
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true, true);
  }

  function applyColorTheme(colorTheme, animate = false, isUserAction = false) {
    if (!COLOR_THEMES.includes(colorTheme)) return;

    currentColorTheme = colorTheme;
    const root = document.documentElement;
    if (animate) root.classList.add('theme-transitioning');
    root.setAttribute('data-color-theme', colorTheme);

    try {
      sessionStorage.setItem(COLOR_STORAGE_KEY, colorTheme);
      if (isUserAction) sessionStorage.setItem(COLOR_STORAGE_KEY + '-manual', '1');
    } catch (e) {}

    updatePaletteButtons(colorTheme);

    if (animate) {
      if (transitionTimer) clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 420);
    }
  }

  function setPaletteMenuOpen(open) {
    const button = document.querySelector('.theme-palette-btn');
    const menu = document.querySelector('.theme-palette-menu');
    if (!button || !menu) return;
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }

  // Auto-adapt when system changes color scheme live, provided user hasn't manually overridden
  function onSystemThemeChange(e) {
    try {
      if (sessionStorage.getItem(MANUAL_KEY) === '1') {
        return; // Respect user's explicit toggle selection
      }
    } catch (err) {}
    applyTheme(e.matches ? 'dark' : 'light', true, false);
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', onSystemThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(onSystemThemeChange);
  }

  function initThemeUI() {
    updateToggleButtons(currentTheme);
    updatePaletteButtons(currentColorTheme);
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        toggleTheme();
        return;
      }

      const paletteButton = e.target.closest('.theme-palette-btn');
      if (paletteButton) {
        const menu = document.querySelector('.theme-palette-menu');
        setPaletteMenuOpen(Boolean(menu?.hidden));
        return;
      }

      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        applyColorTheme(themeOption.dataset.colorTheme, true, true);
        setPaletteMenuOpen(false);
        return;
      }

      if (!e.target.closest('.theme-palette')) {
        setPaletteMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setPaletteMenuOpen(false);
    });
  }

  // Ensure current theme is applied cleanly
  applyTheme(currentTheme, false, false);
  applyColorTheme(currentColorTheme, false, false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeUI);
  } else {
    initThemeUI();
  }

  window.toggleAppTheme = toggleTheme;
  window.setAppTheme = (t) => applyTheme(t, true, true);
  window.setAppColorTheme = (t) => applyColorTheme(t, true, true);
  window.getAppTheme = () => currentTheme;
  window.getAppColorTheme = () => currentColorTheme;
})();
