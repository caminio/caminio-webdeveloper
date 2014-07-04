module.exports = function UsersExchangeController( caminio, policies, middleware ){

  'use strict';

  var _             = require('lodash');
  var User          = caminio.models.User;

  var formidable    = require('formidable');
  var csv           = require('csv');
  var fs            = require('fs');
  var http          = require('http');
  var url           = require('url');
  var async         = require('async');

  return {

    _policies: {
      '*': policies.ensureLogin
    },

    _before: {
      '*': policies.ensureAdmin
    },

    /**
     * @method import
     */
    'import': [
      parseUsersCSV,
      parseUsers,
      function( req, res ){
        res.json( req.report );
      }]

  };

  function parseUsersCSV( req, res, next ){

    var params = {};
    var userCols = ['nickname', 'name', 'email', 'downloadUrl', 'lang' ];  
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
   
    req.users = [];
    req.report = { existed: [], created: [], errors: [], currentDomain: res.locals.currentDomain };

    form
      .parse(req)
      .on('file', function( fields, file ){
        if( file.type !== 'text/csv')
          return res.send(415,'unsupported_media_type');
        csv()
          .from.stream( fs.createReadStream( file.path ), { columns: userCols } )
          .transform( function(row){
            row.lastname = row.name.split(' ')[ row.name.split(' ').length-1];
            row.firstname = row.name.replace(' '+row.lastname,'');
            row.camDomains = [ res.locals.currentDomain._id ];
            row.roles = {};
            row.roles[ res.locals.currentDomain._id ] = 40;
            return row;
          })
          .on('record', function( row, index ){
            if( index !== 0 )
              req.users.push( row );
          })
          .on('end', function(count){
            next();
          });
      });

  }

  function parseUsers( req, res, next ){
    if( !req.users )
      return res.json(400, { error: 'no users found in csv' });

    async.eachSeries( req.users, function(userAttrs, nextIteration){ 
        checkAndCreateUser(userAttrs, req.report, nextIteration ); 
      }, next );

  }

  function checkAndCreateUser( userAttrs, report, next ){

    User
      .findOne({ email: userAttrs.email })
      .exec( function( err, user ){
        if( err ){ return next(err); }
        if( user ){report.existed.push(userAttrs.email); return next(); }

        // parsing urls did work, but server required authentication, which was not worth it
        //
        //if( userAttrs.downloadUrl )
        //  return parseURL( userAttrs, report, next );
        return continueCreateUser( userAttrs, report, next );
      });

  }

  function parseURL( userAttrs, report, next ){
    var file = fs.createWriteStream('/tmp/testimage');
    var hostUrl = url.parse( userAttrs.downloadUrl ); 
    http.get( hostUrl, function (res) {
      res.pipe(file);
      file.on('finish', function(){
        file.close(next);
      });
    });
  }

  function continueCreateUser( userAttrs, report, next ){
    User.create( userAttrs, function( err, user ){
      if( err ){ report.errors.push( _.merge({ user: userAttrs }, err) ); return next(); }
      report.created.push( user.fullname );
      sendWelcome( user, report, next );
    });
  }

  function sendWelcome( user, report, next ){

    return next();

    //caminio.mailer.send(
    //  user.email,
    //  'Willkommen auf der neuen Spielplan-Plattform von Das andere Theater',
    //  'users/welcome',
    //  { 
    //    locals: {
    //      welcome: true,
    //      user: user,
    //      domain: report.currentDomain,
    //      url: ( caminio.config.hostname + '/caminio/accounts/' + user.id + '/reset/' + user.confirmation.key)
    //    } 
    //  },
    //  function( err ){
    //    if( err ){ report.errors.push( _.merge({ user: user.toObject() }, err ) ); }
    //    next();
    //  });
  }


};
