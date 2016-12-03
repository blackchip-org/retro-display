
var createDisplay = function(options) {

    options = options || {};
    var self = {};
    
    var canvasId = options.id || "display";
    var cols = options.cols || 80;
    var rows = options.rows || 40;
    var font = options.font || "monospace";
    var fontSize = options.fontSize || 8;
    var charWidth = options.charWidth || fontSize;
    var charHeight = options.charHeight || fontSize; 
    var baselineOffset = options.baselineOffset || 0; 
    var scale = options.scale || 1;

    self.background = options.background || "#444";
    self.foreground = options.foreground || "#ccc";

    var displayWidth = charWidth * cols * scale;
    var displayHeight = charHeight * rows * scale;
    var keyTime = 0;
    var keyPressed = false;
    var frameTimer = null;

    var canvas = document.getElementById(canvasId);
    var g = canvas.getContext("2d");

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    self.buffer = [];
    self.x = 0;
    self.y = 0;
    self.capsLock = options.capsLock || false;

    self.print = function(text) {
        for (var i = 0; i < text.length; i++) {
            charout(text[i]);
        }
        return self;
    };

    self.println = function(text) {
        if (!text) {
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
        self.x = cols - text.length;
        self.print(text);
        return self;
    };

    self.backspace = function() {
        self.buffer[self.x][self.y].text = " ";
        self.left();
    };

    self.scroll = function() {
        for (var x = 0; x < cols; x++) {
            self.buffer[x].shift();
            self.buffer[x][height - 1] = {
                text: " ",
                foreground: self.foreground, 
                background: self.background
            }
        }
        return self;
    };

    self.clear = function() {
        for (var x = 0; x < cols; x++) {
            self.buffer[x] = [];
            for (var y = 0; y < rows; y++) {
                self.buffer[x][y] = {
                    text: " ",
                    foreground: self.foreground, 
                    background: self.background
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
        var sx = x * charWidth * scale;
        var sy1 = y * charHeight * scale;
        var sy2 = (y + 1) * charHeight * scale;

        g.fillStyle = cell.background;
        g.fillRect(sx, sy1, charWidth * scale, charHeight * scale);

        g.fillStyle = cell.foreground;
        g.fillText(cell.text, sx, sy2 - (baselineOffset * scale)); 
    };

    var renderCursor = function(time) {
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
            foreground: cell.background,
            background: cell.foreground
        });
    };

    var render = function(time) {
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
        if (self.y < cols - 1) {
            self.y += 1;
            if (self.y >= rows) {
                self.y = rows - 1;
            }
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
            self.x = 0;
        }
    };

    self.right = function() {
        self.x += 1;
        if (self.x >= cols) {
            self.x = cols - 1;
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
        if (self.capsLock) {
            char = char.toUpperCase();
        }
        if (char === "\n") {
            nextLine();
        } else {
            self.buffer[self.x][self.y].text = char;
            advance();
        }
    };



    // Use down for repeat events
    var keydown = function(event) {
        keyPressed = true;
        if (event.keyCode === 38) {
            self.up();
        } else if (event.keyCode === 40) {
            self.down();
        } else if (event.keyCode === 37) {
            self.left();
        } else if (event.keyCode === 39) {
            self.right();
        } else if (event.keyCode === 8) {
            self.backspace();
        } else if (event.keyCode === 13) {
            self.println();
        }
    };

    var keypress = function(event) {
        if (event.keyCode < 32) {
            return;
        }
        self.print(event.key);
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

