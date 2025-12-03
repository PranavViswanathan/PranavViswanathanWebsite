const terminal = document.getElementById("terminal");
let commandHistory = [];
let historyIndex = -1;

const asciiArt = `
    ____                            
   / __ \\_________ _____  ____ __   __
  / /_/ / ___/ __ \`/ __ \\/ __ \`/ | / /
 / ____/ /  / /_/ / / / / /_/ /| |/ / 
/_/   /_/   \\__,_/_/ /_/\\__,_/ |___/                                 
        `;

const profile = {
  name: "Pranav Viswanathan",
  title: "Software Developer & ML Engineer",
  education: "MS in Computer Science, Northeastern University",
  location: "Boston, MA",
  linkedin: "linkedin.com/in/pranav-viswanathan-7976711b7/",
  github: "github.com/PranavViswanathan",
  email: "viswanathan.pran@northeastern.edu",
  about: `Hello! I'm Pranav, a Master's student in Computer Science at Northeastern University with a passion for building intelligent systems that solve real-world problems. I love working at the intersection of machine learning and software engineering—taking models from research notebooks to production-grade applications that actually make an impact.\n

I'm drawn to projects that combine data, algorithms, and infrastructure. Whether it's building end-to-end ML pipelines that predict bike-sharing demand across Boston, developing reinforcement learning agents that learn to race, or creating real time anomaly detection systems for industrial equipment—I'm all about turning complex problems into elegant, scalable solutions. There's something deeply satisfying about watching a well-architected system come together.\n

When I'm not coding, you'll find me exploring new frameworks, diving into ML research papers, or optimizing my GitHub workflows. I'm currently seeking Software Engineering, Machine Learning and Data Analyst roles where I can continue building systems that bridge machine learning and software engineering.

`,
};

const skills = {
  languages: ["Python", "Java", "JavaScript", "C++", "SQL", "R", "PHP"],
  frameworks: ["TensorFlow", "PyTorch", "React", "Node.js", "Django", "Flask"],
  tools: [
    "Docker",
    "Kubernetes",
    "Git",
    "AWS",
    "Apache Airflow",
    "MLflow",
    "Terraform",
    "Pulumi",
    "Git",
    "Github",
  ],
  domains: [
    "Machine Learning",
    "MLOps",
    "Computer Vision",
    "Data Analysis",
    "Web Development",
  ],
  cloud: ["AWS", "GCP"],
};

