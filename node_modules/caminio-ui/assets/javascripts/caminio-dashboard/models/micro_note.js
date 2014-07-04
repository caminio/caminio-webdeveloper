( function( App ){

  'use strict';

  App.MicroNote = DS.Model.extend({
    name: DS.attr('string'),
    tags: DS.attr('array'),
    label: DS.belongsTo('label'),
    content: DS.attr('string'),
    createdAt: DS.attr('date'),
    createdBy: DS.belongsTo('user'),
    usersAccess: DS.hasMany('user'),
    private: DS.attr('boolean'),
  });

  Ember.Inflector.inflector.irregular('microNote', 'micro_notes');

})( App );
