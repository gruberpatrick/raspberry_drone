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
  aRotationSensitivity: [131,131,131],
  aRotationOffsets: [0,0,0],

  // CONSTANTS ------------------------------------------------------------------
  fRotation: 360 / 35252,
  fAcceleration: 100 / 35252,

  // FUNCTION -------------------------------------------------------------------
  // initialize sensor
  init: function(lVersion){
    if(lVersion == 0)
       this.sDevice = "/dev/i2c-0";
    this.oWire = new oI2C(this.hAddress, {device: this.sDevice});
    
    // reset gyro
    this.oWire.writeBytes(0x1B, 0x00, this.handleError.bind(this));
    // reset accel
    this.oWire.writeBytes(0x1C, 0x08, this.handleError.bind(this));
    
    for(var lIndex = 0; lIndex < 1000; lIndex++){
      var aData = this.getRotation();
      this.aRotationOffsets[0] += aData[0];
      this.aRotationOffsets[1] += aData[1];
      this.aRotationOffsets[2] += aData[2];
    }
    
    for(var lIndex in this.aRotationOffsets) this.aRotationOffsets[lIndex] /= 1000;
    
    /*// set clock to x gyro
    this.oWire.writeBytes(0x6B, 0x01, this.handleError.bind(this));
    // set gyroscope to most sensitive setting
    this.oWire.writeBytes(0x1B, 0x03, this.handleError.bind(this));
    // set accelerometer to most sensitive setting
    this.oWire.writeBytes(0x1C, 0x03, this.handleError.bind(this));*/
  },

  // FUNCTION
  // get raw acceleration data
  getAcceleration: function(){
    var oBuffer = this.oWire.readBytes(0x3B, 6, this.handleError.bind(this));
    return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
  },

  // FUNCTION
  // get raw rotation data
  getRotation: function(){
    var oBuffer = this.oWire.readBytes(0x43, 6, this.handleError.bind(this));
    return [oBuffer.readInt16BE(2) - this.aRotationZero[1], oBuffer.readInt16BE(0) - this.aRotationZero[0], oBuffer.readInt16BE(4) - this.aRotationZero[2]];
  },

  // FUNCTION
  // get raw rotation offset data
  getRotationOffset: function(){
    var oBuffer = this.oWire.readBytes(0x13, 6, this.handleError.bind(this));
    return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
  },
  
  // FUNCTION
  // get chip temperature
  getTemperature: function(){
    var oData = this.oWire.readBytes(0x41, 2, this.handleError.bind(this));
    return (oData.readInt16BE(0) / 333.86) + 21.00;
  },

  // FUNCTION
  // read compass data
  getCompass: function(){
    var oBuffer = this.oWire.readBytes(0x03, 7, this.handleError.bind(this));
    return [(oBuffer[1] << 8) + oBuffer[0], (oBuffer[3] << 8) + oBuffer[2], (oBuffer[5] << 8) + oBuffer[4]];
  },
  
  // FUNCTION
  // get angles of acceleration
  getAccelerationAngles: function(){
    var aAcceleration = this.getAcceleration();
    return [
      (57.295*Math.atan(parseFloat(aAcceleration[1])/ Math.sqrt(Math.pow(parseFloat(aAcceleration[2]),2)+Math.pow(parseFloat(aAcceleration[0]),2)))), 
      (57.295*Math.atan(parseFloat(-aAcceleration[0])/ Math.sqrt(Math.pow(parseFloat(aAcceleration[2]),2)+Math.pow(parseFloat(aAcceleration[1]),2)))) 
    ];
  },

  // FUNCTION
  // set zero values
  setRotationZero: function(){
    this.aRotationZero = this.getRotation();
  },
  
  // FUNCTION
  // get rotation data as degrees
  getRotationDegree: function(){
    var aData = this.getRotation();
    var aOffset = this.getRotationOffset();
    return [
      parseFloat(aData[0] - this.aRotationOffsets[0]) / this.aRotationSensitivity[0],
      parseFloat(aData[1] - this.aRotationOffsets[1]) / this.aRotationSensitivity[1],
      parseFloat(aData[2] - this.aRotationOffsets[2]) / this.aRotationSensitivity[2]
    ];
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
