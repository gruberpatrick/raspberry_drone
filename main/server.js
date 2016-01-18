// include components
var oNetwork = require("../lib/HandyJS/lib/network-p");

// ###############################################################################
function DroneServer(){

  // ATTRIBUTES -----------------------------------------------------------------
  this.sDroneKey = "";
  
  // FUNCTION -----------------------------------------------------------------
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
        oNetwork.oSocket.clientSend(sKey, JSON.stringify({sType:"command",sCommand:"up=1000"}));
      }else if(oMessage["sType"] == "status"){
        console.log(oMessage["oData"].oESC);
        //oNetwork.oSocket.clientBroadcast(oClient.sLastMessage);
      }else if(oMessage["sType"] == "command"){ // send command to quadcopter
        oNetwork.oSocket.clientSend(this.sDroneKey, oClient.sLastMessage);
      }
    }.bind(this), function(oErr){
      // error
      console.log(oErr);
    });

    var lCount = 0;
    /*var oInterval = setInterval(function(){
      if(this.sDroneKey != "")
        oNetwork.oSocket.clientSend(this.sDroneKey, JSON.stringify({sType:"command",sCommand:"up"}));
      if(lCount == 250)
        clearInterval(oInterval);
    }.bind(this), 500);*/

  };

  // CONSTRUCTOR
  // fake constructor call
  this.initialize();

}

var DS = new DroneServer();
