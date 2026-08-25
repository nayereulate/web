// ===== Landing-page-only interactions (menú móvil, progreso, link activo, back-to-top, copiar alias) =====
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Menú móvil -----
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('topnav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Barra de progreso de scroll -----
  const progress = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progress) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ----- Link activo en el menú según la sección visible -----
  const sections = document.querySelectorAll('main .section');
  const navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const linkFor = new Map();
    navLinks.forEach((a) => linkFor.set(a.getAttribute('href').slice(1), a));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = linkFor.get(entry.target.id);
        if (!link) return;
        navLinks.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
  }

  // ----- Botón volver arriba -----
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  // ----- Widget de donaciones (pestaña flotante siempre visible + panel) -----
  const donateTab = document.getElementById('donateTab');
  const donatePanel = document.getElementById('donatePanel');
  const donateClose = document.getElementById('donateClose');
  const donateTriggers = document.querySelectorAll('.donate-trigger, #donateTab');

  function openDonate() {
    document.body.classList.add('donate-open');
    if (donateTab) donateTab.setAttribute('aria-expanded', 'true');
    if (donatePanel) donatePanel.setAttribute('aria-hidden', 'false');
  }
  function closeDonate() {
    document.body.classList.remove('donate-open');
    if (donateTab) donateTab.setAttribute('aria-expanded', 'false');
    if (donatePanel) donatePanel.setAttribute('aria-hidden', 'true');
  }

  donateTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openDonate();
    });
  });
  if (donateClose) donateClose.addEventListener('click', closeDonate);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDonate();
  });

  // Abierto por defecto solo si hay espacio de sobra a los costados del contenido
  if (window.innerWidth >= 1300) openDonate();

  // ----- Copiar alias de donación -----
  const copyBtn = document.getElementById('copyAliasBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const alias = copyBtn.dataset.alias || '';
      try {
        await navigator.clipboard.writeText(alias);
      } catch (e) {
        const tmp = document.createElement('textarea');
        tmp.value = alias;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      const original = copyBtn.textContent;
      copyBtn.textContent = '✅ ALIAS COPIADO';
      setTimeout(() => { copyBtn.textContent = original; }, 2000);
    });
  }
})();
