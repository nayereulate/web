// ===== Shared micro-interactions: tilt cards, magnetic buttons, ripple, cursor glow, reveal =====
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Cursor glow that follows the pointer -----
  const glow = document.querySelector('.cursor-glow');
  if (glow && !reduced) {
    window.addEventListener('pointermove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });
    window.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }

  // ----- 3D tilt + spotlight on cards -----
  const tiltEls = document.querySelectorAll('.pillar-card, .project-card, .service-card, .release-card, .link-btn');
  if (!reduced) {
    tiltEls.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const isTiltable = el.classList.contains('pillar-card') || el.classList.contains('project-card') || el.classList.contains('service-card') || el.classList.contains('release-card');
        if (isTiltable) {
          el.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
          el.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
        }
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // ----- Magnetic pull on primary buttons -----
  const magnets = document.querySelectorAll('.btn, .link-btn, .back-btn, .share-btn, .donate-tab, .back-to-top');
  if (!reduced) {
    magnets.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.12;
        el.style.setProperty('--tx', dx.toFixed(1) + 'px');
        el.style.setProperty('--ty', dy.toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  // ----- Pixel click ripple -----
  document.querySelectorAll('.link-btn, .btn, .donate-tab, .back-to-top').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = (e.clientX - rect.left - 4) + 'px';
      ripple.style.top = (e.clientY - rect.top - 4) + 'px';
      ripple.style.width = '8px';
      ripple.style.height = '8px';
      ripple.style.background = 'rgba(255,255,255,.85)';
      ripple.style.pointerEvents = 'none';
      ripple.style.borderRadius = '0';
      ripple.style.animation = 'pixelRipple .5s ease-out forwards';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // ----- Reveal on scroll (staggered) -----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduced) {
      const groups = new Map();
      revealEls.forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });
      groups.forEach((els) => {
        els.forEach((el, i) => { el.style.transitionDelay = (i * 80) + 'ms'; });
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('in-view'));
    }
  }
})();
