// JavaScript Document

sessionStorage.mv_username = false;
/*
if(localStorage.room === undefined) {
  localStorage.room = "multiverse";
}
*/


if(localStorage.sound !== "off") {
  localStorage.sound = "on";
}

//localStorage.sound = "off";

function requestNotifications() {
  Notification.requestPermission();
  $('#requestNotifications').hide();
}


/*
*/

$(document).ready(function() {

//$.noConflict();


  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          // the typeahead jQuery plugin expects suggestions to a
          // JavaScript object, refer to typeahead docs for more info
          matches.push({ value: str });
        }
      });

      cb(matches);
    };
  };

  var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

   //$('#chaut').typeahead({
   $('#the-basics .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
  },
  {
    name: 'states',
    displayKey: 'value',
    source: substringMatcher(states)
  });



    // check weather user is writing
    var sentFalse = true;
    setInterval(checkTyping, 3000);
    function checkTyping(){
        var isWritten = $("#chaut").val();
        if(isWritten !== '' ){ // something is written
            socket.emit('writing', {user: sessionStorage.mv_username, writing: true, room: localStorage.room});
            sentFalse = false;
        }
        else { // is not written
            if(sentFalse === false) {  // send it only once
                socket.emit('writing', {user: sessionStorage.mv_username, writing: false, room: localStorage.room});
                sentFalse = true;
            }
        }
    }

    // are we online?
    /*
    setInterval(checkOnline, 3000);
    function checkOnline() {
        if(socket.socket.connected === true) {
         $("#connected").show();
         $("#disconnected").hide();
        }
        else {
         $("#connected").hide();
         $("#disconnected").show();
        }
    }
    */


    socket.on('reconnect_failed', function () {cl("reconnect failed!");})

    socket.on('reconnect_error', function (data) {cl("reconnect error!"+data);})


	socket.on("connecting", function(){
		cl("client connecting");
	});
	socket.on("connect", function(){
		cl("client connected");
		//if(end){end(ioclient);}
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
		//playerName[message.shift()].send(message);
	});
	socket.on('disconnect', function(){
		cl("client disconnected");
	});
	socket.on('error', function(err){ // server not started
		cl("client error\n"+err);
		//setTimeout(function(){connectClient(url,end);}, 5000);
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

    socket.on('shortcuthelp', function (data) { cl("jou");
        printShortcuts();
    });

    socket.on('news', function (data) {
        writer(data);
    });

    socket.on('last', function (data) { cl(data);
        serialWriter(data);
    });

    socket.on('logout', function () {
        sessionStorage.removeItem("username");
        announcer ("You are logged out");
        $("#jetzt").addClass("hidden");
    });

    socket.on('roomHeader', function (data) {
        //$("#roomName").show();
        $("#roomId").html("#"+data.room);
        localStorage.room = data.room;
    });

    // let know if users have seen the message
    socket.on('nsa', function (data) {
        //serialWriter(data);
        var thePost = "#"+data.nid;
        var author = $(thePost).find(".name").find("strong").html();

        if(sessionStorage.mv_username != data.name && data.name != author && data.name != "false") {
            //$(thePost).find(".content").append("<span class='gray small'> &#10003;"+data.name+"</div>");
            $(thePost).find(".viewers").find(".tick").show();
            $(thePost).find(".viewers").append("&nbsp;"+data.name+",");
        }
    });


    // let know if a user is writing
    socket.on('writing', function (data) {
        if(data.writing === true) {
            if(data.user !== sessionStorage.mv_username) {
                $("#isWriting").remove();
                $("#jetzt").before('<span id="isWriting" class="gray small">'+data.user+' is writing</span>');
            }
        }
        else {
            $("#isWriting").remove();
        }
    });

    function notifier(avatar, name, message) {
      if (!("Notification" in window)) {
        cl("this browser does not support notifications");
      } else {
        if (Notification.permission === "granted") {
          if (name != sessionStorage.mv_username ) {
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

    function writer(data, quiet) {
        //if(sessionStorage.mv_username != "false") { // hides news from non logged ins
            message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || '';
            message = findLinksAndImages(message); // find links and images
            var avatar = getAvatar(name);
            $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
            $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>'+name+'</strong></p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
            scrollAndBeep(data);
            if(quiet != true) {
              notifier(avatar, name, message);
            }
            socket.emit('nsa', { nid: data.nid, name: sessionStorage.mv_username, room: data.room });
        //}
    }

    // print announcements
    function announcer(message) {
        message = message || '';
        $("#jetzt").before('<div class="message announce"><p>'+message+'</p>');
    }

    function paint(data, quiet) { cl()
        title = data.title || ''; author = data.author || ''; time = data.time || ''; city = data.city || ''; nid = data.nid || '';
        var avatar = getAvatar(author);

        if(title.indexOf(" ") != -1) title = title.slice(0, title.indexOf(" "));
        $("#isWriting").remove();
        $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><span class="gray" >'+time+'</span></div><div class="place small">'+city+'</div><p class="name"><strong>'+author+'</strong>&nbsp;&nbsp;<a class="gray nodecoration" href="#/r/'+room+'">#'+room+'</a></p><img class="full" src="images/shortcuts/'+shortcuts[title].img+'" /><span class="viewers"></span></div>');
        scrollAndBeep(data);
        if(quiet != true) {
          notifier(avatar, author, title);
        }
        socket.emit('nsa', { nid: data.nid, name: sessionStorage.mv_username, room: data.room });
    }

    function tell(data) {
      if (data.recipient === sessionStorage.mv_username) {
        message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || '';
        message = findLinksAndImages(message); // find links and images
        var avatar = getAvatar(name);
        $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
        $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>'+name+'</strong> sent private message:</p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
        scrollAndBeep(data);
        var itsPrivate = name+" privately:";
        notifier(avatar, itsPrivate, message);
        socket.emit('nsa', { nid: data.nid, name: sessionStorage.mv_username, room: data.room });
      }
    }

    function tell_sent(data) {
      message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; room = data.room || ''; recipient = data.recipient || '';
      message = findLinksAndImages(message); // find links and images
      var avatar = getAvatar(name);
      $("#isWriting").remove(); // <a href="#kala" class="nodecoration" style="color: inherit;">
      $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/users/'+avatar+'" class="avatar" /><div class="time"><a class="gray" href="#/p/'+nid+'">'+time+'</a></div><div class="place small">'+city+'</div><p class="name"><strong>You</strong> told privately to '+recipient+':</p><p>'+message+' <a href="#/r/'+room+'" class="gray nodecoration">#'+room+'</a><span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div></a>');
      scrollAndBeep(data);
    }


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
        announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<!--<br><strong>c</strong> - <strong>curse</strong> in Italian--> <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <!--<br><strong>soundon</strong> - turn  <strong>sound on</strong><br /> <strong>soundoff</strong> - turn <strong>sound off</strong><br />--> <!--<strong>logout</strong> - <strong>log out</strong>--><br /><strong>t username</strong> something - Private message something to username<br /><strong>sc</strong> - display all shortcuts');
        scroll();
    }

    function printMemeHelp() {
        //announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<br><strong>c</strong> - <strong>curse</strong> in Italian <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <br><strong>soundon</strong> - turn  <strong>sound on</strong><br /> <strong>soundoff</strong> - turn <strong>sound off</strong><br /> <strong>logout</strong> - <strong>log out</strong><br /><br /><strong>Rooms:</strong><br /> r <strong>brasalona</strong> - Brasalona in Riga / @murphy is the master<br />r <strong>piens</strong> - Piens in Riga. Delisnacks and Valmiermuiza available<br />r <strong>multiverse</strong> - the main room<br />');
      announcer("<strong>Meme it!</strong><br /><br /><strong>type: <br /></strong>m shortcut top caption/bottom caption<br />e.g:<br />m gf i know you're coming back to me/i have all your socks<br /><br />If a shortcut has either top or bottom line in brackets, it's pre­set, but can be changed.<br /><br /><strong>Shortcuts:</strong><br />m fwp<br>m fwp text to top / text to bottom<br>m fwp text to top<br>m fwp / text to bottom<br><br><strong>Available memes:</strong><br />");
      $.each(memes, function(key, value) {
        var s = value.img;
        s = s.substring(0, s.lastIndexOf("."));
        announcer("<img class='memeThumb' src='images/meme_thumb/"+s+".jpg' /><strong>"+value.name+"</strong> "+value.desc+"  ");
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

    function serialWriter(data) {
        announcer('History for room #' +localStorage.room);
        //scroll();
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
        if (sessionStorage.mv_username != data.author) {
			//cl (localStorage.sound);
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

/*
    $(document).keydown(function(e){
        if (e.keyCode == 40) {
            cIndex++;
            var command = $(c).get(cIndex);
            $("#input").val(command.message);
            //c.pop();
            return false;
        }
    });
  */
});



// up and down arrows bring up last commands
var c = new Array;
c.push({id:"", message:""});
var cIndex = 0;

$(document).keydown(function(e){
    if (e.keyCode == 38) {
        cIndex--;
        var command = $(c).get(cIndex);
        $("#input").val(command.message);
        //c.pop();
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
    //var goToRoom = "http://www.multiverse.im/#/r/"+room;
    var goToRoom = "/r/"+room;
    //var goToRoom = "http://localhost:3001/#/r/"+room;
    //$scope.$apply( $location.path( goToRoom ) );
    //$location.path( goToRoom );

    //window.location.href = goToRoom;
    $location.path( goToRoom );
    //$route.reload();
    return;
  }

});


// controller for input
multiverse.controller('sendout', function($scope, $route, $routeParams, $location) {

    // hides add desktop notif button
    if ("Notification" in window) {
      if(Notification.permission == "granted") {
        $('#requestNotifications').hide();
      }
    }

    localStorage.room = $routeParams.room;

    $scope.chatter = function(htmlForm) {

    // if not a registered user take first input as username
    if (sessionStorage.mv_username === "false") {
      var username = $scope.chat.chaut;
      name = String(username);
      $("#pleaseWait").show(); //console.log(localStorage.room+"aaaa");
      socket.emit('adduser', { username: username, time: getTime(), room: localStorage.room });
      sessionStorage.mv_username = username; // this can be achieved just with using "name"
      document.getElementById("chaut").removeAttribute("placeholder");
      $scope.chat = "";
      return;
    }

      var title = $scope.chat.chaut;
      var message = title;
      var username = sessionStorage.mv_username;

      analyzeEntry($scope, $location, message, username);

      $scope.chat = "";
    }

});


// controller for #/r/*****
multiverse.controller('room', function($scope, $route, $routeParams, $location, $http) {

    if(document.readyState == 'complete') {
      $scope.room = $routeParams.room;
      var room = $scope.room
      localStorage.room = room;
    }
/*
    var room = $routeParams.room;

    $http({method: 'GET', url: '/api/last/'+room}).success(function(data) {
      $scope.lastposts = data;
    });
*/

});


// controller for #/p/*****
multiverse.controller('posts', function($scope, $route, $routeParams, $location, $http) {

    // get the data for main post
    var id = $location.$$path;
    var last = id.substring(id.lastIndexOf("/") + 1, id.length);
    last = String(last);

    socket.emit('room', { title: "r "+ last });


    $http({method: 'GET', url: '/api/p/'+last}).success(function(data) {
      localStorage.room = data.nid;
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

multiverse.directive('lastposts', function() {
    return function($scope, $element, $attrs, $location) {
        $scope.$watch('room', function(value){
          socket.emit('room', { title: "r "+ localStorage.room });
        });
    }
});
