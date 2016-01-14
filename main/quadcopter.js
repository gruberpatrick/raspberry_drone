// include components
var oESC = require("../lib/esc");
var oMPU6050 = require("../lib/mpu6050");
var oMS5611 = require("../lib/ms5611");
var oNetwork = require("../lib/HandyJS/lib/network-p");

// ###############################################################################
function Quadcopter(){

  // initialize quadcopter
  this.initialize = function(){
    // initialize ESC's
    console.log("[QUADCOPTER] initialize");
    oESC.init([9,7,23,19]); // initialize ESC's on given GPIO's
    // connect to server and identify
    oNetwork.oSocket.connectWebSocket("192.168.1.16", 4444, function(){
      // connected to server
      console.log("[QUADCOPTER] connected to server");
      oNetwork.oSocket.serverSend(JSON.stringify({init:true,sType:"quadcopter"}));
    }, function(oLastConnection, lFlags){
      // message from server
      console.log("[QUADCOPTER] message from server:\nlFlag -> " + lFlags);
      console.log(oLastConnection);
    }, function(oErr){
      // error
      console.log(oErr);
    });
  };
  
  // fake constructor
  this.initialize();

}

var Q = new Quadcopter();

