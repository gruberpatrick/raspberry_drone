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
	aZero: [0,0,0],

	// CONSTANTS ------------------------------------------------------------------
	fRotation: 360 / 35252,
	fAcceleration: 100 / 35252,

	// FUNCTION -------------------------------------------------------------------
	// initialize sensor
	init: function(lVersion){
		if(lVersion == 0)
 			this.sDevice = "/dev/i2c-0";
		this.oWire = new oI2C(this.hAddress, {device: this.sDevice});
	},

	// FUNCTION
	// get raw acceleration data
	getAcceleration: function(){
		var oBuffer = this.oWire.readBytes(0x3B, 6, this.handleError.bind(this));
		return [oBuffer.readInt16BE(0) - this.aZero[0], oBuffer.readInt16BE(2) - this.aZero[1], oBuffer.readInt16BE(4) - this.aZero[2]];
	},

	// FUNCTION
	// get raw rotation data
	getRotation: function(){
		var oBuffer = this.oWire.readBytes(0x43, 6, this.handleError.bind(this));
		return [oBuffer.readInt16BE(2), oBuffer.readInt16BE(0), oBuffer.readInt16BE(4)];
	},

  // FUNCTION
  // get raw rotation offset data
  getRotationOffset: function(){
    var oBuffer = this.oWire.readBytes(0x13, 6, this.handleError.bind(this));
    return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
  },

	// FUNCTION
	// read compass data
	getCompass: function(){
		var oBuffer = this.oWire.readBytes(0x03, 7, this.handleError.bind(this));
		return [(oBuffer[1] << 8) + oBuffer[0], (oBuffer[3] << 8) + oBuffer[2], (oBuffer[5] << 8) + oBuffer[4]];
	},

	// FUNCTION
	// get 6 axis data (acceleration + gyro)
	get6Axis: function(){
		var oBuffer = this.oWire.readBytes(0x3B, 14, this.handleError.bind(this));
		return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4), oBuffer.readInt16BE(6), oBuffer.readInt16BE(8), oBuffer.readInt16BE(10), oBuffer.readInt16BE(12)];
	},

	// FUNCTION
	// set zero values
	setZero: function(){
		this.aZero = this.getRotation();
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
	// temperature
	getTemperature: function(){
	  var oData = this.oWire.readBytes(0x41, 2, this.handleError.bind(this));
	  return oData.readInt16BE(0);
	},
	
	// FUNCTION
	// handle errors callback
	handleError: function(oErr){
	  if(oErr == null) return; 
	  console.log(oErr);
	}

};
