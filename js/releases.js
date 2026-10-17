// =========================================================================
// NAYER | EULATE — Feed de releases (landing.html #releases)
//
// Cada tarjeta se sincroniza sola con el último release de GitHub
// (versión, fecha y archivos descargables). Los datos de abajo son el
// respaldo si la API no responde. Para agregar una app nueva, añade un
// objeto arriba de la lista:
//   app      -> nombre de la app
//   repo     -> nombre del repositorio en github.com/nayereulate
//   icon     -> nombre de ícono de js/icons.js (ej. 'phone', 'vr', 'book')
//   notes    -> descripción corta de qué trae el release
//   version, date, downloads -> respaldo: [{ platform: 'windows'|'android'|'zip', url }]
// =========================================================================
window.RELEASES = [
  {
    app: 'DigitalBook',
    repo: 'DigitalBook',
    icon: 'book',
    version: 'v1.0.0',
    date: '2026-08-27',
    notes: 'App de notas para tablets con animación de página real, panel de lápiz/borrador y varios cuadernos.',
    downloads: [
      { platform: 'android', url: 'https://github.com/nayereulate/DigitalBook/releases/latest/download/DigitalBook.apk' }
    ]
  },
  {
    app: 'NayerVR',
    repo: 'NayerVR',
    icon: 'vr',
    version: 'v1.0.0',
    date: '2026-08-27',
    notes: 'Mirror del monitor de tu PC a una VR box genérica por USB/WiFi.',
    downloads: [
      { platform: 'windows', url: 'https://github.com/nayereulate/NayerVR/releases/latest/download/NayerVR-Setup.exe' },
      { platform: 'android', url: 'https://github.com/nayereulate/NayerVR/releases/latest/download/NayerVR.apk' }
    ]
  },
  {
    app: 'NayerControl',
    repo: 'NayerControl',
    icon: 'phone',
    version: 'v1.0.0',
    date: '2026-08-16',
    notes: 'Controla tu Android por USB desde la PC, con emparejamiento WiFi (beta).',
    downloads: [
      { platform: 'windows', url: 'https://github.com/nayereulate/NayerControl/releases/download/v1.0.0/NayerControl-Setup-1.0.0.exe' }
    ]
  }
];

(function () {
  const grid = document.getElementById('releasesGrid');
  if (!grid) return;
  const icon = window.icon || function () { return ''; };
  const addCard = grid.querySelector('.release-card--add');

  const PLATFORMS = {
    windows: { label: 'Windows', icon: 'windows' },
    android: { label: 'Android', icon: 'android' },
    zip: { label: 'Portable .zip', icon: 'package' },
    file: { label: 'Descargar', icon: 'download' }
  };

  function platformOf(name) {
    const n = name.toLowerCase();
    if (n.endsWith('.exe') || n.endsWith('.msi')) return 'windows';
    if (n.endsWith('.apk') || n.endsWith('.aab')) return 'android';
    if (n.endsWith('.zip')) return 'zip';
    return 'file';
  }

  function formatDate(iso) {
    try {
      return new Date(iso.slice(0, 10) + 'T00:00:00').toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  function fill(card, r) {
    card.innerHTML =
      '<div class="release-head">' +
        '<span class="icon-tile" aria-hidden="true">' + icon(r.icon || 'package') + '</span>' +
        '<div><h3></h3><span class="release-version"></span></div>' +
      '</div>' +
      '<p></p>' +
      '<div class="release-meta">' + icon('calendar') + ' <span class="release-date"></span>' +
        (r.live ? ' <span class="release-live" title="Sincronizado con GitHub"><span class="live-dot" aria-hidden="true"></span>GitHub</span>' : '') +
      '</div>' +
      '<div class="release-downloads"></div>';

    card.querySelector('h3').textContent = r.app;
    card.querySelector('.release-version').textContent = r.version;
    card.querySelector('p').textContent = r.notes;
    card.querySelector('.release-date').textContent = formatDate(r.date);

    const wrap = card.querySelector('.release-downloads');
    r.downloads.forEach((d) => {
      const p = PLATFORMS[d.platform] || PLATFORMS.file;
      const link = document.createElement('a');
      link.className = 'dl-btn';
      link.rel = 'noopener';
      link.href = d.url;
      link.setAttribute('download', '');
      link.innerHTML = icon(p.icon) + '<span></span>' + (d.size ? '<small></small>' : '');
      link.querySelector('span').textContent = p.label;
      if (d.size) link.querySelector('small').textContent = d.size;
      wrap.appendChild(link);
    });
  }

  window.RELEASES.forEach((r) => {
    const card = document.createElement('article');
    card.className = 'release-card reveal';
    card.dataset.repo = r.repo || '';
    fill(card, r);
    grid.insertBefore(card, addCard);

    if (!r.repo || !window.GH) return;
    window.GH.get('/repos/' + window.GH.user + '/' + r.repo + '/releases/latest').then((rel) => {
      if (!rel || !rel.tag_name) return;
      const assets = (rel.assets || []).map((a) => ({
        platform: platformOf(a.name),
        url: a.browser_download_url,
        size: (a.size / 1048576).toFixed(1) + ' MB'
      }));
      fill(card, Object.assign({}, r, {
        version: rel.tag_name,
        date: rel.published_at || r.date,
        downloads: assets.length ? assets : r.downloads,
        live: true
      }));
    });
  });
})();
