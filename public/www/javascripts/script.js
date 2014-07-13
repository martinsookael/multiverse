// JavaScript Document

if(localStorage.sound !== "off") {
  localStorage.sound = "on";
}

function requestNotifications() {
  Notification.requestPermission();
  $('#requestNotifications').hide();
}

$(document).ready(function() {



    // check weather user is writing
    var sentFalse = true;

    var room = angular.injector(['ng', 'multiverse']).get("Room").get();
    var Username = angular.injector(['ng', 'multiverse']).get("User").get();

    socket.on('reconnect_failed', function () {cl("reconnect failed!");})

    socket.on('reconnect_error', function (data) {cl("reconnect error!"+data);})


  	socket.on("connecting", function(){
  		cl("client connecting");
  	});
  	socket.on("connect", function(){
  		cl("client connected");
  	});
  	socket.on("connect_failed", function(){
  		cl("client connect_failed");
  	});
  	socket.on("reconnecting", function(){
  		cl("client reconnecting");
  	});
  	socket.on("reconnect", function(){
  		cl("client reconnected");
  	});
  	socket.on("reconnect_failed", function(){
  		cl("client reconnect_failed");
  	});
  	socket.on('message', function(message){
  		cl(message);
  	});
  	socket.on('disconnect', function(){
  		cl("client disconnected");
  	});
  	socket.on('error', function(err){ // server not started
  		cl("client error\n"+err);
  	});




    /* PROCESS SERVER RESPONSES */
    socket.on('getUp', function () {
        $('#jetzt').show();
        $("#input").focus();
        $("#roomName").show();
    });

    socket.on('paint', function (data) {
        paint(data);
    });

    socket.on('tell', function (data) {
        tell(data);
    });

    socket.on('tell_sent', function (data) {
        tell_sent(data);
    });

    socket.on('meme', function (data) {
        memeIt(data);
        scrollAndBeep(data);
    });

    socket.on('who', function (data) {
        printWho(data);
    });

    socket.on('help', function (data) {
        printHelp();
    });

    socket.on('memehelp', function (data) {
        printMemeHelp();
    });

    socket.on('shortcuthelp', function (data) {
        printShortcuts();
    });

    socket.on('news', function (data) {
        writer(data);
    });

    socket.on('last', function (data) {
        serialWriter(data);
    });

    socket.on('logout', function () {
        sessionStorage.removeItem("username");
        announcer ("You are logged out");
        $("#jetzt").addClass("hidden");
    });

    // let know if users have seen the message
    socket.on('nsa', function (data) {
        var Username = angular.injector(['ng', 'multiverse']).get("User").get();
        var thePost = "#"+data.nid;
        var author = $(thePost).find(".name").find("strong").html();
        if(Username != data.name && data.name != author && data.name != "false") {
            $(thePost).find(".viewers").find(".tick").show();
            $(thePost).find(".viewers").append("&nbsp;"+data.name+",");
        }
    });


    // let know if a user is writing
    socket.on('writing', function (data) {
        var Username = angular.injector(['ng', 'multiverse']).get("User").get();
        if(data.writing === true) {
            if(data.user !== Username) {
                $("#isWriting").remove();
                if (data.user != "false" && data.user != undefined) {
                  $("#jetzt").before('<span id="isWriting" class="gray small">'+data.user+' is writing</span>');
                }
            }
        }
        else {
            $("#isWriting").remove();
        }
    });

    // Sends desktop notifications
    function notifier(avatar, name, message) {
      var Username = angular.injector(['ng', 'multiverse']).get("User").get();
      if (!("Notification" in window)) {
        cl("this browser does not support notifications");
      } else {
        if (Notification.permission === "granted") {
          if (name != Username) {
            if (name != "Server" ) {
              var notification = new Notification(name, {icon: "images/users/"+avatar, body: message});
              setTimeout(function(){
                notification.close();
              },4000);
            }
          }
        } else {
          Notification.requestPermission();
        }
      }
    }

    // posts news
    function writer(data, quiet) {
      var Username = angular.injector(['ng', 'multiverse']).get("User").get();
      message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || '';
      message = findLinksAndImages(message); // find links and images
      var avatar = getAvatar(name);
      $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
      $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>'+name+'</strong></p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
      scrollAndBeep(data);
      if(quiet != true) {
        notifier(avatar, name, message);
      }
      socket.emit('nsa', { nid: data.nid, name: Username, room: data.room });
    }

    // print announcements
    function announcer(message) {
        message = message || '';
        $("#jetzt").before('<div class="message announce"><p>'+message+'</p>');
    }

    // Prints shortcuts
    function paint(data, quiet) { cl(data);
        var Username = angular.injector(['ng', 'multiverse']).get("User").get();

        title = data.title || ''; author = data.author || ''; time = data.time || ''; city = data.city || ''; nid = data.nid || '';
        var avatar = getAvatar(author);

        if(title.indexOf(" ") != -1) title = title.slice(0, title.indexOf(" "));
        $("#isWriting").remove();
        $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><span class="gray" >'+time+'</span></div><div class="place small">'+city+'</div><p class="name"><strong>'+author+'</strong>&nbsp;&nbsp;<a class="gray nodecoration" href="#/r/'+room+'">#'+room+'</a></p><img class="full" src="images/shortcuts/'+shortcuts[title].img+'" /><span class="viewers gray small"></span></div>');
        scrollAndBeep(data);
        if(quiet != true) {
          notifier(avatar, author, title);
        }
        socket.emit('nsa', { nid: data.nid, name: Username, room: data.room });
    }

    // Prints private messages
    function tell(data) {
      if (data.recipient === Username) {
        message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || '';
        message = findLinksAndImages(message); // find links and images
        var avatar = getAvatar(name);
        $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
        $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>'+name+'</strong> sent private message:</p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
        scrollAndBeep(data);
        var itsPrivate = name+" privately:";
        notifier(avatar, itsPrivate, message);
        socket.emit('nsa', { nid: data.nid, name: Username, room: data.room });

        //save last private messenger name for "re "
        var scope = angular.element($("#jetzt")).scope();
        $timeout(function() { // timeought ought to help against $apply already in progress.
          scope.$apply(function(){
            scope.lastPMAuthor = name;
          })
        });
      }
    }

    // print private message to sender
    function tell_sent(data) {
      message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || ''; recipient = data.recipient || '';
      message = findLinksAndImages(message); // find links and images
      var avatar = getAvatar(name);
      $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
      $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>You</strong> told privately to '+recipient+':</p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
      scrollAndBeep(data);
    }

    // Who is online
    function printWho(data){
      var allUsers = [];
      $.each(data, function(key, value) {
        if(allUsers != 'undefined'){
          //allUsers = key + ', ' + allUsers; // old
          allUsers = value.name + ', ' + allUsers;
        }
      });
      $("#jetzt").before('<div class="message announce"><div class="time">'+getTime()+'</div><p class="name"><strong>Online users:</strong></p>'+allUsers+'<p></p></div>');
    }

    function printHelp() {
        //announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<br><strong>c</strong> - <strong>curse</strong> in Italian <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <br><strong>soundon</strong> - turn  <strong>sound on</strong><br /> <strong>soundoff</strong> - turn <strong>sound off</strong><br /> <!--<strong>logout</strong> - <strong>log out</strong>--><br /><strong>t username</strong> something - Private message something to username<br /><br /><strong>Rooms:</strong><br /> r <strong>brasalona</strong> - Brasalona in Riga / @murphy is the master<br />r <strong>piens</strong> - Piens in Riga. Delisnacks and Valmiermuiza available<br />r <strong>multiverse</strong> - the main room<br />');
        announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<!--<br><strong>c</strong> - <strong>curse</strong> in Italian--> <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <!--<br><strong>soundon</strong> - turn  <strong>sound on</strong><br /> <strong>soundoff</strong> - turn <strong>sound off</strong><br />--> <!--<strong>logout</strong> - <strong>log out</strong>--><br /><strong>t username</strong> something - Private message something to username<br /><strong>re </strong> - write "re " - reply to last person who sent you private message<br /><strong>sc</strong> - display all shortcuts');
        scroll();
    }

    function printMemeHelp() {
        //announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<br><strong>c</strong> - <strong>curse</strong> in Italian <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <br><strong>soundon</strong> - turn  <strong>sound on</strong><br /> <strong>soundoff</strong> - turn <strong>sound off</strong><br /> <strong>logout</strong> - <strong>log out</strong><br /><br /><strong>Rooms:</strong><br /> r <strong>brasalona</strong> - Brasalona in Riga / @murphy is the master<br />r <strong>piens</strong> - Piens in Riga. Delisnacks and Valmiermuiza available<br />r <strong>multiverse</strong> - the main room<br />');
      announcer("<strong>Meme it!</strong><br /><br /><strong>type: <br /></strong>m shortcut top caption/bottom caption<br />e.g:<br />m gf i know you're coming back to me/i have all your socks<br /><br />If a shortcut has either top or bottom line in brackets, it's pre­set, but can be changed.<br /><br /><strong>Shortcuts:</strong><br />m fwp<br>m fwp text to top / text to bottom<br>m fwp text to top<br>m fwp / text to bottom<br><br><strong>Available memes:</strong><br />");
      $.each(memes, function(key, value) {
        var s = value.img;
        s = s.substring(0, s.lastIndexOf("."));
        announcer("<img class='memeThumb' style='margin-top: 2px; width: 35px; height: 35px;' src='images/meme_thumb_2/"+s+".jpg' /><strong>"+value.name+"</strong> "+value.desc+"  ");
        //cl(value);
      });
      scroll();
    }

    function printShortcuts() {
      announcer("<strong>Shortcuts!</strong>");
      $.each(shortcuts, function(key, value) {
        announcer(key);
      });
      scroll();
    }

    // if there's more news to print - like when user logs in or presses "l"
    function serialWriter(data) {
        var room = angular.injector(['ng', 'multiverse']).get("Room").get();
        announcer('History for room #' + room);
        if(data) {
          for (var i=0;i<data.length;i++) {
              if(data[i].title.indexOf(" ") != -1) var firstWord = data[i].title.slice(0, data[i].title.indexOf(" "));
              else var firstWord = data[i].title;

              if(firstWord in shortcuts) {
                  // it's a shortcut but no meme
                  if(findMemeError(data[i].title) === "noMeme" || findMemeError(data[i].title) === "error"){
                      // well hello there
                      // hardcode often?
                      paint(data[i], true);
                  } // it's a meme!
                  else {
                      memeIt(data[i]);
                  }
              }
              else { // if no shortcut, send it to the wire
                  writer(data[i], true);
              }
          }
          setTimeout(function(){scroll();}, 1000);
        }

    }

    // automagic link creation from URLs
    function urlsToLinks(text) {
        var exp = /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var match =  text.match(exp); // address

        if(match !== null){ // is link
            match = encodeURI(match);
            return "<a href='#' target='blank' onclick='window.open(&quot;"+match+"&quot;, &quot;_blank&quot;, &quot;location=yes&quot;); return false;' style='color: #0066cc; text-decoration: underline; cursor: pointer;' >"+match+"</a>";
        }
        else return text;

    }

    // automagic image creation from URLs
    function findLinksAndImages(text) {
        var exp = /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+(\.jpg|\.jpeg|\.png|\.gif|\.bmp))/ig;
        var match =  text.match(exp);
        if(match !== null){ // is image
            //return text.replace(exp,"<a href='$1' target='_blank'><img class='full' src='$1' /></a>");
            match = encodeURI(match);
            return "<a href='#'  target='blank' onclick='window.open(&quot;"+match+"&quot;, &quot;_blank&quot;, &quot;location=yes&quot;); return false;' ><img class='full' src='"+match+"' /></a>";
        }
        else { // is some other kind of link
            return urlsToLinks(text);
        }
    }

    // autoscroll to bottom of page
    function scroll() {
        //if (name != username) document.getElementById('ping1').play();
        var height = $(document).height();
        //$(window).scrollTop(height);
        window.scrollTo(0,document.body.scrollHeight);
    }

    // scroll and beep on command
    function scrollAndBeep(data) {
        if (Username != data.author) {
			if(localStorage.sound === "on") {
				document.getElementById('ping1').play();
			}
            if(deviceActive === false) {
                makeBeep();
                vibrate();
            }
        }
        scroll();
    }
});



