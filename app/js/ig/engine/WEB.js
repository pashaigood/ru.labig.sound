var Recorder =  require('mattdiamond/Recorder');

/**
 * @author PBelugin 
 */
module.exports = the.module({
	WEB : { //implements : ['ig.sound.record.IRecorder'],
		our : {
			in_init : false,
			init : function(callback) {
				callback = callback || function(){};
				var self = this;

				navigator.getUserMedia(
					{
						audio: true
					},
					function(stream) {
						self.in_init = true;
						self.stream = stream;
						callback();
					},
					function(e) {
						self.in_init = false;
                        callback(new Error('No live audio input: ' + e));
			    	}
			    );
			},
			
			stream : false
		},
		
		inited : false,
		
		/**
		 * (AudioContext)
		 */
		context : 0,
		
		recorder : 0,
		/**
		 * @constructor 
		 */
		WEB : function(callback) {
            callback = callback || function(){};
			var self = this;
			self.context = new AudioContext;
			self.init(callback);
		},
		
		init : function(callback) {
			var self = this;
			
			if (! self.our.stream && ! self.our.in_init) {
				self.our.init(function(e) {
                    callback(e);
                    if (! e) {
                        self.startUserMedia(self.our.stream);
                    }
				});
			}
		},
		
		/**
		 * Обрабатывает событие выбора источника, инициализирует
		 * конеткс и библиотку Recorderjs
		 * @param {Object} stream
		 */
		startUserMedia : function(stream) {

            var self = this,
		  		audio_context = self.context,
		  		inputPoint = audio_context.createGain(),
		    	input = audio_context.createMediaStreamSource(stream),
		    	zeroGain,
		    	recorder;
		  	
		    console.log('Media stream created.');
		    
		    input.connect(inputPoint);
		    console.log('Input connected to audio context destination.');

		    recorder = self.recorder = new Recorder(inputPoint);
		    console.log('Recorder initialised.');
		    
		    //Выставляем громкость воспроизведения на 0
		    zeroGain = audio_context.createGain();
    		zeroGain.gain.value = 0.0;
    		input.connect(zeroGain);
    		zeroGain.connect(audio_context.destination);
    		
    		self.stop = recorder.stop;
    		self.inited = true;
		 },
		 
		 start : function(callback) {
		 	callback = callback || function(){};
		 	var self = this;
		 	
		 	if (self.inited) {
                var recorder = self.recorder;
                recorder.clear();
                recorder.record();
                callback();
		 	} else {
                callback(new Error('Engine not init'));
		 	}
		 },
		 
		 //Пока не нужно
		 getBuffer : function() {},
		 
		 upload : function(url, callback) {
		 	callback = callback || function(){};
		 	
		 	var self = this,
				form_data = new FormData(),
				request = new XMLHttpRequest();
				
		 	self.recorder.stop();
    		self.recorder.exportWAV(function(blob) {
				form_data.append('audio', blob, 'audio.wav');
				request.open("POST", url);
				request.send(form_data);
    		});
    		
    		request.onreadystatechange = function() {
				if (request.readyState == 4) {
					if(request.status == 200) {
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
