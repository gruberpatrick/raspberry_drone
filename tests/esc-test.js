// include test library
var aESC = [];
aESC[0] = require("../lib/esc");
aESC[1] = require("../lib/esc");
aESC[2] = require("../lib/esc");
aESC[3] = require("../lib/esc");

// initialize ESC's
console.log("[ESC] initializing");
aESC[0].init(1, parseInt(process.argv[2]));
aESC[1].init(2, parseInt(process.argv[3]));
aESC[2].init(3, parseInt(process.argv[4]));
aESC[3].init(4, parseInt(process.argv[5]));

while(!aESC[3].bReady){} // wait for last ESC to be activated
console.log("[ESC] initialized");

for(var lIndex in aESC) aESC[lIndex].setPWM(1300);
console.log("[ESC] all ESC's set to normal flying speed");

while(1){} // let the program run
