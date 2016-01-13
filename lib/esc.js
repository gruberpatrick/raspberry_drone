var oFS = require("fs");
var oGPIO = require("pi-gpio");
var oPWM = require("pi-blaster.js");


module.exports = {

	// ATTRIBUTES -----------------------------------------------------------------
	lId: null,
	lPin: null,
	bReady: false,
	sPIGPIOD: "/dev/pigpio"

	// CONSTANTS -----------------------------------------------------------------
	

	// FUNCTION -----------------------------------------------------------------
	// initialize ESC
	init: function(lId, lPin){
		this.lId = lId;
		this.lPin = lPin;
		this.setPWM(1000);
		setTimeout(function(){
		  this.setPWM(2000);
		  setTimeout(function(){
		    this.setPWM(1100);
		    this.bReady = true;
		  }.bind(this), 1);
		}.bind(this), 1);
	},
	
	// write to PIGPIOD
	writePIGPIOD: function(sValue, fCallback){
	  var oBuffer = new Buffer(sValue + "\n");
    var oFD = oFS.open(sPIGPIOD, "w", undefined, function(oErr, oFD) {
      if (err) {
        if (fCallback && typeof fCallback == 'function') {fCallback(oErr)};
      } else {
        oFS.write(oFD, oBuffer, 0, oBuffer.length, -1, function(error, written, buffer) {
          if (oErr) {
            if (fCallback && typeof fCallback == 'function') {fCallback(oErr)};
          } else {
            fs.close(oFD);
            if (fCallback && typeof fCallback == 'function') {fCallback()};
          }
        });
      }
    });
	},
	
	// set PWM to value
	setPWM: function(lValue){
	  this.writePIGPIOD("s" + this.lPin + " " + lValue);
	}

};
