// ===== Interactive constellation starfield + shooting stars (shared by every page) =====
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  let particles = [];
  let meteors = [];
  let w = 0, h = 0;
  let running = false;
  let nextMeteor = 0;
  const mouse = { x: -9999, y: -9999 };
  const LINK_DIST = 130;
  const MOUSE_DIST = 160;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(110, Math.floor((w * h) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      twinkle: Math.random() * Math.PI * 2
    }));
    if (!running) drawStatic();
  }

  function spawnMeteor(now) {
    const fromLeft = Math.random() < 0.5;
    meteors.push({
      x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
      y: Math.random() * h * 0.35,
      vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 4),
      vy: 3 + Math.random() * 2,
      life: 1
    });
    nextMeteor = now + 2500 + Math.random() * 5000;
  }

  function drawStars() {
    for (const p of particles) {
      const alpha = 0.4 + Math.sin(p.twinkle) * 0.4;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    drawStars();
  }

  function step(now) {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.twinkle += 0.02;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;

      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < MOUSE_DIST * MOUSE_DIST) {
        const dist = Math.sqrt(distSq) || 1;
        const pull = (1 - dist / MOUSE_DIST) * 0.02;
        p.x += (dx / dist) * pull * 10;
        p.y += (dy / dist) * pull * 10;
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < LINK_DIST * LINK_DIST) {
          const dist = Math.sqrt(distSq);
          ctx.strokeStyle = `rgba(0,240,255,${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    drawStars();

    // Shooting stars
    if (now > nextMeteor) spawnMeteor(now);
    meteors = meteors.filter((m) => m.life > 0);
    for (const m of meteors) {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.012;
      const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
      tail.addColorStop(0, `rgba(255,255,255,${m.life})`);
      tail.addColorStop(0.3, `rgba(0,240,255,${m.life * 0.6})`);
      tail.addColorStop(1, 'rgba(255,43,214,0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${m.life})`;
      ctx.fillRect(m.x - 1, m.y - 1, 3, 3);
    }

    requestAnimationFrame(step);
  }

  function shouldRun() {
    return !reduced && !document.hidden && !root.classList.contains('fx-off');
  }
  function sync() {
    const want = shouldRun();
    if (want && !running) {
      running = true;
      nextMeteor = performance.now() + 1500;
      requestAnimationFrame(step);
    } else if (!want && running) {
      running = false;
      meteors = [];
      drawStatic();
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('fxchange', sync);

  resize();
  sync();
})();
