(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let isHovering = false;
  let isClicking = false;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      rx = mx;
      ry = my;
    }
  });

  document.addEventListener('mouseleave', () => {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    visible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mousedown', () => {
    isClicking = true;
    dot.classList.add('cursor-click');
    ring.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    isClicking = false;
    dot.classList.remove('cursor-click');
    ring.classList.remove('cursor-click');
  });

  const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, [tabindex]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = true;
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = false;
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    }
  });

  const LERP = 0.12;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    rx = lerp(rx, mx, LERP);
    ry = lerp(ry, my, LERP);

    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
