            // Create a Paper.js Path to draw a line into it:
            var path = new Path();
            // Give the stroke a color
            path.strokeColor = 'black';
            var start = new Point(100, 100);
            // Move to start and draw a line from there
            path.moveTo(start);
            // Note the plus operator on Point objects.
            // PaperScript does that for us, and much more!
            path.lineTo(start + [ 100, -50 ]);
            // Create a circle shaped path with its center at the center
            // of the view and a radius of 30:
            var path = new Path.Circle({
                center: view.center,
                radius: 30,
                strokeColor: 'black'
            });

            // Only execute onMouseDrag when the mouse
            // has moved at least 10 points:
            tool.distanceThreshold = 10;
            var text = new PointText(new Point(200, 50));
            var synth1 = new Tone.MonoSynth();
            var synth2 = new Tone.MonoSynth();
            var param =  {
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

            };
            synth2.set(param);
            synth1.set(param);
            //synth1.setVolume(0);
            //synth1.filterEnvelope.dispose()
            //synth1.setPreset("oscillator");

            //connect the synth to the master output channel
            synth1.toMaster();
            synth2.toMaster();
            Tone.Transport.start();

            Sheet.setInstrument("a",synth1);
            Sheet.setInstrument("b",synth2);

           /* Tone.Note.route("a", function(time, value){
                 synth1.triggerAttackRelease(value.freq, value.duration, time);
            });
            Tone.Note.route("b", function(time, value){
                 synth2.triggerAttackRelease(value.freq, value.duration, time);
            });*/
            var mainBoard = new Board();

            function onMouseDown(event) {
                // Create a new path every time the mouse is clicked
                path = new Path();
                path.add(event.point);
                path.strokeColor = 'black';
                var marker = new Path.Circle({
                    center: [event.point.x,event.point.y],
                    radius: 5,
                    strokeColor: 'black'
                });
                //a square wave at 440hz:



               /* var env = new Tone.Envelope(1, 0, 0.05, 0.5);

                var oscX = new Tone.Oscillator(event.point.x, "sine");
                var oscY = new Tone.Oscillator(event.point.y, "sine");
                
                osc = oscX;*/
                                    //connect it to the master output
                   // osc.setVolume(-50);

                   /* env.connect(osc.output.gain);
                    osc.toMaster();
                    osc.start(Tone.Transport.now());
                    env.triggerAttack(Tone.Transport.now(),0.05);
                    env.triggerRelease("+1");
                    osc.stop("+1.5");*/

               /* osc = oscY;
                                    //connect it to the master output
                   // osc.setVolume(-50);

                    env.connect(osc.output.gain);
                    osc.toMaster();
                    osc.start("+0.5");
                    env.triggerAttack(Tone.Transport.now()+0.5,0.05);
                    env.triggerRelease("+1.5");
                    osc.stop("+2");*/

                     var a = new Tone.Sound(0,1.5,
                        {"oscillator" : {
                            "frequency":event.point.y}
                        });
                    var b = new Tone.Sound(0,1.5,
                        {"oscillator" : {
                            "frequency":event.point.x}
                        });

                    mainBoard.attachSound(a);
                    mainBoard.attachSound(b);


            //create one of Tone's built-in synthesizers


            //create a callback which is invoked every quarter note
            //Tone.Transport.setInterval(function(time){
                //trigger middle C for the duration of an 8th note
            //    synth.triggerAttackRelease(event.point.x, 0.1, time);
            //}, Tone.now);

            //start the transport


           // Tone.Transport.setTimeout(function(time){
           //     synth1.triggerAttackRelease(event.point.x, 1, time);
           // }, 0);
           // Tone.Transport.setTimeout(function(time){
           //     synth2.triggerAttackRelease(event.point.y, 1, time);
           // }, 0);
            //Sheet.newTone(event.point.x,1,0);
            //Sheet.newTone(event.point.y,1,0);

                        //Sheet.newTone(event.point.x,0);


//alert(Tone.Transport.now());
           // var note = new Tone.Note("a", Tone.Transport.now(), {freq:event.point.x,duration:1});
           // var note1 = new Tone.Note("b", Tone.Transport.now(), {freq:event.point.y,duration:1});
            //var note1 = new Tone.Note("b", Tone.Transport.now()+3, event.point.y);


            }

            function onMouseDrag(event) {
                // Add a point to the path every time the mouse is dragged
                path.add(event.point);
                text.justification = 'center';
                text.fillColor = 'black';
                text.content = event.point;
            }

            var Dichord = function(sound1, sound2){
                var shape = new Shape.Circle(new Point(sound1.oscillator.frequency,
                                                             sound2.oscillator.frequency), 30);
                shape.strokeColor = 'black';
                sound1.onStop.attach(function(){
                    shape.remove(); 
                });
                sound2.onStop.attach(function(){
                    shape.remove(); 
                });
            }            



            var Board = function(){

                var self = this;

                self.activeSounds = [];
            }

            Board.prototype.attachSound = function(sound){

                self.activeSounds.push(sound);

                sound.onStart.attach(function () {
                    for (var i = self.activeSounds.length - 1; i >= 0; i--) {
                        var dichord = new Dichord(self.activeSounds[i],sound);
                    };
                })

                sound.onStop.attach(function () {
                    var index = self.activeSounds.indexOf(sound);
                    if (index > -1) {
                        array.splice(index, 1);
                    }

                })

            }

