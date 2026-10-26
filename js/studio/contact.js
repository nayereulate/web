// =========================================================================
// NAYER STUDIO — Mensaje rápido (studio/contacto.html)
// Valida nombre y mensaje y los abre en WhatsApp o Telegram.
// =========================================================================
(function () {
  const form = document.getElementById('quickForm');
  if (!form || !window.NS) return;

  const name = form.elements.c_nombre;
  const topic = form.elements.c_tema;
  const msg = form.elements.c_mensaje;

  function setErr(el, key, text) {
    const e = form.querySelector('[data-error="' + key + '"]');
    if (e) e.textContent = text;
    el.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  function validate() {
    let first = null;
    if (name.value.trim().length < 2) { setErr(name, 'c_nombre', 'Escribe tu nombre.'); first = first || name; }
    else setErr(name, 'c_nombre', '');
    if (msg.value.trim().length < 10) { setErr(msg, 'c_mensaje', 'Escribe tu consulta (al menos 10 caracteres).'); first = first || msg; }
    else setErr(msg, 'c_mensaje', '');
    if (first) first.focus();
    return !first;
  }

  function build() {
    return 'Hola Nayer, te escribo desde Nayer Studio.\n\n' +
      'Nombre: ' + name.value.trim() + '\n' +
      'Tema: ' + topic.value + '\n\n' +
      msg.value.trim();
  }

  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, e.target.name, '');
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  form.querySelectorAll('[data-send]').forEach((btn) => btn.addEventListener('click', () => {
    if (!validate()) return;
    if (btn.dataset.send === 'wa') window.NS.sendWhatsApp(build());
    else window.NS.sendTelegram(build());
  }));

  // ?tema=... preselecciona el tema
  const t = new URLSearchParams(location.search).get('tema');
  if (t) [...topic.options].forEach((o) => { if (o.text.toLowerCase().startsWith(t.toLowerCase())) topic.value = o.value; });
})();
