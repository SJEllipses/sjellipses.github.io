document.addEventListener('DOMContentLoaded', function () {
    const terminalContent = document.getElementById('terminal-content');

    // const welcomeMessage = document.querySelector('.welcome-message');

    // command history
    let commandHistory = [];
    let historyIndex = -1;
    let currentInput = null;

    // available commands
    const commands = {
        help: function () {
            const helpMessage = 'Available commands:\n';
            const helps = [
                ["help", "Show this help message"],
                ["ls", "List files"],
                ["clear", "Clear the outputs"],
                ["cls", "Clear the outputs (alias for clear)"],
                ["date", "Show current date and time"],
                ["echo [text]", "Echo back the text"],
                ["about", "About me"],
                ["github", "Go to my github page"],
                ["repo", "Go to the repository of this page"]
            ];
            let helpString = '';
            for (const [cmd, message] of helps) {
                helpString += cmd.padEnd(16, ' ') + message.padEnd(16, ' ') + "\n";
            }

            return helpMessage + helpString;
        },
        ls: 'sayhello\tsaygoodbye',
        clear: function () {
            terminalContent.innerHTML = '';
            // addCommandLine();
        },
        cls: function () { commands.clear(); },
        date: function () { return new Date().toString(); },
        echo: function (args) { return args.join(' '); },
        "./sayhello": function () { alert('Hello!'); },
        "./saygoodbye": function () {
            if (navigator.language == "zh-CN") {
                window.open("https://www.bilibili.com/video/BV1GJ411x7h7/?t=54.5")
            } else {
                window.open("https://youtu.be/dQw4w9WgXcQ?t=54")
            }
        },
        about: 'Ellipses\nSoftware Engineer\nGithub: https://github.com/SJEllipses\nContact me: sjellipses@gmail.com',
        github: function () { window.open("https://github.com/SJEllipses"); },
        repo: function () { window.open("https://github.com/SJEllipses/sjellipses.github.io"); },
    };

    // add input line
    function addCommandLine() {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';

        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.innerHTML =
            '<span style="color:#00ff00;">player@earth-online</span>' +
            '<span style="color:white;">:</span>' +
            '<span style="color:#00aaff;">~</span>' +
            '<span style="color:white;">$</span>&nbsp;';

        const input = document.createElement('input');
        input.className = 'command-input';
        input.type = 'text';

        commandLine.appendChild(prompt);
        commandLine.appendChild(input);
        terminalContent.appendChild(commandLine);

        terminalContent.scrollTop = terminalContent.scrollHeight;

        setupInputEvents(input);
        input.focus();

        currentInput = input;
    }

    // input events
    function setupInputEvents(input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const commandText = input.value.trim();
                if (commandText) {
                    executeCommand(commandText);
                }
                else{
                    addCommandLine();
                }

                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                    e.preventDefault();
                } else if (commandHistory.length > 0 && historyIndex === -1) {
                    historyIndex = commandHistory.length - 1;
                    input.value = commandHistory[historyIndex];
                    e.preventDefault();
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                    e.preventDefault();
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                    e.preventDefault();
                }
            }
        });
    }

    // execute command
    function executeCommand(input) {
        // add to history
        commandHistory.push(input);
        historyIndex = commandHistory.length;

        const output = document.createElement('div');
        output.className = 'command-output';

        // analyze command
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // run commands
        let result;
        if (commands.hasOwnProperty(command)) {
            const cmd = commands[command];
            if (typeof cmd === 'function') {
                result = cmd(args);
            } else {
                result = cmd;
            }
        } else {
            result = `'${command}' is not recognized as an internal command.`;
        }

        // display output
        output.textContent = result || '';
        terminalContent.appendChild(output);

        addCommandLine();
    }

    addCommandLine();

    terminalContent.addEventListener('click', function () {
        if (currentInput) {
            currentInput.focus();
        }
    });
});