/**
 *
 * @class Label
 *
 */
 
module.exports = function Label( caminio, mongoose ){

  'use strict';

  var _         = require('lodash');
  var ObjectId  = mongoose.Schema.Types.ObjectId;

  var schema = new mongoose.Schema({

    /**
     * @property name
     * @type String
     */  
    name: { type: String, public: true },

    /**
     * @property type
     * @type String
     */
    type: { type: String, public: true },

    /**
     * @property bgColor
     * @type String
     */
    bgColor: { type: String, public: true },
    
    /**
     * @property borderColor
     * @type String
     */
    borderColor: { type: String, public: true },

    /**
     * @property fgColor
     * @type String
     */
    fgColor: { type: String, public: true },

    /**
     * @property parent
     * @type ObjectId
     */
    parent: { type: ObjectId, public: true },

    /**
     * @property camDomain
     * @type ObjectId
     */
    camDomain: { type: ObjectId, ref: 'Domain' },

    /**
     * @property usersAccess
     * @type [ObjectId]
     */
    usersAccess: { type: [ObjectId], ref: 'User', index: true, public: true },
    
    /**
     * @property createdAt
     * @type Date
     */
    createdAt: { type: Date, default: Date.now, public: true },

    /**
     * @property createdBy
     * @type ObjectId
     */
    createdBy: { type: ObjectId, ref: 'User', public: true },

    /**
     * @property updatedAt
     * @type Date
     */
    updatedAt: { type: Date, default: Date.now, public: true },

    /**
     * @property updatedBy
     * @type ObjectId
     */
    updatedBy: { type: ObjectId, ref: 'User', public: true }

  });

  schema.virtual('private').get(function(){
    return this.usersAccess && this.usersAccess.length > 0;
  });

  schema.post('remove', function(label){
    _.forEach( caminio.models, function( M ){
      M.update( { label: label._id }, { $set:{ label: null }}).exec(function( err ){
        if( err ){ caminio.logger.debug('label unlinking error (model: '+M.modelName+') ', err); }
      });
      M.update( { labels: label._id }, { $pull: { labels: label._id }}, { multi: true }, function( err ){
        if( err ){ caminio.logger.debug('label unlinking error (model: '+M.modelName+') ', err); }
      });
    });
  });

  schema.pre('save', checkUniquenessOfName );

  /** 
   *  Checks if the name of the label is already taken by anotherone.
   *  Labelnames are caseinsensitiv and must be unique.
   *  @param next { Function }
   *  @param next.err { Object } Null if name is not taken.
   *  @example
   *  
   *      new Label({ name: 'test' });
   *      // The following will produce a validation error
   *      new Label({ name: 'test' });
   *      // also 
   *      new Label({ name: 'TEST' });
   *      // and
   *      new Label({ name: 'Test' });
   */
  function checkUniquenessOfName( next ){
    /*jshint validthis:true */
    validateKey( this, 'name', next );
  }

  function validateKey( actual, key, next ){
    var Label = caminio.models.Label; 

    var q = Label.findOne({ 
      camDomain: actual.camDomain
    });

    q.where( key ).equals( actual[key] );
    q.where('_id').ne(actual._id);
    q.exec( function( err, field ){
      var error = null;
      if( err ) error = err;
      if( field ) {
        error = new Error( 'Another Label found with same ' + key + ': ' + field._id ); 
        error.name = 'validation_error';
        error.details = 'Another Label found with same ' + key + ': ' + field._id;
      }
      next( error );
    });
  }


  schema.publicAttributes = [ 'private' ];

  return schema;

};
