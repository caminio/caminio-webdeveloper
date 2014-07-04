( function(App){

  'use strict';

  App.Client = DS.Model.extend({
    name: DS.attr(),
    secret: DS.attr('string'),
    user: DS.attr('string'),
    scope: DS.attr('string', { defaultValue: '*' }),
  });

})(App);