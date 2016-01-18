// include components
var oESC = require("../lib/esc");
var oMPU6050 = require("../lib/mpu6050");
var oMS5611 = require("../lib/ms5611");
var oNetwork = require("../lib/HandyJS/lib/network-p");

// ###############################################################################
function Quadcopter(){
  
  // ATTRIBUTES -----------------------------------------------------------------
  this.aESCPins = [26,27,17,19];
  this.lXAdjustRatio = 12.5;
  this.lYAdjustRatio = 14.286;

  // FUNCTION -----------------------------------------------------------------
  // initialize quadcopter
  this.initialize = function(){
    // initialize ESC's
    console.log("[QUADCOPTER] initialize");
    oESC.init(this.aESCPins); // initialize ESC's on given GPIO's
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
      oNetwork.oSocket.serverSend(JSON.stringify({sType:"status",oData:{"oESC":oESC.getESC(),"oMPU6050":oMPU6050}}));
    }.bind(this), function(oErr){
      // error
      console.log(oErr);
    }.bind(this));
    // try to stabilize quadcopter every 100ms
    setInterval(function(){
      this.stabilize();
    }.bind(this), 100);
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
    // get all angles
    var aData = oMPU6050.getAccelerationAngles();
    // check if no need to adjust yet
    if( (aData[0] >= -1.0 && aData[0] <= 1.0) && (aData[1] >= -1.0 && aData[1] <= 1.0) )
      return;
    // reset all adjusts
    for(var lIndex in oESC.oESC) oESC.oESC[lIndex].lAdjust = 0;
    // check ESC's to adjust
    console.log(aData[0] + " - " + aData[1]);
    var lESC = -1;
    if(aData[0] < 0 && aData[1] > 0)
      lESC = 26;
    else if(aData[0] > 0 && aData[1] > 0)
      lESC = 27;
    else if(aData[0] > 0 && aData[1] < 0)
      lESC = 17;
    else if(aData[0] < 0 && aData[1] < 0)
      lESC = 17;
    // modify off ESC based on average
    if(lESC == -1)
      return;
    console.log("[QUADCOPTER] modify: " + lESC);
    if(aData[0] < 0)
      aData[0] *= -1;
    if(aData[1] < 0)
      aData[1] *= -1;
    var lAdjust = aData[0];
    if(aData[1] > aData[0])
      lAdjust = aData[1];
    oESC.oESC[lESC].lAdjust = lAdjust * this.lXAdjustRatio;
    oESC.setAllESC();
  };
  
  // CONSTRUCTOR
  // fake constructor call
  this.initialize();

}

var Q = new Quadcopter();

