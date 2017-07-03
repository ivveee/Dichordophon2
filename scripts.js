"use strict";
//(function(){
	
	    //borrowed from underscore.js
    function isUndef(val){
        return val === void 0;
    }


	var Sheet = new function(){
		var self = this;

		var instruments = {};
		/*var defaultInstrumentParams;


		self.setDefaultInstrument = function(instrument){
			defaultInstrumentParams = instrument;
		};*/

		self.constructDefaultInstrument = function(){
	        var defaultSynth = new Tone.MonoSynth(
	        {
	            "portamento" : 0.0,
	            "oscillator" : {
	                "type" : "sine",
	            },
	            
	            "filter" : {
	                "Q" : 1,
	                "type" : "lowpass",
	                "rolloff" : -12
	            },
	            "envelope" : {
	                "attack" : 0.05,
	                "decay" : 0.3,
	                "sustain" : 1,
	                "release" : 0.5
	            },
	            "filterEnvelope" : {
	                "attack" : 0.01,
	                "decay" : 0.01,
	                "sustain" : 0.01,
	                "release" : 0.01,
	                "min" : 4000,
	                "max" : 4000,
	                "exponent" : 2
	            }
	         });
	        defaultSynth.setVolume(-25);
	        defaultSynth.toMaster();
	        return defaultSynth;
    	}

        //self.setDefaultInstrument(defaultSynth);

		self.setInstrument = function(name,instrument){
			instruments[name] = instrument;
			Tone.Note.route(name, function(time, value){
	        	instruments[name].triggerAttackRelease(value.freq, value.duration, time);
	        }); 
		}

		self.getInstrumentByName = function(name){
			return instruments[name];
		}

		self.newTone = function(frequency, duration, timeFromNow){
			var synth = self.constructDefaultInstrument();
			var callbackF = function(){
				return function(timeF){
					synth.triggerAttackRelease(frequency, duration, timeF);
					synth.oscillator.onended = function(){console.log("aaa");};
				}
			}();
			Tone.Transport.setTimeout(callbackF, timeFromNow);
				
		}
	}

	var Shaper = new function(){
		var activeTones = [];

		//stateChanged
	}

var toneSettings = function(){
	var self = this;
	self.mode = 0;

}

	// ----------DEvent
	function DEvent(sender) {
	    this._sender = sender;
	    this._listeners = [];
	}

	DEvent.prototype = {
	    attach: function (listener) {
	        this._listeners.push(listener);
	    },
	    notify: function (args) {
	        var index;

	        for (index = 0; index < this._listeners.length; index += 1) {
	            this._listeners[index](this._sender, args);
	        }
	    }
	};

	Tone.Sound = function(startTime,durationTime,options){

		var self = this;

		this.onStart = new DEvent(this);
    	this.onStop = new DEvent(this);

		if(isUndef(startTime)) 
			this.startTime = Tone.Transport.now();
		else
			this.startTime = startTime;

		if(isUndef(durationTime)) 
			this.durationTime = 1;
		else
			this.durationTime = durationTime;

            //get the defaults
        //this.output = this.context.createGain();

        Tone.call(this, options);
        options = this.defaultArg(options, Tone.Sound.defaults);

        this.oscillator = new Tone.OmniOscillator(options.oscillator);//frequency,type

        this.envelope = new Tone.Envelope(options.envelope);

        this.envelope.connect(this.oscillator.output.gain);
        this.oscillator.toMaster();

		Tone.Transport.setTimeout(self.start.bind(self), startTime);
		Tone.Transport.setTimeout(self.triggerRelease.bind(self), startTime + durationTime - options.envelope.release);
		Tone.Transport.setTimeout(self.stop.bind(self), startTime + durationTime);

		//this.onStart = function(){}//Board should change this
		//this.onStop = function(){}

        /**
         *  the first oscillator
         *  @type {Tone.OmniOscillator}
         */
        //this.oscillator = new Tone.OmniOscillator(options.oscillator);

		
		//self.oscillator = new Tone.Oscillator(event.point.x, "sine");
	}

	Tone.extend(Tone.Sound);

    Tone.Sound.prototype.start = function(){ 
    	    this.onStart.notify(Tone.Transport.now());
        	this.oscillator.start(Tone.Transport.now());
        	this.envelope.triggerAttack(Tone.Transport.now(),this.envelope.sustain);
        }

    Tone.Sound.prototype.triggerRelease = function(){
        	this.envelope.triggerRelease(Tone.Transport.now());
          	//this.onStop.notify(Tone.Transport.now());

        }

    Tone.Sound.prototype.stop = function(){
        	this.oscillator.stop(Tone.Transport.now());
        	          	this.onStop.notify(Tone.Transport.now());

//        	this.onStop.notify(Tone.Transport.now());
        	//console.log(Tone.Transport.now());
        }


	Tone.Sound.defaults = {
        "oscillator" : {
        	"frequency":440,
             "type" : "triangle"
        },
        "envelope" : {
            "attack" : 0.5,
            "decay" : 0,
            "sustain" : 0.1,
            "release" : 0.5
        }
    }

	/*window.onload( function(){

	})*/




//}());