/* ── Data loading ── */
async function load(path) {
  const res = await fetch(path);
  return res.json();
}

async function init() {
  const [about, projects, skills, contact] = await Promise.all([
    load('data/about.json'),
    load('data/projects.json'),
    load('data/skills.json'),
    load('data/contact.json'),
  ]);
  window.portfolioData = { about, projects, skills, contact };
  renderAbout(about);
  renderProjects(projects.projects.filter(p => p.display));
  renderSkills(skills.categories);
  initSkillGraph(skills.categories, projects.projects.filter(p => p.display));
  renderContact(contact);
  setupObserver();
  setupNav(about.name);
}

/* ── About / Hero ── */
function renderAbout(d) {
  document.title = d.name + ' — Portfolio';
  setText('hero-name', d.name);
  setText('hero-title', d.title);
  setText('about-bio', d.bio);
  setText('about-edu', Array.isArray(d.education) ? d.education.join(' · ') : d.education);
  setText('about-loc', d.location);
  setText('nav-name', d.name);
  if (d.resume) el('hero-resume').href = d.resume;

  // Typing animation for tagline
  const taglineEl = el('hero-tagline');
  taglineEl.innerHTML = '<span id="tagline-text"></span><span class="typing-cursor"></span>';
  startTyping(document.getElementById('tagline-text'), d.taglines || [d.tagline]);
}

/* ── Typing animation ── */
function startTyping(target, lines) {
  let li = 0, ci = 0, deleting = false;

  function tick() {
    const line = lines[li];
    if (!deleting) {
      target.textContent = line.slice(0, ++ci);
      if (ci === line.length) {
        deleting = true;
        setTimeout(tick, 1800);
      } else {
        // Slight variation in speed makes it feel human
        setTimeout(tick, 45 + Math.random() * 25);
      }
    } else {
      target.textContent = line.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        li = (li + 1) % lines.length;
        setTimeout(tick, 380);
      } else {
        setTimeout(tick, 22 + Math.random() * 12);
      }
    }
  }

  // Small delay so the hero animation has started before typing begins
  setTimeout(tick, 1200);
}

/* ── Projects ── */
function renderProjects(list) {
  const grid = el('projects-grid');
  // Each column explodes in a different direction to simulate cards flying apart from a stack
  const dirs = [
    { tx: '-90px', ty: '50px', rot: '-3deg' },
    { tx: '0px',   ty: '100px', rot: '0deg'  },
    { tx: '90px',  ty: '50px', rot: '3deg'  },
  ];
  list.forEach((p, i) => {
    const card = div('project-card');
    const dir = dirs[i % 3];
    card.style.setProperty('--tx', dir.tx);
    card.style.setProperty('--ty', dir.ty);
    card.style.setProperty('--rot', dir.rot);
    card.style.setProperty('--d', `${(i % 3) * 0.08}s`);
    card.innerHTML = `
      <div class="project-title">${esc(p.title)}</div>
      <div class="project-desc">${esc(p.description)}</div>
      <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}</div>
      <div class="project-links">
        ${p.github ? `<a class="project-link" href="${p.github}" target="_blank" rel="noopener">GitHub &rarr;</a>` : ''}
        ${p.demo ? `<a class="project-link" href="${p.demo}" target="_blank" rel="noopener">Demo &rarr;</a>` : ''}
        ${!p.github && !p.demo ? '<span class="project-link dim">In Progress</span>' : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── Skills ── */
function renderSkills(categories) {
  const wrap = el('skills-categories');
  categories.forEach((cat, ci) => {
    const group = document.createElement('div');
    group.className = 'skill-category';
    const label = document.createElement('div');
    label.className = 'skill-cat-label';
    label.textContent = cat.label;
    const tags = div('skill-tags');
    cat.skills.forEach((s, si) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = s;
      // Golden-angle distribution for natural-looking scatter
      const angle = ((ci * 5 + si) * 137.5) % 360;
      const dist = 45 + (si % 4) * 18;
      const tx = (Math.cos(angle * Math.PI / 180) * dist).toFixed(1);
      const ty = (Math.sin(angle * Math.PI / 180) * dist).toFixed(1);
      tag.style.setProperty('--tx', `${tx}px`);
      tag.style.setProperty('--ty', `${ty}px`);
      tag.style.setProperty('--d', `${(ci * 0.05) + (si * 0.04)}s`);
      tags.appendChild(tag);
    });
    group.appendChild(label);
    group.appendChild(tags);
    wrap.appendChild(group);
  });
}

/* ── Contact ── */
function renderContact(d) {
  const wrap = el('contact-links');
  const items = [
    { label: 'Email', href: `mailto:${d.email}`, text: d.email },
    { label: 'GitHub', href: d.github, text: 'GitHub' },
    { label: 'LinkedIn', href: d.linkedin, text: 'LinkedIn' },
    { label: 'Portfolio', href: d.portfolio, text: 'Portfolio' },
  ].filter(x => x.href && x.href !== 'mailto:');

  items.forEach((item, i) => {
    const a = document.createElement('a');
    a.className = 'contact-link';
    a.href = item.href;
    if (!item.href.startsWith('mailto')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.style.setProperty('--d', `${i * 0.08}s`);
    a.textContent = item.text;
    wrap.appendChild(a);
  });
}

/* ── IntersectionObserver ── */
function setupObserver() {
  const opts = { threshold: 0.15 };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, opts);

  const targets = document.querySelectorAll(
    '.reveal-label, .reveal-up, .project-card, .skill-tag, .contact-link'
  );
  targets.forEach(t => obs.observe(t));
}

/* ── Navbar scroll state ── */
function setupNav(name) {
  const nav = el('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const hamburger = el('nav-hamburger');
  const navLinks = nav.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Helpers ── */
const el = id => document.getElementById(id);
const setText = (id, val) => { const e = el(id); if (e) e.textContent = val; };
const div = (cls, style) => {
  const d = document.createElement('div');
  d.className = cls;
  if (style) d.setAttribute('style', style);
  return d;
};
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

init();