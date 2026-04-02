# Pranav Viswanathan — Portfolio Website

A modern, scroll-driven portfolio website built with vanilla HTML, CSS, and JavaScript. All content is driven by JSON data files — updating personal info, projects, or skills never requires touching the layout code. Features scroll-triggered exploding animations, a fully interactive in-page terminal, and a typing animation hero section.

**Live:** [pranavvis.tech](https://pranavvis.tech)

<img width="2042" height="1126" alt="image" src="https://github.com/user-attachments/assets/b7563222-e84d-42c5-ac2b-c027119508cf" />


<img width="1780" height="976" alt="image" src="https://github.com/user-attachments/assets/e7a81822-3417-48f8-bafe-e163b2402103" />

<img width="1268" height="661" alt="image" src="https://github.com/user-attachments/assets/a5dfa1ae-745b-474f-a5da-5b9eef9fd70a" />


---

## Features

### Scroll-Driven Exploding Animations
- **Hero** — each element enters from a different direction (name scales up, greeting slides from left, title from right) giving a sense of content flying into place
- **Projects** — cards launch in from different positions based on their column (left, bottom, right) simulating an explosion from a stacked origin
- **Skills** — tags scatter in from randomized positions using a golden-angle distribution before organizing into rows
- **About / Contact** — staggered reveal animations driven by `IntersectionObserver`

### Interactive In-Page Terminal
Press `` ` `` (backtick) anywhere on the page, or click the `>_` button in the navbar, to open a fully functional terminal. Press `Esc` or click outside to close.

**Available commands:**

| Category | Commands |
|---|---|
| About | `whoami`, `about`, `education`, `experience` |
| Work | `skills`, `projects`, `open <n>`, `contact` |
| Navigation | `ls`, `cd <section>`, `pwd` |
| Recruiter Mode | `git log`, `top`, `whois pranav`, `weather`, `diff resume` |
| Fun | `neofetch`, `ascii`, `hire-me`, `sudo hire-me`, `matrix`, `coffee`, `joke`, `date`, `echo` |
| Terminal | `clear`, `history`, `exit` / `quit` |

Terminal features: command history (`↑` / `↓`), tab autocomplete, `Ctrl+C` to cancel input, matrix rain animation, and a `sudo hire-me` Easter egg.

**Recruiter Mode commands:**
- `git log` — commit-log styled career milestones
- `top` — process-table view of active projects and their status
- `whois pranav` — full lookup: role, location, availability, contact info
- `weather` — live Boston weather fetched from wttr.in
- `diff resume` — side-by-side diff of SDE vs ML resume focus areas

### Interactive Skill Graph
The Skills section includes an interactive force-directed graph that visualizes the relationships between skills and projects. Skill nodes are color-coded by category (Languages, ML/AI, Backend & Infra, Frontend, Distributed Systems) and connected to project nodes when a project uses that skill. Supports hover to highlight connections, drag to reposition nodes, and a physics simulation that settles into a stable layout.

### Typing Animation Hero
The hero tagline cycles through multiple lines using a smooth typewriter effect with human-feel randomised speed variation. Lines are defined in `data/about.json` under `taglines`.

### JSON-Driven Content
All personal content lives in `data/`. The site layout never needs to be edited when updating projects, skills, or contact details.

### Display Flag for Projects
Each project in `data/projects.json` has a `"display"` boolean. Set it to `true` to show the project on the site, `false` to hide it — no code changes needed.

---

## Project Structure

```
portfolio/
├── index.html          # Static layout shell
├── style.css           # All styles, animations, terminal UI
├── script.js           # Data loading, rendering, IntersectionObserver
├── terminal.js         # Full terminal implementation (IIFE, self-contained)
├── skillgraph.js       # Interactive force-directed skill graph (IIFE, self-contained)
└── data/
    ├── about.json      # Name, bio, title, taglines, education, location, resume
    ├── projects.json   # Projects with display flag, tech stack, links
    ├── skills.json     # Skills grouped by category
    └── contact.json    # Email, GitHub, LinkedIn, portfolio URL
```

---

## Running Locally

The site uses `fetch()` to load JSON files, which requires an HTTP server. Opening `index.html` directly via `file://` will not work.

**Option 1 — Python (no dependencies)**
```bash
cd ExplodingViewWebsite
python3 -m http.server 8000
# Open http://localhost:8000
```

**Option 2 — Node.js**
```bash
npx serve .
```

**Option 3 — VS Code**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html` → *Open with Live Server*.

---

## Updating Content

### Personal Info — `data/about.json`
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "tagline": "Your static tagline",
  "taglines": [
    "Line 1 for the typing animation",
    "Line 2",
    "Line 3"
  ],
  "bio": "Your bio paragraph",
  "education": "University — Degree, Year",
  "location": "City, State",
  "resume": "assets/resume.pdf"
}
```

### Projects — `data/projects.json`
```json
{
  "projects": [
    {
      "display": true,
      "title": "Project Name",
      "description": "Project description pulled from the GitHub About field.",
      "tech": ["Python", "Docker", "FastAPI"],
      "github": "https://github.com/username/repo",
      "demo": "https://demo-url.com"
    }
  ]
}
```

Set `"display": false` to hide a project without deleting it. The terminal's `projects` command and `open <n>` command only show projects with `display: true`.

### Skills — `data/skills.json`
```json
{
  "categories": [
    {
      "label": "Category Name",
      "skills": ["Skill A", "Skill B", "Skill C"]
    }
  ]
}
```

### Contact — `data/contact.json`
```json
{
  "email": "you@email.com",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "portfolio": "https://yoursite.com"
}
```

### Resume
Drop your PDF at `assets/resume.pdf`. The Resume button in the hero will link to it automatically (the path is set in `about.json` under `"resume"`).

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Markup | HTML5 | Static shell, no framework overhead |
| Styles | CSS3 | Custom properties, keyframe animations, IntersectionObserver-driven reveals |
| Logic | Vanilla JavaScript (ES2020) | No build step, no dependencies |
| Fonts | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via Google Fonts | Modern humanist sans-serif |
| Animations | CSS keyframes + IntersectionObserver | Hardware-accelerated, no GSAP dependency |
| Terminal | Custom IIFE (`terminal.js`) | Self-contained, reads from `window.portfolioData` |

No React, no Vue, no Tailwind, no build tools.

---

## How the Terminal Works

`terminal.js` is a self-contained IIFE that:

1. Builds the terminal DOM (overlay, window, title bar, output area, input row) and appends it to `<body>` on load
2. Registers a global `keydown` listener for `` ` `` (toggle) and `Esc` (close)
3. Exposes `window.openTerminal()` for the nav button and the hero icon
4. Reads live data from `window.portfolioData`, which `script.js` populates after fetching the JSON files — so terminal commands like `projects` and `contact` always reflect the current data

Command routing uses a plain object map (`CMD`) keyed by command name. Each value is a function that calls `print()` with a mix of `line()`, `rich()` (HTML), and `block()` (pre-formatted) nodes.

---

## How Animations Work

**Hero section** — pure CSS `@keyframes` with staggered `animation-delay`. Elements start at `opacity: 0` with directional transforms; each keyframe animates to `opacity: 1; transform: none` using `animation-fill-mode: forwards`.

**All other sections** — elements start at `opacity: 0` with transforms set via inline CSS custom properties (`--tx`, `--ty`, `--rot`, `--d`). A single `IntersectionObserver` (threshold `0.15`) adds a `visible` class when an element scrolls into view. CSS transitions on `.visible` then move each element to its final position.

Project card explosion direction is determined by column index (`i % 3`):
- Column 0 → slides from bottom-left with −3° rotation
- Column 1 → slides from directly below
- Column 2 → slides from bottom-right with +3° rotation

Skill tag scatter uses a golden-angle distribution (137.5°) so tags arrive from naturally varied directions before organizing into rows.

---

## Deployment

The repo includes a `CNAME` file for custom domain hosting via GitHub Pages.

1. Push to a GitHub repository
2. Go to **Settings → Pages**, set source to the `main` branch root
3. Add your custom domain in the Pages settings; the `CNAME` file handles the DNS mapping

The site is fully static — no server-side logic, no environment variables.

---

## License

MIT — free to fork and adapt for your own portfolio.
