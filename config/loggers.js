(function(){

  'use strict';

  if( process.env.NODE_ENV !== 'production' )
    return;

  var loggly = require('loggly');

  var client = loggly.createClient({
    token: 'da2445ac-aa08-4d9a-b3f5-03b347286170',
    subdomain: 'tastenwerk',
    tags: ['caminio'],
    json: true
  });

  module.exports.loggers = [ client ];

})();
