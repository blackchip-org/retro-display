
var fontTest7 = function(spec) {
    var device = spec || display;
    for (var i = 32; i <= 127; i++) {
        device.print(String.fromCharCode(i));
    }
    device.println();
    for (var i = 32; i <= 127; i++) {
        device.print(String.fromCharCode(i));
    }        
    device.println();
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