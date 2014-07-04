( function(){
  'use strict';
  
  var join          = require('path').join;
  var resolvePath   = require('path').resolve;
  var fs            = require('fs');
  var _             = require('lodash');
  var formidable    = require('formidable');
  var easyimg       = require('easyimage');
  var mkdirp        = require('mkdirp');
  
  module.exports = function ProfilesController( caminio, policies, middleware ){
  
    var User   = caminio.models.User;
    var Domain = caminio.models.Domain;
  
    return {
  
      _before: {
        '*': policies.ensureLogin
      },
  
      /**
       * @method index
       */
      'show': [
        function( req, res ){
          res.caminio.render();
        }
      ],
  
      /**
       * serve static files in case of development mode;
       */
      'pics': [
        getUser,
        function( req, res ){
          var filename = join( caminio.config.contentPath, '__users', req.user._id+'.jpg' );
          if( !fs.existsSync( filename ) )
            return res.sendfile( resolvePath(__dirname+'/../../assets/images/bot_128x128.png') );
          return res.sendfile( filename );
        }],

      /**
       * upload pic
       */
      'upload_pic': function( req, res ){
        var form = new formidable.IncomingForm();
        var mediafilename;
        form.encoding = 'utf-8';
        form.maxFieldsSize = 5 * 10^6;
        req.mediafiles = [];
        req.errors = [];

        if( !fs.existsSync( form.uploadDir ) )
          mkdirp.sync( form.uploadDir );
        form.uploadDir = join( caminio.config.contentPath, '__users' );

        if( !fs.existsSync( form.uploadDir ) )
          mkdirp.sync( form.uploadDir );

        form
        .on('fileBegin', function(name, file){
          file.path = mediafilename = join( form.uploadDir, res.locals.currentUser._id.toString() );
        })
        .on('end', function(){
          easyimg.thumbnail({
            src: mediafilename,
            dst: mediafilename+'.jpg',
            width: 128,
            height: 128,
            gravity: 'Center'}, function( err, image ){
              if( err ){
                caminio.logger.error(err);
                req.err.push(err);
              }
              res.json(200);
            });
        })
        .on('error', function(err){
          caminio.logger.error(err);
          res.send( 500, util.inspect(err) );
        }).parse(req, function(err, fields, files){});

      },

      /**
       * known email addresses
       */
      'knownEmailAddresses': [
        function( req, res, next ){ req.params.id = res.locals.currentUser._id; next(); },
        getUser,
        getEmailAddresses,
        function( req, res ){
          res.json( req.emails.map( function(email){ return { value: email }; } ));
        }
      ]

    };

    function getUser( req, res, next ){
      User.findOne({ _id: req.param('id') })
      .populate('camDomains')
      .exec( function( err, user ){
        if( err ){ return res.json(500, { error: 'server_error', details: err } ); }
        if( !user ){ return res.json(404, { erro: 'not_found' }); }
        req.user = user;
        next();
      });
    }

    function getEmailAddresses( req, res, next ){
      var regexp = new RegExp(req.param('q'),'i');
      var domains = req.user.populated('camDomains');
      if( req.user.superuser )
        Domain.find({}, function( err, domains ){
          if( err ){ console.error(err); return res.json(500, { error: 'server_error', details: err } ); }
          runGetEmails( _.map( domains, '_id') );
        });
        else
          runGetEmails( domains );

        function runGetEmails( domains ){
          User
          .find({ camDomains: { '$in': domains }, email: regexp})
          .sort({ email: 'asc' })
          .exec( function( err, users ){
            if( err ){ console.error(err); return res.json(500, { error: 'server_error', details: err } ); }
            req.emails = users.map(function(user){ return user.email; });
            next();
          });
        }

    }

  };

})();
