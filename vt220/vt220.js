var display;

window.onload = function() {
    display = createDisplay({
        cols: 80,
        rows: 25,
        bgColor: "#222",
        fgColor: "#d4992f",
        font: "VT220",
        fontSize: 20,
        charWidth: 10,
        charHeight: 20,
        baselineOffset: 3,
        border: 50,
        borderColor: "#444",
        borderRadius: 20
    });

    display.println("VM/370 ONLINE");
    display.y = 4;
    display.cprintln("        VV        VV   MM         MM        ");
    display.cprintln("	      VV        VV   MMM       MMM        ");
    display.cprintln("        VV        VV   MMMM     MMMM        ");
    display.cprintln("        VV        VV   MM MM   MM MM        ");
    display.cprintln(" 3333333333     777777777777MMMM  00000000  ");
    display.cprintln("333333333333    77777777777  MM  0000000000 ");
    display.cprintln("33      VV33    77VV    77      00MM      00");
    display.cprintln("         V33     VV    77M      00MM      00");
    display.cprintln("	        33    VV    77MM      00MM      00");
    display.cprintln("       3333VV  VV    77 MM      00MM      00");
    display.cprintln("       3333 VVVV     77 MM      00MM      00");
    display.cprintln("	        33 VV      77 MM      00MM      00");
    display.cprintln("	        33         77         00        00");
    display.cprintln("33        33         77         00        00");
    display.cprintln("333333333333         77          0000000000 ");
    display.cprintln(" 3333333333          77           00000000  ");    
    display.y = 24;
    display.rprint("RUNNING");
};

