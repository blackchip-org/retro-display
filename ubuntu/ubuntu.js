var display;

window.addEventListener("load", function() {
    textColor = "#eee";

    display = createDisplay({
        cols: 80,
        rows: 40,
        bgColor: "#310a25",
        fgColor: textColor,
        font: "Ubuntu",
        fontSize: 16,
        charHeight: 18,
        charWidth: 8,
        baselineOffset: 3
    });

    display
        .clear()
        .println("Welcome to Ubuntu 12.04.2 LTS (GNU/Linux 3.2.0-25-virtual x86_64)")
        .println()
        .println(" * Documentation:  https://help.ubuntu.com/")
        .println()
        .println(" System information as of Wed Mar  6 16:29:32 UTC 2013")
        .println()
        .println(" System load:  0.0               Processes:           69")
        .println(" Usage of /:   13.5% of 7.97GB   Users logged in:     0")
        .println(" Memory usage: 45%               IP address for eth0: 192.168.42.42")
        .println()
        .println(" Graph this data and manage this system at http://landscape.canonical.com/")
        .println()
        .println("Get cloud support with Ubuntu Advantage Cloud Guest")
        .println("  http://www.ubuntu.com/business/services/cloud")
        .println()
        .println();

    run(display, {
        prompt: function() {
            display
                .color("#86f82e")
                .print("root@localhost")
                .color(textColor)
                .print(":")
                .color("#64a6c8")
                .print("/# ")
                .color(textColor);
        }
    });

});