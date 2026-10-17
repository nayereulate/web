// =========================================================================
// NAYER STUDIO — Brief de contacto (contacto.html)
// Valida el formulario, arma un mensaje ordenado y lo abre en WhatsApp.
// No se envía nada a ningún servidor.
// Acepta ?servicio=software|contenido|colab|otro, ?nivel=1|2|3 y ?resumen=texto
// (lo envía el estimador de software.html) para precargar.
// Guarda un borrador en localStorage para no perder lo escrito.
// =========================================================================
(function () {
  const WHATSAPP = '59168518643';
  const LABELS = { software: 'Software', contenido: 'Contenido', colab: 'Colaboración / marca', otro: 'Otro' };
  const LEVELS = { 1: 'Nivel 1 · Quick Quest', 2: 'Nivel 2 · Main Quest', 3: 'Nivel 3 · Raid' };

  const form = document.getElementById('briefForm');
  if (!form) return;

  const nameEl = form.elements.nombre;
  const descEl = form.elements.descripcion;
  const nivelEl = form.elements.nivel;
  const plazoEl = form.elements.plazo;
  const refEl = form.elements.referencias;

  const DRAFT_KEY = 'ne-brief-draft';
  const counter = document.getElementById('desc-count');

  // ----- Borrador guardado (se aplica primero; la URL tiene prioridad) -----
  function readDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { return null; }
  }
  function saveDraft() {
    const data = {
      nombre: nameEl.value, descripcion: descEl.value, nivel: nivelEl.value,
      plazo: plazoEl.value, referencias: refEl.value, servicio: selectedService()
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* sin almacenamiento */ }
  }
  const draft = readDraft();
  if (draft) {
    nameEl.value = draft.nombre || '';
    descEl.value = draft.descripcion || '';
    nivelEl.value = draft.nivel || '';
    plazoEl.value = draft.plazo || '';
    refEl.value = draft.referencias || '';
    if (draft.servicio) {
      const r = form.querySelector('input[name="servicio"][value="' + draft.servicio + '"]');
      if (r) r.checked = true;
    }
  }

  // ----- Precarga desde la URL -----
  const params = new URLSearchParams(window.location.search);
  const presetService = params.get('servicio');
  if (presetService && LABELS[presetService]) {
    const radio = form.querySelector('input[name="servicio"][value="' + presetService + '"]');
    if (radio) radio.checked = true;
  }
  const presetLevel = params.get('nivel');
  if (presetLevel && LEVELS[presetLevel]) nivelEl.value = presetLevel;
  const resumen = (params.get('resumen') || '').slice(0, 600);
  if (resumen && !descEl.value.includes(resumen)) {
    descEl.value = resumen + '\n\n' + descEl.value;
  }

  function updateCount() {
    if (!counter) return;
    const left = descEl.maxLength - descEl.value.length;
    counter.textContent = descEl.value.length + ' / ' + descEl.maxLength;
    counter.classList.toggle('is-low', left < 100);
  }
  updateCount();
  if (draft && (draft.nombre || draft.descripcion) && window.toast) {
    setTimeout(() => window.toast('Recuperé tu borrador', 'save'), 400);
  }

  function setError(input, errId, msg) {
    const err = document.getElementById(errId);
    if (err) err.textContent = msg;
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function selectedService() {
    const checked = form.querySelector('input[name="servicio"]:checked');
    return checked ? checked.value : '';
  }

  function validate(moveFocus) {
    let firstInvalid = null;

    const name = nameEl.value.trim();
    if (name.length < 2) {
      setError(nameEl, 'err-name', 'Escribe tu nombre para saber cómo llamarte.');
      firstInvalid = firstInvalid || nameEl;
    } else {
      setError(nameEl, 'err-name', '');
    }

    if (!selectedService()) {
      setError(null, 'err-service', 'Elige el tipo de proyecto.');
      firstInvalid = firstInvalid || form.querySelector('input[name="servicio"]');
    } else {
      setError(null, 'err-service', '');
    }

    const desc = descEl.value.trim();
    if (desc.length < 20) {
      setError(descEl, 'err-desc', 'Cuéntame un poco más (al menos 20 caracteres).');
      firstInvalid = firstInvalid || descEl;
    } else {
      setError(descEl, 'err-desc', '');
    }

    if (firstInvalid && moveFocus) firstInvalid.focus();
    return !firstInvalid;
  }

  function buildMessage() {
    const lines = [
      '¡Hola Nayer! Te escribo desde tu web.',
      '',
      '*Nombre:* ' + nameEl.value.trim(),
      '*Servicio:* ' + LABELS[selectedService()]
    ];
    if (nivelEl.value) lines.push('*Tamaño:* ' + LEVELS[nivelEl.value]);
    if (plazoEl.value) lines.push('*Plazo:* ' + plazoEl.value);
    if (refEl.value.trim()) lines.push('*Referencias:* ' + refEl.value.trim());
    lines.push('', '*Idea:*', descEl.value.trim());
    return lines.join('\n');
  }

  // Limpia el error de un campo apenas el usuario lo corrige
  let saveTimer = 0;
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validate(false);
    if (e.target === descEl) updateCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 300);
  });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'servicio') setError(null, 'err-service', '');
    saveDraft();
  });

  const copyBtn = document.getElementById('copyBrief');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!validate(true)) return;
      window.copyText(buildMessage()).then(() => window.toast && window.toast('Mensaje copiado: pégalo donde prefieras', 'copy'));
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(true)) return;
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(buildMessage());
    // sin 'noopener' en features: con él window.open siempre devuelve null
    clearDraft();
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // popup bloqueado: abrir en la misma pestaña
  });
})();
