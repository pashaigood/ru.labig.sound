var Recorder = require('jwagener/Recorder');

module.exports = the.module({
	Flash : { //implements : ['ig.sound.record.IRecorder'],
		our: {
            swfPath: '/recorder.swf'
        },
        inited : false,
		
		Flash : function(callback) {
            callback = callback || function(){};
			var self = this;
			
			if (self.our.singleton) {
				return self.our.singleton;
			}
			
			self.our.singleton = self;

            self.init(callback);
		},

        init: function(callback) {
            var self = this;
            Recorder.initialize({
                //TODO положить ещё куда-нибуть
                swfSrc: self.our.swfPath,
                initialized : function() {
                    Recorder.record({
                        start : function() {
                            Recorder.stop();
                            self.inited = true;
                            callback();
                        }
                    });
                }
            });
        },

		start : function(callback) {
			if (this.inited) {
				callback = callback || function(){};
				Recorder.record({
					start : function() {
						callback();
					}
				});
			}
            else {
                callback(new Error('Engine not init'));
            }
		},
		
		stop : function() {
			Recorder.stop();
		},
		
		upload : function(url, callback) {
			callback = callback || function(){};
			
			Recorder.upload({
				url : url,
				success : function(response) {
					callback(response);
				}
			});
		}
	}
});
