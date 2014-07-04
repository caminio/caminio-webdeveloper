/*
 * caminio-media
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */

module.exports = function Mediafile( caminio, mongoose ){

  'use strict';

  var join      = require('path').join;
  var extname   = require('path').extname;

  var camUtil   = require('caminio/util');
 
  var ObjectId = mongoose.Schema.Types.ObjectId;
  var Mixed = mongoose.Schema.Types.Mixed;

  var schema = new mongoose.Schema({

    embedded: { type: Boolean, public: true, default: false },

    /**
     * @property name
     * @type String
     */
    name: { type: String, public: true, required: true },

    /**
     * the path relative to the domain content/public/files folder
     *
     * @property relativePath
     * @type String
     */
    path: { type: String, public: true },

    preferences: { type: Mixed, default: {}, public: true },

    /**
     * @property size
     * @type Integer
     */
    size: { type: Number, public: true },

    /**
     * @property contentType
     * @type String
     */
    contentType: { type: String, public: true },

    /**
     * @property description
     * @type String
     */
    description: { type: String, public: true },

    /**
     * @property copyright
     * @type String
     */
    copyright: { type: String, public: true },

    /**
     * @property thumbnails
     * @type Array
     */
    // thumbnails: { type: Array, public: true },

    position: { type: Number, public: true },

    isTeaser: { type: Boolean, public: true, default: false },

    isHidden: { type: Boolean, public: true, default: false },

    /**
     * @property isPublic
     * @type Boolean
     */
    isPublic: { type: Boolean, default: true, public: true },

    /**
     * @property isPublic
     * @type Boolean
     */
    userAccess: { type: [ObjectId], ref: 'User', public: true },
    
    /**
     * @property parent
     * @type ObjectId
     */
    parent: { type: ObjectId, public: true },

    /**
     * @property parentType
     * @type String
     */
    parentType: { type: String, public: true },

    /**
     * @property camDomain
     * @type ObjectId
     * Can be a webpage, a contact, a shopitem
     */
    camDomain: { type: ObjectId, ref: 'Domain' },
    
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

  schema.virtual('relPath')
    .get(function(){
      return join( (this.parent ? this.parent.toString() : ''), this.name );
    });
  schema.methods.thumbPath = function( thumb ){
    thumb = thumb ? '_'+thumb : '';
    return join( '/files/', (this.parent ? this.parent.toString() : ''), camUtil.getFilename( this.name ) + thumb + extname( this.name ) );
  };

  schema.publicAttributes = [ 'relPath' ];
  return schema;

};
