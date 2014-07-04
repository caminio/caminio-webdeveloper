// module.exports = function MediafileSchema( caminio, mongoose ){

//   var Mixed    = mongoose.Schema.Types.Mixed;
//   var ObjectId = mongoose.Schema.Types.ObjectId;

//   var schema = new mongoose.Schema({

//     name: { type: String, public: true, required: true },
//     isEmbedded: { type: Boolean, default: true },
//     path: { type: String, public: true },
//     preferences: { type: Mixed, default: {}, public: true },
//     size: { type: Number, public: true },
//     contentType: { type: String, public: true },
//     description: { type: String, public: true },
//     copyright: { type: String, public: true },
//     isPublic: { type: Boolean, default: true, public: true },
//     createdAt: { type: Date, default: Date.now, public: true },
//     updatedAt: { type: Date, default: Date.now, public: true },
//     updatedBy: { type: ObjectId, ref: 'User', public: true },
//     createdBy: { type: ObjectId, ref: 'User', public: true }
    
//   });
  
//   return schema;

// };

module.exports = function( caminio, mongoose ){
  return require('./api/models/mediafile')( caminio, mongoose );
};