// caminio routes
// define your routes here
module.exports.routes = {
  
  '/caminio': 'DashboardController#index',

  '/caminio/locales/:lang': 'DashboardController#locales',

  '/caminio/admin': 'AdminController#index',

  'get /caminio/users/migrate': 'UsersController#migrate',

  'autorest /caminio/users': 'User',

  'autorest /caminio/labels': 'Label',

  '/caminio/profiles': 'ProfilesController#show',

  'POST /caminio/profile_pic': 'ProfilesController#upload_pic',

  '/caminio/profile/known_email_addresses': 'ProfilesController#knownEmailAddresses',

  '/caminio/profile_pics/:id': 'ProfilesController#pics',

  'GET /caminio/util/countries': 'UtilController#countries',

  'POST /caminio/usersexchange/import:format': 'UsersExchangeController#import'

};
