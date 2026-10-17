// =========================================================================
// NAYER STUDIO — Estimador de proyecto (software.html #estimador)
// Puntúa el proyecto con pesos simples y lo traduce a nivel + rango de tiempo.
// Es orientativo: para ajustar la calibración cambia los pesos de abajo.
// =========================================================================
(function () {
  const form = document.getElementById('estimator');
  if (!form) return;

  const TYPES = {
    web: { label: 'Web', w: 1 },
    desktop: { label: 'App de escritorio', w: 2 },
    android: { label: 'App Android', w: 2.5 },
    script: { label: 'Automatización', w: 0.5 },
    bot: { label: 'Bot / integración', w: 1.5 }
  };
  const EXTRAS = {
    login: { label: 'Usuarios / login', w: 2 },
    db: { label: 'Base de datos', w: 1.5 },
    api: { label: 'Integración con APIs', w: 1.5 },
    admin: { label: 'Panel de administración', w: 2 },
    multi: { label: 'Varias plataformas', w: 3 },
    design: { label: 'Diseño visual a medida', w: 1 }
  };
  const LEVELS = [
    { n: 1, name: 'QUICK QUEST', max: 3.5 },
    { n: 2, name: 'MAIN QUEST', max: 10.5 },
    { n: 3, name: 'RAID', max: Infinity }
  ];
  const DAYS_PER_POINT = 2.5;

  const range = form.elements.pantallas;
  const out = document.getElementById('est-screens-out');
  const elLevel = document.getElementById('est-level');
  const elBar = document.getElementById('est-bar');
  const elTime = document.getElementById('est-time');
  const elWeight = document.getElementById('est-weight');
  const send = document.getElementById('est-send');
  const copyBtn = document.getElementById('est-copy');
  let summary = '';

  function timeRange(score) {
    const days = score * DAYS_PER_POINT;
    const lo = Math.max(1, Math.round(days * 0.8));
    const hi = Math.max(lo + 1, Math.round(days * 1.3));
    if (hi <= 7) return lo + '–' + hi + ' días';
    return Math.max(1, Math.round(lo / 5)) + '–' + Math.max(2, Math.ceil(hi / 5)) + ' semanas';
  }

  function update() {
    const type = form.querySelector('input[name="tipo"]:checked').value;
    const screens = Number(range.value);
    const extras = [...form.querySelectorAll('input[name="extra"]:checked')].map((c) => c.value);
    const existing = form.querySelector('input[name="base"]:checked').value === 'existente';

    out.textContent = screens;
    range.style.setProperty('--fill', ((screens - 1) / 11 * 100).toFixed(1) + '%');

    const parts = [{ label: TYPES[type].label, w: TYPES[type].w }];
    const perScreen = type === 'script' || type === 'bot' ? 0.35 : 0.6;
    parts.push({ label: screens + ' pantallas/secciones', w: (screens - 1) * perScreen });
    extras.forEach((x) => parts.push({ label: EXTRAS[x].label, w: EXTRAS[x].w }));

    let score = parts.reduce((a, p) => a + p.w, 0);
    if (existing) score *= 0.8;

    const level = LEVELS.find((l) => score < l.max);
    const heaviest = parts.slice().sort((a, b) => b.w - a.w)[0];
    const time = timeRange(score);

    elLevel.textContent = 'NIVEL ' + level.n + ' · ' + level.name;
    elLevel.dataset.level = level.n;
    elBar.style.width = Math.min(100, Math.max(8, (score / 14) * 100)).toFixed(0) + '%';
    elTime.textContent = time;
    elWeight.textContent = heaviest.label;

    summary =
      'Estimación desde la web: ' + TYPES[type].label + ', ' + screens + ' pantallas/secciones' +
      (extras.length ? ', extras: ' + extras.map((x) => EXTRAS[x].label).join(', ') : '') +
      (existing ? ', partiendo de algo existente' : ', desde cero') +
      '. Resultado: Nivel ' + level.n + ' (' + level.name + '), ~' + time + '.';

    send.href = 'contacto.html?servicio=software&nivel=' + level.n + '&resumen=' + encodeURIComponent(summary);
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      window.copyText(summary).then(() => window.toast && window.toast('Estimación copiada', 'copy'));
    });
  }
  update();
})();
