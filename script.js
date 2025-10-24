$(function() {
    $('#terminal').terminal(function(command) {
        if (command === 'help') {
            this.echo('Available commands: help, hello, clear');
        } else if (command === 'hello') {
            this.echo('Hello, world!');
        } else if (command === 'clear') {
            this.clear();
        } else {
            this.echo('Unknown command: ' + command);
        }
    }, {
        greetings: 'Welcome to Terminal Blog\nType "help" for commands',
        name: 'blog_terminal',
        prompt: '> ',
        height: '100%', // Full height
        width: '100%'  // Full width
    });
});