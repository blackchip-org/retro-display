
fontTest7 = function(spec) {
    var device = spec || display;
    for (var i = 32; i <= 127; i++) {
        device.print(String.fromCharCode(i));
    }
    device.println();
    for (var i = 32; i <= 127; i++) {
        device.print(String.fromCharCode(i));
    }        
    device.println();
};
