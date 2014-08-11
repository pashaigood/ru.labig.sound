$(function () {

    function onInit(err) {
        console.log(arguments, 'init');
    }

    var recorder = new ig.sound.record.Wav(onInit);

    $('.record').click(function () {
        console.log('before start');
        recorder.start(function (err) {
            if (!err) {

                console.log('start');

                setTimeout(function () {
                    recorder.stop();
                    console.log('stop record');
                    recorder.upload('/test');
                }, 5000);
            }
            else {
                console.log(err);
            }

        });
    });
});
