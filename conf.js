module.exports = {
    general: {
      port: 3001
    }
  , db: {
        usesDb: true // true - uses db, false - uses not.
      , host: process.env.HOST // notice the missing "http://"
      , port: process.env.DBPORT
      , dbName: process.env.DB
      , collectionName: process.env.COLLECTION
      , username: process.env.USER
      , password: process.env.PASS
    }
};
