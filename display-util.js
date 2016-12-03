
fontTest7 = function(display) {
    display.reset();
    for (var i = 32; i <= 127; i++) {
        display.print(String.fromCharCode(i));
    }
    display.println();
    for (var i = 32; i <= 127; i++) {
        display.print(String.fromCharCode(i));
    }        
};
