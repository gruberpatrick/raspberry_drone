// include components
var oESC = require("../lib/esc");
var oMPU6050 = require("../lib/mpu6050");
var oMS5611 = require("../lib/ms5611");
var oNetwork = require("../lib/HandyJS/lib/network-p");

// ###############################################################################
function Quadcopter(){
  
  // ATTRIBUTES -----------------------------------------------------------------

  // FUNCTION -----------------------------------------------------------------
  // initialize quadcopter
  this.initialize = function(){
    // initialize ESC's
    console.log("[QUADCOPTER] initialize");
    oESC.init([26,27,17,19]); // initialize ESC's on given GPIO's
    // initialize MPU6050
    oMPU6050.init(1);
    // connect to server and identify
    oNetwork.oSocket.connectWebSocket("192.168.1.16", 4444, function(){
      // connected to server
      console.log("[QUADCOPTER] connected to server");
      oNetwork.oSocket.serverSend(JSON.stringify({init:true,sType:"quadcopter"}));
    }.bind(this), function(oLastConnection, lFlags){
      // message from server
      // analyze command
      var oMessage = JSON.parse(oLastConnection.sLastMessage);
      if(oMessage["sType"] == "command"){
        this.executeCommand(oMessage["sCommand"]);
      }
      oNetwork.oSocket.serverSend(JSON.stringify({sType:"data",oData:{oESC.oESC}}));
    }.bind(this), function(oErr){
      // error
      console.log(oErr);
    }.bind(this));
  };
  
  // FUNCTION
  // analyze command and decide how to execute
  this.executeCommand = function(sCommand){
    var aPieces = sCommand.split("=");
    console.log("[QUADCOPTER] command:");
    console.log(aPieces);
    if(aPieces[0] == "up")
      aPieces.length == 2 ? this.ascend(parseInt(aPieces[1])) : this.ascend();
    else if(aPieces[0] == "down")
      aPieces.length == 2 ? this.descend(parseInt(aPieces[1])) : this.descend();
    else if(aPieces[0] == "hover")
      this.hover();
      
    this.stabilize();
  };
  
  // FUNCTION
  // make quadcopter ascend
  this.ascend = function(lValue){
    typeof lValue == "undefined" ? oESC.incDecAllESC(2, true) : oESC.setAllESC(lValue);
  };
  
  // FUNCTION
  // make quadcopter descend
  this.descend = function(lValue){
    typeof lValue == "undefined" ? oESC.incDecAllESC(2, false) : oESC.setAllESC(lValue);
  };
  
  // FUNCTION
  // make quadcopter hover
  this.hover = function(){
    // TODO: integrate sensor values to hover
  };
  
  // FUNCTION
  // stabilize quadcopter
  this.stabilize = function(){
    // TODO: stabilize quadcopter based on sensor data
  };
  
  // CONSTRUCTOR
  // fake constructor call
  this.initialize();

}

var Q = new Quadcopter();

