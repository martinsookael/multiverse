// JavaScript Document

function getAvatar(name){
    switch(name) {
        case "4m4t3ur":
        var avatar = "4m4t3ur.jpeg";
        break;

        case "m":
        var avatar = "4m4t3ur.jpeg";
        break;

        case "muusa":
        var avatar = "muusa.jpg";
        break;

        case "Greta":
        var avatar = "greta.jpg";
        break;

        case "Server":
        var avatar = "be.png";
        break;

        case "vilkas":
        var avatar = "vilkas.jpg";
        break;

        case "murphy":
        var avatar = "murphy.jpg";
        break;

        case "jp":
        var avatar = "jp.jpg";
        break;

        case "rampage":
        var avatar = "rampage.png";
        break;

        case "marisjonovs":
        var avatar = "marisjonovs.jpg";
        break;

        case "4t4y4u"
        var avatar = "4t4y4u.jpg";
        break;

        default:
        var avatar = "drm.jpg";
        break;
    }
    return avatar;
}


function announcer2(message) {
    message = message || '';
    var announce=document.createElement("div");
    var t=document.createTextNode(message);
    announce.appendChild(t);
    announce.className = announce.className + " message announce";
    var insertAt = document.getElementById("jetzt");
    insertAt.parentNode.insertBefore(announce, insertAt);
}



// get local time
function getTime() {
    var d = new Date();
    var n = d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    var time = n+':'+m;
    return time;
}

// shortcut for console.log
function cl(data) {
    console.log(data);
}

function logInIfUser(changeRoom) {
  if (sessionStorage.mv_username != undefined) {
    document.getElementById("chaut").removeAttribute("placeholder");
    //cl(localStorage.room);
    if(changeRoom === "true") {
      if(localStorage.room === 'undefined') {
        socket.emit('room', { title: "r multiverse" });
      }
    }
    announcer2 ("You are logged in as "+sessionStorage.mv_username);
    announcer2 ("write 'h'+enter for help");
  }
}



/*
function getPostsApi($scope, $http, $location) {

  var id = $location.$$path;
  var last = id.substring(id.lastIndexOf("/") + 1, id.length);
  last = String(last);

  $http({method: 'GET', url: '/api/p/'+last}).success(function(data) {
    $scope.post = data;
  });
} */


function memeHelp() {
  console.log(memes);
}

function soundOn() {
  localStorage.sound = "on";
  var soundOn = {};
  soundOn.title="sound is now on"; soundOn.author="Server"; soundOn.room="multiverse";
  //writer(soundOn);
  announcer2(soundOn.title);
}

function soundOff() {
  localStorage.sound = "off";
  var soundOff = {};
  soundOff.title="sound is now off"; soundOff.author="Server"; soundOff.room="multiverse";
  //writer(soundOff);
  announcer2(soundOff.title);
}


