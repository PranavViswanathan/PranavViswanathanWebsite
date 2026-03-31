(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 640;

  let W, H, particles;
  const mouse = { x: -9999, y: -9999 };

  const COUNT_DESKTOP = 75;
  const COUNT_MOBILE  = 30;
  const CONNECT_DIST  = 130;
  const MOUSE_RADIUS  = 160;
  const MOUSE_FORCE   = 0.25;
  const MAX_SPEED     = 1.2;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.2 + 0.4,
      a:  Math.random() * 0.35 + 0.08,
    };
  }

  function init() {
    resize();
    const count = isMobile() ? COUNT_MOBILE : COUNT_DESKTOP;
    particles = Array.from({ length: count }, makeParticle);
  }

  function update() {
    for (const p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0) {
        const d = Math.sqrt(d2);
        const f = (MOUSE_RADIUS - d) / MOUSE_RADIUS * MOUSE_FORCE;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }

      p.vx *= 0.97;
      p.vy *= 0.97;

      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > MAX_SPEED) { p.vx = p.vx / spd * MAX_SPEED; p.vy = p.vy / spd * MAX_SPEED; }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      else if (p.y > H) p.y = 0;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.globalAlpha = (1 - d / CONNECT_DIST) * 0.1;
          ctx.strokeStyle = '#f0ede8';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,237,232,${p.a})`;
      ctx.fill();
    }
  }

  let raf;
  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pause when tab is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });

  init();
  loop();
})();
