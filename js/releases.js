// =========================================================================
// NAYER | EULATE — Feed de releases (landing.html #releases)
//
// Para publicar un nuevo release: agrega un objeto arriba de la lista
// (así el más reciente aparece primero). Campos:
//   app         -> nombre de la app
//   version     -> ej. "v1.2.0"
//   date        -> "YYYY-MM-DD"
//   icon        -> un emoji
//   notes       -> descripción corta de qué trae el release
//   downloads   -> lista de botones de descarga, uno por plataforma:
//                  [{ label: 'Windows', url: '...' }, { label: 'Android', url: '...' }]
//                  Usa el patrón "latest/download" para que el link nunca
//                  quede desactualizado al publicar una versión nueva:
//                  https://github.com/<user>/<repo>/releases/latest/download/<archivo>
//                  (el nombre del archivo debe ser igual en todos los releases)
//   downloadUrl -> alternativa a "downloads" cuando solo hay un archivo
//                  (enlace directo al asset, ver ejemplo de NayerControl)
// =========================================================================
window.RELEASES = [
  {
    app: 'DigitalBook',
    version: 'v1.0.0',
    date: '2026-08-27',
    icon: '📓',
    notes: 'Primera versión: app de notas para tablets con animación de página real, panel de lápiz/borrador y varios cuadernos.',
    downloads: [
      { label: '📱 Android', url: 'https://github.com/nayereulate/DigitalBook/releases/latest/download/DigitalBook.apk' }
    ]
  },
  {
    app: 'NayerVR',
    version: 'v1.0.0',
    date: '2026-08-27',
    icon: '🥽',
    notes: 'Primera versión: mirror del monitor de tu PC a una VR box genérica por USB/WiFi.',
    downloads: [
      { label: '🖥️ Windows', url: 'https://github.com/nayereulate/NayerVR/releases/latest/download/NayerVR-Setup.exe' },
      { label: '📱 Android', url: 'https://github.com/nayereulate/NayerVR/releases/latest/download/NayerVR.apk' }
    ]
  },
  {
    app: 'NayerControl',
    version: 'v1.0.0',
    date: '2026-08-16',
    icon: '📱',
    notes: 'Primera versión estable: controla tu Android por USB en tu PC, con emparejamiento WIFI (BETA).',
    downloadUrl: 'https://github.com/nayereulate/NayerControl/releases/download/v1.0.0/NayerControl-Setup-1.0.0.exe'
  }
];

(function () {
  const grid = document.getElementById('releasesGrid');
  if (!grid) return;

  const addCard = grid.querySelector('.release-card--add');

  function formatDate(iso) {
    try {
      return new Date(iso + 'T00:00:00').toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  window.RELEASES.forEach((r) => {
    const card = document.createElement('article');
    card.className = 'release-card reveal';
    card.innerHTML =
      '<div class="release-head">' +
        '<span class="release-icon">' + (r.icon || '🚀') + '</span>' +
        '<div><h3></h3><span class="release-version"></span></div>' +
      '</div>' +
      '<p></p>' +
      '<div class="release-meta"><span class="release-date"></span></div>' +
      '<div class="release-downloads"></div>';

    card.querySelector('h3').textContent = r.app;
    card.querySelector('.release-version').textContent = r.version;
    card.querySelector('p').textContent = r.notes;
    card.querySelector('.release-date').textContent = '🗓 ' + formatDate(r.date);

    const downloads = r.downloads || [{ label: '⬇ DESCARGAR', url: r.downloadUrl }];
    const downloadsWrap = card.querySelector('.release-downloads');
    downloads.forEach((d) => {
      const link = document.createElement('a');
      link.className = 'project-link';
      link.rel = 'noopener';
      link.href = d.url;
      link.textContent = d.label;
      link.setAttribute('download', '');
      downloadsWrap.appendChild(link);
    });

    grid.insertBefore(card, addCard);
  });
})();
