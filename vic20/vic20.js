var display;
 
window.addEventListener("load", function() {

    display = createDisplay({
        cols: 22,
        rows: 23,
        bgColor: "#fff",
        fgColor: "#3710de",
        font: "VIC20",
        fontSize: 8,
        charWidth: 16,
        scale: 2
    });

    display
        .println("**** CBM BASIC V2 ****")
        .println("3853 BYTES FREE")
        .println()
        .println("READY.");
});
