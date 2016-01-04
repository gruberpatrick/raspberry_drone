var oI2C = require("i2c");

// ##############################################################################
// MPU6050 Class:
// Used for Gyroscope and Accelerometer
// ##############################################################################

module.exports = {

	// ATTRIBUTES -----------------------------------------------------------------
	sDevice: "/dev/i2c-1",
	hAddress: 0x68,
	hAddressLow: 0x68,
	hAddressHight: 0x69,
	oWire: null,
	aRotationZero: [0,0,0],
	aAccelerationZero: [0,0,0],

	// CONSTANTS ------------------------------------------------------------------
	fRotation: 360 / 35252,
	fAcceleration: 100 / 35252,

	// FUNCTION -------------------------------------------------------------------
	// initialize sensor
	init: function(lVersion){
		if(lVersion == 0)
 			this.sDevice = "/dev/i2c-0";
		this.oWire = new oI2C(this.hAddress, {device: this.sDevice});
		// set clock to x gyro
		this.oWire.writeBytes(0x6B, 2, 0x01, /*this.handleError.bind(this)*/function(){});
		// set gyroscope to most sensitive setting
		this.oWire.writeBytes(0x1B, 4, 0x00, /*this.handleError.bind(this)*/function(){});
		// set accelerometer to most sensitive setting
		this.oWire.writeBytes(0x1C, 4, 0x00, /*this.handleError.bind(this)*/function(){});
	},

	// FUNCTION
	// get raw acceleration data
	getAcceleration: function(){
		var oBuffer = this.oWire.readBytes(0x3B, 6, /*this.handleError.bind(this)*/function(){});
		return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
	},

	// FUNCTION
	// get raw rotation data
	getRotation: function(){
		var oBuffer = this.oWire.readBytes(0x43, 6, /*this.handleError.bind(this)*/function(){});
		return [oBuffer.readInt16BE(2) - this.aRotationZero[1], oBuffer.readInt16BE(0) - this.aRotationZero[0], oBuffer.readInt16BE(4) - this.aRotationZero[2]];
	},

  // FUNCTION
  // get raw rotation offset data
  getRotationOffset: function(){
    var oBuffer = this.oWire.readBytes(0x13, 6, /*this.handleError.bind(this)*/function(){});
    return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
  },
  
  // FUNCTION
  // get chip temperature
  getTemperature: function(){
    var oData = this.oWire.readBytes(0x41, 2, /*this.handleError.bind(this)*/function(){});
    return (oData.readInt16BE(0) / 333.86) + 21.00;
  },

	// FUNCTION
	// read compass data
	getCompass: function(){
		var oBuffer = this.oWire.readBytes(0x03, 7, /*this.handleError.bind(this)*/function(){});
		return [(oBuffer[1] << 8) + oBuffer[0], (oBuffer[3] << 8) + oBuffer[2], (oBuffer[5] << 8) + oBuffer[4]];
	},

	// FUNCTION
	// set zero values
	setRotationZero: function(){
		this.aRotationZero = this.getRotation();
	},
	
	// FUNCTION
	// get rotation data as degrees
	getRotationDegree: function(){
		var oData = this.getRotation();
		return [Math.round(oData[0] * this.fRotation), Math.round(oData[1] * this.fRotation), Math.round(oData[2] * this.fRotation)];
	},

	// FUNCTION
	// get acceleration as percentage to highest measured
	getAccelerationPercentage: function(){
		var oData = this.getAcceleration();
		return [Math.round(oData[0] * this.fAcceleration), Math.round(oData[1] * this.fAcceleration), Math.round(oData[2] * this.fAcceleration)];
	},
	
	// FUNCTION
	// handle errors callback
	handleError: function(oErr){
	  if(oErr == null) return; 
	  console.log(oErr);
	}

};
