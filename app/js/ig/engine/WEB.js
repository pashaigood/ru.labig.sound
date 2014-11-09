var Recorder = require('mattdiamond/Recorder');
//require('audiolib');


/**
 * @author PBelugin
 */
module.exports = the.module({
    WEB: { //implements : ['ig.sound.record.IRecorder'],
        our: {
            isInit: false,

            init: function(callback) {
                callback = callback || function(){};
                var our = this;
                if (our.isInit === false) {
                    our.context = new AudioContext;
                    our.isInit = 0;

                    our.getStream(function(err, stream) {
                        if (err) {
                            our.isInit = false;
                            throw err;
                        }

                        our.isInit = true;
                        stream.stop();
                        callback(err);
                    });
                }
            },

            getStream: function (callback) {
                navigator.getUserMedia(
                    {
                        audio: true
                    },
                    function (stream) {
                        callback(false, stream);
                    },
                    function (err) {
                        callback(err);
                    }
                )
            }
        },
        stream: 0,

        /**
         * (AudioContext)
         */
        context: 0,

        recorder: 0,

        /**
         * @constructor
         */
        WEB: function (callback) {
            var self = this;
            self.init(callback);
        },

        init: function (callback) {
            var self = this,
                inputPoint;

            self.our.init(callback);
            inputPoint = self.inputPoint = self.our.context.createGain();

            self.recorder = new Recorder(inputPoint);
        },

        isReady: function() {
            var self = this;

            if (! self.our.isInit) {
                console.log('Is Not Init');
                return false;
            }

            return true;
        },

        start: function (callback) {
            callback = callback || function () {};
            var self = this;

            if (self.isReady()) {
                self.our.getStream(function (err, stream) {
                    if (! err) {
                        window.stream = stream;
                        self.stream = stream;
                        self.setupStream();

                        self._start(callback);
                    }
                    else {
                        callback(err);
                    }
                });
            }

        },

        _start: function(callback) {
            var recorder = this.recorder;
            recorder.clear();
            recorder.record();
            callback();
        },

        play: function() {
            if (this.isReady()) {

            this.recorder.exportWAV(function(blob) {
                var url = URL.createObjectURL(blob);
                var au = document.createElement('audio');

                au.controls = false;
                au.src = url;
                au.volume = 1;
                au.play();
            });
            }

        },

        stop: function () {
            if (this.isReady()) {

                var self = this,
                    stream = self.stream;

                self.recorder.stop();
                stream.stop();
            }
        },

        setupStream: function () {
            var self = this,
                audioContext = self.our.context,
                source = audioContext.createMediaStreamSource(self.stream),
                zeroGain;

            source.connect(self.inputPoint);
            zeroGain = audioContext.createGain();
            zeroGain.gain.value = 0.0;
            zeroGain.connect(audioContext.destination);
            source.connect(zeroGain);
        },

        //Пока не нужно
        getBuffer: function () {
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
