
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
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public/www')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

function saveToDb(message, author, time) {
    articleProvider.save({
        title: message,
        author: author,
        time: time
        }, function(error, docs) {
        // ERROR HANDLING
    });
}

// socket
io.sockets.on('connection', function (socket) {
    
    socket.on('news', function (data) { 
        io.sockets.in(socket.room).emit('news', { title: data.text, author: data.author, time: data.time });
        //socket.emit('news', { title: data.text, author: data.author, time: data.time });
        //socket.broadcast.emit('news', { title: data.text, author: data.author, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.text, data.author, data.time);
        }
    });

    socket.on('paint', function (data) { //console.log(data);
        io.sockets.in(socket.room).emit('paint', { title: data.title, author: data.author, time: data.time });
        //socket.emit('paint', { title: data.title, author: data.author, time: data.time });
        //socket.broadcast.emit('paint', { title: data.title, author: data.author, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.title, data.author, data.time);
        }
    });

    socket.on('meme', function (data) { 
        io.sockets.in(socket.room).emit('meme', { title: data.title, author: data.author, time: data.time });
        //socket.emit('meme', { title: data.title, author: data.author, time: data.time });
        //socket.broadcast.emit('meme', { title: data.title, author: data.author, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.title, data.author, data.time);
        }
    });
    
    socket.on('room', function (data) { 
        var newroom = data.title.slice(2); // remove "r" from beginning
        //console.log(room);
		socket.leave(socket.room);
		socket.join(newroom);
        socket.emit('news', { title: 'You are connected to #'+newroom, author: 'Server', time: data.time}); // echo to client they've connected
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('news', { title: socket.username+' has left this room', author: 'Server', time: data.time}); 
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('news', { title: '<strong>'+socket.username + '</strong> has joined this room', author: 'Server', time: data.time});
		//socket.emit('updaterooms', rooms, newroom);
    });

    socket.on('who', function (data) { 
        socket.emit('who', usernames);
    });

    
    socket.on('help', function () { 
        socket.emit('help');
    });
    
    socket.on('last', function () { 
        if(conf.db.usesDb === true) {
            articleProvider.findLast( function(error,docs){ //console.log(docs);
                socket.emit('last', docs);
            })
        }
        else socket.emit('news', { message: 'no datatabase connected', author: 'Server', time: ''});

    });    
    
    socket.on('adduser', function(data){
        socket.username = data.username; // store the username in the socket session for this client
        usernames[data.username] = data.username; // add the client's username to the global list
		socket.room = 'room1'; // store the room name in the socket session for this client
		socket.join('room1'); // send client to room 1
        //socket.broadcast.emit('news', { title: '<strong>'+data.username + '</strong> has connected', author: 'Server', time: data.time}); // echo to room  that a person has connected 
		socket.broadcast.to('room1').emit('news', { title: '<strong>'+data.username + '</strong> has connected', author: 'Server', time: data.time});

        socket.emit('help');
        socket.emit('news', { title: 'Buongiorno! You are connected', author: 'Server', time: data.time}); // echo to client they've connected
        socket.emit('who', usernames);
        socket.emit('getUp');
        if(conf.db.usesDb === true) {
            articleProvider.findLast( function(error,docs){
                socket.emit('last', docs);
            });
        }            
    });
    /*
    socket.on('getUsers', function(){
        // update list of users in chat, client-side
        socket.emit('getUsers', usernames);
    });
*/    
    
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // echo globally that this client has left
        socket.broadcast.to('room1').emit('news', { title: '<strong>'+socket.username + '</strong> has disconnected', author: 'Server', time: 'bye'});
        //socket.broadcast.emit('news', { title: '<strong>'+socket.username + '</strong> has disconnected', author: 'Server', time: 'bye'});
		socket.leave(socket.room);
    });

	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
        socket.emit('news', { title: '! You are connected to #'+newroom, author: 'Server', time: data.time}); // echo to client they've connected
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('news', { title: socket.username+' has left this room', author: 'Server', time: data.time}); 
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('news', { title: '<strong>'+socket.username + '</strong> has joined this room', author: 'Server', time: data.time});
		//socket.emit('updaterooms', rooms, newroom);
	});
    
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



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});