var s = require("./mpu6050");
var ms5611 = require("./ms5611");
var oWebSocket = require("ws").Server;

var sTest = process.argv[2];

s.init(1);

if(sTest == "rotation"){

	console.log("[SENSOR] check rotation");
	setTimeout(s.setZero.bind(s), 1000);
	setInterval(function(){
	  var oData = s.getRotation();
 	 	console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
	}, 100);

}else if(sTest == "acceleration"){
	
	console.log("[SENSOR] check acceleration");
	setInterval(function(){
		var oData = s.getAcceleration();
		console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
	}, 100);

}else if(sTest == "compass"){
	
	console.log("[SENSOR] check compass");
	setInterval(function(){
		var oData = s.getCompass();
		console.log("x:%d\ty:%d\tz:%d", oData[0], oData[1], oData[2]);
	}, 100);

}else if(sTest == "barometer"){

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
		var oDegree = s.getRotationDegree();
		var oAcceleration = s.getAccelerationPercentage();
		if(oConnected != null){
			try{
				oConnected.send(JSON.stringify({degree:oDegree,acceleration:oAcceleration}));
			}catch(e){
				
			}
		}
	}, 10);

}
