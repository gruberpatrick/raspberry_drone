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
      this.oESC[aESC[lIndex]] = {lValue: 1000};
    }
    this.setAllESC(1000);
  },
  
  // FUNCTION
  // check for faulty values
  checkFaultyValue: function(lValue, mElement){
    // set value range
    if(lValue < 1000)
      lValue = 1000;
    else if(lValue > 2000)
      lValue = 2000;
    else
      return false;
    // set correct values
    if(typeof mElement == "undefined")
      this.setAllESC(lValue);
    else if(typeof mElement == "object")
      this.setMultipleESC(mElement, lValue);
    else if(typeof mElement == "number")
      this.setESC(mElement, lValue);
    return true;
  },
  
  // FUNCTION
  // set PWM of all initialized ESC's
  setAllESC: function(lValue){
    if(this.checkFaultyValue(lValue))
      return;
    var sValue = "";
    for(var lIndex in this.oESC){
      if(typeof lValue != "undefined")
        lValue = this.oESC[lIndex].lValue;
      else
        this.oESC[lIndex].lValue = lValue;
      sValue += "s " + lIndex + " " + lValue;
    }
    this.writePIGPIOD(sValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // FUNCTION
  // set PWM of multiple ESC's
  setMultipleESC: function(aESC, lValue){
    if(this.checkFaultyValue(lValue, aESC))
      return;
    var sValue = "";
    for(var lIndex in aESC){
      this.oESC[aESC[lIndex]].lValue = lValue;
      sValue += "s " + aESC[lIndex] + " " + lValue;
    }
    this.writePIGPIOD(sValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // FUNCTION
  // set PWM of ESC
  setESC: function(lPin, lValue){
    if(this.checkFaultyValue(lValue, lPin))
      return;
    this.oESC[lPin].lValue = lValue;
    this.writePIGPIOD("s " + lPin + " " + lValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
  
  // FUNCTION
  // stop ESC
  stopESC: function(lPin){
    this.setESC(lPin, 1000);
  },
  
  // FUNCTION
  // stop all ESC's
  stopAllESC: function(){
    this.setAllESC(1000);
  },
  
  // FUNCTION
  // increase / decrease ESC
  incDecESC: function(lPin, lDifference, bInc){
    if(typeof bInc == "undefined" || bInc)
      this.oESC[lPin].lValue += lDifference;
    else
      this.oESC[lPin].lValue -= lDifference;
    this.setESC(this.oESC[lPin].lValue);
  },
  
  // FUNCTION
  // increase / decrease all ESC's
  incDecAllESC: function(lDifference, bInc){
    console.log("[ESC] incDecAllESC lValue:" + lValue);
    if(typeof bInc == "undefined" || bInc)
      for(var lIndex in this.oESC) this.oESC[lIndex].lValue += lDifference;
    else
      for(var lIndex in this.oESC) this.oESC[lIndex].lValue -= lDifference;
    this.setAllESC();
  },
  
  // FUNCTION
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
