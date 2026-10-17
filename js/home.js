// =========================================================================
// NAYER | EULATE — Homepage (index.html)
// Typing tagline, pixel skyline, grid beams, terminal window, parallax, share
// =========================================================================
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const fxOff = () => root.classList.contains('fx-off');

  // ===== Typing effect =====
  const phrases = [
    'Estudiante de Ingenieria Informatica',
    'Creador de contenido 100% friki',
    'Creo herramientas por diversion',
    'Software y contenido a medida',
    'Bienvenido a mi base secreta'
  ];
  const typedEl = document.getElementById('typed');
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
    if (reduced) typedEl.textContent = phrases[0];
    else typeLoop();
  }

  // ===== Pixel skyline (seeded, so it looks the same on every visit) =====
  const skyline = document.getElementById('skyline');
  if (skyline) {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const W = 1600, H = 200;
    let far = '', near = '', wins = '', extras = '';

    // far layer: low, wide blocks
    for (let x = 0; x < W;) {
      const bw = 50 + Math.floor(rand() * 90);
      const bh = 40 + Math.floor(rand() * 70);
      far += `<rect class="b-far" x="${x}" y="${H - bh}" width="${bw}" height="${bh}"/>`;
      x += bw;
    }
    // near layer: towers with lit windows, lower near the centre so the hero stays clean
    for (let x = 0; x < W;) {
      const bw = 34 + Math.floor(rand() * 60);
      const centre = Math.abs(x + bw / 2 - W / 2) / (W / 2); // 0 at centre, 1 at edges
      const bh = Math.floor(30 + rand() * 60 + centre * 110 * rand() + centre * 30);
      const y = H - bh;
      near += `<rect class="b" x="${x}" y="${y}" width="${bw}" height="${bh}"/>`;
      near += `<rect class="edge" x="${x}" y="${y}" width="${bw}" height="2"/>`;
      for (let wy = y + 8; wy < H - 6; wy += 10) {
        for (let wx = x + 5; wx < x + bw - 6; wx += 9) {
          const r = rand();
          if (r < 0.2) {
            const cls = 'w' + (r < 0.05 ? ' c' : '') + (r < 0.035 ? ' w-blink' : '');
            const delay = cls.includes('blink') ? ` style="animation-delay:${(rand() * 4).toFixed(1)}s"` : '';
            wins += `<rect class="${cls}" x="${wx}" y="${wy}" width="4" height="4"${delay}/>`;
          }
        }
      }
      if (bh > 120 && rand() < 0.6) {
        const ax = x + Math.floor(bw / 2);
        extras += `<rect class="b" x="${ax - 1}" y="${y - 18}" width="2" height="18"/><rect class="antenna" x="${ax - 2}" y="${y - 22}" width="4" height="4"/>`;
      }
      x += bw + Math.floor(rand() * 6);
    }
    skyline.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${far}${near}${extras}${wins}</svg>`;
  }

  // ===== Light beams along the grid columns =====
  const floor = document.getElementById('gridFloor');
  if (floor && !reduced) {
    const COL = 56; // must match background-size in base.css .grid-floor
    const cols = Math.floor(window.innerWidth / COL);
    const colors = ['var(--cyan)', 'var(--pink)', 'var(--yellow)'];
    const used = new Set();
    for (let i = 0; i < Math.min(7, cols); i++) {
      let c;
      do { c = 1 + Math.floor(Math.random() * (cols - 1)); } while (used.has(c) && used.size < cols - 1);
      used.add(c);
      const b = document.createElement('i');
      b.className = 'beam';
      b.style.left = c * COL + 'px';
      b.style.setProperty('--beam', colors[i % colors.length]);
      b.style.setProperty('--dur', (2.6 + Math.random() * 2.4).toFixed(2) + 's');
      b.style.setProperty('--delay', (Math.random() * 4).toFixed(2) + 's');
      floor.appendChild(b);
    }
  }

  // ===== Terminal window: looping fake session =====
  const term = document.getElementById('termBody');
  if (term) {
    const SCRIPT = [
      ['$ ', 'git push origin main'],
      ['', '<span class="p">✓</span> 3 commits enviados'],
      ['$ ', 'nayer build --release'],
      ['', '<span class="m">▸ compilando NayerVR...</span>'],
      ['', '<span class="p">✓</span> NayerVR-Setup.exe listo'],
      ['$ ', 'deploy web'],
      ['', '<span class="p">✓</span> nayereulate.github.io/web']
    ];
    const prompt = (txt) => '<span class="p">' + txt + '</span>';
    let html = '';

    const showAll = () => {
      term.innerHTML = SCRIPT.map((l) => (l[0] ? prompt(l[0]) : '') + l[1]).join('\n');
    };

    if (reduced) {
      showAll();
    } else {
      let line = 0, ch = 0;
      const tick = () => {
        if (fxOff()) { showAll(); setTimeout(tick, 1500); return; }
        const [pre, txt] = SCRIPT[line];
        if (pre) {
          // typed command
          ch++;
          term.innerHTML = html + prompt(pre) + txt.slice(0, ch) + '<span class="cur"></span>';
          if (ch < txt.length) { setTimeout(tick, 55 + Math.random() * 60); return; }
          html += prompt(pre) + txt + '\n';
        } else {
          // instant output line
          html += txt + '\n';
          term.innerHTML = html + '<span class="cur"></span>';
        }
        ch = 0;
        line++;
        if (line >= SCRIPT.length) {
          line = 0;
          setTimeout(() => { html = ''; tick(); }, 3200);
          return;
        }
        setTimeout(tick, pre ? 380 : 520);
      };
      tick();
    }
  }

  // ===== Parallax for the floating windows =====
  const layer = document.getElementById('floatLayer');
  if (layer && !reduced) {
    let raf = 0, nx = 0, ny = 0;
    window.addEventListener('pointermove', (e) => {
      nx = (e.clientX / window.innerWidth - 0.5) * 2;
      ny = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        layer.style.setProperty('--px', nx.toFixed(3));
        layer.style.setProperty('--py', ny.toFixed(3));
        raf = 0;
      });
    }, { passive: true });
  }

  // ===== Share button =====
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn && window.sharePage) shareBtn.addEventListener('click', window.sharePage);
})();
