var oGPIO = require("pi-gpio");
var oPWM = require("pi-blaster.js");


module.exports = {

	// ATTRIBUTES -----------------------------------------------------------------
	lId: null,
	lPin: null,
	bReady: false,

	// CONSTANTS -----------------------------------------------------------------
	

	// FUNCTION -----------------------------------------------------------------
	// initialize ESC
	init: function(lId, lPin){
		this.lId = lId;
		this.lPin = lPin;
		oPWM.setPWM(this.lPin, 0);
	},

	startFull: function(){
		oPWM.setPWM(this.lPin, 1);
	}

};
