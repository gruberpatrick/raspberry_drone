var oI2C = require("i2c");

// ##############################################################################
// MPU6050 Class:
// Used for Gyroscope and Accelerometer
// ##############################################################################

module.exports = {

  // ATTRIBUTES -----------------------------------------------------------------
  sDevice: "/dev/i2c-1",
  hAddress: 0x69,
  oWire: null,
  aRotationSensitivity: [131,131,131],
  aRotationOffsets: [0,0,0],
  aAccelerationOffsets: [0,0,0],
  lGravity: 9.80665,
  lSamples: 1000,

  // CONSTANTS ------------------------------------------------------------------
  fRotation: 360 / 35252,
  fAcceleration: 100 / 35252,

  // FUNCTION -------------------------------------------------------------------
  // initialize sensor
  init: function(lVersion){
    if(lVersion == 0)
       this.sDevice = "/dev/i2c-0";
    this.oWire = new oI2C(this.hAddress, {device: this.sDevice});
    
    this.oWire.writeBytes(0x19, 0x07, this.handleError.bind(this));
    this.oWire.writeBytes(0x1A, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x1B, 0x08, this.handleError.bind(this));
    this.oWire.writeBytes(0x1C, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x1D, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x1E, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x1F, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x20, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x21, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x22, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x23, 0x00, this.handleError.bind(this));
    
    // reset I2C slaves
    this.oWire.writeBytes(0x24, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x25, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x26, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x27, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x28, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x29, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2A, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2B, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2C, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2D, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2E, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x2F, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x31, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x32, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x33, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x34, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x35, 0x00, this.handleError.bind(this));
    
    this.oWire.writeBytes(0x37, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x38, 0x00, this.handleError.bind(this));
    this.oWire.writeBytes(0x6B, 0x02, this.handleError.bind(this));

    /*for(var lIndex = 0; lIndex < this.lSamples; lIndex++){
      // get rotational offsets
      var aData = this.getRotation();
      this.aRotationOffsets[0] += (aData[0] / this.lSamples);
      this.aRotationOffsets[1] += (aData[1] / this.lSamples);
      this.aRotationOffsets[2] += (aData[2] / this.lSamples);
      // get acceleration offsets -> 0g
      var aData = this.getAcceleration();
      this.aAccelerationOffsets[0] += (aData[0] / this.lSamples);
      this.aAccelerationOffsets[1] += (aData[1] / this.lSamples);
      this.aAccelerationOffsets[2] += (aData[2] / this.lSamples);
    }
    
    console.log("[MPU6050] -> ");
    console.log(this.aAccelerationOffsets);*/
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
    return [oBuffer.readInt16BE(0), oBuffer.readInt16BE(2), oBuffer.readInt16BE(4)];
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
  // get angles of acceleration
  getAccelerationAngles: function(){
    var aAcceleration = this.getAcceleration();
    return [
      (57.295*Math.atan(parseFloat(aAcceleration[1])/ Math.sqrt(Math.pow(parseFloat(aAcceleration[2]),2)+Math.pow(parseFloat(aAcceleration[0]),2)))), 
      (57.295*Math.atan(parseFloat(-aAcceleration[0])/ Math.sqrt(Math.pow(parseFloat(aAcceleration[2]),2)+Math.pow(parseFloat(aAcceleration[1]),2)))) 
    ];
  },
  
  // FUNCTION
  // get rotation data as degrees
  getAccelerationZeroG: function(){
    var aData = this.getAcceleration();
    return [
      parseFloat(aData[0] - this.aAccelerationOffsets[0]) / this.aRotationSensitivity[0],
      parseFloat(aData[1] - this.aAccelerationOffsets[1]) / this.aRotationSensitivity[1],
      parseFloat(aData[2] - this.aAccelerationOffsets[2]) / this.aRotationSensitivity[2]
    ];
  },
  
  // FUNCTION
  // handle errors callback
  handleError: function(oErr){
    if(oErr == null) return; 
    console.log(oErr);
  }

};
