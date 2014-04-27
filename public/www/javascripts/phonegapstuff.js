

    // Wait for device API libraries to load
    //

    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);


    var deviceActive = false;
    var isWeb = true;

    function onDeviceReady() {
        deviceActive = true;
        isWeb = false;
    }

    function onPause() {
        deviceActive = false;
        isWeb = false;
    }

    function onResume() {
        deviceActive = true;
        isWeb = false;
    }

    function openLink(match) { //console.log(match);
         var ref = window.open(match, '_blank', 'location=yes');
        //ref.addEventListener('loadstart', function() { alert('start: ' + event.url); });
         //ref.addEventListener('loadstop', function() { alert('stop: ' + event.url); });
         //ref.addEventListener('exit', function() { alert(event.type); });
    }

    function showAlert() {
        navigator.notification.alert(
            'Message!',  // message
            'Title',            // title
            'Button name'                  // buttonName
        );
    }

    function makeBeep() {
        if(isWeb === false) {
            navigator.notification.beep(1);
        }
        //navigator.notification.beep(3); // for three beeps
    }

    function vibrate() {
        if(isWeb === false) {
            navigator.notification.vibrate(200);
        }
    }