// up and down arrows bring up last commands
var c = new Array;
c.push({id:"", message:""});
var cIndex = 0;

$(document).keydown(function(e){
  if (e.keyCode == 38) {
      cIndex--;
      var command = $(c).get(cIndex);
      $("#chaut").val(command.message);
      return false;
  }

  if (e.keyCode == 40) {
      cIndex++;
      var command = $(c).get(cIndex);
      $("#chaut").val(command.message);
      return false;
    }

});


var multiverse = angular.module('multiverse', ['ngRoute']);

// Routes
multiverse.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
    templateUrl : 'pages/main_container.html',
    controller  : 'room'
  })

  .when('/r/:room', {
    templateUrl : 'pages/room.html',
    controller  : 'room'
  })

  .when('/p/:post', {
    templateUrl : 'pages/post.html',
    controller  : 'posts'
  })
/*
  .otherwise({
      redirectTo: '/'
  })
*/

  $locationProvider.html5Mode(false);

});

// controller for main page
multiverse.controller('one', function($scope, $route, $routeParams, $location) {

  // This helps people on front page to go to a room
  $scope.roomer = function(htmlForm) {
    var room = $scope.roomer.number;
    room = String(room);
    var goToRoom = "/r/"+room;
    $location.path( goToRoom );
    return;
  }

  // If ?iframe=1 is called hide github, facebook and twitter.
  if($location.search().iframe === "1") {
    $scope.$parent.iframe = true;
  } else {
    $scope.$parent.iframe = false;
  }

});


