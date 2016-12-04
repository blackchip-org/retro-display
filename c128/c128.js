var display;

var boxTest = function() {
    display.println("\ue0b0\u2500\u252c\u2500\u2510");
    display.println("\ue0dd \u2502 \u2502");
    display.println("\u251c\u2500\u253c\u2500\u2524");
    display.println("\u2502 \u2502 \u2502");
    display.println("\u2514\u2500\u2534\u2500\u2518");
};

window.addEventListener("load", function() {
    display = createDisplay({
        cols: 40,
        rows: 25,
        bgColor: "#606060",
        fgColor: "#b2ed8a",
        font: "C128",
        fontSize: 8,
        baselineOffset: 1,
        scale: 2,
        border: 50,
        borderColor: "#b2ed8a",
        borderRadius: 20
    });

    display
        .clear()
        .println()
        .cprintln("COMMODORE BASIC V7.0 122365 BYTES FREE")
        .cprintln("(C)1986 COMMODORE ELECTRONICS, LTD.")
        .cprintln("(C)1977 MICROSOFT CORP.")
        .cprintln("ALL RIGHTS RESERVED");

    run(display, {
        prompt: "\nREADY.\n"
    });

});