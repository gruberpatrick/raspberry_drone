// create ESC object and sensors
var oESC = require("./lib/esc");
var oMPU6050 = require("./lib/mpu6050");
var oMS5611 = require("./lib/ms5611");
// include networking components
var oNetwork = require("./lib/HandyJS/lib/network-p");

// initialize ESC's
console.log("[QUADCOPTER] initialize");
oESC.init([9,7,23,19]); // initialize ESC's on given GPIO's

// test ESC's #####################
/*function initTest(){
  var lSpeed = 1250;
  oESC.setAllPWM(lSpeed);
  var oInterval = setInterval(function(){
    console.log("[QUADCOPTER] setting speed to: " + lSpeed);
    oESC.setAllPWM(lSpeed);
    lSpeed += 5;
    if(lSpeed == 2000){
      lSpeed = 1000;
      oESC.setAllPWM(lSpeed);
      clearInterval(oInterval);
    }
  }, 100);
}*/
// initTest(); ####################

oNetwork.oSocket.connectWebSocket("192.168.1.16", 4444, function(){
  // connected to server
  console.log("[QUADCOPTER] connected to server");
}, function(oLastConnection, lFlags){
  // message from server
  console.log("[QUADCOPTER] message from server:\nlFlag -> " + lFlags);
  console.log(oLastConnection);
}, function(oErr){
  // error
  console.log(oErr);
});




