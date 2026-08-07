(function () {
  'use strict';

  /* ── State ── */
  let inputHistory = [];
  let historyIdx   = -1;
  let isOpen       = false;
  let matrixTimer  = null;
  let activeGame   = null;

  /* ── DOM refs (set in buildDOM) ── */
  let overlay, outputEl, inputEl;

  /* ── Data access ── */
  const data = () => window.portfolioData || null;

  /* ── Output helpers ── */
  function line(text, cls) {
    const el = document.createElement('div');
    el.className = 'tl' + (cls ? ' ' + cls : '');
    el.textContent = text !== undefined ? text : '';
    return el;
  }

  function rich(html, cls) {
    const el = document.createElement('div');
    el.className = 'tl' + (cls ? ' ' + cls : '');
    el.innerHTML = html;
    return el;
  }

  function block(text) {
    const el = document.createElement('pre');
    el.className = 'tpre';
    el.textContent = text;
    return el;
  }

  function print(...items) {
    items.filter(Boolean).forEach(item => {
      if (typeof item === 'string') outputEl.appendChild(line(item));
      else outputEl.appendChild(item);
    });
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ═══════════════════════════════════════
     Commands
  ═══════════════════════════════════════ */
  const CMD = {

    help() {
      print(block(
`  ╔══════════════════════════════════════════╗
  ║       pranav@portfolio — help            ║
  ╚══════════════════════════════════════════╝

  About Me
    whoami          Quick intro
    about           Full bio
    education       Academic background
    experience      What I'm looking for
    skills          Tech stack by category
    projects        All projects with index
    open <n>        Open project #n on GitHub
    contact         How to reach me

  Navigate the Site
    ls              List sections
    cd <section>    Scroll to a section
    pwd             Show current section

  Recruiter Mode
    git log         Milestones that shaped me
    top             What's currently running in my head
    whois pranav    Full lookup on who I am
    weather         Current Boston weather
    diff resume     SDE vs ML resume, side by side

  Fun
    neofetch        Portfolio system info
    ascii           ASCII name art
    hire-me         ;)
    sudo hire-me    ;;)
    matrix          Enter the matrix
    tetris          Play Tetris
    coffee          ☕
    joke            Random dev joke
    date            Current date & time
    echo <text>     Echo something back

  Terminal
    clear / cls     Clear the screen
    history         Command history
    exit / quit     Close terminal

  ↑ ↓  Navigate history
  Tab  Autocomplete
  \`    Toggle terminal · Esc  Close`
      ), line());
    },

    whoami() {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      const sep = '─'.repeat(d.about.name.length);
      print(
        line(),
        line(d.about.name, 'tc-accent tc-bold'),
        line(sep, 'tc-dim'),
        line(d.about.title),
        line(d.about.location, 'tc-muted'),
        line(),
        line(d.about.bio),
        line(),
        line('Status  →  GenAI Engineer at Citi', 'tc-accent'),
        line()
      );
    },

    about() { CMD.whoami(); },

    education() {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      print(
        line(),
        line('Education', 'tc-accent tc-bold'),
        line('─────────', 'tc-dim'),
        ...(Array.isArray(d.about.education) ? d.about.education.map(e => line(e)) : [line(d.about.education)]),
        line(),
        line('Focus Areas', 'tc-accent'),
        line('  · Machine Learning & MLOps'),
        line('  · Distributed Systems'),
        line('  · Full-Stack Engineering'),
        line()
      );
    },

    experience() {
      print(
        line(),
        line("What I'm Looking For", 'tc-accent tc-bold'),
        line('────────────────────', 'tc-dim'),
        line('  Role      →  New Grad SWE / ML Engineer'),
        line('  Start     →  May 2026'),
        line('  Location  →  Open to relocation'),
        line('  Type      →  Full-time'),
        line(),
        line('I love building:', 'tc-accent'),
        line('  → End-to-end ML systems with real-world impact'),
        line('  → Distributed infrastructure at scale'),
        line('  → Anything that merges AI + systems thinking'),
        line()
      );
    },

    skills() {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      print(line());
      d.skills.categories.forEach(cat => {
        print(
          line(cat.label, 'tc-accent'),
          line('  ' + cat.skills.join('  ·  '), 'tc-muted'),
          line()
        );
      });
    },

    projects() {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      const list = d.projects.projects.filter(p => p.display);
      print(line());
      list.forEach((p, i) => {
        const firstSentence = p.description.split(/\.\s/)[0] + '.';
        print(
          rich(`  <span class="tc-accent">[${i + 1}]</span> <strong>${esc(p.title)}</strong>`),
          line('      ' + firstSentence, 'tc-muted'),
          line('      ' + p.tech.slice(0, 4).join(' · '), 'tc-dim'),
          line()
        );
      });
      print(line('  Type  open <n>  to visit a project on GitHub.', 'tc-dim'), line());
    },

    open(args) {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      const n = parseInt(args[0], 10);
      const list = d.projects.projects.filter(p => p.display);
      if (!args.length || isNaN(n) || n < 1 || n > list.length) {
        return print(line(`Usage: open <1–${list.length}>`, 'tc-error'));
      }
      const p = list[n - 1];
      window.open(p.github, '_blank', 'noopener');
      print(line(`Opening ${p.title} on GitHub…`, 'tc-accent'));
    },

    contact() {
      const d = data();
      if (!d) return print(line('Still loading data…', 'tc-muted'));
      const c = d.contact;
      print(
        line(),
        line('Contact', 'tc-accent tc-bold'),
        line('───────', 'tc-dim'),
        rich(`  Email     →  <a class="tc-link" href="mailto:${esc(c.email)}">${esc(c.email)}</a>`),
        rich(`  GitHub    →  <a class="tc-link" href="${esc(c.github)}" target="_blank" rel="noopener">${esc(c.github)}</a>`),
        rich(`  LinkedIn  →  <a class="tc-link" href="${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin)}</a>`),
        c.portfolio
          ? rich(`  Portfolio →  <a class="tc-link" href="${esc(c.portfolio)}" target="_blank" rel="noopener">${esc(c.portfolio)}</a>`)
          : null,
        line()
      );
    },

    ls() {
      print(
        line(),
        line('  hero/     about/     projects/     skills/     contact/', 'tc-accent'),
        line()
      );
    },

    cd(args) {
      const valid = ['hero', 'about', 'projects', 'skills', 'contact'];
      const target = (args[0] || '').toLowerCase().replace(/^\//, '');
      if (!target || !valid.includes(target)) {
        return print(line(
          `cd: ${args[0] || '<section>'}: not found  (valid: ${valid.join(', ')})`,
          'tc-error'
        ));
      }
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      print(line(`Navigating to /${target}…`, 'tc-accent'));
    },

    pwd() {
      const sections = ['contact', 'skills', 'projects', 'about', 'hero'];
      const cur = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.6 && r.bottom > 0;
      }) || 'hero';
      print(line(`/portfolio/${cur}`, 'tc-accent'));
    },

    neofetch() {
      const d = data();
      const name = d ? d.about.name : 'Pranav Viswanathan';
      const uni  = d ? (Array.isArray(d.about.education) ? d.about.education[0] : d.about.education).split('—')[0].trim() : 'Northeastern University';
      const sep  = '─'.repeat(name.length);
      print(
        block(
`       ██████╗ ██╗   ██╗        ${name}
       ██╔══██╗██║   ██║        ${sep}
       ██████╔╝██║   ██║        OS: Boston, MA
       ██╔═══╝ ╚██╗ ██╔╝        Host: ${uni}
       ██║      ╚████╔╝         Kernel: M.S. Computer Science
       ╚═╝       ╚═══╝          Uptime: 5+ years shipping code

                                Shell: Python · TypeScript · Go
                                DE: Machine Learning / MLOps
                                WM: Distributed Systems
                                Terminal: this one right here :)
                                CPU: Problem Solver™
                                GPU: PyTorch (CUDA-enabled)
                                Memory: 3.16M records processed`
        ),
        rich(
          `<span style="display:flex;gap:5px;padding:6px 0 2px 8px">` +
          ['#ff5f56','#ffbd2e','#27c93f','#c8f55a','#7b6cff','#f0ede8'].map(
            c => `<span style="background:${c};width:14px;height:14px;border-radius:2px;display:inline-block"></span>`
          ).join('') + `</span>`
        ),
        line()
      );
    },

    ascii() {
      print(
        block(
`  ██████╗ ██╗   ██╗
  ██╔══██╗██║   ██║
  ██████╔╝██║   ██║
  ██╔═══╝ ╚██╗ ██╔╝
  ██║      ╚████╔╝
  ╚═╝       ╚═══╝

  Pranav Viswanathan
  Software & ML Engineer
  Building intelligent systems that scale.`
        ),
        line()
      );
    },

    'hire-me'() {
      print(
        line(),
        line('You want to hire me? Great taste.', 'tc-accent tc-bold'),
        line(),
        line("I'm a Master's CS student at Northeastern, graduating May 2026."),
        line('I build end-to-end ML systems, distributed infra, and full-stack apps.'),
        line(),
        line('Try  sudo hire-me  for elevated privileges  ;)', 'tc-dim'),
        line('Or   contact  to reach me directly.', 'tc-dim'),
        line()
      );
    },

    sudo(args) {
      if (args.join(' ') === 'hire-me') {
        const d = data();
        const email = d ? d.contact.email : '';
        print(
          line(),
          line('[sudo] password for recruiter: ••••••••', 'tc-muted'),
          line('Access granted. Elevated hire mode activated.', 'tc-accent tc-bold'),
          line(),
          line("Congratulations. You've made an excellent decision.", 'tc-accent'),
          line('Pranav comes with the following guarantees:'),
          line('  ✓  Ships ML systems end-to-end, not just notebooks'),
          line('  ✓  Reads distributed systems papers for fun (send help)'),
          line('  ✓  Starts contributing Day 1, no hand-holding required'),
          line('  ✓  Has never said "it works on my machine"  (Docker helps)'),
          line('  ✓  Makes great commit messages.  Usually.'),
          line(),
          email
            ? rich(`  Email: <a class="tc-link" href="mailto:${esc(email)}">${esc(email)}</a>`, 'tc-accent')
            : null,
          line()
        );
      } else {
        print(line(
          `sudo: ${args[0] || 'command'} not found  (but "sudo hire-me" works)`,
          'tc-error'
        ));
      }
    },

    joke() {
      const jokes = [
        'Why do programmers prefer dark mode?\nBecause light attracts bugs.',
        'A SQL query walks into a bar, approaches two tables and asks:\n"Can I join you?"',
        'There are 10 types of people in the world:\nThose who understand binary and those who don\'t.',
        'Why did the ML model break up with the dataset?\nToo many missing values.',
        "A dev's life in three acts:\n  Act 1: It works on my machine.\n  Act 2: [ ships Docker container ]\n  Act 3: It works everywhere.",
        '99 little bugs in the code…\nTake one down, patch it around…\n127 little bugs in the code.',
        'How many programmers does it take to change a light bulb?\nNone. That\'s a hardware problem.',
        'Debugging is like being the detective in a crime film\nwhere you are also the murderer.',
        'A product manager walks into a bar.\n"Give me everything you have."\nThe bartender says: "I\'ll need to refine the requirements."',
      ];
      const j = jokes[Math.floor(Math.random() * jokes.length)];
      print(line(), block('  ' + j.replace(/\n/g, '\n  ')), line());
    },

    date() {
      print(line(
        new Date().toLocaleString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long',
          day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
        }),
        'tc-accent'
      ));
    },

    echo(args) { print(line(args.join(' '))); },

    coffee() {
      print(
        block(
`         )  (
        (   ) )
         ) ( (
       _______)_
    .-'---------|
   ( C|/\\/\\/\\/\\/|   ☕  Coffee Break
    '-./\\/\\/\\/\\/|
      '_________'
       '-------'

  Responsible for ~87% of all code ever written.`
        ),
        line()
      );
    },

    matrix() {
      if (matrixTimer) return;
      const chars = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01';
      print(line('Entering the matrix… (press any key to exit)', 'tc-dim'));
      const box = document.createElement('pre');
      box.className = 'tpre tmatrix-anim';
      outputEl.appendChild(box);
      outputEl.scrollTop = outputEl.scrollHeight;
      let frames = 0;
      const stop = () => {
        clearInterval(matrixTimer);
        matrixTimer = null;
        box.remove();
        print(line('You are free.', 'tc-accent'));
        document.removeEventListener('keydown', onAnyKey);
      };
      const onAnyKey = e => {
        if (e.key !== '`') stop();
      };
      document.addEventListener('keydown', onAnyKey);
      matrixTimer = setInterval(() => {
        let g = '';
        for (let r = 0; r < 12; r++) {
          for (let c = 0; c < 58; c++) {
            g += Math.random() > 0.65
              ? chars[Math.floor(Math.random() * chars.length)]
              : ' ';
          }
          g += '\n';
        }
        box.textContent = g;
        if (++frames >= 100) stop();
      }, 70);
    },

    tetris() {
      if (activeGame) {
        print(line('A game is already active. Press Q to quit first.', 'tc-error'));
        return;
      }

      const W = 10, H = 20;

      // Each piece: array of 4 rotations; each rotation: array of [dr, dc] cell offsets
      const PIECES = [
        // I
        [[[0,0],[0,1],[0,2],[0,3]], [[0,2],[1,2],[2,2],[3,2]], [[2,0],[2,1],[2,2],[2,3]], [[0,1],[1,1],[2,1],[3,1]]],
        // O
        [[[0,0],[0,1],[1,0],[1,1]], [[0,0],[0,1],[1,0],[1,1]], [[0,0],[0,1],[1,0],[1,1]], [[0,0],[0,1],[1,0],[1,1]]],
        // T
        [[[0,1],[1,0],[1,1],[1,2]], [[0,0],[1,0],[1,1],[2,0]], [[1,0],[1,1],[1,2],[2,1]], [[0,1],[1,0],[1,1],[2,1]]],
        // S
        [[[0,1],[0,2],[1,0],[1,1]], [[0,0],[1,0],[1,1],[2,1]], [[0,1],[0,2],[1,0],[1,1]], [[0,0],[1,0],[1,1],[2,1]]],
        // Z
        [[[0,0],[0,1],[1,1],[1,2]], [[0,1],[1,0],[1,1],[2,0]], [[0,0],[0,1],[1,1],[1,2]], [[0,1],[1,0],[1,1],[2,0]]],
        // J
        [[[0,0],[1,0],[1,1],[1,2]], [[0,0],[0,1],[1,0],[2,0]], [[1,0],[1,1],[1,2],[2,2]], [[0,1],[1,1],[2,0],[2,1]]],
        // L
        [[[0,2],[1,0],[1,1],[1,2]], [[0,0],[1,0],[2,0],[2,1]], [[1,0],[1,1],[1,2],[2,0]], [[0,0],[0,1],[1,1],[2,1]]],
      ];

      let board = Array.from({length: H}, () => new Array(W).fill(0));
      let current = null;
      let score = 0, level = 1, lines = 0;
      let gameOver = false, paused = false;
      let timer = null, speed = 800;

      const display = document.createElement('pre');
      display.className = 'tpre';
      outputEl.appendChild(display);
      outputEl.scrollTop = outputEl.scrollHeight;

      function valid({piece, rot, row, col}) {
        return PIECES[piece][rot].every(([dr, dc]) => {
          const r = row + dr, c = col + dc;
          return r >= 0 && r < H && c >= 0 && c < W && !board[r][c];
        });
      }

      function getGhost() {
        let r = current.row;
        while (valid({...current, row: r + 1})) r++;
        return r;
      }

      function render() {
        if (!current) return;
        const ghost = getGhost();
        const grid = board.map(row => [...row]);

        PIECES[current.piece][current.rot].forEach(([dr, dc]) => {
          const r = ghost + dr, c = current.col + dc;
          if (r >= 0 && r < H && !grid[r][c]) grid[r][c] = -1;
        });

        PIECES[current.piece][current.rot].forEach(([dr, dc]) => {
          const r = current.row + dr, c = current.col + dc;
          if (r >= 0 && r < H) grid[r][c] = current.piece + 1;
        });

        let out = `  Score: ${score}  Level: ${level}  Lines: ${lines}${paused ? '  [PAUSED]' : ''}\n`;
        out += '  ┌' + '──'.repeat(W) + '┐\n';
        for (let r = 0; r < H; r++) {
          out += '  │';
          for (let c = 0; c < W; c++) {
            if (grid[r][c] > 0) out += '██';
            else if (grid[r][c] === -1) out += '░░';
            else out += '  ';
          }
          out += '│\n';
        }
        out += '  └' + '──'.repeat(W) + '┘\n';
        out += '\n  ←→ move  ↑ rotate  ↓ soft drop  Space: hard drop  P: pause  Q: quit';

        display.textContent = out;
        outputEl.scrollTop = outputEl.scrollHeight;
      }

      function clearLines() {
        const newBoard = board.filter(row => !row.every(c => c > 0));
        const cleared = H - newBoard.length;
        while (newBoard.length < H) newBoard.unshift(new Array(W).fill(0));
        board = newBoard;
        const pts = [0, 100, 300, 500, 800][cleared] || 0;
        score += pts * level;
        lines += cleared;
        level = Math.floor(lines / 10) + 1;
        speed = Math.max(80, 800 - (level - 1) * 75);
      }

      function endGame() {
        clearTimeout(timer);
        timer = null;
        activeGame = null;
        document.removeEventListener('keydown', gameKey);
        inputEl.disabled = false;
        inputEl.focus();
        render();
        print(
          line(),
          line(gameOver
            ? `Game Over!  Score: ${score}  Lines: ${lines}`
            : `Tetris quit.  Score: ${score}  Lines: ${lines}`, 'tc-accent'),
          line()
        );
      }

      function newPiece() {
        const p = Math.floor(Math.random() * PIECES.length);
        current = { piece: p, rot: 0, row: 0, col: 3 };
        if (!valid(current)) { gameOver = true; endGame(); }
      }

      function place() {
        PIECES[current.piece][current.rot].forEach(([dr, dc]) => {
          board[current.row + dr][current.col + dc] = current.piece + 1;
        });
        clearLines();
        newPiece();
      }

      function step() {
        if (paused || gameOver) return;
        if (valid({...current, row: current.row + 1})) {
          current.row++;
        } else {
          place();
        }
        if (!gameOver) render();
      }

      function scheduleStep() {
        timer = setTimeout(() => {
          step();
          if (!gameOver) scheduleStep();
        }, speed);
      }

      function gameKey(e) {
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','p','P','q','Q'].includes(e.key)) return;
        e.preventDefault();
        if (gameOver) return;

        if (e.key === 'q' || e.key === 'Q') { gameOver = true; endGame(); return; }
        if (e.key === 'p' || e.key === 'P') { paused = !paused; render(); return; }
        if (paused) return;

        if (e.key === 'ArrowLeft' && valid({...current, col: current.col - 1})) { current.col--; render(); }
        if (e.key === 'ArrowRight' && valid({...current, col: current.col + 1})) { current.col++; render(); }
        if (e.key === 'ArrowUp') {
          const nextRot = (current.rot + 1) % PIECES[current.piece].length;
          if (valid({...current, rot: nextRot})) { current.rot = nextRot; render(); }
        }
        if (e.key === 'ArrowDown') {
          if (valid({...current, row: current.row + 1})) { current.row++; render(); }
          else { place(); if (!gameOver) render(); }
        }
        if (e.key === ' ') {
          current.row = getGhost();
          place();
          if (!gameOver) render();
        }
      }

      inputEl.disabled = true;
      document.addEventListener('keydown', gameKey);
      activeGame = () => { if (!gameOver) { gameOver = true; endGame(); } };

      print(line('Starting Tetris…  ←→: move  ↑: rotate  ↓: soft drop  Space: hard drop  P: pause  Q: quit', 'tc-dim'));

      newPiece();
      if (!gameOver) { render(); scheduleStep(); }
    },

    /* ── Recruiter Mode ── */

    'git'(args) {
      if (args[0] !== 'log') {
        return print(line(`git: '${args[0] || ''}' is not a recognized git command`, 'tc-error'));
      }
      const entries = [
        { hash: 'a3f9c12', ref: '(HEAD -> main)', msg: 'built OmniRAG local-first RAG system' },
        { hash: '7b2e841', ref: null,             msg: 'joined Northeastern MS Computer Science' },
        { hash: 'f91da03', ref: null,             msg: 'interned at NergyLive, built real-time HVAC anomaly detection' },
        { hash: '3c8b120', ref: null,             msg: 'graduated Vellore Institute of Technology' },
        { hash: 'e4f2b99', ref: null,             msg: 'wrote first line of code' },
      ];
      print(line());
      entries.forEach(e => {
        const refHtml = e.ref
          ? ` <span style="color:#27c93f">${esc(e.ref)}</span>`
          : '';
        print(rich(
          `  <span style="color:#c8f55a">${esc(e.hash)}</span>${refHtml} ${esc(e.msg)}`
        ));
      });
      print(line());
    },

    top() {
      const procs = [
        { pid: '001', name: 'OmniRAG',          cpu: '34.2', mem: '18.1', status: 'running'  },
        { pid: '002', name: 'job-search',        cpu: '98.7', mem: '67.3', status: 'running'  },
        { pid: '003', name: 'SwarmCoordinator', cpu: '12.4', mem: ' 9.2', status: 'sleeping' },
        { pid: '004', name: 'Rebalance-AI',     cpu: ' 8.1', mem: '11.0', status: 'sleeping' },
        { pid: '005', name: 'HawkEye',          cpu: ' 4.3', mem: ' 6.7', status: 'stopped'  },
      ];
      const statusColor = { running: '#27c93f', sleeping: '#ffbd2e', stopped: '#ff6b6b' };
      print(
        line(),
        rich(`  <span class="tc-dim">PID   NAME                CPU%    MEM%    STATUS</span>`),
        rich(`  <span class="tc-dim">────  ──────────────────  ──────  ──────  ─────────</span>`)
      );
      procs.forEach(p => {
        const sc = statusColor[p.status] || '#f0ede8';
        print(rich(
          `  <span class="tc-muted">${esc(p.pid)}</span>   ` +
          `<span class="tc-accent">${esc(p.name.padEnd(18))}</span>  ` +
          `${esc(p.cpu.padStart(6))}  ` +
          `${esc(p.mem.padStart(6))}  ` +
          `<span style="color:${sc}">${esc(p.status)}</span>`
        ));
      });
      print(line());
    },

    whois(args) {
      if ((args[0] || '').toLowerCase() !== 'pranav') {
        return print(line(
          `whois: ${args[0] || '<name>'}: not found  (try: whois pranav)`,
          'tc-error'
        ));
      }
      print(
        line(),
        rich(`  <span class="tc-dim">Name:</span>         Pranav Viswanathan`),
        rich(`  <span class="tc-dim">Role:</span>         Software &amp; ML Engineer`),
        rich(`  <span class="tc-dim">Org:</span>          Northeastern University (MS CS, May 2026)`),
        rich(`  <span class="tc-dim">Location:</span>     Boston, MA`),
        rich(`  <span class="tc-dim">Status:</span>       <span class="tc-accent tc-bold">AVAILABLE</span> — actively seeking new grad roles`),
        rich(`  <span class="tc-dim">Skills:</span>       Python, Go, Java, PyTorch, AWS, Docker`),
        rich(`  <span class="tc-dim">Contact:</span>      pvvisthn@gmail.com`),
        rich(`  <span class="tc-dim">LinkedIn:</span>     linkedin.com/in/pranav-viswanathan-7976711b7`),
        rich(`  <span class="tc-dim">GitHub:</span>       github.com/PranavViswanathan`),
        line()
      );
    },

    weather() {
      const loadingEl = line('Fetching Boston weather…', 'tc-muted');
      print(loadingEl);
      fetch('https://wttr.in/Boston?format=j1')
        .then(r => { if (!r.ok) throw new Error('bad response'); return r.json(); })
        .then(d => {
          loadingEl.remove();
          const cur = d.current_condition[0];
          const desc    = cur.weatherDesc[0].value;
          const tempF   = cur.temp_F;
          const tempC   = cur.temp_C;
          const humidity = cur.humidity;
          const windMph = cur.windspeedMiles;
          const windDir = cur.winddir16Point;
          print(
            line(),
            line('Boston, MA', 'tc-accent tc-bold'),
            line('─────────────', 'tc-dim'),
            rich(`  <span class="tc-dim">Condition:</span>    ${esc(desc)}`),
            rich(`  <span class="tc-dim">Temperature:</span>  ${esc(tempF)}°F / ${esc(tempC)}°C`),
            rich(`  <span class="tc-dim">Humidity:</span>     ${esc(humidity)}%`),
            rich(`  <span class="tc-dim">Wind:</span>         ${esc(windMph)} mph ${esc(windDir)}`),
            line()
          );
        })
        .catch(() => {
          loadingEl.remove();
          print(line("weather service unreachable — it's Boston, assume rain", 'tc-error'));
        });
    },

    diff(args) {
      if (args[0] !== 'resume') {
        return print(line(`diff: try  diff resume`, 'tc-error'));
      }
      print(
        line(),
        rich(`<span class="tc-dim">diff --git a/resume-sde.pdf b/resume-ml.pdf</span>`),
        rich(`<span class="tc-dim">--- a/resume-sde.pdf</span>`),
        rich(`<span class="tc-dim">+++ b/resume-ml.pdf</span>`),
        line(),
        rich(`<span style="color:#5dd3f3">@@ Featured Projects @@</span>`),
        rich(`<span style="color:#ff6b6b">-  SwarmCoordinator: Raft consensus, 10 drone agents, FastAPI, Three.js</span>`),
        rich(`<span style="color:#ff6b6b">-  HawkEye: RGB/Thermal/LiDAR fusion, Kalman filter, 14-16 FPS</span>`),
        rich(`<span style="color:#27c93f">+  OmniRAG: local-first RAG, BGE cross-encoder reranking, LanceDB</span>`),
        rich(`<span style="color:#27c93f">+  Rebalance-AI: XGBoost/LightGBM, R²&gt;0.96, 3.16M records</span>`),
        line(),
        rich(`<span style="color:#5dd3f3">@@ Technical Skills @@</span>`),
        rich(`<span style="color:#ff6b6b">-  Go, Distributed Systems, Raft Consensus, WebSockets, Microservices</span>`),
        rich(`<span style="color:#ff6b6b">-  Redis, Prometheus, Load Testing (Locust), ECS Fargate</span>`),
        rich(`<span style="color:#27c93f">+  LlamaIndex, SentenceTransformers, Vector Embeddings, Anomaly Detection</span>`),
        rich(`<span style="color:#27c93f">+  RAG, Cross-Encoder Reranking, Hugging Face Transformers, MLflow</span>`),
        line(),
        rich(`<span style="color:#5dd3f3">@@ Coursework Highlighted @@</span>`),
        rich(`<span style="color:#ff6b6b">-  Building Scalable Distributed Systems, Algorithms, DBMS</span>`),
        rich(`<span style="color:#27c93f">+  Machine Learning, MLOps, NLP, Foundations of AI</span>`),
        line(),
        rich(`<span style="color:#5dd3f3">@@ Certifications @@</span>`),
        rich(`<span style="color:#ff6b6b">-  (none listed)</span>`),
        rich(`<span style="color:#27c93f">+  Google Cloud Essentials, Supervised ML: Regression and Classification</span>`),
        rich(`<span style="color:#27c93f">+  Postman Student Expert</span>`),
        line(),
        rich(`<span style="color:#5dd3f3">@@ Vibe @@</span>`),
        rich(`<span style="color:#ff6b6b">-  "I build systems that scale"</span>`),
        rich(`<span style="color:#27c93f">+  "I build systems that learn"</span>`),
        line()
      );
    },

    clear() { outputEl.innerHTML = ''; printWelcome(); },
    cls()   { CMD.clear(); },

    history() {
      if (!inputHistory.length) return print(line('No history yet.', 'tc-muted'));
      print(line());
      inputHistory.forEach((cmd, i) => {
        print(rich(`  <span class="tc-dim">${String(i + 1).padStart(3)}  </span>${esc(cmd)}`));
      });
      print(line());
    },

    exit()  { closeTerminal(); },
    quit()  { closeTerminal(); },
    close() { closeTerminal(); },
  };

  /* ══════════════════════════════════════
     Dispatch
  ══════════════════════════════════════ */
  function dispatch(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (trimmed !== inputHistory[inputHistory.length - 1]) inputHistory.push(trimmed);
    historyIdx = inputHistory.length;

    outputEl.appendChild(rich(
      `<span class="tc-prompt">pranav@portfolio:~$</span> <span class="tc-echo">${esc(trimmed)}</span>`
    ));

    const parts = trimmed.split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    if (cmd === 'hire' && args[0] === 'me') return CMD['hire-me']();
    if (cmd === 'sudo') return CMD.sudo(args);

    const handler = CMD[cmd];
    if (handler) {
      handler(args);
    } else {
      print(line(
        `command not found: ${cmd}  (type help for available commands)`,
        'tc-error'
      ));
    }

    outputEl.scrollTop = outputEl.scrollHeight;
  }

  /* ══════════════════════════════════════
     Welcome banner
  ══════════════════════════════════════ */
  function printWelcome() {
    print(
      block(
`  Welcome to Pranav's portfolio terminal.
  Type  help  to explore what's available.
  Press  \`  to toggle  ·  Esc  to close.`
      ),
      line()
    );
  }

  /* ══════════════════════════════════════
     Open / Close
  ══════════════════════════════════════ */
  function openTerminal() {
    if (isOpen) return;
    isOpen = true;
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('t-open');
    setTimeout(() => inputEl.focus(), 60);
  }

  function closeTerminal() {
    if (!isOpen) return;
    isOpen = false;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('t-open');
    if (matrixTimer) { clearInterval(matrixTimer); matrixTimer = null; }
    if (activeGame) { activeGame(); activeGame = null; }
  }

  /* ══════════════════════════════════════
     Tab completion
  ══════════════════════════════════════ */
  const ALL_CMDS = Object.keys(CMD).concat(['hire me']);

  function tabComplete() {
    const val = inputEl.value;
    if (!val) return;
    const matches = ALL_CMDS.filter(c => c.startsWith(val));
    if (matches.length === 1) {
      inputEl.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      print(rich(`<span class="tc-dim">${matches.join('  ')}</span>`));
    }
  }

  /* ══════════════════════════════════════
     Key handlers
  ══════════════════════════════════════ */
  function onInputKey(e) {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      dispatch(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) inputEl.value = inputHistory[--historyIdx] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < inputHistory.length - 1) {
        inputEl.value = inputHistory[++historyIdx] || '';
      } else {
        historyIdx = inputHistory.length;
        inputEl.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      tabComplete();
    } else if (e.key === 'c' && e.ctrlKey) {
      inputEl.value = '';
      print(rich('<span class="tc-dim">^C</span>'));
    }
  }

  function onGlobalKey(e) {
    if (e.key === 'Escape' && isOpen) { closeTerminal(); return; }
    if (
      e.key === '`' &&
      !e.ctrlKey && !e.metaKey && !e.altKey &&
      document.activeElement !== inputEl
    ) {
      e.preventDefault();
      isOpen ? closeTerminal() : openTerminal();
    }
  }

  /* ══════════════════════════════════════
     Build DOM
  ══════════════════════════════════════ */
  function buildDOM() {
    overlay = document.createElement('div');
    overlay.id = 'terminal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Portfolio terminal');

    const win = document.createElement('div');
    win.id = 'terminal-win';

    /* title bar */
    const bar = document.createElement('div');
    bar.id = 'terminal-bar';
    bar.innerHTML = `
      <div class="t-dots">
        <span class="t-dot t-dot-red"  id="t-close-dot" title="Close"></span>
        <span class="t-dot t-dot-amber"></span>
        <span class="t-dot t-dot-green"></span>
      </div>
      <span class="t-win-title">pranav@portfolio — bash</span>
      <span class="t-win-hint">[ \` ] toggle</span>
    `;

    /* output */
    outputEl = document.createElement('div');
    outputEl.id = 'terminal-output';

    /* input row */
    const row = document.createElement('div');
    row.id = 'terminal-input-row';

    const prompt = document.createElement('span');
    prompt.className = 'tc-prompt';
    prompt.textContent = 'pranav@portfolio:~$';
    prompt.setAttribute('aria-hidden', 'true');

    inputEl = document.createElement('input');
    inputEl.id = 'terminal-input';
    inputEl.type = 'text';
    inputEl.setAttribute('autocomplete', 'off');
    inputEl.setAttribute('autocorrect', 'off');
    inputEl.setAttribute('autocapitalize', 'none');
    inputEl.setAttribute('spellcheck', 'false');
    inputEl.setAttribute('aria-label', 'Terminal input');
    inputEl.placeholder = 'type a command…';

    row.appendChild(prompt);
    row.appendChild(inputEl);

    win.appendChild(bar);
    win.appendChild(outputEl);
    win.appendChild(row);
    overlay.appendChild(win);
    document.body.appendChild(overlay);

    /* events */
    document.getElementById('t-close-dot').addEventListener('click', closeTerminal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeTerminal(); });
    outputEl.addEventListener('click', () => inputEl.focus());
    inputEl.addEventListener('keydown', onInputKey);
    document.addEventListener('keydown', onGlobalKey);
  }

  /* ══════════════════════════════════════
     Init
  ══════════════════════════════════════ */
  function init() {
    buildDOM();
    printWelcome();
    window.openTerminal = openTerminal;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
