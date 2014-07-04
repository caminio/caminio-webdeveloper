module.exports = {
  
  // run this server on port
  port: 8901,
  hostname: 'https://camin.io',
  contentPath: __dirname+'/../../../../content',
  // port: 4000,
  // hostname: 'http://localhost:4000',
  // contentPath: __dirname+'/../../../content',

  // database
  db: { url: 'mongodb://localhost:27017/caminio-webdeveloper' },

  superusers: [ 'manager@camin.io' ],

  loglevel: 'warn'

};
