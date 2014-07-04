/**
 * @class MainController
 */

'use strict';

var async = require('async'); 
var join = require('path').join;

module.exports = function MainController( caminio, policies, middleware ){                                        
  var Template = caminio.models.ContactTemplate;
  var Field = caminio.models.ContactField;

  return {

    _before: {
      '*!(index)': policies.ensureLogin
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        // this tries to find a template file in any of api/views directory
        // named [controller_namespace]/<controller_name>/<action_name>
        // here this would be main_controller/index
        res.caminio.render();
      }
    ]

  };

};
