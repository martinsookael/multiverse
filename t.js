
/**
 * Module dependencies.
 */


var express = require('express')
//  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , conf = require('./conf')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , date = new Date();


// Mongo db operations
if(conf.db.usesDb === true) {
  var ArticleProvider = require('./db').ArticleProvider;
  var articleProvider = new ArticleProvider(conf.db.host, conf.db.port)
}

// all environments
app.set('port', process.env.PORT || conf.general.port);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/www/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public/www')));


// Set sockets ready for production:
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// usernames which are currently connected to the chat
var usernames = new Array();

/*
function printUsernames(usernames) {
    console.log(JSON.stringify(usernames));
}

setInterval( function(){printUsernames(usernames)}, 10000 );
*/

function findUserIndex(username) {
    for (var i=0;i<usernames.length;i++) {
        if(username === usernames[i].name) {
            return i;
        }
    }
}

function findUserRoom(username) {
    var index = findUserIndex(username);
}

function removeUser(username) {
    var index = findUserIndex(username);
    usernames.splice(index,1);
}

function switchUserRoom(username,room) {
    var index = findUserIndex(username);
    if(username != undefined) {
      usernames[index].room = room;
    }
}


function saveToDb(message, author, time, room, city, nid) {
    articleProvider.save({
        title: message,
        author: author,
        time: time,
        room: room,
        city: city,
        nid: nid
        }, function(error, docs) {
        // ERROR HANDLING
    });
}

