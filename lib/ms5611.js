var oI2C = require("i2c");

module.exports = {

  // ATTRIBUTES -----------------------------------------------------------------
  sDevice: "/dev/i2c-1",
  hAddress: 0x68,
  oWire: null,

  // CONSTANTS -----------------------------------------------------------------
  

  // FUNCTION -----------------------------------------------------------------
  // initialize sensor
  init: function(lVersion){
    if(lVersion == 0)
      this.sDevice = "/dev/i2c-0";
    this.oWire = new oI2C(this.hAddress, {device: this.sDevice});
  },

  // FUNCTION
  // get raw rotation data
  getAltitude: function(){
    var oBuffer = this.oWire.readBytes(0x77, 7, function(oErr, oData){ if(oErr == null) return; console.log(oErr); });
    return [oBuffer.readInt16BE(0)];
  }

};