const projects = [
  {
    name: "BlueBikes-Demand-Prediction",
    description:
      "An end-to-end MLOps platform leveraging distributed orchestration (Apache Airflow), experiment tracking (MLflow), and containerized microservices (Docker) to deliver real-time demand forecasting for Boston's Bluebikes network.",
    language: "Python",
    topics: ["machine-learning", "mlops", "airflow", "mlflow"],
    url: "https://github.com/PranavViswanathan/Optimizing-Bluebikes-Operations-with-Machine-Learning-Based-Demand-Prediction",
  },
  {
    name: "Neuro Pilot",
    description:
      "A comparative reinforcement learning framework evaluating Q-Learning versus Deep Q-Networks (DQN) on the Gymnasium CarRacing-v3 environment",
    language: "Python",
    topics: [
      "reinforcement-learning",
      "deep-learning",
      "pytorch",
      "Deep Q-Networks",
    ],
    url: "https://github.com/PranavViswanathan/NeuroPilot",
  },
  {
    name: "Image Manipulation Toolkit",
    description:
      "A comprehensive image processing toolkit built entirely in Java featuring both CLI and GUI interfaces for advanced image manipulation.",
    language: "Java",
    topics: ["Java", "MVC", "Image-Processing"],
    url: "https://github.com/PranavViswanathan/Image-Manipulation-Toolkit",
  },
  {
    name: "Kernal Combat",
    description:"Kernal-Combat is a terminal-themed coding arena built with vanilla JS and CodeMirror. Users can solve algorithmic challenges, compare solutions, and trigger automated “combat” where code metrics (runtime, space usage, LOC, solve speed) determine the winner",
    language: "HTML",
    topics: ["html", "css", "JS", "simulator"],
    url: "https://github.com/PranavViswanathan/Kernal-Combat/"
  },
  {
    name: "Aegis Nav",
    description:
      "An embedded computer vision system built on Raspberry Pi 3 with custom-compiled OpenCV 3.3.0 for the AegisNav assistive device.",
    language: "Python",
    topics: ["raspberry-pi", "OpenCV", "embedded-systems"],
    url: "https://github.com/PranavViswanathan/AegisNav",
  },
  {
    name: "SQL Injection Simulation",
    description:
      "An educational cybersecurity simulation demonstrating SQL injection (SQLI) attack vectors and their exploitation techniques for database manipulation.",
    language: "PHP",
    topics: ["PHP", "SQL", "network-security", "simulation"],
    url: "https://github.com/PranavViswanathan/SQL_Injection_Simulation",
  },
  {
    name: "PranavaOku",
    description:
      "A lightweight, self-hosted cloud platform built with Flask and Pulumi Automation API for deploying static sites (S3) and virtual machines (EC2) on AWS.",
    language: "Python",
    topics: ["IaaS", "AWS", "Pulumi"],
    url: "https://github.com/PranavViswanathan/PranavaOku",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(text, speed = 30) {
  const line = document.createElement("div");
  line.className = "output-line";
  terminal.appendChild(line);

  for (let char of text) {
    line.textContent += char;
    await sleep(speed);
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function addLine(content, className = "") {
  const line = document.createElement("div");
  line.className = `output-line ${className}`;
  line.innerHTML = content;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

async function displayWelcome() {
  await sleep(500);
  addLine(`<pre class="ascii-art">${asciiArt}</pre>`);
  await sleep(300);
  //await typeText("Initializing portfolio...", 20);
  await sleep(500);
  await typeText(`Welcome to ${profile.name}'s Terminal Portfolio!`, 20);
  await sleep(300);
  addLine("");
  await typeText(`To view a more traditional webpage, run webpage-view`)
  await typeText('Type "help" to see available commands', 30);
  addLine("");
  createInputLine();
}

function createInputLine() {
  const inputContainer = document.createElement("div");
  inputContainer.className = "input-line";
  inputContainer.innerHTML = `
                <span class="prompt">pranav@portfolio:~$</span>
                <input type="text" id="user-input" autofocus>
            `;
  terminal.appendChild(inputContainer);

  const input = document.getElementById("user-input");
  input.focus();
  input.addEventListener("keydown", handleInput);

  terminal.scrollTop = terminal.scrollHeight;
}

async function handleInput(event) {
  if (event.key === "Enter") {
    const input = event.target;
    const command = input.value.trim().toLowerCase();

    addLine(
      `<span class="prompt">pranav@portfolio:~$</span> <span class="command">${input.value}</span>`
    );

    input.removeEventListener("keydown", handleInput);
    input.parentElement.remove();

    if (command) {
      commandHistory.unshift(command);
      historyIndex = -1;
      await executeCommand(command);
    }

    createInputLine();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      event.target.value = commandHistory[historyIndex];
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      event.target.value = commandHistory[historyIndex];
    } else {
      historyIndex = -1;
      event.target.value = "";
    }
  }
}

async function executeCommand(cmd) {
  if (cmd === "cd ~") {
    const currentInput = document.getElementById("user-input");
    if (currentInput) {
      currentInput.removeEventListener("keydown", handleInput);
      currentInput.parentElement.remove();
    }
    clearTerminal();
    await displayWelcome();
    return;
  }
  const parts = cmd.split(" ");
  const command = parts[0];

  switch (command) {
    case "help":
      displayHelp();
      break;
    case "about":
      displayAbout();
      break;
    case "skills":
      displaySkills();
      break;
    case "projects":
      displayProjects();
      break;
    case "contact":
      displayContact();
      break;
    case "clear":
      clearTerminal();
      break;
    case "github":
      window.open(`https://${profile.github}`, "_blank");
      addLine(`<span class="success">Opening GitHub profile...</span>`);
      break;
    case "resume":
      const resumeType = parts[1];
      if (resumeType === "sde") {
        window.open("assets/resume/PranavViswanathan_SDE_FTE.pdf", "_blank");
        addLine(
          `<span class="success">Opening Software Development Resume, please stand by...</span>`
        );
      } else if (resumeType === "aiml") {
        window.open("assets/resume/PranavViswanathan_AIML_FTE.pdf", "_blank");
        addLine(
          `<span class="success">Opening AI/ML Resume, please stand by...</span>`
        );
      } else {
        addLine('<div class="section-title">Available Resumes:</div>');
        addLine(
          '<div class="help-command"><span class="command-name">resume sde</span> - Software Development Resume</div>'
        );
        addLine(
          '<div class="help-command"><span class="command-name">resume aiml</span> - AI/ML Resume</div>'
        );
      }
      break;
    case "whoami":
      addLine(profile.name);
      break;
    case "pwd":
      addLine("/home/pranav/portfolio");
      break;
    case "ls":
      addLine("about.txt  skills.txt  projects/  contact.txt  README.md");
      break;

    case "cd ~":
      clearTerminal();
      displayWelcome();
      break;
    case "sudo":
      hackerboi();
      break;
    case "webpage-view":
      window.open("webpage.html", "_self");
      addLine(`<span class="success">Opening webpage view...</span>`);
      break;
    // case 'play-game':
    //     game();
    //     break;
    case "photography-page-viewer":
      window.open("photography.html");
      addLine(`<span class="success"> Opening albums...</span>`);
      break;
    default:
      addLine(`<span class="error">Command not found: ${command}</span>`);
      addLine('Type "help" to see available commands');
      break;
  }
  addLine("");
}

function displayHelp() {
  addLine('<div class="section-title">Available Commands:</div>');
  const commands = [
    { cmd: "about", desc: "Learn more about me" },
    { cmd: "skills", desc: "View my technical skills" },
    { cmd: "projects", desc: "Browse my projects" },
    { cmd: "contact", desc: "Get my contact information" },
    { cmd: "github", desc: "Open my GitHub profile" },
    { cmd: "resume", desc: "View my resume" },
    { cmd: "clear", desc: "Clear the terminal" },
    //{ cmd: 'play-game', desc: 'Play a quick game of hangman'},
    { cmd: "help", desc: "Show this help message" },
    {
      cmd: "webpage-view",
      desc: "View a traditional webpage version of my porfolio.",
    },
  ];

  commands.forEach((item) => {
    addLine(
      `<div class="help-command"><span class="command-name">${item.cmd}</span> - ${item.desc}</div>`
    );
  });
}

function displayAbout() {
  addLine('<div class="section-title">About Me</div>');
  addLine(
    `<div class="info-item"><span class="label">Name:</span><span class="value">${profile.name}</span></div>`
  );
  addLine(
    `<div class="info-item"><span class="label">Title:</span><span class="value">${profile.title}</span></div>`
  );
  addLine(
    `<div class="info-item"><span class="label">Education:</span><span class="value">${profile.education}</span></div>`
  );
  addLine(
    `<div class="info-item"><span class="label">Location:</span><span class="value">${profile.location}</span></div>`
  );
  addLine("");
  addLine(`<div class="info-item">${profile.about}</div>`);
}

function displaySkills() {
  addLine('<div class="section-title">Technical Skills</div>');

  addLine('<div class="info-item"><span class="label">Languages:</span></div>');
  let langTags = '<div class="info-item">';
  skills.languages.forEach((lang) => {
    langTags += `<span class="skill-tag">${lang}</span>`;
  });
  langTags += "</div>";
  addLine(langTags);

  addLine(
    '<div class="info-item"><span class="label">Frameworks:</span></div>'
  );
  let frameworkTags = '<div class="info-item">';
  skills.frameworks.forEach((fw) => {
    frameworkTags += `<span class="skill-tag">${fw}</span>`;
  });
  frameworkTags += "</div>";
  addLine(frameworkTags);

  addLine('<div class="info-item"><span class="label">Tools:</span></div>');
  let toolTags = '<div class="info-item">';
  skills.tools.forEach((tool) => {
    toolTags += `<span class="skill-tag">${tool}</span>`;
  });
  toolTags += "</div>";
  addLine(toolTags);

  addLine(
    '<div class="info-item"><span class="label">Cloud-Tech:</span></div>'
  );
  let cloudTags = '<div class="info-item">';
  skills.cloud.forEach((cloud) => {
    cloudTags += `<span class="skill-tag">${cloud}</span>`;
  });
  cloudTags += "</div>";
  addLine(cloudTags);

  addLine('<div class="info-item"><span class="label">Domains:</span></div>');
  let domainTags = '<div class="info-item">';
  skills.domains.forEach((domain) => {
    domainTags += `<span class="skill-tag">${domain}</span>`;
  });
  domainTags += "</div>";
  addLine(domainTags);
}

function displayProjects() {
  addLine('<div class="section-title">Featured Projects</div>');
  projects.forEach((project) => {
    let projectHTML = `
                    <div class="project-card">
                        <div class="project-name">${project.name}</div>
                        <div class="project-desc">${project.description}</div>
                        <div class="project-lang">Language: ${
                          project.language
                        }</div>
                        <div class="project-lang">Topics: ${project.topics.join(
                          ", "
                        )}</div>
                        <a href="${
                          project.url
                        }" target="_blank" class="project-link">View on GitHub →</a>
                    </div>
                `;
    addLine(projectHTML);
  });
}

function displayContact() {
  addLine('<div class="section-title">Contact Information</div>');
  addLine(
    `<div class="info-item"><span class="label">Email:</span><span class="value">${profile.email}</span></div>`
  );
  addLine(
    `<div class="info-item"><span class="label">GitHub:</span><span class="value link" onclick="window.open('https://${profile.github}', '_blank')">${profile.github}</span></div>`
  );
  addLine(
    `<div class="info-item"><span class="label">LinkedIn:</span><span class="value link" onclick="window.open('https://${profile.linkedin}', '_blank')">${profile.linkedin}</span></div>`
  );
  addLine("");
  addLine(
    '<div class="info-item"><span class="success">Feel free to reach out for collaboration or opportunities!</span></div>'
  );
}

function clearTerminal() {
  terminal.innerHTML = "";
}

function hackerboi() {
  addLine(`<span class="error">AH HA! We have a hacker here don't we?</span>`);
}

function game() {
  const words = [
    "python",
    "javascript",
    "terminal",
    "machine",
    "learning",
    "docker",
    "kubernetes",
    "algorithm",
    "database",
    "software",
    "engineer",
    "computer",
    "network",
    "security",
    "pipeline",
    "framework",
    "react",
    "github",
  ];

  const word = words[Math.floor(Math.random() * words.length)];
  let guessedLetters = [];
  let wrongGuesses = 0;
  const maxWrongs = 6;

  const hangmanStages = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
  ];

  function displayWord() {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  }

  function checkWin() {
    return word.split("").every((letter) => guessedLetters.includes(letter));
  }

  function displayGame() {
    addLine('<div class="section-title">HANGMAN GAME</div>');
    addLine(`<pre class="ascii-art">${hangmanStages[wrongGuesses]}</pre>`);
    addLine(
      `<div class="info-item"><span class="label">Word:</span><span class="value">${displayWord()}</span></div>`
    );
    addLine(
      `<div class="info-item"><span class="label">Wrong guesses:</span><span class="error">${wrongGuesses}/${maxWrongs}</span></div>`
    );
    if (guessedLetters.length > 0) {
      addLine(
        `<div class="info-item"><span class="label">Guessed:</span><span class="value">${guessedLetters.join(
          ", "
        )}</span></div>`
      );
    }
    addLine("");
  }

  function playHangman(letter) {
    if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
      addLine(`<span class="error">Please enter a single letter (a-z)</span>`);
      addLine("");
      promptGuess();
      return;
    }

    if (guessedLetters.includes(letter)) {
      addLine(`<span class="error">You already guessed '${letter}'!</span>`);
      addLine("");
      promptGuess();
      return;
    }

    guessedLetters.push(letter);

    if (word.includes(letter)) {
      addLine(
        `<span class="success">Correct! '${letter}' is in the word!</span>`
      );
    } else {
      wrongGuesses++;
      addLine(
        `<span class="error">Wrong! '${letter}' is not in the word.</span>`
      );
    }
    addLine("");

    if (checkWin()) {
      displayGame();
      addLine(
        `<span class="success">🎉 Congratulations! You won! The word was '${word}'!</span>`
      );
      addLine("");
      resumeNormalInput();
    } else if (wrongGuesses >= maxWrongs) {
      displayGame();
      addLine(
        `<span class="error">💀 Game Over! The word was '${word}'.</span>`
      );
      addLine("");
      resumeNormalInput();
    } else {
      displayGame();
      promptGuess();
    }
  }

  function promptGuess() {
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-line";
    inputContainer.innerHTML = `
            <span class="prompt">guess a letter:</span>
            <input type="text" id="game-input" maxlength="1" autofocus>
        `;
    terminal.appendChild(inputContainer);

    const input = document.getElementById("game-input");
    input.focus();

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const guess = input.value.trim().toLowerCase();
        addLine(
          `<span class="prompt">guess a letter:</span> <span class="command">${input.value}</span>`
        );
        input.removeEventListener("keydown", arguments.callee);
        input.parentElement.remove();
        playHangman(guess);
      }
    });

    terminal.scrollTop = terminal.scrollHeight;
  }

  function resumeNormalInput() {
    createInputLine();
  }

  displayGame();
  promptGuess();
}
function initializeLoader() {
  const loaderBody = document.getElementById("loaderBody");
  const loader = document.getElementById("fullscreenLoader");

  const steps = [
    { command: "Checking system requirements", output: "[OK]", delay: 300 },
    { command: "Loading dependencies", output: "[OK]", delay: 400 },
    {
      command: "Initializing terminal environment",
      output: "[OK]",
      delay: 500,
    },
    { command: "Compiling portfolio data", output: "[OK]", delay: 400 },
    { command: "Loading projects database", output: "[OK]", delay: 600 },
    { command: "Establishing connection", output: "[OK]", delay: 400 },
    { command: "Rendering interface", output: "[OK]", delay: 500 },
  ];

  let currentStep = 0;
  let progress = 0;

  const initialContent = `
        <div class="loader-line">
            <span class="loader-prompt">pranav@portfolio:~$</span>
            <span class="loader-command">./initialize_portfolio.sh</span>
        </div>
        <div class="loader-output">Initializing...</div>
        <div class="loader-progress-bar">
            <div class="loader-progress-fill" id="loaderProgressFill"></div>
        </div>
        <div class="loader-line">
            <span class="loader-percentage" id="loaderPercentage">0%</span>
        </div>
    `;

  loaderBody.innerHTML = initialContent;

  const progressFill = document.getElementById("loaderProgressFill");
  const percentageDisplay = document.getElementById("loaderPercentage");

  function executeStep() {
    if (currentStep >= steps.length) {
      const successLine = document.createElement("div");
      successLine.className = "loader-line";
      successLine.innerHTML =
        '<span class="loader-output loader-success">✓ Portfolio initialized successfully!</span>';
      loaderBody.appendChild(successLine);

      const launchLine = document.createElement("div");
      launchLine.className = "loader-line";
      launchLine.innerHTML = `
                <span class="loader-prompt">pranav@portfolio:~$</span>
                <span class="loader-command">launch</span>
                <span class="loader-cursor"></span>
            `;
      loaderBody.appendChild(launchLine);

      setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => {
          loader.style.display = "none";
        }, 800);
      }, 800);
      return;
    }

    const step = steps[currentStep];

    const stepLine = document.createElement("div");
    stepLine.className = "loader-line";
    stepLine.innerHTML = `<span class="loader-output">[${currentStep + 1}/${
      steps.length
    }] ${step.command}...</span>`;
    loaderBody.appendChild(stepLine);

    setTimeout(() => {
      stepLine.innerHTML += `<span class="loader-success"> ${step.output}</span>`;

      progress = ((currentStep + 1) / steps.length) * 100;
      progressFill.style.width = progress + "%";
      percentageDisplay.textContent = Math.floor(progress) + "%";

      loaderBody.scrollTop = loaderBody.scrollHeight;

      currentStep++;
      executeStep();
    }, step.delay);
  }

  setTimeout(executeStep, 500);
}

window.addEventListener("load", function () {
  initializeLoader();
});
displayWelcome();
