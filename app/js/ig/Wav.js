var engines = {
        WEB: require('ig/engine/WEB'),
        Flash: require('ig/engine/Flash')
    },
    engine;

/**
 * Данный медот выбирает технологию записи
 * звукового сигнала
 */
!function () {

    navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        window.AudioContext = window.AudioContext
            || window.webkitAudioContext;

        window.URL = window.URL
            || window.webkitURL;

        engine = engines.WEB;

        //Вызов для тестов
//		engine = engines.Flash;
    }
    else {
        engine = engines.Flash;
    }
}();

module.exports = engine;
