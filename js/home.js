// ===== Typing effect =====
const phrases = [
  'Founder de mi propia startup',
  'Streamer 100% friki',
  'Dev de dia y de noche',
  'Bienvenido a mi base secreta'
];
const typedEl = document.getElementById('typed');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}

if (typedEl) {
  if (reducedMotion) {
    typedEl.textContent = phrases[0];
  } else {
    typeLoop();
  }
}

// ===== Copy link button =====
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      const tmp = document.createElement('textarea');
      tmp.value = window.location.href;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
    shareBtn.textContent = '✅ ENLACE COPIADO';
    shareBtn.classList.add('copied');
    setTimeout(() => {
      shareBtn.innerHTML = '<span class="icon">📋</span> COPIAR ENLACE';
      shareBtn.classList.remove('copied');
    }, 2000);
  });
}
