// ===== Inner-page interactions (menú móvil, progreso, back-to-top, donaciones) =====
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Menú móvil -----
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('topnav');
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  }

  // ----- Barra de progreso + botón volver arriba (un solo listener, por frame) -----
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  let ticking = false;
  function onScroll() {
    const doc = document.documentElement;
    if (progress) {
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
    }
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  // ----- Widget de donaciones (solo existe en landing.html) -----
  const donateTab = document.getElementById('donateTab');
  const donatePanel = document.getElementById('donatePanel');
  const donateClose = document.getElementById('donateClose');

  function setDonate(open) {
    document.body.classList.toggle('donate-open', open);
    if (donateTab) donateTab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (donatePanel) donatePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  if (donatePanel) {
    document.querySelectorAll('.donate-trigger, #donateTab').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        setDonate(true);
        if (donateClose) donateClose.focus({ preventScroll: true });
      });
    });
    if (donateClose) donateClose.addEventListener('click', () => setDonate(false));

    // Abierto por defecto solo si hay espacio de sobra a los costados del contenido
    if (window.innerWidth >= 1300) setDonate(true);
  }

  // ----- Filtros genéricos: .filter-bar[data-filter-target] + items [data-tags] -----
  document.querySelectorAll('.filter-bar[data-filter-target]').forEach((bar) => {
    const target = document.querySelector(bar.getAttribute('data-filter-target'));
    if (!target) return;
    const items = target.querySelectorAll('[data-tags]');
    const buttons = bar.querySelectorAll('[data-filter]');

    buttons.forEach((btn) => {
      const f = btn.getAttribute('data-filter');
      const n = f === 'all' ? items.length : [...items].filter((it) => it.dataset.tags.split(' ').includes(f)).length;
      btn.insertAdjacentHTML('beforeend', ' <span class="count">' + n + '</span>');
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        items.forEach((it) => {
          const show = f === 'all' || it.dataset.tags.split(' ').includes(f);
          it.classList.toggle('is-filtered-out', !show);
          if (show) it.classList.add('in-view');
        });
      });
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeNav();
    if (donatePanel) setDonate(false);
  });
})();
