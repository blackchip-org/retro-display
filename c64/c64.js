var display

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
        bgColor: "#4736ae",
        fgColor: "#8578e2",
        font: "C64",
        fontSize: 8,
        baselineOffset: 1,
        scale: 2,
        capsLock: true,
        border: 50,
        borderColor: "#8578e2",
        borderRadius: 20
    });

    display
        .clear()
        .println()
        .cprintln("**** COMMODORE 64 BASIC V2 ****")
        .println()
        .cprintln("64K RAM SYSTEM  38911 BASIC BYTES FREE")
        .println()
        .println("READY.");
});