// =========================================================================
// NAYER STUDIO — Interacciones base de /studio
// Menú móvil, header al hacer scroll, aparición de secciones, año del footer
// y enlaces de contacto tomados de NS_CONFIG.
// =========================================================================
(function () {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Menú móvil -----
  const toggle = document.getElementById('pNavToggle');
  const nav = document.getElementById('pNav');
  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('p-nav-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false)));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 960) setNav(false); });
  }

  // ----- Header con fondo al bajar -----
  const header = document.querySelector('.p-header');
  let ticking = false;
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // ----- Aparición al hacer scroll -----
  const items = document.querySelectorAll('.p-reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  // ----- Enlaces de contacto centralizados -----
  if (window.NS) {
    document.querySelectorAll('[data-wa]').forEach((a) => {
      a.href = window.NS.waLink(a.getAttribute('data-wa') || '');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-tg]').forEach((a) => {
      a.href = window.NS.config.telegram;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-workana]').forEach((a) => {
      a.href = window.NS.config.workana;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-phone]').forEach((el) => { el.textContent = window.NS.config.phoneLabel; });
  }

  // ----- Año actual -----
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
