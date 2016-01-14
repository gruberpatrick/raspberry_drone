// include components
var oNetwork = require("../lib/HandyJS/lib/network-p");

// ###############################################################################
function DroneServer(){

  this.sDroneKey = "";
  
  // FUNCTION
  // initialize drone server
  this.initialize = function(){
    oNetwork.oSocket.initializeWebSocket(4444, function(oWS){
      // new connection established
      console.log("[SERVER] connection established");
    }.bind(this), function(sKey, oClient){
      var oMessage = JSON.parse(oClient.sLastMessage);
      if(typeof oMessage["init"] != "undefined" && oMessage["init"]){ // check if initial definition
        oNetwork.oSocket.setClientValue(sKey, {sType: oMessage["sType"]});
        this.sDroneKey = sKey;
      }
      else if(oMessage["sType"] == "command"){ // send command to quadcopter
        console.log(oMessage);
        oNetwork.oSocket.clientSend(sQuadcopterKey, oClient.sLastMessage);
      }
    }.bind(this), function(oErr){
      // error
      console.log(oErr);
    });
  };

  // CONSTRUCTOR
  // fake constructor call
  this.initialize();

}

var DS = new DroneServer();
