// create ESC objects
var aESC = [];
aESC[0] = [require("./lib/esc"), 9];
aESC[1] = [require("./lib/esc"), 7];
aESC[2] = [require("./lib/esc"), 23];
aESC[3] = [require("./lib/esc"), 19];

// include sensors
var oMPU6050 = require("./lib/mpu6050");
var oMS5611 = require("./lib/ms5611");

// include websocket for external controls
var oWS = require("ws");

// initialize each ESC
console.log("[QUADCOPTER] initialize");
for(var lIndex in aESC){ aESC[lIndex][0].init(lIndex, aESC[lIndex][1]); }

// test ESC's
console.log("[QUADCOPTER] send signal to ESC's for 5 seconds");
for(var lIndex in aESC){ aESC[lIndex][0].setPWM(1240); }
setTimeout(function(){
  for(var lIndex in aESC){ aESC[lIndex][0].setPWM(1000); }
}, 5000);
console.log("[QUADCOPTER] was the test succesful? (Y/n)");
