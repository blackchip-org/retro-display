
var createDisplay = function(options) {

    options = options || {};
    var self = {};
    
    var canvasId = options.id || "display";

    var cols = options.cols || 80;
    var rows = options.rows || 40;
    var padding = options.padding || 0;

    var font = options.font || "monospace";
    var fontSize = options.fontSize || 8;
    var charWidth = options.charWidth || fontSize;
    var charHeight = options.charHeight || fontSize; 
    var baselineOffset = options.baselineOffset || 0; 
    var scale = options.scale || 1;

    var displayWidth = (charWidth * cols * scale) + (padding * 2);
    var displayHeight = (charHeight * rows * scale) + (padding * 2);

    var keyHandled = false;
    var keyTime = 0;
    var keyPressed = false;
    var frameTimer = null;

    var inputBuffer = [];
    var inputStart = {};
    var inputPos = 0;
    var inputCallback = null;

    var overflow = [];

    var canvas = document.getElementById(canvasId);
    var g = canvas.getContext("2d");

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    self.buffer = [];
    self.x = options.x || 0;
    self.y = options.y || 0;
    self.caps = options.caps || false;
    self.scrollLock = options.scrollLock || false;
    self.bgColor = options.bgColor || "#444";
    self.fgColor = options.fgColor || "#ccc";
    self.border = options.border || 0;
    self.borderColor = options.borderColor || "#000";
    self.borderRadius = options.borderRadius || 0;
    self.free = options.free || false;

    self.print = function(text) {
        for (var i = 0; i < text.length; i++) {
            charout(text[i]);
        }
        return self;
    };

    self.println = function(text) {
        if (text === undefined) {
            text = "";
        }
        self.print(text + "\n");
        return self;
    };

    self.cprintln = function(text) {
        self.x = (cols / 2) - Math.floor(text.length / 2);
        if (self.x < 0) {
            self.x = 0;
        }
        self.println(text);
        return self;
    };

    self.rprint = function(text) {
        var previousScrollLock = self.scrollLock;
        self.scrollLock = true;
        self.x = cols - text.length;
        self.print(text);
        self.scrollLock = previousScrollLock;
        return self;
    };

    self.printAt = function(x, y, text) {
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            if (self.caps) {
                char = char.toUpperCase();
            }
            self.buffer[x][y].text = char;
            x += 1;
            if (x >= cols) {
                x = 0;
                if (y === rows - 1) {
                    self.scroll();
                } else {
                    y += 1;
                }
            }
        }
    };

    self.lineAt = function(y) {
        var result = "";
        for (var x = 0; x < cols; x++) {
            result += self.buffer[x][y].text;
        }
        return result.trim();
    };

    self.color = function(fgColor, bgColor) {
        self.fgColor = fgColor;
        if (bgColor) {
            self.bgColor = bgColor;
        }
        return this;
    };

    self.backspace = function() {
        if (self.free) {
            self.left();
            self.buffer[self.x][self.y].text = " ";
        } else if (inputCallback) {
            if (inputPos > 0) {
                inputBuffer.splice(inputPos - 1, 1);
                inputBuffer.push(" ");
                inputPos -= 1;
                self.left();
                self.printAt(inputStart.x, inputStart.y, inputBuffer);
            }
        }
    };

    self.scroll = function() {
        if (self.scrollLock) {
            return;
        }
        for (var x = 0; x < cols; x++) {
            self.buffer[x].shift();
            self.buffer[x][rows - 1] = {
                text: " ",
                fgColor: self.fgColor,
                bgColor: self.bgColor
            }
        }
        if (inputStart) {
            inputStart.y -= 1;
        }
        return self;
    };

    self.input = function(callback) {
        inputBuffer = [];
        inputPos = 0;
        inputStart = {x: self.x, y: self.y};
        inputCallback = callback;
    };

    self.clear = function() {
        for (var x = 0; x < cols; x++) {
            self.buffer[x] = [];
            for (var y = 0; y < rows; y++) {
                overflow[y] = {previous: false, next: false};
                self.buffer[x][y] = {
                    text: " ",
                    fgColor: self.fgColor,
                    bgColor: self.bgColor
                }
            }
        }
        return self;
    };

    self.reset = function() {
        self.clear();
        self.x = 0;
        self.y = 0;
    };

    var renderCell = function(x, y, cell) {
        var sx = (x * charWidth * scale) + padding;
        var sy1 = (y * charHeight * scale) + padding;
        var sy2 = ((y + 1) * charHeight * scale) + padding;

        g.fillStyle = cell.bgColor;
        g.fillRect(sx, sy1, charWidth * scale, charHeight * scale);

        g.fillStyle = cell.fgColor;
        g.fillText(cell.text, sx, sy2 - (baselineOffset * scale)); 
    };

    var renderCursor = function(time) {
        if (!inputCallback && !self.free) {
            return;
        }
        if (keyPressed) {
            keyPressed = false;
            keyTime = time;
        }

        var checkTime = time - keyTime;
        if (checkTime % 1000 > 500) {
            return;
        }
        var cell = self.buffer[self.x][self.y];
        renderCell(self.x, self.y, {
            text: cell.text, 
            fgColor: cell.bgColor,
            bgColor: cell.fgColor
        });
    };

    var render = function(time) {
        var previousBorder = window.getComputedStyle(canvas, null);
        var currentBorder = "0px none rgb(0, 0, 0)";
        if (self.border > 0) {
            currentBorder = self.border + "px solid " + self.borderColor;
        }
        if (currentBorder !== previousBorder) {
            canvas.style.border = currentBorder;
            canvas.style.borderRadius = self.borderRadius + "px";
        }

        g.fillStyle = self.bgColor;
        g.fillRect(0, 0, displayWidth, displayHeight);

        var scaledFontSize = fontSize * scale;
        g.font = scaledFontSize + "px " + font; 
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                renderCell(x, y, self.buffer[x][y]);
            }
        }
        frameTimer = window.requestAnimationFrame(render);
        renderCursor(time);
    };

    var nextLine = function() {
        self.x = 0;
        if (self.y < rows - 1) {
            self.y += 1;
        } else {
            self.scroll();
        }
    };

    var advance = function() {
        self.x += 1;
        if (self.x >= cols) {
            nextLine();
        }
    };

    self.left = function() {
        self.x -= 1;
        if (self.x < 0) {
            if (self.y > 0) {
                self.x = cols - 1;
                self.y -= 1;
            } else {
                self.x = 0;
            }
        }
    };

    self.right = function() {
        self.x += 1;
        if (self.x >= cols) {
            self.x = 0; 
            if (self.y === rows - 1) {
                self.scroll();
            } else {
                self.y += 1
            }
        }
    };

    self.up = function() {
        self.y -= 1;
        if (self.y < 0) {
            self.y = 0;
        }
    };

    self.down = function() {
        self.y += 1;
        if (self.y >= rows) {
            self.y = rows - 1;
        }
    };

    var charout = function(char) {
        if (self.caps) {
            char = char.toUpperCase();
        }
        if (char === "\n") {
            nextLine();
        } else {
            self.buffer[self.x][self.y] = {
                text: char,
                bgColor: self.bgColor,
                fgColor: self.fgColor
            };
            advance();
        }
    };

    var previousChar = function() {
        if (self.free) {
            self.left();
            return;
        }
        if (!inputCallback) {
            return;
        }
        if (inputPos <= 0) {
            return;
        }
        self.left();
        inputPos -= 1;
    };

    var nextChar = function() {
        if (self.free) {
            self.right();
            return;
        }
        if (!inputCallback) {
            return;
        }
        if (inputPos >= inputBuffer.length) {
            return;
        }
        self.right();
        inputPos += 1;
    };

    // Use down for repeat events
    var keydown = function(event) {
        keyPressed = true;
        keyHandled = true;
        if (event.keyCode === 38 && self.free) {
            self.up();
        } else if (event.keyCode === 40 && self.free) {
            self.down();
        } else if (event.keyCode === 37) {
            previousChar();
        } else if (event.keyCode === 39) {
            nextChar();
        } else if (event.keyCode === 8) {
            self.backspace();
            event.preventDefault();
        } else if (event.keyCode === 13) {
            self.println();
            handleInput();
        } else {
            keyHandled = false;
        }
    };

    var keypress = function(event) {
        if (keyHandled) {
            keyHandled = false;
            return;
        }
        if (self.free) {
            self.print(event.key);
            if (self.x === 0) {
                overflow[self.y].previous = true;
                overflow[self.y - 1].next = true;
            }
        } else if (inputCallback) {
            inputBuffer.splice(inputPos, 0, event.key);
            inputPos += 1;
            //console.log("buffer", inputBuffer);
            self.right();
            self.printAt(inputStart.x, inputStart.y, inputBuffer);
        }
    };

    var handleInput = function() {
        if (!inputCallback) {
            return;
        }
        var result = "";
        if (self.free) {
            var result = self.lineAt(self.y - 1);
        } else {
            var result = inputBuffer.join("").trim();
        }
        // Save reference in case the callback wants to reschedule
        var callback = inputCallback;
        inputCallback = null;
        callback(result);
    };

    self.stop = function() {
        window.cancelAnimationFrame(frameTimer);
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keypress", keypress);
    };

    self.start = function() {
        self.stop();
        frameTimer = window.requestAnimationFrame(render);
        window.addEventListener("keydown", keydown);
        window.addEventListener("keypress", keypress);
    };

    self.clear();
    self.start();

    return self;
};

