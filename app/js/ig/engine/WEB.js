var Recorder = require('mattdiamond/Recorder');

/**
 * @author PBelugin
 */
module.exports = the.module({
    WEB: { //implements : ['ig.sound.record.IRecorder'],
        our: {
            stream: 0,
            setupStream: function () {
                var self = this,
                    audio_context = self.context,
                    input = audio_context.createMediaStreamSource(self.stream),
                    zeroGain;

                input.connect(self.inputPoint);
                zeroGain = audio_context.createGain();
                zeroGain.gain.value = 0.0;
                input.connect(zeroGain);
                zeroGain.connect(audio_context.destination);
            },

            createInput: function() {
                var self = this;
                if (! self.inputPoint) {

                    self.context = new AudioContext;
                    return (self.inputPoint = self.context.createGain());
                }
                else {
                    return self.inputPoint;
                }
            },

            getStream: function (callback) {
                var our = this;
                if (our.stream === 0) {
                    our.stream = 1;
                    navigator.getUserMedia(
                        {
                            audio: true
                        },
                        function (stream) {
                            callback(false, (our.stream = stream));
                        },
                        function (err) {
                            callback(err);
                        }
                    )
                }
                else
                if (our.stream === 1) {
                    console.log('in request');
                }
                else {
                    callback(false, our.stream);
                }
            },

            setup: function(callback) {
                var our = this;
                our.getStream(function() {
                    our.setupStream();
                });

                return our.createInput();
            }
        },

        inited: false,

        /**
         * (AudioContext)
         */
        context: 0,

        recorder: 0,

        /**
         * @constructor
         */
        WEB: function (callback) {
            callback = callback || function () {};
            var self = this;


            self.init(callback);
        },

        init: function (callback) {
            var self = this;
            self.recorder = new Recorder(self.our.setup());
        },

        _start: function(callback) {
            var recorder = this.recorder;
            recorder.clear();
            recorder.record();
            callback();
        },

        start: function (callback) {
            callback = callback || function () {};
            var self = this;
            self._start(callback);
        },

        play: function() {
            this.recorder.exportWAV(function(blob) {
                var url = URL.createObjectURL(blob);
                var au = document.createElement('audio');

                au.controls = false;
                au.src = url;
                au.volume = 1;
                au.play();
            });
        },

        stop: function () {
            var self = this;
            self.recorder.stop();
        },


        upload: function (url, callback) {
            callback = callback || function () {
            };

            var self = this,
                form_data = new FormData(),
                request = new XMLHttpRequest();

            self.recorder.stop();
            self.recorder.exportWAV(function (blob) {
                form_data.append('audio', blob, 'audio.wav');
                request.open("POST", url);
                request.send(form_data);
            });

            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        callback(request.responseText);
                    }
                    else {
                        callback();
                    }
                }
            };
        }
    }
});
