(function () {
  'use strict';

  const CAT_COLORS = {
    'Languages':           '#7b6cff',
    'ML / AI':             '#c8f55a',
    'Backend & Infra':     '#ff8c60',
    'Frontend':            '#60c8ff',
    'Distributed Systems': '#d060ff',
  };

  let canvas, ctx, dpr;
  let W = 0, H = 0;
  let nodes = [], edges = [];
  let alpha = 1;
  const ALPHA_DECAY = 0.016;
  const ALPHA_MIN = 0.001;
  let animId = null;
  let graphActive = true;
  let initialized = false;
  const mouse = { x: -9999, y: -9999 };
  let hoveredNode = null;
  let draggedNode = null;
  let dragOffset = { x: 0, y: 0 };

  /* ── Tech-to-skill matching ── */
  function matches(tech, skill) {
    const t = tech.toLowerCase().trim();
    const s = skill.toLowerCase().trim();
    if (t === s) return true;
    if (t.includes(s) || s.includes(t)) return true;
    const tw = t.split(/[\s\/\-,.()]+/).filter(w => w.length > 3);
    const sw = s.split(/[\s\/\-,.()]+/).filter(w => w.length > 3);
    return tw.some(a => sw.some(b => a === b));
  }

  /* ── Build graph data from JSON ── */
  function build(categories, projects) {
    nodes = [];
    edges = [];
    const cx = W / 2, cy = H / 2;
    const totalSkills = categories.reduce((s, c) => s + c.skills.length, 0);
    let si = 0;

    categories.forEach(cat => {
      cat.skills.forEach(skill => {
        const angle = (si / totalSkills) * Math.PI * 2 - Math.PI / 2;
        const r = Math.min(W, H) * 0.37 + (Math.random() - 0.5) * 24;
        nodes.push({
          id: si++,
          type: 'skill',
          label: skill,
          category: cat.label,
          color: CAT_COLORS[cat.label] || '#888',
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          vx: 0, vy: 0, r: 5,
        });
      });
    });

    const numSkills = nodes.length;

    projects.forEach((proj, pi) => {
      const idx = nodes.length;
      const angle = (pi / projects.length) * Math.PI * 2;
      nodes.push({
        id: idx,
        type: 'project',
        label: proj.title,
        github: proj.github || null,
        x: cx + Math.cos(angle) * 55 + (Math.random() - 0.5) * 30,
        y: cy + Math.sin(angle) * 55 + (Math.random() - 0.5) * 30,
        vx: 0, vy: 0, r: 9,
      });

      const seen = new Set();
      proj.tech.forEach(tech => {
        for (let i = 0; i < numSkills; i++) {
          const key = `${i}-${idx}`;
          if (!seen.has(key) && matches(tech, nodes[i].label)) {
            seen.add(key);
            edges.push({ s: i, t: idx });
          }
        }
      });
    });
  }

  /* ── Force-directed simulation ── */
  function tick() {
    const a = alpha;

    // Repulsion between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i], nj = nodes[j];
        const dx = nj.x - ni.x, dy = nj.y - ni.y;
        const d2 = Math.max(dx * dx + dy * dy, 1);
        const d = Math.sqrt(d2);
        const f = (-780 / d2) * a;
        ni.vx += (dx / d) * f; ni.vy += (dy / d) * f;
        nj.vx -= (dx / d) * f; nj.vy -= (dy / d) * f;
      }
    }

    // Spring attraction along edges
    const REST = 88;
    edges.forEach(({ s, t }) => {
      const ns = nodes[s], nt = nodes[t];
      const dx = nt.x - ns.x, dy = nt.y - ns.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = ((d - REST) / d) * 0.11 * a;
      ns.vx += dx * f; ns.vy += dy * f;
      nt.vx -= dx * f; nt.vy -= dy * f;
    });

    // Weak centering gravity
    nodes.forEach(n => {
      n.vx += (W / 2 - n.x) * 0.006 * a;
      n.vy += (H / 2 - n.y) * 0.006 * a;
    });

    // Hover push: repel nearby nodes away from hovered project
    if (hoveredNode && hoveredNode.type === 'project') {
      const PUSH_RADIUS = 90, PUSH_STR = 320;
      nodes.forEach(n => {
        if (n === hoveredNode) return;
        const dx = n.x - hoveredNode.x, dy = n.y - hoveredNode.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < PUSH_RADIUS) {
          const f = PUSH_STR * (1 - d / PUSH_RADIUS) / d;
          n.vx += dx * f * 0.016;
          n.vy += dy * f * 0.016;
        }
      });
    }

    // Integrate with damping + boundary clamp
    nodes.forEach(n => {
      if (n === draggedNode) {
        n.x = mouse.x - dragOffset.x;
        n.y = mouse.y - dragOffset.y;
        n.x = Math.max(n.r + 6, Math.min(W - n.r - 6, n.x));
        n.y = Math.max(n.r + 6, Math.min(H - n.r - 6, n.y));
        n.vx = 0; n.vy = 0;
        return;
      }
      n.vx *= 0.78; n.vy *= 0.78;
      n.x = Math.max(n.r + 6, Math.min(W - n.r - 6, n.x + n.vx));
      n.y = Math.max(n.r + 6, Math.min(H - n.r - 6, n.y + n.vy));
    });
  }

  /* ── Hover detection ── */
  function updateHover() {
    if (draggedNode) return;
    let best = null, bestD = Infinity;
    nodes.forEach(n => {
      const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      if (d < n.r + 10 && d < bestD) { bestD = d; best = n; }
    });
    hoveredNode = best;
    canvas.style.cursor = best ? 'pointer' : 'default';
    // Keep simulation alive while hovering a project so push force stays active
    if (best && best.type === 'project') alpha = Math.max(alpha, 0.15);
  }

  function neighborSet(node) {
    const s = new Set([node.id]);
    edges.forEach(e => {
      if (e.s === node.id) s.add(e.t);
      if (e.t === node.id) s.add(e.s);
    });
    return s;
  }

  /* ── Render ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const nb = hoveredNode ? neighborSet(hoveredNode) : null;

    // Edges
    edges.forEach(({ s, t }) => {
      const hi = nb && nb.has(s) && nb.has(t);
      ctx.beginPath();
      ctx.moveTo(nodes[s].x, nodes[s].y);
      ctx.lineTo(nodes[t].x, nodes[t].y);
      ctx.strokeStyle = hi
        ? 'rgba(200,245,90,0.65)'
        : nb ? 'rgba(240,237,232,0.04)' : 'rgba(240,237,232,0.1)';
      ctx.lineWidth = hi ? 1.5 : 0.5;
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      const dim = nb && !nb.has(n.id);
      ctx.globalAlpha = dim ? 0.1 : 1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);

      if (n.type === 'project') {
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        const isConn = nb && nb.has(n.id) && n !== hoveredNode;
        ctx.strokeStyle = isConn
          ? 'rgba(200,245,90,0.9)'
          : n === hoveredNode ? '#c8f55a' : 'rgba(240,237,232,0.75)';
        ctx.lineWidth = n === hoveredNode ? 2.5 : 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = n.color + '28';
        ctx.fill();
        ctx.strokeStyle = n.color;
        ctx.lineWidth = n === hoveredNode ? 2 : 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    });

    // Labels
    ctx.textAlign = 'center';
    nodes.forEach(n => {
      if (nb && !nb.has(n.id)) return;
      const isHov = n === hoveredNode;
      const isCon = nb && nb.has(n.id) && n !== hoveredNode;

      if (n.type === 'project' && isHov) {
        ctx.font = `600 12px 'Plus Jakarta Sans',sans-serif`;
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#c8f55a';
        ctx.fillText(n.label, n.x, n.y - n.r - 5);
      } else if (n.type !== 'project' && (isHov || isCon)) {
        ctx.font = `${isHov ? 600 : 400} 10px 'Plus Jakarta Sans',sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillStyle = n.color;
        ctx.fillText(n.label, n.x, n.y + n.r + 4);
      }
    });

    // Legend
    drawLegend();
  }

  function drawLegend() {
    const lx = 16, baseY = 16;
    let oy = 0;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `400 10px 'Plus Jakarta Sans',sans-serif`;

    Object.entries(CAT_COLORS).forEach(([cat, color]) => {
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(lx + 4, baseY + oy + 6, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color + '35';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(240,237,232,0.5)';
      ctx.fillText(cat, lx + 13, baseY + oy + 6);
      ctx.globalAlpha = 1;
      oy += 17;
    });

    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(lx + 4, baseY + oy + 7, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,237,232,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(240,237,232,0.5)';
    ctx.fillText('Project', lx + 13, baseY + oy + 7);
    ctx.globalAlpha = 1;
    oy += 22;

    ctx.font = `400 9px 'Plus Jakarta Sans',sans-serif`;
    ctx.fillStyle = 'rgba(240,237,232,0.22)';
    ctx.fillText('hover nodes to explore', lx, baseY + oy + 4);
  }

  /* ── Animation loop ── */
  function loop() {
    if (alpha > ALPHA_MIN) {
      tick();
      alpha *= (1 - ALPHA_DECAY);
    }
    updateHover();
    draw();
    animId = requestAnimationFrame(loop);
  }

  /* ── Canvas sizing ── */
  function resize(categories, projects) {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.round(rect.width);
    H = Math.round(Math.min(W * 0.62, 500));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    if (categories) build(categories, projects);
  }

  /* ── Public init ── */
  window.initSkillGraph = function (categories, projects) {
    canvas = document.createElement('canvas');
    canvas.id = 'skills-graph-canvas';
    canvas.style.cssText = 'display:block;width:100%;border-radius:12px;border:0.5px solid rgba(240,237,232,0.1);';
    ctx = canvas.getContext('2d');

    const inner = document.querySelector('#skills .section-inner');
    inner.appendChild(canvas);

    const lbl = inner.querySelector('.section-label');
    lbl.classList.add('skills-graph-toggle', 'graph-active');
    const hint = document.createElement('span');
    hint.className = 'skills-graph-hint';
    hint.textContent = '↙ list';
    lbl.appendChild(hint);

    hint.classList.add('graph-hint-pulse');
    setTimeout(() => hint.classList.remove('graph-hint-pulse'), 3000);

    const catEl = document.getElementById('skills-categories');

    const bottomHint = document.createElement('div');
    bottomHint.className = 'skills-graph-bottom-hint';
    bottomHint.textContent = '→ view as interactive graph';
    inner.appendChild(bottomHint);
    bottomHint.addEventListener('click', () => lbl.click());

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      graphActive = false;
      lbl.classList.remove('graph-active');
      hint.textContent = '↗ graph';
      catEl.style.display = '';
      canvas.style.display = 'none';
      bottomHint.style.display = '';
    } else {
      catEl.style.display = 'none';
      canvas.style.display = 'block';
      bottomHint.style.display = 'none';
    }

    // Initialize graph immediately
    resize(categories, projects);
    initialized = true;
    alpha = 1;

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (draggedNode) { alpha = Math.max(alpha, 0.3); }
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = -9999; mouse.y = -9999; hoveredNode = null;
      draggedNode = null;
    });
    canvas.addEventListener('mousedown', e => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let best = null, bestD = Infinity;
      nodes.forEach(n => {
        const d = Math.hypot(mx - n.x, my - n.y);
        if (d < n.r + 10 && d < bestD) { bestD = d; best = n; }
      });
      if (best) {
        draggedNode = best;
        dragOffset.x = mx - best.x;
        dragOffset.y = my - best.y;
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });
    window.addEventListener('mouseup', () => {
      if (draggedNode) {
        draggedNode = null;
        canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        alpha = Math.max(alpha, 0.4);
      }
    });
    canvas.addEventListener('click', e => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      nodes.forEach(n => {
        if (n.type === 'project' && n.github && Math.hypot(mx - n.x, my - n.y) < n.r + 10) {
          window.open(n.github, '_blank', 'noopener');
        }
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize(categories, projects);
        alpha = 1;
      }, 150);
    });

    loop();

    lbl.addEventListener('click', () => {
      graphActive = !graphActive;
      lbl.classList.toggle('graph-active', graphActive);
      hint.textContent = graphActive ? '↙ list' : '↗ graph';
      bottomHint.style.display = graphActive ? 'none' : '';

      if (graphActive) {
        catEl.style.display = 'none';
        canvas.style.display = 'block';
        alpha = 1;
        if (!animId) loop();
      } else {
        catEl.style.display = '';
        canvas.style.display = 'none';
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    });
  };
})();
