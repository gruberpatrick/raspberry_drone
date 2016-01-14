var oFS = require("fs");
var oGPIO = require("pi-gpio");
var oPWM = require("pi-blaster.js");
var oExec = require("child_process").exec;


module.exports = {

	// ATTRIBUTES -----------------------------------------------------------------
	lId: null,
	lPin: null,
	bReady: false,
	sPIGPIOD: "/dev/pigpio",

	// CONSTANTS -----------------------------------------------------------------
	

	// FUNCTION -----------------------------------------------------------------
	// initialize ESC
	init: function(lId, lPin){
		this.lId = lId;
		this.lPin = lPin;
		this.setPWM(1000);
		this.bReady = true;
	},
	
	// set PWM to value
  setPWM: function(lValue){
    this.writePIGPIOD("s " + this.lPin + " " + lValue, function(oErr){ if(!oErr) return; console.log("[ESC] -> "); console.log(oErr); });
  },
	
	// write to PIGPIOD
	writePIGPIOD: function(sValue, fCallback){
	  /*
	   * TODO: - write command directly to file
	  */var oBuffer = new Buffer(sValue + "\n");
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
   /*oExec("echo \"" + sValue + "\" > " + this.sPIGPIOD, function(oErr, oStdo, oStderr){
     if(!oErr) return;
     console.log("[ESC] -> ");
     console.log(oErr);
   });*/
	}

};