function analyzeEntry($scope, $location, message, username) {

      var rndNumb=Math.floor(Math.random()*1000000);
      var nid = "p"+rndNumb;

      var rndNumb=Math.floor(Math.random()*1000000);
      var nid = "p"+rndNumb;

      c.push({id:nid, message:message}); // add this to local command list

      // get the first word
      if (message === '') return false;
      message = message.trim();
      if(message.indexOf(" ") != -1) var firstWord = message.slice(0, message.indexOf(" "));
      else var firstWord = message;

      // get geoinfo
      var city ='';
      if (typeof(geoip_city) != "undefined") {
          //city = geoip_city()+", "+geoip_region()+", "+geoip_country_name();
          city = geoip_city();
    //}

    // is it a shortcut?
    if(firstWord in shortcuts) {

        // is it a meme?
        // is it a meme with a typo?
        if(findMemeError(message) === "error") {
            var data = new Array;
            data.title = '<strong>'+message+'</strong> - no such meme here :(';
            //input.val('');
            data.name = "Server";
            data.time = getTime();
            writer(data);
        } // it's no meme, pass it on
        else if(findMemeError(message) === "noMeme"){
            if(message === "m" || message === "M") {
                //announcer2("<strong>Meme it!</strong><strong>type: <br /></strong>m shortcut top caption/bottom caption<br />e.g:<br />m gf i know you're coming back to me/i have all your socks<br /><br />If a shortcut has either top or bottom line in brackets, it's pre­set, but can be changed.<br /><br /><strong>Shortcuts:</strong><br />m fwp<br>m fwp text to top / text to bottom<br>m fwp text to top<br>m fwp / text to bottom<br><br><strong>Available memes:</strong><br /><strong>m fwp</strong> - First World Problem<br><strong>m bru</strong> - bottom text: 'IMPOSSIBRU!!'<br /><strong>m baby</strong> - SuccessBaby<br /><strong>m yuno</strong> - Y U No?<br /><strong>m goodguy</strong> - Good Guy Greg<br /><strong>m man</strong> - Most interesting guy on earth<br /><strong>m simply</strong> - top text: 'One does not simply'<br /><strong>m whatif</strong> - top text: 'What if I told you?'<br /><strong>m scumb</strong> - Scumbag Steve<br /><strong>m scumg</strong> - Scumbag Stacy<br /><strong>m gf</strong> - Overly attached girlfriend<br /><strong>m fuckme</strong> - bottom text: 'Fuck me, right?' <br /><strong>m nobody</strong> - Bottom text: 'Ain&quot;t nobody got time for that'<br /><strong>m fa</strong> - Forever alone <br /><strong>m boat</strong> - I should buy a boat cat <br /><strong>m acc</strong> - top text: 'challegne accepted' <br /><strong>m notbad</strong> - bottom text: 'not bad' <br /><strong>m yoda</strong> - master yoda<br /><strong>m soclose</strong> - so close<br /><strong>m africa</strong> - top text: so you're telling me<br /><strong>m aliens</strong> - bottom text 'aliens'<br /><strong>m brian</strong> - bad luck Brian<br /><strong>m dawg</strong> - yo dawg, i heard...<br /><strong>m high</strong> - bottom text: 'is too damn high'<br /><strong>m isee</strong> - bottom text: i see what you did there<br /><strong>m notsure</strong> - not sure...<br /><strong>m bean</strong> - ...if you know what I meme<br /><strong>m evil</strong> - Dr. Evils one million dollars<br /><strong>m stoned</strong> - the stoned dude<br /><strong>m gusta</strong> - Me gusta<br /><strong>m parrot</strong> - Paranoid parrot<br /><strong>m social</strong> - Socially Awkward Penguin <br /><strong>m say</strong> - You don't say?<br /><strong>m kidding</strong> - Are you fucking kidding me?<br /><strong>m smth</strong> - It's something <br /><strong>m story</strong> - True strory<br /><strong>m yeah</strong> - Aww yeah <br /><strong>m please</strong> - Bitch please <br /><strong>m eyes</strong> - seductive eyes <br /><strong>m fu</strong> - fuck you <br />");
                //scroll();
                socket.emit("memehelp", { title: message, author: sessionStorage.mv_username, time: getTime(), city: city, nid: nid, room: localStorage.room });
            }

            else {
                if(message === "r" || message === "r " || message === "soundon" || message === "soundoff"  ) { 	// put these also to shortcuts.js

              switch(message) {

                case "r": // r misfire
                return false;
                break;

                case "r ": // r misfire
                return false;
                break;

                case "soundon":
                soundOn();
                break;

                case "soundoff":
                soundOff();
                break;

                default:
                return false;
                break;
              }

      }
                else {
                    var channel = shortcuts[firstWord].channel;
                    if(channel === 'room') {
                      var newroom = message.slice(2);
                      localStorage.room = newroom;
                      $scope.$apply( $location.path( "r/"+localStorage.room ) );


                    }
                    socket.emit(channel, { title: message, author: sessionStorage.mv_username, time: getTime(), city: city, nid:nid, room:localStorage.room });
                }
            }
        } // it's a meme!
        else {
            var data = new Array;
            data.title = message;
            data.author = "Server";
            data.time = getTime();
            socket.emit("meme", { title: message, author: sessionStorage.mv_username, time: getTime(), city: city, nid: nid, room: localStorage.room });
        }
    }

    else { // if no shortcut, send it to the wire
        socket.emit('news', { text: message, author: sessionStorage.mv_username, time: getTime(), city: city, nid: nid, room: localStorage.room}, function(feedBack) {
            //console.log(feedBack); // fires when server has seen it
        });
    }
  }
}
