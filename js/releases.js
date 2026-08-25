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
//   downloadUrl -> enlace DIRECTO al archivo del asset en GitHub
//                  (Releases del repo -> click derecho al asset -> copiar
//                  enlace; tiene el patrón
//                  https://github.com/<user>/<repo>/releases/download/<tag>/<archivo>)
// =========================================================================
window.RELEASES = [
  {
    app: 'NayerControl',
    version: 'v1.0.0',
    date: '2026-08-16',
    icon: '📱',
    notes: 'Primera versión estable: controla tu Android por Wi-Fi sin cables, con emparejamiento único por USB.',
    downloadUrl: 'https://github.com/nayereulate/NayerControl/releases/download/v1.0.0/NayerControl-Windows.zip'
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
      '<a class="project-link" rel="noopener">⬇ DESCARGAR</a>';

    card.querySelector('h3').textContent = r.app;
    card.querySelector('.release-version').textContent = r.version;
    card.querySelector('p').textContent = r.notes;
    card.querySelector('.release-date').textContent = '🗓 ' + formatDate(r.date);
    const link = card.querySelector('a');
    link.href = r.downloadUrl;
    link.setAttribute('download', '');

    grid.insertBefore(card, addCard);
  });
})();
