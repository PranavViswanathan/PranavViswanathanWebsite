 const terminal = document.getElementById('terminal');
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
            email: "viswanathan.pr@northeastern.edu",
            about: `Hello! I'm Pranav, a Master's student in Computer Science at Northeastern University with a passion for building intelligent systems that solve real-world problems. I love working at the intersection of machine learning and software engineering—taking models from research notebooks to production-grade applications that actually make an impact.\n

I'm drawn to projects that combine data, algorithms, and infrastructure. Whether it's building end-to-end ML pipelines that predict bike-sharing demand across Boston, developing reinforcement learning agents that learn to race, or creating real time anomaly detection systems for industrial equipment—I'm all about turning complex problems into elegant, scalable solutions. There's something deeply satisfying about watching a well-architected system come together.\n

When I'm not coding, you'll find me exploring new frameworks, diving into ML research papers, or optimizing my GitHub workflows. I'm currently seeking Software Engineering, Machine Learning and Data Analyst roles where I can continue building systems that bridge machine learning and software engineering.

`
        };

        const skills = {
            languages: ["Python", "Java", "JavaScript", "C++", "SQL", "R"],
            frameworks: ["TensorFlow", "PyTorch", "React", "Node.js", "Django", "Flask"],
            tools: ["Docker", "Kubernetes", "Git", "AWS", "Apache Airflow", "MLflow"],
            domains: ["Machine Learning", "MLOps", "Computer Vision", "Data Analysis", "Web Development"]
        };

        const projects = [
            {
                name: "BlueBikes-Demand-Prediction",
                description: "ML-based demand prediction system for Boston's bike-sharing network with comprehensive MLOps pipeline",
                language: "Python",
                topics: ["machine-learning", "mlops", "airflow", "mlflow"],
                url: "https://github.com/PranavViswanathan/Optimizing-Bluebikes-Operations-with-Machine-Learning-Based-Demand-Prediction"
            },
            {
                name: "Neuro Pilot",
                description: "A comparative reinforcement learning framework evaluating Q-Learning versus Deep Q-Networks (DQN) on the Gymnasium CarRacing-v3 environment",
                language: "Python",
                topics: ["reinforcement-learning", "deep-learning", "pytorch", "Deep Q-Networks"],
                url: "https://github.com/PranavViswanathan/NeuroPilot"
            },
            {
                name: "Image Manipulation Toolkit",
                description: "A comprehensive image processing toolkit built entirely in Java featuring both CLI and GUI interfaces for advanced image manipulation.",
                language: "Java",
                topics: ["Java", "MVC", "Image-Processing"],
                url: "https://github.com/PranavViswanathan/Image-Manipulation-Toolkit"
            },
            {
                name: "Aegis Nav",
                description: "An embedded computer vision system built on Raspberry Pi 3 with custom-compiled OpenCV 3.3.0 for the Speranza Cieca assistive device.",
                language: "Python",
                topics: ["raspberry-pi", "OpenCV", "embedded-systems"],
                url: "https://github.com/PranavViswanathan/AegisNav"
            },
            {
                name: "SQL Injection Simulation",
                description: "An educational cybersecurity simulation demonstrating SQL injection (SQLI) attack vectors and their exploitation techniques for database manipulation.",
                language: "PHP",
                topics: ["PHP", "SQL", "network-security", "simulation"],
                url: "https://github.com/PranavViswanathan/SQL_Injection_Simulation"
            },
            {
                name: "PranavaOku",
                description: "A lightweight, self-hosted cloud platform built with Flask and Pulumi Automation API for deploying static sites (S3) and virtual machines (EC2) on AWS.",
                language: "Python",
                topics: ["IaaS", "AWS", "Pulumi"],
                url: "https://github.com/PranavViswanathan/PranavaOku"
            }
        ];

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function typeText(text, speed = 30) {
            const line = document.createElement('div');
            line.className = 'output-line';
            terminal.appendChild(line);

            for (let char of text) {
                line.textContent += char;
                await sleep(speed);
                terminal.scrollTop = terminal.scrollHeight;
            }
        }

        function addLine(content, className = '') {
            const line = document.createElement('div');
            line.className = `output-line ${className}`;
            line.innerHTML = content;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }

        async function displayWelcome() {
            await sleep(500);
            addLine(`<pre class="ascii-art">${asciiArt}</pre>`);
            await sleep(300);
            await typeText("Initializing portfolio...", 20);
            await sleep(500);
            await typeText(`Welcome to ${profile.name}'s Terminal Portfolio!`, 20);
            await sleep(300);
            addLine('');
            await typeText('Type "help" to see available commands', 30);
            addLine('');
            createInputLine();
        }

        function createInputLine() {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'input-line';
            inputContainer.innerHTML = `
                <span class="prompt">pranav@portfolio:~$</span>
                <input type="text" id="user-input" autofocus>
            `;
            terminal.appendChild(inputContainer);
            
            const input = document.getElementById('user-input');
            input.focus();
            input.addEventListener('keydown', handleInput);
            
            terminal.scrollTop = terminal.scrollHeight;
        }

        async function handleInput(event) {
            if (event.key === 'Enter') {
                const input = event.target;
                const command = input.value.trim().toLowerCase();
                
                addLine(`<span class="prompt">pranav@portfolio:~$</span> <span class="command">${input.value}</span>`);
                
                input.removeEventListener('keydown', handleInput);
                input.parentElement.remove();
                
                if (command) {
                    commandHistory.unshift(command);
                    historyIndex = -1;
                    await executeCommand(command);
                }
                
                createInputLine();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    event.target.value = commandHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    event.target.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    event.target.value = '';
                }
            }
        }

        async function executeCommand(cmd) {
            if (cmd =='cd ~'){
                clearTerminal();
                displayWelcome();
                return;
            }
            const parts = cmd.split(' ');
            const command = parts[0];

            switch(command) {
                case 'help':
                    displayHelp();
                    break;
                case 'about':
                    displayAbout();
                    break;
                case 'skills':
                    displaySkills();
                    break;
                case 'projects':
                    displayProjects();
                    break;
                case 'contact':
                    displayContact();
                    break;
                case 'clear':
                    clearTerminal();
                    break;
                case 'github':
                    window.open(`https://${profile.github}`, '_blank');
                    addLine(`<span class="success">Opening GitHub profile...</span>`);
                    break;
                case 'resume':
                    const resumeType = parts[1];
                    if (resumeType === 'sde') {
                        window.open('assets/resume/PranavViswanathan_SDE_FTE.pdf', '_blank');
                        addLine(`<span class="success">Opening Software Development Resume, please stand by...</span>`);
                    } else if (resumeType === 'aiml') {
                        window.open('assets/resume/PranavViswanathan_AIML_FTE.pdf', '_blank');
                        addLine(`<span class="success">Opening AI/ML Resume, please stand by...</span>`);
                    } else {
                        addLine('<div class="section-title">Available Resumes:</div>');
                        addLine('<div class="help-command"><span class="command-name">resume sde</span> - Software Development Resume</div>');
                        addLine('<div class="help-command"><span class="command-name">resume aiml</span> - AI/ML Resume</div>');
                    }
                    break;
                case 'whoami':
                    addLine(profile.name);
                    break;
                case 'pwd':
                    addLine('/home/pranav/portfolio');
                    break;
                case 'ls':
                    addLine('about.txt  skills.txt  projects/  contact.txt  README.md');
                    break;
                case 'date':
                    addLine(new Date().toString());
                    break;
                case 'cd ~':
                    clearTerminal();
                    displayWelcome();
                    break;
                default:
                    addLine(`<span class="error">Command not found: ${command}</span>`);
                    addLine('Type "help" to see available commands');
            }
            addLine('');
        }

        function displayHelp() {
            addLine('<div class="section-title">Available Commands:</div>');
            const commands = [
                { cmd: 'about', desc: 'Learn more about me' },
                { cmd: 'skills', desc: 'View my technical skills' },
                { cmd: 'projects', desc: 'Browse my projects' },
                { cmd: 'contact', desc: 'Get my contact information' },
                { cmd: 'github', desc: 'Open my GitHub profile' },
                { cmd: 'resume', desc: 'View my resume' },
                { cmd: 'clear', desc: 'Clear the terminal' },
                { cmd: 'help', desc: 'Show this help message' },

            ];
            
            commands.forEach(item => {
                addLine(`<div class="help-command"><span class="command-name">${item.cmd}</span> - ${item.desc}</div>`);
            });
        }

        function displayAbout() {
            addLine('<div class="section-title">About Me</div>');
            addLine(`<div class="info-item"><span class="label">Name:</span><span class="value">${profile.name}</span></div>`);
            addLine(`<div class="info-item"><span class="label">Title:</span><span class="value">${profile.title}</span></div>`);
            addLine(`<div class="info-item"><span class="label">Education:</span><span class="value">${profile.education}</span></div>`);
            addLine(`<div class="info-item"><span class="label">Location:</span><span class="value">${profile.location}</span></div>`);
            addLine('');
            addLine(`<div class="info-item">${profile.about}</div>`);
        }

        function displaySkills() {
            addLine('<div class="section-title">Technical Skills</div>');
            
            addLine('<div class="info-item"><span class="label">Languages:</span></div>');
            let langTags = '<div class="info-item">';
            skills.languages.forEach(lang => {
                langTags += `<span class="skill-tag">${lang}</span>`;
            });
            langTags += '</div>';
            addLine(langTags);
            
            addLine('<div class="info-item"><span class="label">Frameworks:</span></div>');
            let frameworkTags = '<div class="info-item">';
            skills.frameworks.forEach(fw => {
                frameworkTags += `<span class="skill-tag">${fw}</span>`;
            });
            frameworkTags += '</div>';
            addLine(frameworkTags);
            
            addLine('<div class="info-item"><span class="label">Tools:</span></div>');
            let toolTags = '<div class="info-item">';
            skills.tools.forEach(tool => {
                toolTags += `<span class="skill-tag">${tool}</span>`;
            });
            toolTags += '</div>';
            addLine(toolTags);
            
            addLine('<div class="info-item"><span class="label">Domains:</span></div>');
            let domainTags = '<div class="info-item">';
            skills.domains.forEach(domain => {
                domainTags += `<span class="skill-tag">${domain}</span>`;
            });
            domainTags += '</div>';
            addLine(domainTags);
        }

        function displayProjects() {
            addLine('<div class="section-title">Featured Projects</div>');
            projects.forEach(project => {
                let projectHTML = `
                    <div class="project-card">
                        <div class="project-name">${project.name}</div>
                        <div class="project-desc">${project.description}</div>
                        <div class="project-lang">Language: ${project.language}</div>
                        <div class="project-lang">Topics: ${project.topics.join(', ')}</div>
                        <a href="${project.url}" target="_blank" class="project-link">View on GitHub →</a>
                    </div>
                `;
                addLine(projectHTML);
            });
        }

        function displayContact() {
            addLine('<div class="section-title">Contact Information</div>');
            addLine(`<div class="info-item"><span class="label">Email:</span><span class="value">${profile.email}</span></div>`);
            addLine(`<div class="info-item"><span class="label">GitHub:</span><span class="value link" onclick="window.open('https://${profile.github}', '_blank')">${profile.github}</span></div>`);
            addLine(`<div class="info-item"><span class="label">LinkedIn:</span><span class="value link" onclick="window.open('https://${profile.linkedin}', '_blank')">${profile.linkedin}</span></div>`);
            addLine('');
            addLine('<div class="info-item"><span class="success">Feel free to reach out for collaboration or opportunities!</span></div>');
        }

        function clearTerminal() {
            terminal.innerHTML = '';
        }

        displayWelcome();