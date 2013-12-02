module.exports = {
    general: {
        host: '127.0.0.1' // notice the missing "http://"
      , port: 3001
      , url: 'http://127.0.0.1:3001'
      , anonAccess: true // leave true for non-logged in users to be able to see conversation
        // annonAccess IS NOT WORKING 
    }
  , db: {
        usesDb: true // true - uses db, false - uses not. // IF TALKER WON'T START, START DEBUGGING FROM HERE
      , host: 'ds051368.mongolab.com' // notice the missing "http://"
      , port: 51368 
      , dbName: 'heroku_app18775261'
      , collectionName: 'chat'
      , username: 'heroku_app18775261'
      , password: 'qfhs9bftk5k41of30q0i2oa0ot'
    }
  /*, db: {
        usesDb: true // true - uses db, false - uses not. // IF TALKER WON'T START, START DEBUGGING FROM HERE
      , host: '127.0.0.1' // notice the missing "http://"
      , port: 27017 
      , dbName: 'talker'
      , collectionName: 'chat3'
     // , username: 'heroku_app18775261'
    //  , password: 'qfhs9bftk5k41of30q0i2oa0ot'
    }*/
};