// controller for input
multiverse.controller('sendout', function($scope, $route, $routeParams, $location, Room, User) {

    // hides add desktop notif button
    if ("Notification" in window) {
      if(Notification.permission == "granted") {
        $('#requestNotifications').hide();
      }
    }

    Room.set($routeParams.room);
    room = $routeParams.room;
    //socket.emit('room', { title: "r "+ room });

    $scope.memeImage = "blank";
    $scope.memeName = "blank";

    $scope.chatter = function(htmlForm) {

    // if not a registered user take first input as username
    if (User.get() == "false") {
      var username = $scope.chat.chaut;
      name = String(username);
      $("#pleaseWait").show();
      socket.emit('adduser', { username: username, time: getTime(), room: room });
      User.set(username);
      document.getElementById("chaut").removeAttribute("placeholder");
      $scope.chat = "";
      return;
    }

      var title = $scope.chat.chaut;
      var message = title;
      var username = User.get();

      analyzeEntry($scope, $location, message, username);

      $scope.chat = "";
      $scope.showPreview = false;
    }

    $scope.onTextInput = function(){
      var message = $scope.chat.chaut;
      var chunks = message.split(" ");
      //var memeToShow = null;
      //var sh = window.shortcuts;

      // Show preview for shortcuts
      if(chunks.length == 1){
        var needle = chunks[0];
        if(needle in window.shortcuts) {
          var scSuggestion = shortcuts[needle];
          if(scSuggestion.img){ // some shortcuts don't have images
            $scope.showPreview = true;
            $scope.previewImage = "images/shortcuts/" + scSuggestion.img;
            $scope.previewName = scSuggestion.img; // couldn't figure out how to get the key #rookie
          }
          return; //exit early
        }
      }

      //only if we have two bits = it might be a meme
      if(chunks.length == 2){
        var needle = chunks[1];
        var found = window.memes.filter(function(item) { return item.name == needle; });
        if(found.length >= 1){
          $scope.showPreview = true;
          var memeSuggestion = found[0];
          $scope.previewImage = "images/meme/" + memeSuggestion.img;
          $scope.previewName = memeSuggestion.name;
          return; //exit early
        }
      }
      $scope.showPreview = false;

      // if input is "re ", replace it with "t lastPMAuthor"
      if ($scope.chat.chaut.length === 3 && $scope.lastPMAuthor != undefined && /re\s$/ig.test($scope.chat.chaut)) {
        $scope.chat.chaut = "t " + $scope.lastPMAuthor + " ";
      }

      // let other users know somebody is writing
      if ($scope.chat.chaut.length > 0) {
        if ($scope.chat.chaut.length <= 2) {
          socket.emit('writing', {user: User.get(), writing: true, room: room});
        }
      }

      // if not writing, remove the "is writing" tag
      if ($scope.chat.chaut.length === 0) {
        socket.emit('writing', {user: User.get(), writing: false, room: room});
        isTyping = 0;
      }

    }
});


