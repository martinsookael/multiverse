module.exports = {
    general: {
        host: '127.0.0.1' // notice the missing "http://"
      , port: 3001
      , url: 'http://127.0.0.1:3001'
      , anonAccess: true // leave true for non-logged in users to be able to see conversation
        // annonAccess IS NOT WORKING 
    }
  , db: {
        usesDb: false // true - uses db, false - uses not. // IF TALKER WON'T START, START DEBUGGING FROM HERE
      , dbName: 'talker'
      , collectionName: 'chat'
    }
};
