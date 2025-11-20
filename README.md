# Pranav's Terminal Portfolio Website

A sleek, interactive terminal-themed portfolio website showcasing my projects, skills, and experience as a Software Developer & ML Engineer.

<br>

![Screenshot of my website](https://github.com/PranavViswanathan/PranavViswanathanWebsite/blob/main/assets/images/webpage_screenshot.png)

## Overview

This portfolio website is designed to look and feel like a real Unix/Linux terminal, providing an engaging and unique way to explore my professional background. The site features both an interactive terminal interface and a static webpage view for different user preferences.

## Features

### Interactive Terminal Mode
- Command-Line Interface: Navigate the portfolio using real terminal commands
- Command History: Use arrow keys (up/down) to cycle through previous commands
- Auto-complete Feel: Tab-like experience for power users
- Easter Eggs: Hidden commands for curious visitors (try sudo!)
- Hangman Game: Play a quick tech-themed word game
- Smooth Animations: Typing effects and transitions for an authentic terminal experience

### Static Webpage Mode
- Traditional Navigation: Click-based navigation with smooth scrolling
- Full-Screen Loader: Terminal-themed loading animation
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Quick Access: Jump directly to sections via navigation menu

### Available Commands
help        Display all available commands
about       Learn more about me
skills      View technical skills and expertise
projects    Browse featured projects
contact     Get contact information
github      Open GitHub profile
resume      View resumes (sde/aiml)
clear       Clear the terminal
cd ~        Reboot/refresh terminal
whoami      Display name
pwd         Show current directory
ls          List files
date        Show current date and time

## Design Philosophy

The website embraces a hacker/developer aesthetic with:
- Matrix-inspired colors: Neon green (#00ff41), cyan (#64ffda), gold (#ffd700)
- Dark background: Deep navy (#0a0e27) for reduced eye strain
- Monospace typography: Courier New for that authentic terminal feel
- Smooth animations: Hover effects, transitions, and typing animations
- Mac-style terminal: Realistic terminal window with traffic light buttons

## Technology Stack

- HTML5: Semantic markup and structure
- CSS3: Custom styling with animations and transitions
- Vanilla JavaScript: No frameworks, pure JS for performance
- GitHub Pages: Static hosting (or your hosting choice)

## Project Structure
```
portfolio/
├── index.html                  Main interactive terminal page
├── webpage.html                Static webpage view
├── assets/
│   ├── css/
│   │   ├── main_style.css     Styles for terminal interface
│   │   └── web_page_style.css Styles for static webpage
│   ├── js/
│   │   └── main_page_js.js    Terminal functionality & commands
│   ├── images/
│   │   └── pranav_logo.png    Favicon and branding
│   └── resume/
│       ├── PranavViswanathan_SDE_FTE.pdf
│       └── PranavViswanathan_AIML_FTE.pdf
└── README.md
```
## Setup & Installation

1. Clone the repository
   git clone https://github.com/PranavViswanathan/portfolio-website.git
   cd portfolio-website

2. Open locally
   - Simply open index.html in your browser
   - Or use a local server:
     python -m http.server 8000
     Visit http://localhost:8000

3. Deploy
   - GitHub Pages: Push to gh-pages branch or enable Pages in settings
   - Netlify: Drag and drop the folder
   - Vercel: Import from GitHub repository

## Usage

### For Interactive Terminal
1. Visit the main page
2. Wait for the loading animation to complete
3. Type help to see all available commands
4. Navigate using keyboard commands
5. Use webpage-view to switch to static mode

### For Static Webpage
1. Click webpage.html or use the webpage-view command
2. Use the navigation menu at the top
3. Scroll through sections
4. Click on project cards and contact links

## Customization

### Changing Colors
Edit the CSS variables in main_style.css or web_page_style.css:
:root {
    --terminal-green: #00ff41;
    --terminal-cyan: #64ffda;
    --terminal-gold: #ffd700;
    --terminal-bg: #0a0e27;
    --terminal-window: #1a1d2e;
}

### Adding New Commands
In main_page_js.js, add to the executeCommand() function:
case 'yourcommand':
    yourFunction();
    break;

### Updating Content
Edit the data objects in main_page_js.js:
- profile: Personal information
- skills: Technical skills by category
- projects: Project showcase data

## Responsive Design

The website is fully responsive and optimized for:
- Desktop: Full terminal experience with all features
- Tablet: Adapted layout with touch-friendly controls
- Mobile: Simplified interface with mobile-optimized navigation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## License

This project is open source and available under the MIT License.

## Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact

Pranav Viswanathan
- Email: viswanathan.pran@northeastern.edu
- LinkedIn: pranav-viswanathan-7976711b7
- GitHub: @PranavViswanathan

## Acknowledgments

- Inspired by classic Unix/Linux terminals
- ASCII art generated using custom scripts
- Terminal aesthetic inspired by developer culture
- Icons from Skill Icons (https://skillicons.dev)

## Future Enhancements

- Add more interactive games (Snake, Tic-Tac-Toe)
- Implement command auto-completion
- Add Matrix rain effect command
- Create theme switcher (green/amber/blue)
- Add sound effects for typing
- Implement fortune command for random quotes
- Add project filtering by technology
- Create interactive code snippets viewer

---
