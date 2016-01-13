// include test library
var aESC = [];
aESC[0] = require("../lib/esc");
aESC[1] = require("../lib/esc");
aESC[2] = require("../lib/esc");
aESC[3] = require("../lib/esc");

// initialize ESC's
console.log("[ESC] initializing");
aESC[0].init(1, parseInt(process.argv[2]));

setTimeout(aESC[0].startFull, 1000);

while(1){}