$(function () {

    function onInit(err) {
        console.log(arguments, 'init');
    }

    var recorder = new ig.sound.record.Wav(onInit),
        recorder2 = new ig.sound.record.Wav(onInit);

    function record(recorder) {
        console.log('before start');
        recorder.start(function (err) {
            if (! err) {

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
    }

    $('.record').click(function () {
        record(recorder);
    });

    $('.play').click(function() {
        recorder.play();
    });

    $('.record2').click(function () {
        record(recorder2);
    });
    $('.play2').click(function() {
        recorder2.play();
    })
});
