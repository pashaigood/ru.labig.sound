var engines = {
    WEB: require('ig/engine/WEB'),
    Flash: require('ig/engine/Flash')
};

module.exports = the.module({
	
	Wav : { //implements : ['ig.sound.record.IRecorder'],
		our : {
			engine : 0,
			
			/**
			 * Данный медот выбирает технологию записи
			 * звукового сигнала
			 */
			initRecordEngine : function() {

				if (! this.engine) {
					navigator.getUserMedia = navigator.getUserMedia
						|| navigator.webkitGetUserMedia
						|| navigator.mozGetUserMedia;
					
					if (navigator.getUserMedia) {
						window.AudioContext = window.AudioContext
							|| window.webkitAudioContext;
						
						window.URL = window.URL
							|| window.webkitURL;
						
						this.engine = engines.WEB;

                        //Вызов для тестов
//						this.engine = engines.Flash;
					}
					else {
						this.engine = engines.Flash;
					}
				}
			}
		},
		
		/**
		 * Экзепляр текущей метода записи. 
		 */
		engine : 0,
		
		/**
		 * Конструктор 
		 */
		Wav : function(callback) {
            this.our.initRecordEngine();
            return new this.our.engine(callback);
		}
	}
});
