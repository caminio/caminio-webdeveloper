module.exports = function( caminio, mongoose ){

  var MediafileSchema = require('caminio-media/mediafile_schema')(caminio, mongoose);
  caminio.models.User.schema.add({ mediafiles: { type: [ MediafileSchema ], public: true } });

};