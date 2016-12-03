var display;
 
var c64 = function() {
    var self = {};

    self.boot = function() {
        display
            .clear()
            .println()
            .cprintln("**** COMMODORE 64 BASIC V2 ****")
            .println()
            .cprintln("64K RAM SYSTEM  38911 BASIC BYTES FREE")
            .println()
            .println("READY.");
    };

    self.fontTest = function() {
        display.reset();
        for (var i = 32; i <= 127; i++) {
            display.print(String.fromCharCode(i));
        }
        display.ln();
        for (var i = 32; i <= 127; i++) {
            display.print(String.fromCharCode(i));
        }        
        display.ln();
        display.ln();
        display.println("\u250c\u2534");
        display.println("\u2514\u2534");
    };

    return self;
}();

window.addEventListener("load", function() {
    display = createDisplay({
        cols: 40,
        rows: 25,
        background: "#4040e0",
        foreground: "#a0a0fc",
        font: "C64",
        fontSize: 20,
        charWidth: 20,
        charHeight: 23,
        charHeightOffset: 3,
    });
    c64.boot();
});