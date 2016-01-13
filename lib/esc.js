var oGPIO = require("pi-gpio");


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
		oGPIO.close(this.lPin);
		oGPIO.open(this.lPin, "output", function(){
			oGPIO.write(this.lPin, 0, function(){
				this.bReady = true;
			}.bind(this));
		}.bind(this));
	},

	startFull: function(){
		oGPIO.write(this.lPin, 1);
	}

};
