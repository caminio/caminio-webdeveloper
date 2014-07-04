/*
 * camin.io
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 01/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */

module.exports = TestModel;

function TestModel( caminio, mongoose ){
  
  var ObjectId  = mongoose.Schema.Types.ObjectId;

  var schema = new mongoose.Schema({
                    name: String
                  });

  return schema;

}
