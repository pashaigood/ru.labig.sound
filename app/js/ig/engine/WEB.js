var Recorder = require('mattdiamond/Recorder');

/**
 * @author PBelugin
 */
module.exports = the.module({
    WEB: { //implements : ['ig.sound.record.IRecorder'],
        stream: 0,
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
            callback = callback || function () {
            };
            var self = this;
            self.init(callback);
        },

        init: function (callback) {
            var self = this,
                audio_context = self.context = new AudioContext,
                inputPoint = self.inputPoint = audio_context.createGain();

            self.recorder = new Recorder(inputPoint);

            self.start(function (err) {
                if (!err) {
                    self.stop();
                    self.inited = true;
                }

                callback(err);
            });
        },

        _start: function(callback) {
            var recorder = this.recorder;
            recorder.clear();
            recorder.record();
            callback();
        },

        start: function (callback) {
            callback = callback || function () {
            };
            var self = this;

                self.getStream(function (err, stream) {
                    if (! err) {
                        self.stream = stream;
                        self.setupStream();

                        self._start(callback);
                    }
                    else {
                        callback(err);
                    }
                });
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
            self.stream.stop();
        },

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
