$(function () {

    function onInit(err) {
        console.log(arguments, 'init');
    }

//    console.log (ig.sound.record.Wav.init());

    recTest = new ig.sound.record.Wav();
    recorder2 = new ig.sound.record.Wav();


    function record(recTest) {
        console.log('before start');
        recTest.start(function (err) {
            if (! err) {

                console.log('start');

                setTimeout(function () {
                    recTest.stop();
                    console.log('stop record');
                    recTest.upload('/test');
                }, 2000);
            }
            else {
                console.log(err);
            }

        });
    }

    $('.record').click(function () {
        record(recTest);
    });

    $('.play').click(function() {
        recTest.play();
    });

    $('.record2').click(function () {
        record(recorder2);
    });
    $('.play2').click(function() {
        recorder2.play();
    })
});
