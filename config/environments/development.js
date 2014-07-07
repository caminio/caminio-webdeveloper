module.exports = {

  // run this server on port
  port: 4000,

  // database
  db: { 
    url: 'mongodb://localhost:27017/caminio-webdeveloper',
    debug: true 
  },

  superusers: [ 'manager@camin.io' ],

  hostname: 'http://localhost:4000',

  contentPath: __dirname+'/../../../content',

  loglevel: 'debug'

};