// controller for #/r/*****
multiverse.controller('room', function($scope, $route, $routeParams, $location, $http, Room) {
    //Room.set($routeParams.room);
});


// controller for #/p/*****
multiverse.controller('posts', function($scope, $route, $routeParams, $location, $http) {

    // get the data for main post
    var id = $location.$$path;
    var last = id.substring(id.lastIndexOf("/") + 1, id.length);
    last = String(last);

    //socket.emit('room', { title: "r "+ last });


    $http({method: 'GET', url: '/api/p/'+last}).success(function(data) {
      Room.set(data.nid);
      // create avatar if known user
      var avatar = getAvatar(data.author);
      $scope.avatar = avatar;
      $scope.post = data;
      if(data) {
        memeIt(data);
      }
    });

    $http({method: 'GET', url: '/api/last/'+last}).success(function(data) {
      $scope.lastposts = data;
    });

});


// should clear caching. Noone knows if it does it.
multiverse.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});

multiverse.factory('Room', function () {
  return new function () {
    if(window['room'] === undefined) {
      room = "one";
    }
    this.get = function () {
      return room;
    }
    this.set = function (nr) {
      room = nr;
      socket.emit('room', { title: "r "+ room });
      return;
    }
  }
});

multiverse.factory('User', function () {
  return new function () {
    if(window['user'] === undefined) {
      user = "false";
    }
    this.get = function () {
      return user;
    }
    this.set = function (newUser) {
      user = newUser;
      return;
    }
  }
});
