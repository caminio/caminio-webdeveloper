/*
 * caminio-media
 *
 * @author <thorsten.zerha@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license comercial
 *
 */

var fs          = require('fs');
var join        = require('path').join;
var basename    = require('path').basename;
var extname     = require('path').extname;
var mkdirp      = require('mkdirp');
var formidable  = require('formidable');
var inflection  = require('inflection');
var util        = require('util');
var camUtil     = require('caminio/util');
var transformJSON = camUtil.transformJSON;
var async       = require('async');
var glob        = require('glob');
var easyimg     = require('easyimage');

/**
 *  @class MediafilesController
 *  @constructor
 */
module.exports = function( caminio, policies, middleware ){

  var Mediafile = caminio.models.Mediafile;

  return {

    _policies: {
      '*!( index, show)': policies.ensureLogin,
      'index, show': policies.ensureLoginOrApiPublicOrToken,
    },

    _before: {
      'update': [ getMediaFile, renameFileIfRequired, cropImage ]
    },

    _beforeResponse: {
      'destroy': removeFiles
    },

    'create_embedded': [
      getDocById,
      checkDocMediafiles,
      function( req, res ){
        var procFiles = [];
        var onlyOne = false;
        var form = createForm( req, res.locals.currentDomain );
        form.uploadDir = join( res.locals.currentDomain.getContentPath(),
                              'public', 
                              inflection.transform( req.param('doc_type'), ['underscore','pluralize'] ) );

        if( !fs.existsSync( form.uploadDir ) )
          mkdirp.sync( form.uploadDir );

        form
          .on('fileBegin', function(name, file){
            file.path = join( form.uploadDir, file.name );
          })
          .on('file', function(field,file){
            procFiles.push( file );
          })
          .on('field', function(name, value){
            switch( name ){
              case 'only_one':
                onlyOne = true;
                break;
            }
          })
          .on('end', function(){
            async.eachSeries( procFiles, createEmbeddedMediafile, function(){
              req.doc.constructor.findOne({ _id: req.doc._id }, function(err, doc){
                res.json({ mediafiles: doc.mediafiles });
              });
            });
          })
          .on('error', function(err){
            console.error(err);
            caminio.logger.error(err);
            res.send( 500, util.inspect(err) );
          }).parse(req, function(err, fields, files){});

        function createEmbeddedMediafile( file, next ){
          req.err = req.err || [];
          var mediafile = { name: file.name, 
                             size: file.size,
                             createdBy: res.locals.currentUser._id,
                             updatedBy: res.locals.currentUser._id,
                             path: basename(file.path),
                             contentType: file.type };

          if( onlyOne )
            req.doc.mediafiles.forEach(function(doc){
              doc.remove();
            });

          req.doc.mediafiles.push( mediafile );

          req.doc.save(function( err ){
            if( err ){
              console.error(err);
              req.err.push( err ); 
            } else
            async.eachSeries( req.doc.mediafiles, function(mediafile, nextMediafile){

              var mediafilename = join(form.uploadDir,mediafile._id.toString());

              fs.renameSync( join(form.uploadDir,mediafile.name),
                              mediafilename );

              easyimg.thumbnail({
                src: mediafilename,
                dst: mediafilename+'.jpg',
                width: 128,
                height: 128,
                gravity: 'Center'}, function( err, image ){
                  if( err ){
                    console.error(err);
                    req.err.push(err);
                  }
                  nextMediafile();
                });

              nextMediafile();

            }, next );
          });
        }
      }],

    reorder: function( req, res ){
      var curPos = 0;
      var errors = [];
      async.eachSeries( req.param('ids'), function( id, next ){
        Mediafile.update({ _id: id }, { position: curPos++ }, function( err ){
          if( err ){ errors.push(err); }
          next();
        });
      }, function( err ){
        if( errors.length > 0 )
          return res.json(500, errors);
        res.send(200);
      });
    },

    create: function( req, res ){
      res.locals.domainSettings.thumbs = res.locals.domainSettings.thumbs || ['100x100','500x500'];
      var procFiles = [];
      var parent;
      var form = createForm( req, res.locals.currentDomain );
      form
        .on('field', function(name, value){
          switch( name ){
            case 'parent':
              parent = value;
              if( parent )
                form.uploadDir = join(form.uploadDir, parent);
              break;
          }
        })
        .on('fileBegin', function(name, file){
          if( !fs.existsSync( form.uploadDir ) )
            mkdirp.sync( form.uploadDir );
          file.name = camUtil.normalizeFilename( file.name );
          file.path = join( form.uploadDir, file.name );
        })
        .on('file', function(field,file){
          procFiles.push( file );
        })
        .on('end', function(){
          async.each( procFiles, createMediafile, function(){
            res.json({ mediafiles: req.mediafiles });
          });
        })
        .on('error', function(err){
          console.error(err);
          caminio.logger.error(err);
          res.send( 500, util.inspect(err) );
        }).parse(req, function(err, fields, files){});

      function createMediafile( file, next ){
        if( typeof(parent) === 'string' && parent === 'null' )
          parent = null;
        req.err = req.err || [];
        var defaultThumbs = {};
        res.locals.domainSettings.thumbs.forEach(function(thumb){
          defaultThumbs[thumb] = {
            x: 0,
            y: 0,
            w: thumb.split('x')[0],
            h: thumb.split('x')[1],
            resizeW: thumb.split('x')[0],
            resizeH: thumb.split('x')[1],
            cropX: 0,
            cropY: 0,
            selX: 0,
            selY: 0,
            selX2: thumb.split('x')[0],
            selY2: thumb.split('x')[1]
          };
        });
        Mediafile.create({ name: file.name, 
                           size: file.size,
                           parent: parent,
                           camDomain: res.locals.currentDomain,
                           createdBy: res.locals.currentUser,
                           updatedBy: res.locals.currentUser,
                           path: basename(file.path),
                           preferences: {
                            thumbs: defaultThumbs
                           },
                           contentType: file.type }, function( err, mediafile ){
                            if( err ){ 
                              console.error(err);
                              req.err.push( err ); 
                              return next(); 
                            }
                            req.mediafiles.push( mediafile );
                            req.mediafile = req.body.mediafile = mediafile;
                            guessCropImage( req, res, next );
                          });
      }

    }

  };

  function cropImage( req, res, next ){

    if( !req.param('crop') )
      return next();

    if( req.body.mediafile.contentType.indexOf('image') < 0 )
      return next();

    if( !res.locals.domainSettings.thumbs ||
        res.locals.domainSettings.thumbs.length < 1 )
      return;

    var filename = join( res.locals.currentDomain.getContentPath(), 'public', 'files', req.mediafile.relPath  );

    async.each( res.locals.domainSettings.thumbs, function( thumbSize, nextThumb ){

      if( !req.body.mediafile.preferences.thumbs[thumbSize] )
        return nextThumb();

      easyimg.resize({
         src: filename, 
         dst: camUtil.getFilename( filename )+ '_' + thumbSize + extname( filename ),
         width: parseInt(req.body.mediafile.preferences.thumbs[thumbSize].resizeW), 
         height: parseInt(req.body.mediafile.preferences.thumbs[thumbSize].resizeH),
      }, function(err, image){

        if( err )
          console.error(err);

        var x = parseInt(req.body.mediafile.preferences.thumbs[thumbSize].cropX);
        var y = parseInt(req.body.mediafile.preferences.thumbs[thumbSize].cropY);
        
        var cropW = parseInt(thumbSize.split('x')[0]);
        var cropH = parseInt(thumbSize.split('x')[1]);
        var offsetCorrection = image.width - (x + cropW);
        if( offsetCorrection < 0 )
          x = x + offsetCorrection;

        offsetCorrection = image.height - (y + cropH);
        if( offsetCorrection < 0 )
          y = y + offsetCorrection;

        var options = {
          src: camUtil.getFilename( filename ) +'_' + thumbSize + extname( filename ),
          dst: camUtil.getFilename( filename ) +'_' + thumbSize + extname( filename ),
          cropwidth: cropW,
          cropheight: cropH,
          x: x,
          y: y,
          gravity: 'NorthWest'
        };
        easyimg.crop( options, function( err, image ){
           if (err) throw err;
           caminio.logger.info('thumb: ' + thumbSize + ' w'+parseInt(thumbSize.split('x')[0])+' h:'+parseInt(thumbSize.split('x')[1]) + ' ' + image.width + ' x ' + image.height);
           nextThumb();
        });
      });
    }, next);

  }

  function guessCropImage( req, res, next ){
    if( req.body.mediafile.contentType.indexOf('image') < 0 )
      return next();

    if( !res.locals.domainSettings.thumbs ||
        res.locals.domainSettings.thumbs.length < 1 )
      return;

    var filename = join( res.locals.currentDomain.getContentPath(), 'public', 'files', req.mediafile.relPath  );

    async.each( res.locals.domainSettings.thumbs, function( thumbSize, nextThumb ){

      easyimg.info( filename, function(err, info ,stderr){
        var w = parseInt(thumbSize.split('x')[0]);
        var h = parseInt(thumbSize.split('x')[1]);

        var opts = {
          src: filename, 
          dst: camUtil.getFilename( filename ) +'_' + thumbSize + extname( filename ),
          cropwidth: w, 
          cropheight: h,
          width: w
        };

        if( info.width >= info.height && h >= w )
          opts.width = (info.width / info.height) * w;
        else if( info.height >= info.width && w >= h )
          opts.width = (info.height / info.width) * w;

        easyimg.rescrop(opts, function(err, image) {
          if (err) throw err;
          caminio.logger.info('guessed thumb: ' + thumbSize  + ' ' + image.width + ' x ' + image.height);
          nextThumb();
        });
      });
    }, next);

  }

  function createForm( req, domain ){
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.maxFieldsSize = domain.diskUploadLimitM * 10^6;
    req.mediafiles = [];
    req.errors = [];
    
    form.uploadDir = join( domain.getContentPath(), 'public', 'files' );

    if( !fs.existsSync( form.uploadDir ) )
      mkdirp.sync( form.uploadDir );

    return form;
  }

  function getDocById( req, res, next ){
    caminio.models[inflection.classify(req.param('doc_type'))].findOne({ _id: req.param('doc_id') }).exec(function(err, doc){
      if( err ){ return res.json(500, { error: 'document_retrieval', details: err}); }
      if( !doc ){ return res.json(404, { error: 'not found', details: 'The requested document was not found on this server'}); }
      req.doc = doc;
      next();
    });
  }

  function checkDocMediafiles( req, res, next ){
    if( !('mediafiles' in req.doc) )
      return res.json(400, { error: 'document attributes error', details: 'the document does not provide a "mediafiles" attribute'});
    next();
  }

  function getMediaFile( req, res, next ){
    Mediafile
      .findOne({ _id: req.param('id') })
      .exec(function( err, mediafile ){
        if( err ){ return res.json(500, { error: 'server error', details: err }); }
        req.mediafile = mediafile;
        next();
      });
  }

  function renameFileIfRequired( req, res, next ){
    var publicPath = join(res.locals.currentDomain.getContentPath(), 'public', 'files', req.mediafile.relPath);
    if( req.mediafile.name === req.body.mediafile.name ||
        !fs.existsSync( publicPath ) )
      return next();
    req.body.mediafile.name = camUtil.normalizeFilename( req.body.mediafile.name );
    fs.renameSync( publicPath,
                   join(res.locals.currentDomain.getContentPath(), 'public', 'files', req.body.mediafile.relPath ) );
    next();
  }

  function removeFiles( req, res, next ){
    var filename = join(res.locals.currentDomain.getContentPath(), 'public', 'files', 
                          req.doc.relPath.replace( extname(req.doc.relPath),'') );
    glob( camUtil.getFilename( filename )+'*', function (er, files) {
      files.forEach(function( file ){
        fs.unlink( file );
      });
      next();
    });
  }

};
