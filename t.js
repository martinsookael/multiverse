
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
  var articleProvider = new ArticleProvider(conf.general.host, 27017)
}

// all environments
app.set('port', conf.general.port);
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

function saveToDb(message, name, time) {
    articleProvider.save({
        title: message,
        author: name,
        time: time
        }, function(error, docs) {
        // ERROR HANDLING
    });
}

// socket
io.sockets.on('connection', function (socket) {
    
    socket.on('news', function (data) { 
        socket.emit('news', { message: data.text, name: data.name, time: data.time });
        socket.broadcast.emit('news', { message: data.text, name: data.name, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.text, data.name, data.time);
        }
    });

    socket.on('paint', function (data) { 
        socket.emit('paint', { message: data.text, name: data.name, time: data.time });
        socket.broadcast.emit('paint', { message: data.text, name: data.name, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.text, data.name, data.time);
        }
    });

    socket.on('meme', function (data) { 
        socket.emit('meme', { message: data.text, name: data.name, time: data.time });
        socket.broadcast.emit('meme', { message: data.text, name: data.name, time: data.time });
        if(conf.db.usesDb === true) {
            saveToDb(data.text, data.name, data.time);
        }
    });
    
    socket.on('who', function (data) { 
        socket.emit('who', usernames);
    });

    
    socket.on('help', function () { 
        socket.emit('help');
    });
    
    socket.on('last', function () { 
        if(conf.db.usesDb === true) {
            articleProvider.findLast( function(error,docs){
                socket.emit('last', docs);
            })
        }
        else socket.emit('news', { message: 'no datatabase connected', name: 'Server', time: ''});

    });    
    
    socket.on('adduser', function(data){
        socket.username = data.username; // store the username in the socket session for this client
        usernames[data.username] = data.username; // add the client's username to the global list
        socket.broadcast.emit('news', { message: '<strong>'+data.username + '</strong> has connected', name: 'Server', time: data.time}); // echo to room  that a person has connected 
        socket.emit('help');
        socket.emit('news', { message: 'Buongiorno! You are connected', name: 'Server', time: data.time}); // echo to client they've connected
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
        socket.broadcast.emit('news', { message: '<strong>'+socket.username + '</strong> has disconnected', name: 'Server', time: 'bye'});
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