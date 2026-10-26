// =========================================================================
// NAYER STUDIO — Configuración central de la experiencia de clientes
// Cambia aquí tus datos de contacto y se actualizan en todo /studio.
// =========================================================================
window.NS_CONFIG = {
  // Número en formato internacional, sin "+" ni espacios
  whatsapp: '59168518643',
  // Telegram abre el chat por número (requiere que tu privacidad permita que te encuentren por teléfono).
  // Si tienes usuario, cámbialo por 'https://t.me/TU_USUARIO'
  telegram: 'https://t.me/+59168518643',
  phoneLabel: '+591 685 18643',

  // Perfil de Workana: pago protegido para clientes que prefieren pagar por la plataforma.
  // En nayer.dev también funciona el atajo nayer.dev/workana (ver vercel.json)
  workana: 'https://www.workana.com/freelancer/263f3e9a2ccebb62771bc710030bbb84',

  // Rangos de presupuesto que se ofrecen en el cotizador (opcionales para el cliente)
  budgets: ['Prefiero conversarlo', 'Menos de USD 150', 'USD 150 – 400', 'USD 400 – 1.000', 'Más de USD 1.000'],

  // Formas de pago que se ofrecen en el cotizador
  payments: {
    local: 'Transferencia o QR (Bolivia)',
    workana: 'Pago protegido vía Workana',
    later: 'Lo definimos en la propuesta'
  }
};

// ----- Helpers de contacto compartidos por cotizar.html y contacto.html -----
window.NS = (function () {
  const cfg = window.NS_CONFIG;

  function waLink(text) {
    return 'https://wa.me/' + cfg.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function openWindow(url) {
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // popup bloqueado
  }

  // WhatsApp acepta el texto en la URL
  function sendWhatsApp(text) { openWindow(waLink(text)); }

  // Telegram no permite precargar texto a un contacto: se copia y se abre el chat
  function sendTelegram(text) {
    const done = () => {
      if (window.toast) window.toast('Mensaje copiado: pégalo en el chat de Telegram', 'copy');
      openWindow(cfg.telegram);
    };
    if (window.copyText) window.copyText(text).then(done);
    else done();
  }

  // Referencia corta para identificar cada solicitud: NS-261025-K3F9
  function refId() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'NS-' + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + rand;
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  return { waLink, sendWhatsApp, sendTelegram, refId, download, config: cfg };
})();
