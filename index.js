
'use strict';

if( process.env.NODE_ENV === 'production' )
  require('nodetime').profile({
      accountKey: 'c1a35df9e40bc8d177217e985308558ea8fac915', 
      appName: 'camin.io-webdeveloper'
    });

var caminio = require('caminio');

caminio.run(
  require('caminio-auth'),
  require('caminio-ui'),
  require('caminio-media'),
  require('caminio-rocksol')
);

