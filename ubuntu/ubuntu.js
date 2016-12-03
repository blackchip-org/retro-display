var display;
 
var ubuntu = function() {
    var self = {};

    self.boot = function() {
        display
            .clear()
            .print("root@localhost:/# ");
    };

    return self;
}();

window.addEventListener("load", function() {
    display = createDisplay({
        cols: 80,
        rows: 40,
        background: "#310a25",
        font: "Ubuntu",
        fontSize: 16,
        charHeight: 18,
        charWidth: 10,
        charHeightOffset: 2
    });
    ubuntu.boot();
});