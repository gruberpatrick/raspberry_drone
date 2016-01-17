var mpu6050 = require("../lib/mpu6050");
var ms5611 = require("../lib/ms5611");
var oWebSocket = require("ws").Server;

var sTest = process.argv[2];

mpu6050.init(1);

if(sTest == "rotation"){

  console.log("[SENSOR] check rotation");
  setTimeout(mpu6050.setZero.bind(mpu6050), 1000);
  setInterval(function(){
    var oData = mpu6050.getRotation();
      console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
  }, 100);

}else if(sTest == "acceleration"){
  
  console.log("[SENSOR] check acceleration");
  setInterval(function(){
    var oData = mpu6050.getAcceleration();
    console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
  }, 100);

}else if(sTest == "acceleration-angle"){
  
  var aTestValues = mpu6050.getAccelerationAngles();
  
  console.log("[SENSOR] check acceleration angle");
  setInterval(function(){
    var oData = mpu6050.getAccelerationAngles();
    console.log("x:%d\ty:%d", oData[0] - aTestValues[0], oData[1] - aTestValues[1]);
  }, 100);
  
}else if(sTest == "temperature"){

  console.log("[SENSOR] check temperature");
  console.log(mpu6050.getTemperature());
  
}else if(sTest == "compass"){
  
  // TODO:
  // implement
  console.log("[SENSOR] check compass");
  setInterval(function(){
    var oData = mpu6050.getCompass();
    console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
  }, 100);

}else if(sTest == "barometer"){

  // TODO:
  // implement
  console.log("[SENSOR] check barometer");
  ms5611.init(1);
  console.log(ms5611.getAltitude());

}else if(sTest == "live"){

  console.log("[SENSOR] live connection");
  var wss = new oWebSocket({port: 3333});
  var oConnected = null;
  wss.on('connection', function connection(ws) {
    oConnected = ws;
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  });

  setInterval(function(){
    var oDegree = mpu6050.getRotationDegree();
    var oAcceleration = mpu6050.getAccelerationZeroG();
    if(oConnected != null){
      try{
        oConnected.send(JSON.stringify({degree:oDegree,acceleration:oAcceleration}));
      }catch(e){
        
      }
    }
  }, 10);

}
