[![Build Status](https://travis-ci.org/caminio/caminio-ui.png)](https://travis-ci.org/caminio/caminio-ui)

## caminio-ui

A user interface for caminio. It provides you with a graphical admin backend and is required by most caminio
gears implementing graphical features.

## dependencies

* [http://github.com/caminio/caminio-auth](http://github.com/caminio/caminio-auth)

## usage

    $ npm install --save caminio-ui


require it to your project/gear's index file before or at least when you run caminio.

    var caminio = require('caminio');

    caminio.run(
      require('caminio-auth'),
      require('caminio-ui')
    );
