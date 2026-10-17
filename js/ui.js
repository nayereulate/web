// =========================================================================
// NAYER | EULATE — UI global (todas las páginas)
//   · toast(msg, icon)        notificaciones breves
//   · copyText(text)          copiar con respaldo para navegadores viejos
//   · Paleta de comandos      Ctrl/⌘+K o "/" — navegar, redes y acciones
//   · Efectos CRT on/off      se recuerda en este navegador
//   · Código Konami           ↑↑↓↓←→←→BA
// =========================================================================
(function () {
  const root = document.documentElement;
  const icon = window.icon || function () { return ''; };
  const WHATSAPP = 'https://wa.me/59168518643';

  // ---------------- Toasts ----------------
  const toastWrap = document.createElement('div');
  toastWrap.className = 'toasts';
  toastWrap.setAttribute('role', 'status');
  toastWrap.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastWrap);

  window.toast = function (msg, iconName) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = icon(iconName || 'check') + '<span></span>';
    t.querySelector('span').textContent = msg;
    toastWrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 2600);
  };

  // ---------------- Copiar ----------------
  window.copyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const tmp = document.createElement('textarea');
      tmp.value = text;
      tmp.setAttribute('readonly', '');
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
    }
  };

  function sharePage() {
    const data = { title: document.title, url: location.href.split('#')[0] };
    if (navigator.share) {
      navigator.share(data).catch(() => {});
    } else {
      window.copyText(data.url).then(() => window.toast('Enlace copiado', 'link'));
    }
  }
  window.sharePage = sharePage;

  // ---------------- Efectos CRT ----------------
  function fxOn() { return !root.classList.contains('fx-off'); }
  function syncFxButtons() {
    document.querySelectorAll('[data-fx-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', fxOn() ? 'true' : 'false');
      const label = b.querySelector('[data-fx-label]');
      if (label) label.textContent = fxOn() ? 'EFECTOS: ON' : 'EFECTOS: OFF';
    });
  }
  function setFx(on) {
    root.classList.toggle('fx-off', !on);
    try { localStorage.setItem('ne-fx', on ? 'on' : 'off'); } catch (e) { /* sin almacenamiento */ }
    syncFxButtons();
    window.dispatchEvent(new CustomEvent('fxchange', { detail: on }));
    window.toast(on ? 'Efectos retro activados' : 'Modo ligero: efectos desactivados', 'sliders');
  }
  document.querySelectorAll('[data-fx-toggle]').forEach((b) => b.addEventListener('click', () => setFx(!fxOn())));
  syncFxButtons();

  // ---------------- Paleta de comandos ----------------
  const COMMANDS = [
    { g: 'Páginas', label: 'Inicio · mis links', icon: 'link', href: 'index.html', k: 'home hub redes' },
    { g: 'Páginas', label: 'Sobre mí', icon: 'user', href: 'landing.html', k: 'about nayer historia umss' },
    { g: 'Páginas', label: 'Proyectos', icon: 'folder', href: 'landing.html#creaciones', k: 'creaciones portafolio apps' },
    { g: 'Páginas', label: 'Releases y descargas', icon: 'download', href: 'landing.html#releases', k: 'descargar apk exe versiones' },
    { g: 'Páginas', label: 'Nayer Studio', icon: 'briefcase', href: 'servicios.html', k: 'agencia servicios estudio' },
    { g: 'Páginas', label: 'Software Lab', icon: 'code', href: 'software.html', k: 'desarrollo web apps android escritorio' },
    { g: 'Páginas', label: 'Estimador de proyecto', icon: 'calculator', href: 'software.html#estimador', k: 'cotizar calcular precio tiempo' },
    { g: 'Páginas', label: 'Niveles de proyecto', icon: 'layers', href: 'software.html#niveles', k: 'paquetes planes quest raid' },
    { g: 'Páginas', label: 'Content Lab', icon: 'video', href: 'contenido.html', k: 'contenido edicion stream obs' },
    { g: 'Páginas', label: 'Colabs y marcas', icon: 'megaphone', href: 'contenido.html#colabs', k: 'patrocinio sponsor review' },
    { g: 'Páginas', label: 'Contacto · enviar brief', icon: 'chat', href: 'contacto.html', k: 'cotizar formulario mensaje' },
    { g: 'Redes', label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@nayerdev', ext: true },
    { g: 'Redes', label: 'Twitch', icon: 'twitch', href: 'https://www.twitch.tv/nayer_eulate_m', ext: true, k: 'stream directo' },
    { g: 'Redes', label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@nayer.dev', ext: true },
    { g: 'Redes', label: 'GitHub', icon: 'github', href: 'https://github.com/nayereulate', ext: true, k: 'codigo repos' },
    { g: 'Redes', label: 'Discord', icon: 'discord', href: 'https://discord.gg/3p7HU2fUN', ext: true, k: 'comunidad' },
    { g: 'Acciones', label: 'Escribir por WhatsApp', icon: 'whatsapp', href: WHATSAPP, ext: true, k: 'contacto mensaje' },
    { g: 'Acciones', label: 'Compartir esta página', icon: 'share', run: sharePage, k: 'copiar enlace link' },
    { g: 'Acciones', label: 'Activar / desactivar efectos', icon: 'sliders', run: () => setFx(!fxOn()), k: 'crt animaciones rendimiento ligero' },
    { g: 'Acciones', label: 'Volver arriba', icon: 'arrow-up', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }), k: 'top inicio' }
  ];

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const pal = document.createElement('div');
  pal.className = 'cmdk';
  pal.hidden = true;
  pal.innerHTML =
    '<div class="cmdk__backdrop" data-close></div>' +
    '<div class="cmdk__panel" role="dialog" aria-modal="true" aria-label="Buscador del sitio">' +
      '<div class="cmdk__search">' + icon('search') +
        '<input type="text" class="cmdk__input" placeholder="Busca una página, red o acción..." aria-label="Buscar" ' +
        'role="combobox" aria-expanded="true" aria-controls="cmdkList" autocomplete="off" spellcheck="false">' +
        '<kbd>ESC</kbd></div>' +
      '<ul class="cmdk__list" id="cmdkList" role="listbox"></ul>' +
      '<div class="cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> navegar</span><span><kbd>↵</kbd> abrir</span><span><kbd>Ctrl</kbd><kbd>K</kbd> abrir/cerrar</span></div>' +
    '</div>';
  document.body.appendChild(pal);

  const input = pal.querySelector('.cmdk__input');
  const list = pal.querySelector('.cmdk__list');
  let results = [];
  let active = 0;
  let lastFocus = null;

  function render() {
    const q = norm(input.value.trim());
    results = COMMANDS.filter((c) => !q || norm(c.label + ' ' + c.g + ' ' + (c.k || '')).includes(q));
    active = Math.min(active, Math.max(results.length - 1, 0));
    list.innerHTML = '';
    if (!results.length) {
      list.innerHTML = '<li class="cmdk__empty">Sin resultados. Prueba con "software", "stream" o "descargar".</li>';
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let group = '';
    results.forEach((c, i) => {
      if (c.g !== group) {
        group = c.g;
        const h = document.createElement('li');
        h.className = 'cmdk__group';
        h.setAttribute('role', 'presentation');
        h.textContent = group;
        list.appendChild(h);
      }
      const li = document.createElement('li');
      li.className = 'cmdk__item' + (i === active ? ' is-active' : '');
      li.id = 'cmdk-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === active ? 'true' : 'false');
      li.innerHTML = icon(c.icon) + '<span></span>' + (c.ext ? icon('external', 'cmdk__ext') : '');
      li.querySelector('span').textContent = c.label;
      li.addEventListener('mousemove', () => { if (active !== i) { active = i; highlight(); } });
      li.addEventListener('click', () => exec(c));
      list.appendChild(li);
    });
    input.setAttribute('aria-activedescendant', 'cmdk-opt-' + active);
  }

  function highlight() {
    list.querySelectorAll('.cmdk__item').forEach((el) => {
      const on = el.id === 'cmdk-opt-' + active;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) el.scrollIntoView({ block: 'nearest' });
    });
    input.setAttribute('aria-activedescendant', 'cmdk-opt-' + active);
  }

  function exec(c) {
    close();
    if (c.run) { c.run(); return; }
    if (c.ext) { window.open(c.href, '_blank', 'noopener'); return; }
    window.location.href = c.href;
  }

  function open() {
    if (!pal.hidden) return;
    lastFocus = document.activeElement;
    pal.hidden = false;
    input.value = '';
    active = 0;
    render();
    document.body.classList.add('cmdk-open');
    requestAnimationFrame(() => { pal.classList.add('show'); input.focus(); });
  }
  function close() {
    if (pal.hidden) return;
    pal.classList.remove('show');
    document.body.classList.remove('cmdk-open');
    pal.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openPalette = open;

  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(results.length, 1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + results.length) % Math.max(results.length, 1); highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) exec(results[active]); }
    else if (e.key === 'Tab') { e.preventDefault(); } // el foco se queda en el buscador
  });
  pal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) close(); });
  document.querySelectorAll('[data-cmdk]').forEach((b) => b.addEventListener('click', open));

  function typingInField(el) {
    return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      pal.hidden ? open() : close();
    } else if (e.key === '/' && pal.hidden && !typingInField(document.activeElement)) {
      e.preventDefault();
      open();
    } else if (e.key === 'Escape' && !pal.hidden) {
      close();
    }
  });

  // Etiqueta del atajo según sistema
  if (/Mac|iPhone|iPad/.test(navigator.platform || '')) {
    document.querySelectorAll('[data-mod-key]').forEach((k) => { k.textContent = '⌘'; });
  }

  // ---------------- Código Konami ----------------
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let kPos = 0;
  window.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    kPos = key === KONAMI[kPos] ? kPos + 1 : (key === KONAMI[0] ? 1 : 0);
    if (kPos === KONAMI.length) { kPos = 0; godMode(); }
  });

  function godMode() {
    window.toast('GOD MODE ACTIVADO · +30 vidas', 'invader');
    root.classList.add('god-mode');
    setTimeout(() => root.classList.remove('god-mode'), 6000);
    if (root.classList.contains('fx-off') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#00f0ff', '#ff2bd6', '#ffe66d', '#39ff88', '#a239ff'];
    const layer = document.createElement('div');
    layer.className = 'pixel-rain';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 1.2).toFixed(2) + 's';
      p.style.animationDuration = (1.6 + Math.random() * 1.6).toFixed(2) + 's';
      const size = 4 + Math.round(Math.random() * 3) * 2;
      p.style.width = p.style.height = size + 'px';
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4000);
  }
})();
