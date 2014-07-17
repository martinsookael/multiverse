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

        case "4t4y4u":
        var avatar = "4t4y4u.jpg";
        break;

        case "enzuguri":
        var avatar = "enzuguri.jpg";
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

/*
function logInIfUser(changeRoom) {
  var Room = angular.injector(['ng', 'multiverse']).get("Room");
  if (sessionStorage.mv_username != undefined) {
    document.getElementById("chaut").removeAttribute("placeholder");
    if(changeRoom === "true") {
      if(Room.get() === 'undefined') {
        socket.emit('room', { title: "r one" });
      }
    }
    announcer2 ("You are logged in as "+sessionStorage.mv_username);
    announcer2 ("write 'h'+enter for help");
  }
}
*/


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
