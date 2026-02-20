// ══════════════════════════════════════
//  Study Dudy — nav.js (fixed)
// ══════════════════════════════════════

// Wait for the full DOM before doing anything
document.addEventListener('DOMContentLoaded', () => {

  // ── Date ──────────────────────────────
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const dateStr = fmt.format(new Date());

  const navDateEl = document.getElementById('navDate');
  const mobileDateEl = document.getElementById('mobileDateDisplay');
  if (navDateEl)    navDateEl.textContent    = dateStr;
  if (mobileDateEl) mobileDateEl.textContent = dateStr;

  // ── Preloader ─────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hide');
    }, 1800);
  });

  // ── Theme ─────────────────────────────
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t === 'default' ? '' : t);
    localStorage.setItem('sd-theme', t);
  }

  // Restore saved theme on load
  const saved = localStorage.getItem('sd-theme');
  if (saved) setTheme(saved);

  // Desktop theme button
  const themeBtn      = document.getElementById('themeBtn');
  const themeDropdown = document.getElementById('themeDropdown');

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', e => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      // Close sections dropdown if open
      if (sectionsDropdown) sectionsDropdown.classList.remove('open');
      if (sectionsBtn)      sectionsBtn.classList.remove('active');
    });

    themeDropdown.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        setTheme(opt.dataset.theme);
        themeDropdown.classList.remove('open');
      });
    });
  }

  // Mobile theme buttons
  document.querySelectorAll('.mobile-theme-opt').forEach(opt => {
    opt.addEventListener('click', () => setTheme(opt.dataset.theme));
  });

  // ── Sections Dropdown ─────────────────
  const sectionsBtn      = document.getElementById('sectionsBtn');
  const sectionsDropdown = document.getElementById('sectionsDropdown');

  if (sectionsBtn && sectionsDropdown) {
    sectionsBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = sectionsDropdown.classList.toggle('open');
      sectionsBtn.classList.toggle('active', isOpen);
      // Close theme dropdown if open
      if (themeDropdown) themeDropdown.classList.remove('open');
    });

    // Stop clicks inside the dropdown from bubbling up and closing it
    sectionsDropdown.addEventListener('click', e => e.stopPropagation());
  }

  // ── Hamburger ─────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // ── Close all dropdowns on outside click ──
  document.addEventListener('click', () => {
    if (themeDropdown)    themeDropdown.classList.remove('open');
    if (sectionsDropdown) sectionsDropdown.classList.remove('open');
    if (sectionsBtn)      sectionsBtn.classList.remove('active');
    // Do NOT close the hamburger mobile menu on outside click (bad UX on mobile)
  });

});