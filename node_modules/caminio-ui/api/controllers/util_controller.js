module.exports = function UtilController( caminio, policies, middleware ){

  return {

    /**
     * @method countries
     */
    'countries': function( req, res ){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      var countryCodes = require( __dirname + '/../../lib/country_codes');
      res.json( countryCodes[req.param('lang')] );
    }

  };

};
