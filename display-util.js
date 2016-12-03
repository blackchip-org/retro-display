
var __font = function(to) {
    display.println();
    for (var i = 32; i <= to; i++) {
        display.print(String.fromCharCode(i));
    }
    display.println();
    for (var i = 32; i <= to; i++) {
        display.print(String.fromCharCode(i));
    }        
    display.println();
};

var font7 = function() {
    __font(127);
};

var font8 = function() {
    __font(255);
};

var run = function(display, options) {

    options = options || {};

    var showPrompt = function() {
        if (options.prompt) {
            if (typeof options.prompt === "function") {
                options.prompt();
            } else {
                display.print(options.prompt);
            }
        }
    };

    var process = function(command) {
        try {
            if (display.capsLock) {
                command = command.toLowerCase();
            }
            var result = eval(command);
            if (result !== undefined) {
                display.println(result);
            }
        } catch (error) {
            display.println(error);
        }
        showPrompt();
        return true;
    };

    showPrompt();
    display.input(process);
};

var math = Math;
