var _       = require('lodash');
var join    = require('path').join;
var fs      = require('fs');

// global middleware actions to be run
// in every request
module.exports = function( caminio ){

  return [ 
    updateDomainStats,
    sideinfoBoxes,
    dashboardBoxes,
    setLanguage
  ];

  /**
   * reads sideinfo box requests from gears
   *
   * @method sideinfoBoxes
   *
   */
  function sideinfoBoxes( req, res, next ){
    res.locals.sideinfoBoxes = [];
    _.each( caminio.gears, function( gear ){
      var sideinfoDir = join(gear.paths.absolute,'api','sideinfos');
      if( fs.existsSync( sideinfoDir ) ){
        fs.readdirSync( sideinfoDir )
          .forEach( function( file ){
            res.locals.sideinfoBoxes.push( fs.readFileSync(join(sideinfoDir, file)) );
          });
      }
    });
    next();
  }

  /**
   * reads dashboard boxes from gears
   *
   * @method dashboardBoxes
   *
   */
  function dashboardBoxes( req, res, next ){
    if( ! res.locals.currentDomain )
      return next();
    res.locals.dashboardBoxes = [];
    _.each( caminio.gears, function( gear ){
      var dir = join(gear.paths.absolute,'api','dashboard-addons');
      if( fs.existsSync( dir ) ){
        fs.readdirSync( dir )
          .forEach( function( file ){
            // itereate through allowedAppNames
            // and determine if domain is allowed
            // to use this dashboard plugin
            _.some( res.locals.currentDomain.allowedAppNames, function(appName){
              if( file.indexOf(appName) >= 0 ){
                res.locals.dashboardBoxes.push( fs.readFileSync(join(dir, file)) );
                return true;
              }
            });
          });
      }
    });
    next();
  }

  /**
   *  Adds an entry to domain statistics
   *  @method updateDomainStats
   */
  function updateDomainStats( req, res, next ){
    var d = (new Date()).getDate();
    var cond = {};
    cond['stats.'+d]= 1;
    if( res.locals.currentDomain ){
      res.locals.currentDomain.update({ $inc: cond  }, function( err ){
      });
    }
    next();
  }

  /**
   * set the language to given parameter
   * @method setLanguage
   * @example
   *     /?locale=de
   */
  function setLanguage( req, res, next ){
    if( req.param('locale') ){
      if( _.keys(caminio.i18n.find( req.param('locale') )).length > 0 ){
        req.session.locale = req.param('locale');
      }
    }
    if( req.session.locale ){
      req.i18n.setLng( req.session.locale, { fixLng: true } );
      res.locals.currentLang = req.session.locale;
    } else if( res.locals.currentUser ){
      req.i18n.setLng( res.locals.currentUser.lang, { fixLng: true } );
      res.locals.currentLang = res.locals.currentUser.lang;
    }

    next();
  }

  
};
