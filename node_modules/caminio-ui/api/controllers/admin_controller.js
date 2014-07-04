/**
 * @class AdminController
 */
module.exports = function AdminController( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        // this tries to find a template file in any of api/views directory
        // named [controller_namespace]/<controller_name>/<action_name>
        // here this would be admin_controller/index
        //console.log(process.memoryUsage());
        res.caminio.render();
      }
    ]

  };

};