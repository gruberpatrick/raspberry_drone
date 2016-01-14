// create ESC object and sensors
var oESC = require("./lib/esc");
var oMPU6050 = require("./lib/mpu6050");
var oMS5611 = require("./lib/ms5611");
// include websocket for external controls
var oWS = require("ws");

// initialize ESC's
console.log("[QUADCOPTER] initialize");
oESC.init([9,7,23,19]);

// test ESC's
console.log("[QUADCOPTER] send signal to ESC's for 5 seconds");
var lCount = 0;
oESC.setAllPWM(1240);
setTimeout(function(){
  oESC.setAllPWM(1000);
}, 5000);
console.log("[QUADCOPTER] was the test succesful? (Y/n)");
