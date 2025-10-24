$(function() {
    // Sample blog data (id: {title, content})
    const blogs = {
        '001': {
            title: 'My First Post',
            content: [
                'Line 1: Welcome to my blog!',
                'Line 2: This is a terminal-based site.',
                'Line 3: Use hjkl to navigate.',
                'Line 4: Press q to quit.',
                // Add more lines as needed...
            ]
        },
        '002': {
            title: 'Second Post',
            content: [
                'Line 1: Another entry.',
                'Line 2: More content here.',
                // etc.
            ]
        }
    };

    // Function to list blogs
    function listBlogs(term) {
        term.echo('Available posts:');
        for (const id in blogs) {
            term.echo(`${id} - ${blogs[id].title}`);
        }
    }

    // Vim-like viewer state
    function createVimInterpreter(id, term) {
        const content = blogs[id].content;
        let currentLine = 0; // Starting line
        let horizontalOffset = 0; // For long lines
        const pageSize = 20; // Lines per "page" (adjust based on terminal height)

        // Display current view
        function displayContent() {
            term.clear();
            term.echo(`Viewing: ${blogs[id].title} (hjkl to navigate, q to quit)`);
            for (let i = 0; i < pageSize; i++) {
                const lineIndex = currentLine + i;
                if (lineIndex < content.length) {
                    const line = content[lineIndex].substring(horizontalOffset);
                    term.echo(line);
                }
            }
            term.echo('-- INSERT MODE SIMULATION --'); // Mimic vim footer
        }

        displayContent(); // Initial display

        // Return options for pushed interpreter
        return {
            prompt: '', // No prompt in vim mode
            keydown: function(e) {
                const key = e.key.toLowerCase();
                if (key === 'j' && currentLine + pageSize < content.length) {
                    currentLine++; // Down
                } else if (key === 'k' && currentLine > 0) {
                    currentLine--; // Up
                } else if (key === 'l') {
                    horizontalOffset++; // Right (if line is long)
                } else if (key === 'h' && horizontalOffset > 0) {
                    horizontalOffset--; // Left
                } else if (key === 'q') {
                    term.pop(); // Exit vim mode
                    return false;
                }
                displayContent(); // Refresh view
                return false; // Prevent default terminal behavior
            },
            interpreter: function() {} // Empty interpreter (no Enter-based commands)
        };
    }

    $('#terminal').terminal(function(command) {
        const args = command.split(' ');
        if (args[0] === 'ls') {
            listBlogs(this);
        } else if (args[0] === 'open' && args[1] in blogs) {
            const vimOptions = createVimInterpreter(args[1], this);
            this.push(vimOptions.interpreter, vimOptions);
        } else if (command === 'help') {
            this.echo('Available commands: help, ls (list posts), open <id> (view post), clear');
        } else if (command === 'clear') {
            this.clear();
        } else {
            this.echo('Unknown command: ' + command);
        }
    }, {
        greetings: 'Welcome to Terminal Blog\nType "ls" to list posts, "open <id>" to view',
        name: 'blog_terminal',
        prompt: '> ',
        height: '100%',
        width: '100%'
    });
});