'use strict';

var express         = require('../node_modules/caminio/node_modules/express')
  , MongoStore      = require('connect-mongo')(express);

module.exports.session = {
  
  secret: 'X8l7h4qJpEktzsrS9VwfuYcXQREVgKHXOeBCKgdgqqD9unPvkwx6AcW68SLPQwkK',

  store: new MongoStore({
    db: 'caminio-webdeveloper_sessions',
    collection: 'sessions',
    auto_reconnect: true
  }),
  
  timeout: 10 * 60 * 60 * 1000,

  redirectUrl: '/'

};
