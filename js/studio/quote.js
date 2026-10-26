// =========================================================================
// NAYER STUDIO — Cotizador por pasos (studio/cotizar.html)
//   1 Servicio · 2 Detalles · 3 Alcance · 4 Contacto · 5 Enviar
// - Resumen y estimación en vivo (la estimación aplica a software)
// - Borrador en localStorage, referencia única por solicitud
// - Precarga: ?servicio=software|contenido|colab|consultoria  &nivel=1|2|3  &formato=mencion|review|stream
// - Forma de pago preferida (transferencia/QR, Workana o a definir)
// - Envío por WhatsApp (texto precargado) o Telegram (se copia y se abre el chat)
// Nada se envía a un servidor.
// =========================================================================
(function () {
  const form = document.getElementById('quoteForm');
  if (!form || !window.NS) return;
  const NS = window.NS;
  const icon = window.icon || (() => '');
  const toast = (m, i) => window.toast && window.toast(m, i);

  // ---------- Catálogos ----------
  const SERVICE = {
    software: 'Desarrollo de software',
    contenido: 'Contenido para creadores',
    colab: 'Colaboración de marca',
    consultoria: 'Consultoría técnica'
  };
  const SW_TYPES = {
    web: { label: 'Web', w: 1 },
    desktop: { label: 'App de escritorio', w: 2 },
    android: { label: 'App Android', w: 2.5 },
    script: { label: 'Automatización', w: 0.5 },
    bot: { label: 'Bot / integración', w: 1.5 }
  };
  const SW_EXTRAS = {
    login: { label: 'Usuarios / login', w: 2 },
    db: { label: 'Base de datos', w: 1.5 },
    api: { label: 'Integración con APIs', w: 1.5 },
    admin: { label: 'Panel de administración', w: 2 },
    multi: { label: 'Varias plataformas', w: 3 },
    design: { label: 'Diseño visual a medida', w: 1 }
  };
  const PLANS = [
    { n: 1, name: 'Esencial', max: 3.5 },
    { n: 2, name: 'Profesional', max: 10.5 },
    { n: 3, name: 'A medida', max: Infinity }
  ];
  const DAYS_PER_POINT = 2.5;
  const CT = { edicion: 'Edición de video', stream: 'Setup de stream', identidad: 'Identidad visual', herramientas: 'Herramientas / bots', mentoria: 'Mentoría' };
  const CB = { mencion: 'Mención', review: 'Review / demo', stream: 'Stream patrocinado' };
  const CS = { idea: 'Validar idea y alcance', stack: 'Elegir stack', codigo: 'Revisar código existente', mvp: 'Plan de MVP por etapas' };
  const NEXT_LABEL = ['Continuar', 'Continuar', 'Continuar', 'Revisar solicitud'];

  // ---------- Elementos ----------
  const steps = [...form.querySelectorAll('.q-step')];
  const stepper = [...document.querySelectorAll('#qStepper li')];
  const prevBtn = document.getElementById('qPrev');
  const nextBtn = document.getElementById('qNext');
  const nav = document.getElementById('qNav');
  const summary = document.getElementById('qSummary');
  const refEl = document.getElementById('qRef');
  const preview = document.getElementById('qPreview');
  const est = {
    box: document.getElementById('qEstimate'),
    plan: document.getElementById('qEstPlan'),
    bar: document.getElementById('qEstBar'),
    time: document.getElementById('qEstTime'),
    weight: document.getElementById('qEstWeight'),
    hp: document.getElementById('qHp')
  };
  const range = form.elements.sw_pantallas;
  const rangeOut = document.getElementById('swPantallasOut');
  const desc = form.elements.q_desc;
  const descCount = document.getElementById('qDescCount');

  // Presupuestos desde la configuración
  const budgetSel = form.elements.q_presupuesto;
  (NS.config.budgets || ['Prefiero conversarlo']).forEach((b) => {
    const o = document.createElement('option');
    o.value = o.textContent = b;
    budgetSel.appendChild(o);
  });

  // ---------- Lectura de campos ----------
  const one = (name) => {
    const el = form.elements[name];
    if (!el) return '';
    if (el instanceof RadioNodeList) {
      const c = [...el].find((x) => x.checked);
      return c ? c.value : (el.value || '');
    }
    return el.type === 'checkbox' ? (el.checked ? el.value : '') : el.value.trim();
  };
  const many = (name) => [...form.querySelectorAll('input[name="' + name + '"]:checked')].map((x) => x.value);

  // ---------- Estimación (software) ----------
  function timeRange(score) {
    const days = score * DAYS_PER_POINT;
    const lo = Math.max(1, Math.round(days * 0.8));
    const hi = Math.max(lo + 1, Math.round(days * 1.3));
    if (hi <= 7) return lo + ' – ' + hi + ' días';
    return Math.max(1, Math.round(lo / 5)) + ' – ' + Math.max(2, Math.ceil(hi / 5)) + ' semanas';
  }
  function estimate() {
    const type = one('sw_tipo') || 'web';
    const screens = Number(range.value);
    const extras = many('sw_extra');
    const parts = [{ label: SW_TYPES[type].label, w: SW_TYPES[type].w }];
    const per = type === 'script' || type === 'bot' ? 0.35 : 0.6;
    parts.push({ label: screens + ' pantallas / secciones', w: (screens - 1) * per });
    extras.forEach((x) => parts.push({ label: SW_EXTRAS[x].label, w: SW_EXTRAS[x].w }));
    let score = parts.reduce((a, p) => a + p.w, 0);
    if (one('sw_base') === 'existente') score *= 0.8;
    const plan = PLANS.find((p) => score < p.max);
    return {
      plan: plan,
      time: timeRange(score),
      pct: Math.min(100, Math.max(8, (score / 14) * 100)),
      heaviest: parts.slice().sort((a, b) => b.w - a.w)[0].label
    };
  }

  // ---------- Modelo de la solicitud ----------
  function collect() {
    const s = one('servicio');
    const d = { servicio: s, detalles: [], estimacion: null };
    if (s === 'software') {
      const extras = many('sw_extra').map((x) => SW_EXTRAS[x].label);
      d.detalles.push(['Tipo', SW_TYPES[one('sw_tipo') || 'web'].label]);
      d.detalles.push(['Pantallas / secciones', range.value]);
      if (extras.length) d.detalles.push(['Extras', extras.join(', ')]);
      d.detalles.push(['Punto de partida', one('sw_base') === 'existente' ? 'Ya hay algo hecho' : 'Desde cero']);
      d.estimacion = estimate();
    } else if (s === 'contenido') {
      const sv = many('ct_servicio').map((x) => CT[x]);
      const pf = many('ct_plataforma');
      if (sv.length) d.detalles.push(['Servicios', sv.join(', ')]);
      d.detalles.push(['Frecuencia', one('ct_frecuencia')]);
      if (pf.length) d.detalles.push(['Plataformas', pf.join(', ')]);
    } else if (s === 'colab') {
      const pf = many('cb_plataforma');
      d.detalles.push(['Formato', CB[one('cb_formato')] || '']);
      if (one('cb_producto')) d.detalles.push(['Producto', one('cb_producto')]);
      if (pf.length) d.detalles.push(['Plataformas', pf.join(', ')]);
    } else if (s === 'consultoria') {
      d.detalles.push(['Tema', CS[one('cs_tema')] || '']);
      d.detalles.push(['Formato', one('cs_sesiones')]);
    }
    d.plazo = one('q_plazo');
    d.presupuesto = one('q_presupuesto');
    d.referencias = one('q_ref');
    d.descripcion = one('q_desc');
    d.nombre = one('q_nombre');
    d.empresa = one('q_empresa');
    d.email = one('q_email');
    d.canal = one('q_canal');
    d.pago = (NS.config.payments || {})[one('q_pago')] || '';
    return d;
  }

  function buildMessage() {
    const d = collect();
    const L = ['Hola Nayer, te envío una solicitud desde Nayer Studio.', '', 'Referencia: ' + ref, 'Servicio: ' + (SERVICE[d.servicio] || '—')];
    if (d.detalles.length) {
      L.push('', '— Detalles —');
      d.detalles.forEach(([k, v]) => L.push(k + ': ' + v));
    }
    if (d.estimacion) L.push('Estimación orientativa: Plan ' + d.estimacion.plan.name + ' · ' + d.estimacion.time);
    L.push('', '— Alcance —', 'Plazo: ' + d.plazo, 'Presupuesto: ' + d.presupuesto);
    if (d.referencias) L.push('Referencias: ' + d.referencias);
    L.push('Descripción:', d.descripcion || '—');
    L.push('', '— Contacto —', 'Nombre: ' + (d.nombre || '—'));
    if (d.empresa) L.push('Empresa / canal: ' + d.empresa);
    if (d.email) L.push('Correo: ' + d.email);
    if (d.pago) L.push('Forma de pago: ' + d.pago);
    L.push('Prefiere conversar por: ' + d.canal);
    return L.join('\n');
  }

  // ---------- Resumen lateral ----------
  function row(k, v) {
    const div = document.createElement('div');
    div.className = 'p-kv';
    div.innerHTML = '<dt></dt><dd></dd>';
    div.firstChild.textContent = k;
    div.lastChild.textContent = v;
    return div;
  }
  function renderSummary() {
    const d = collect();
    summary.innerHTML = '';
    summary.appendChild(row('Servicio', SERVICE[d.servicio] || 'Sin elegir'));
    d.detalles.forEach(([k, v]) => summary.appendChild(row(k, v)));
    if (current >= 2 || d.descripcion) {
      summary.appendChild(row('Plazo', d.plazo));
      summary.appendChild(row('Presupuesto', d.presupuesto));
    }
    if (d.nombre) summary.appendChild(row('Contacto', d.nombre + (d.empresa ? ' · ' + d.empresa : '')));
    if (current >= 3 && d.pago) summary.appendChild(row('Pago', d.pago));

    if (d.estimacion) {
      const e = d.estimacion;
      est.box.hidden = false;
      est.plan.textContent = 'Plan ' + e.plan.name;
      est.bar.style.width = e.pct.toFixed(0) + '%';
      est.time.textContent = e.time;
      est.weight.textContent = e.heaviest;
      est.hp.innerHTML = [1, 2, 3].map((n) => '<i' + (n <= e.plan.n ? '' : ' class="off"') + '></i>').join('');
    } else {
      est.box.hidden = true;
    }
    rangeOut.textContent = range.value;
    range.style.setProperty('--fill', ((range.value - 1) / 11 * 100).toFixed(1) + '%');
    descCount.textContent = desc.value.length + ' / ' + desc.maxLength;
  }

  // ---------- Validación ----------
  function setErr(name, msg) {
    const e = form.querySelector('[data-error="' + name + '"]');
    if (e) e.textContent = msg;
    const field = form.elements[name];
    if (field && !(field instanceof RadioNodeList) && field.setAttribute) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function validate(i) {
    let ok = true;
    let first = null;
    const fail = (name, msg, focusEl) => { setErr(name, msg); ok = false; first = first || focusEl; };
    if (i === 0) {
      if (!one('servicio')) fail('servicio', 'Elige un tipo de servicio para continuar.', form.querySelector('input[name="servicio"]'));
      else setErr('servicio', '');
    }
    if (i === 1) {
      const s = one('servicio');
      if (s === 'contenido' && !many('ct_servicio').length) fail('ct_servicio', 'Elige al menos un servicio.', form.querySelector('input[name="ct_servicio"]'));
      else setErr('ct_servicio', '');
      if (s === 'colab' && one('cb_producto').length < 2) fail('cb_producto', 'Indica el producto o la marca.', form.elements.cb_producto);
      else setErr('cb_producto', '');
    }
    if (i === 2) {
      if (one('q_desc').length < 20) fail('q_desc', 'Cuéntame un poco más (al menos 20 caracteres).', desc);
      else setErr('q_desc', '');
    }
    if (i === 3) {
      if (one('q_nombre').length < 2) fail('q_nombre', 'Escribe tu nombre.', form.elements.q_nombre);
      else setErr('q_nombre', '');
      const mail = one('q_email');
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) fail('q_email', 'Revisa el formato del correo.', form.elements.q_email);
      else setErr('q_email', '');
    }
    if (first && first.focus) first.focus();
    return ok;
  }

  // ---------- Navegación ----------
  let current = 0;
  let maxReached = 0;

  function showGroups() {
    const s = one('servicio');
    form.querySelectorAll('.q-group').forEach((g) => { g.hidden = g.dataset.for !== s; });
  }

  function go(i, focus) {
    current = Math.max(0, Math.min(steps.length - 1, i));
    maxReached = Math.max(maxReached, current);
    steps.forEach((s, k) => s.classList.toggle('is-active', k === current));
    stepper.forEach((li, k) => {
      li.classList.toggle('is-done', k < current);
      li.classList.toggle('is-current', k === current);
      const b = li.querySelector('button');
      b.disabled = k > maxReached;
      if (k === current) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    prevBtn.hidden = current === 0;
    nextBtn.hidden = current === steps.length - 1;
    nextBtn.innerHTML = (NEXT_LABEL[current] || 'Continuar') + ' ' + icon('arrow-right');
    nav.style.justifyContent = current === 0 ? 'flex-end' : 'space-between';
    if (current === 1) showGroups();
    if (current === steps.length - 1) preview.textContent = buildMessage();
    renderSummary();
    save();
    if (focus) {
      const head = steps[current].querySelector('h2');
      if (head) { head.setAttribute('tabindex', '-1'); head.focus({ preventScroll: true }); }
      const top = form.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  nextBtn.addEventListener('click', () => { if (validate(current)) go(current + 1, true); });
  prevBtn.addEventListener('click', () => go(current - 1, true));
  stepper.forEach((li, k) => li.querySelector('button').addEventListener('click', () => {
    if (k <= maxReached) {
      // al saltar hacia adelante, valida los pasos intermedios
      for (let j = current; j < k; j++) { if (!validate(j)) { go(j, true); return; } }
      go(k, true);
    }
  }));
  // Enter en un input avanza en vez de enviar
  form.addEventListener('submit', (e) => { e.preventDefault(); nextBtn.click(); });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
      e.preventDefault();
      if (!nextBtn.hidden) nextBtn.click();
    }
  });

  // Elegir un servicio avanza solo
  form.querySelectorAll('input[name="servicio"]').forEach((r) => r.addEventListener('change', () => {
    setErr('servicio', '');
    showGroups();
    setTimeout(() => go(1, true), 180);
  }));

  // ---------- Borrador ----------
  const DRAFT = 'ns-quote-draft';
  function save() {
    const data = { ref: ref, step: current, max: maxReached, fields: {} };
    [...form.elements].forEach((el) => {
      if (!el.name || el.type === 'button') return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (!data.fields[el.name]) data.fields[el.name] = [];
        if (el.checked) data.fields[el.name].push(el.value);
      } else {
        data.fields[el.name] = el.value;
      }
    });
    try { localStorage.setItem(DRAFT, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) { return null; }
  }
  function apply(fields) {
    Object.keys(fields).forEach((name) => {
      const v = fields[name];
      form.querySelectorAll('[name="' + name + '"]').forEach((el) => {
        if (el.type === 'radio' || el.type === 'checkbox') el.checked = Array.isArray(v) && v.includes(el.value);
        else el.value = v;
      });
    });
  }
  let saveTimer = 0;
  form.addEventListener('input', () => { renderSummary(); clearTimeout(saveTimer); saveTimer = setTimeout(save, 250); });
  form.addEventListener('change', () => { renderSummary(); save(); });

  // ---------- Arranque ----------
  const draft = load();
  const ref = (draft && draft.ref) || NS.refId();
  refEl.textContent = ref;
  let startStep = 0;
  if (draft && draft.fields) {
    apply(draft.fields);
    startStep = Math.min(draft.step || 0, 3);
    maxReached = draft.max || 0;
  }

  const params = new URLSearchParams(location.search);
  const ps = params.get('servicio');
  if (ps && SERVICE[ps]) {
    const r = form.querySelector('input[name="servicio"][value="' + ps + '"]');
    if (r) r.checked = true;
    const nivel = params.get('nivel');
    if (ps === 'software' && nivel) {
      // cada plan precarga una configuración típica
      const presets = {
        1: { tipo: 'script', pantallas: 1, extras: [] },
        2: { tipo: 'web', pantallas: 5, extras: ['db'] },
        3: { tipo: 'android', pantallas: 8, extras: ['multi', 'api', 'login'] }
      };
      const p = presets[nivel];
      if (p) {
        form.querySelectorAll('input[name="sw_tipo"]').forEach((x) => { x.checked = x.value === p.tipo; });
        range.value = p.pantallas;
        form.querySelectorAll('input[name="sw_extra"]').forEach((x) => { x.checked = p.extras.includes(x.value); });
      }
    }
    const formato = params.get('formato');
    if (ps === 'colab' && CB[formato]) {
      form.querySelectorAll('input[name="cb_formato"]').forEach((x) => { x.checked = x.value === formato; });
    }
    startStep = Math.max(startStep, 1);
    maxReached = Math.max(maxReached, 1);
  }

  showGroups();
  go(startStep, false);
  if (draft && draft.fields && (draft.fields.q_desc || draft.fields.q_nombre)) {
    setTimeout(() => toast('Recuperé tu solicitud en curso', 'save'), 400);
  }

  // ---------- Acciones finales ----------
  function readyToSend() {
    for (let j = 0; j < steps.length - 1; j++) {
      if (!validate(j)) { go(j, true); return false; }
    }
    return true;
  }
  document.getElementById('qSendWa').addEventListener('click', () => {
    if (!readyToSend()) return;
    NS.sendWhatsApp(buildMessage());
    toast('Abriendo WhatsApp con tu solicitud ' + ref, 'whatsapp');
  });
  document.getElementById('qSendTg').addEventListener('click', () => {
    if (!readyToSend()) return;
    NS.sendTelegram(buildMessage());
  });
  document.getElementById('qCopy').addEventListener('click', () => {
    window.copyText(buildMessage()).then(() => toast('Solicitud copiada', 'copy'));
  });
  document.getElementById('qDownload').addEventListener('click', () => {
    NS.download(ref + '.txt', buildMessage());
    toast('Resumen descargado', 'download');
  });
  document.getElementById('qReset').addEventListener('click', () => {
    if (!window.confirm('¿Borrar la solicitud y empezar de nuevo?')) return;
    try { localStorage.removeItem(DRAFT); } catch (e) { /* sin almacenamiento */ }
    window.location.href = window.location.pathname;
  });
})();
