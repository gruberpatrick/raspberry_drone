var oFS = require("fs");
var oGPIO = require("pi-gpio");
var oPWM = require("pi-blaster.js");
var oExec = require("child_process").exec;


module.exports = {

  // ATTRIBUTES -----------------------------------------------------------------
  bReady: false,
  sPIGPIOD: "/dev/pigpio",
  oESC: {}, // contains object -> pin_id: {...}
  
  // CONSTANTS -----------------------------------------------------------------
  

  // FUNCTION -----------------------------------------------------------------
  // initialize ESC
  init: function(aESC){
    // build ESC object
    for(var lIndex in aESC){
      this.oESC[aESC[lIndex]] = {};
      this.setMultiplePWM(aESC, 1000);
    }
  },
  
  // set PWM of all initialized ESC's
  setAllPWM: function(lValue){
    var sValue = "";
    for(var lIndex in this.oESC){
      sValue += "s " + lIndex + " " + lValue;
    }
    this.writePIGPIOD(sValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // set PWM of multiple ESC's
  setMultiplePWM: function(aESC, lValue){
    var sValue = "";
    for(var lIndex in aESC){
      sValue += "s " + aESC[lIndex] + " " + lValue;
    }
    this.writePIGPIOD(sValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // set PWM of ESC
  setPWM: function(lPin, lValue){
    this.writePIGPIOD("s " + lPin + " " + lValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // write to PIGPIOD
  writePIGPIOD: function(sValue, fCallback){
    var oBuffer = new Buffer(sValue + "\n");
    var oFD = oFS.open(this.sPIGPIOD, "w", undefined, function(oErr, oFD) {
      if (oErr) {
        if (fCallback && typeof fCallback == 'function') {fCallback(oErr)};
      } else {
        oFS.write(oFD, oBuffer, 0, oBuffer.length, -1, function(oErr, oWritten, oBuffer) {
          if (oErr) {
            if (fCallback && typeof fCallback == 'function') {fCallback(oErr)};
          } else {
            oFS.close(oFD);
            if (fCallback && typeof fCallback == 'function') {fCallback()};
          }
        });
      }
    });
  }

};
