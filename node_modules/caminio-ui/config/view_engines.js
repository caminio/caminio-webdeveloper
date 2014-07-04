var hbs = require('express-hbs');
var join = require('path').join;

module.exports.viewEngines = {
  
  'jade': {
    ext: [ 'jade' ],
    engine: require('jade').__express,
    default: 'jade'
  },

  /**
   * @module ui
   * @class HandlebarsHelpers
   */
  'handlebars': {
    engine: hbs.express3({ 
      beautify: true, 
      partialsDir: join(__dirname,'..','api','views','partials') 
    }),
    ext: [ 'hbs' ],
    //default: 'hbs',
    exec: function( caminio, req, res, cb ){

      //
      // unused but might be useful later
      //
      hbs.registerHelper('extIf', function(conditional, options){
        if( options.hash.eql ){
          if( options.hash.eql === conditional )
            return options.fn(this);
          if( options.inverse )
            return options.inverse(this);
        }
      });

     
      /**
       * @method isActiveController
       * @return {Boolean} if given name equals current controllerName
       *
       */
      hbs.registerHelper('isActiveController', function(conditional, options){
        if( conditional === req.controllerName.replace('Controller','').toLowerCase() )
          return options.fn(this);
        if( options.inverse )
          return options.inverse(this);
      });

      /**
       * @method tControllerName
       * @return {String} translated title for given controller name
       *
       */
      hbs.registerHelper('tControllerName', function(conditional, options){
        return req.i18n.t('navbar.'+conditional);
      });

      /**
       * @method env
       * @param {String} environment, e.g.: 'production', 'development'
       * @return {Boolean} if given environment matches current environment
       */
      hbs.registerHelper('env', function(conditional, options){
        if( conditional === caminio.env )
          return options.fn(this);
        if( options.inverse )
          return options.inverse(this);
      });

      cb();

    }
  }


};