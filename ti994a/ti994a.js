var display;
 
window.addEventListener("load", function() {

    display = createDisplay({
        cols: 32,
        rows: 24,
        bgColor: "#40e8f0",
        fgColor: "#000",
        font: "TI99",
        fontSize: 16,
        charWidth: 6,
        charHeight: 8,
        scale: 3,
        border: 50,
        borderColor: "#40e8f0",
        borderRadius: 20
    });

    display.y = 22;
    display
        .println("TI BASIC READY")
        .println()

    run(display, {
        prompt: ">"
    });
});
