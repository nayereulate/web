// =========================================================================
// NAYER | EULATE — Datos en vivo desde la API pública de GitHub
//   GH.get(path)      fetch con caché local de 1 h (la API permite 60 req/h)
//   GH.ago(iso)       "hace 3 semanas"
//   [data-repo]       en tarjetas: añade versión, lenguaje y última actualización
//   #ghStatus         en index: último repo con actividad
//   [data-gh="repos"] número de repos públicos
// Si la API falla, se usa la última caché o simplemente se deja el HTML estático.
// =========================================================================
(function () {
  const USER = 'nayereulate';
  const API = 'https://api.github.com';
  const TTL = 60 * 60 * 1000;
  const inflight = {};

  function readCache(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function writeCache(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) { /* sin almacenamiento */ }
  }

  function get(path) {
    const key = 'gh:' + path;
    const cached = readCache(key);
    if (cached && Date.now() - cached.t < TTL) return Promise.resolve(cached.d);
    if (inflight[path]) return inflight[path];
    inflight[path] = fetch(API + path, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { writeCache(key, d); return d; })
      .catch(() => (cached ? cached.d : null));
    return inflight[path];
  }

  const rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('es', { numeric: 'auto' }) : null;
  function ago(iso) {
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, secs] of units) {
      if (Math.abs(diff) >= secs || unit === 'minute') {
        const v = Math.round(diff / secs);
        return rtf ? rtf.format(v, unit) : iso.slice(0, 10);
      }
    }
    return iso.slice(0, 10);
  }

  window.GH = { user: USER, get: get, ago: ago };

  // ----- Meta de repos en tarjetas de proyecto / casos -----
  document.querySelectorAll('[data-repo]').forEach((card) => {
    if (card.classList.contains('release-card')) return; // releases.js se encarga
    const repo = card.getAttribute('data-repo');
    Promise.all([get('/repos/' + USER + '/' + repo), get('/repos/' + USER + '/' + repo + '/releases/latest')]).then(([info, rel]) => {
      if (!info) return;
      const bits = [];
      if (rel && rel.tag_name) bits.push('<span class="repo-meta__tag">' + window.icon('tag') + rel.tag_name.replace(/[<>&]/g, '') + '</span>');
      if (info.language) bits.push('<span>' + window.icon('code') + info.language.replace(/[<>&]/g, '') + '</span>');
      if (info.stargazers_count > 0) bits.push('<span>' + window.icon('star') + info.stargazers_count + '</span>');
      if (info.pushed_at) bits.push('<span>' + window.icon('commit') + 'act. ' + ago(info.pushed_at) + '</span>');
      const meta = document.createElement('div');
      meta.className = 'repo-meta';
      meta.title = 'Datos en vivo de GitHub';
      meta.innerHTML = '<span class="live-dot" aria-hidden="true"></span>' + bits.join('');
      const link = card.querySelector('.project-link');
      card.insertBefore(meta, link || null);
    });
  });

  // ----- Contador de repos públicos -----
  const repoCounters = document.querySelectorAll('[data-gh="repos"]');
  if (repoCounters.length) {
    get('/users/' + USER).then((u) => {
      if (u && typeof u.public_repos === 'number') repoCounters.forEach((el) => { el.textContent = u.public_repos; });
    });
  }

  // ----- Estado en vivo (index) -----
  const status = document.getElementById('ghStatus');
  if (status) {
    const text = status.querySelector('[data-gh-text]');
    get('/users/' + USER + '/repos?sort=pushed&per_page=5').then((repos) => {
      // el repo de perfil (nayereulate/nayereulate) no dice nada como "último proyecto"
      const r = (repos || []).find((x) => x.name.toLowerCase() !== USER.toLowerCase());
      if (r) {
        text.textContent = 'último push en ' + r.name + ' · ' + ago(r.pushed_at);
        status.href = r.html_url;
        status.classList.add('is-live');
      } else {
        text.textContent = 'github.com/' + USER;
      }
    });
  }
})();
