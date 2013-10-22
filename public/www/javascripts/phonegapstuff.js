

    // Wait for device API libraries to load
    //

    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    

    var deviceActive = false;

    function onDeviceReady() { 
        deviceActive = true;
    }

    function onPause() { 
        deviceActive = false;
    }

    function onResume() { 
        deviceActive = true;
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
        if(deviceActive === true) { 
            navigator.notification.beep(1);
        }
        //navigator.notification.beep(3); // for three beeps
    }

    function vibrate() {
        if(deviceActive === true) { 
            navigator.notification.vibrate(200);
        }
    }
