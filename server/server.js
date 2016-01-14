// NETWORKING: https://github.com/gruberpatrick/HandyJS
// initialize web socket server
var oNetwork = require("../lib/HandyJS/lib/network-p");

oNetwork.oSocket.initializeWebSocket(4444, function(oWS){
  // new connection established
  console.log("[SERVER] connection established");
}, function(sKey, oClient){
  // got message from client
  console.log("[SERVER] message from client:");
  console.log(oClient);
}, function(oErr){
  // error
  console.log(oErr);
});
