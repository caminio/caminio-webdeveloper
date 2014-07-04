// caminio routes
// define your routes here
module.exports.routes = {
  '/': 'MainController#index',
  'autorest /caminio/mediafiles': 'Mediafile',
  'POST /caminio/mediafiles/embedded/:doc_type/:doc_id': 'MediafilesController#create_embedded',
  'POST /caminio/mediafiles/reorder': 'MediafilesController#reorder'
};
