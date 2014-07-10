
/**
 *
 */

var conf = require('./conf');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// If Martin works on localhost, then the data will not be sent to the server
// if you think, this is a ugly hack, feel free to fix it.
os = require("os");
if (os.hostname() === "α") {
//  conf.db.host = "127.0.0.1";
}


ArticleProvider = function(host, port) {
  if(conf.db.dbName) {
    this.db= new Db(conf.db.dbName, new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(err, db) {
      if(!err) {
        db.authenticate(conf.db.username, conf.db.password, function(err){
          if(!err) con = db;
        })
      }
    });
  }
};


ArticleProvider.prototype.getCollection= function(callback) {
  if(conf.db.collectionName) {
    this.db.collection(conf.db.collectionName, function(error, article_collection) {
      if( error ) callback(error);
      else callback(null, article_collection);
    });
  }
};

ArticleProvider.prototype.findLast = function(room, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else { console.log("yo");
        article_collection.find({ room: { $in: [room] }}).sort({$natural:-1}).limit(7).toArray(function(error, results) {
            if( error ) callback(error)
          else callback(null, results.reverse())
          //else callback(null, results)
        });
      }
    });
};


ArticleProvider.prototype.findOne = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({nid: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};



ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          //article.created_at = new Date();
        }

        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

exports.ArticleProvider = ArticleProvider;