// socket
io.sockets.on('connection', function (socket) {

    function changeRoom(data) {
            var newroom = data.title.slice(2); // remove "r" from beginning
            socket.leave(socket.room);
            socket.join(newroom);
            if(socket.username != "undefined") {
              socket.emit('news', { title: 'You are connected to #'+newroom, author: 'Server', time: data.time}); // echo to client they've connected
              // sent message to OLD room
              socket.broadcast.to(socket.room).emit('news', { title: '<strong>'+socket.username+'</strong> has left this room', author: 'Server', time: data.time});
              // update socket session room title
              socket.room = newroom;
              socket.broadcast.to(newroom).emit('news', { title: '<strong>'+socket.username + '</strong> has joined this room', author: 'Server', time: data.time});
              socket.emit('roomHeader', { room: newroom}); // echo to client they've connected
              switchUserRoom(socket.username,newroom)
            }
            printLast();
    }


    function printLast() {
        var room = socket.room;
        articleProvider.findLast(room, function(error,docs){
            socket.emit('last', docs);
        })
    }

    socket.on('news', function (data, pingBack) {
        // if the data doesn't know the room, ask from usernames
        if(data.room === null) {
            data.room = findUserRoom(socket.username);
        }
        console.log("t:news:room: "+data.room);

        // send it to all
        io.sockets.in(data.room).emit('news', { title: data.text, author: data.author, time: data.time, city: data.city, nid: data.nid, room: data.room });
        // write it to tb
        if(conf.db.usesDb === true) {
            saveToDb(data.text, data.author, data.time, data.room, data.city, data.nid);
        }
        pingBack(data.nid);
    });

    socket.on('paint', function (data) {
        io.sockets.in(socket.room).emit('paint', { title: data.title, author: data.author, time: data.time, room: data.room, city: data.city, nid: data.nid });
        //socket.emit('paint', { title: data.title, author: data.author, time: data.time });
        //socket.broadcast.emit('paint', { title: data.title, author: data.author, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.title, data.author, data.time, data.room, data.city, data.nid, data.room);
        }
    });

    socket.on('meme', function (data) {
        io.sockets.in(socket.room).emit('meme', { title: data.title, author: data.author, time: data.time, city: data.city, nid:data.nid });
        //socket.emit('meme', { title: data.title, author: data.author, time: data.time });
        //socket.broadcast.emit('meme', { title: data.title, author: data.author, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.title, data.author, data.time, data.room, data.city, data.nid );

        }
    });

    socket.on('room', function(data) {
        changeRoom(data)
    });


    socket.on('nsa', function (data) {
        //socket.broadcast.to(data.room).emit('nsa', { nid: data.nid, name: data.name });
        io.sockets.emit('nsa', { nid: data.nid, name: data.name }); // to fix - send only to apropriate room
    });


    socket.on('writing', function (data) {
        io.sockets.in(data.room).emit('writing', { user: data.user, writing: data.writing});
    });


    socket.on('who', function (data) {
        socket.emit('who', usernames);
    });

    socket.on('help', function () {
        socket.emit('help');
    });

    socket.on('last', function () {
        if(conf.db.usesDb === true) {
            printLast();
        }
        else socket.emit('news', { message: 'no datatabase connected', author: 'Server', time: ''});

    });

    socket.on('adduser', function(data){

        socket.username = data.username; // store the username in the socket session for this client

        var existing = findUserIndex(data.username);

        // if it's an NEW user
        if(existing === undefined) {
          if(socket.room === undefined) {
            socket.room = 'multiverse'; // store the room name in the socket session for this client
          }
          usernames.push({name: socket.username, room: socket.room});
          var query = new Array();
          query.title = "r "+socket.room;
          if(socket.room === 'multiverse') {
            changeRoom(query);
          }
        } else { // if it's a EXISTING user
          socket.room = usernames[existing].room;
          var query = new Array();
          query.title = "r "+socket.room;
          //changeRoom(query);
        }



        //socket.broadcast.emit('news', { title: '<strong>'+data.username + '</strong> has connected', author: 'Server', time: data.time}); // echo to room  that a person has connected
        socket.emit('help');
        socket.emit('news', { title: 'Buongiorno! You are connected', author: 'Server', time: data.time}); // echo to client they've connected
        socket.emit('who', usernames);
        socket.emit('getUp');
        if(conf.db.usesDb === true) {
        //    printLast();
        }
//        io.sockets.emit('news', { title: '<strong>'+socket.username + '</strong> has connected to ' +socket.room, author: 'Server', time: ''});
        io.sockets.emit('news', { title: '<strong>'+socket.username + '</strong> has connected', author: 'Server', time: ''});

    });
    /*
    socket.on('getUsers', function(){
        // update list of users in chat, client-side
        socket.emit('getUsers', usernames);
    });
*/

    socket.on('disconnect', function(){ // welcome to the hotel california

        // remove the username from global usernames list
        //removeUser(socket.username);

        // echo globally that this client has left
        // remove disconnected because remove disconnected
        //io.sockets.emit('news', { title: '<strong>'+socket.username + '</strong> has disconnected', author: 'Server', time: 'bye'});
        //socket.leave(socket.room); // turned that off, since other way started havocing
    });

	/*socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
        socket.emit('news', { title: '! You are connected to #'+newroom, author: 'Server', time: data.time}); // echo to client they've connected
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('news', { title: socket.username+' has left this room', author: 'Server', time: data.time});
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('news', { title: '<strong>'+socket.username + '</strong> has joined this room', author: 'Server', time: data.time});
        socket.emit('roomHeader', { room: 'yolo'+newroom}); // echo to client they've connected

		//socket.emit('roomHeader', {room: newroom});

	});*/

});
/*
app.get('/', function(req, res){
    if(conf.db.usesDb === true) {
        articleProvider.findLast( function(error,docs){
            res.render('index.jade', {
                articles:docs,
                conf: conf.general
            });
        res.end();
        })
    }
    else {
        res.render('index.jade', {
            conf: conf.general
        });
        //res.end();
    }
});
*/

app.get('/', function(req, res){
    //res.writeHead(200, {"Content-Type": "text/html"});
    //res.end("Hello, yes, this is server!\n<br /> Please go to <a href='www/index.html'>talker</a>.");
    //res.render('index.html');
    res.sendfile(__dirname + '/public/www/index.html');
});

app.get('/api/p/:id', function(req, res){
    articleProvider.findOne(req.params.id, function(error,docs){

        //res.render('index.jade', {
          //  articles:docs,
          //  conf: conf.general
          //res.writeHead(200, {"Content-Type": "text/html"});
          res.send(docs);
        });

    //res.end();

    //53590604827e5c0200000021
    //res.send({id:req.params.id, name: "The Name", description: "description"});
});



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
