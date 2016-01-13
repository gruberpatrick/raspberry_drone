// include test library
var aESC = [];
aESC[0] = require("../lib/esc");
aESC[1] = require("../lib/esc");
aESC[2] = require("../lib/esc");
aESC[3] = require("../lib/esc");

// initialize ESC's
console.log("[ESC] initializing");
aESC[0].init(1, parseInt(process.argv[2]));
aESC[1].init(1, parseInt(process.argv[3]));
aESC[2].init(1, parseInt(process.argv[4]));
aESC[3].init(1, parseInt(process.argv[5]));

// set setting to full
setTimeout(function(){
  aESC[0].startFull();
  aESC[1].startFull();
  aESC[2].startFull();
  aESC[3].startFull();
}, 1000);

while(1){}