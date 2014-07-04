( function( App ){

  'use strict';

  App.Label = DS.Model.extend({
    name: DS.attr('string'),
    type: DS.attr('string'),
    bgColor: DS.attr('string', { defaultValue: '#548EE5' }),
    fgColor: DS.attr('string', { defaultValue: '#fff' }),
    usersAccess: DS.hasMany('user'),
    private: DS.attr('boolean'),
    borderColor: DS.attr('string', { defaultValue: '#637dd4' }),
    styleAttrs: function(){
      return 'background-color: '+this.get('bgColor') + '; color: '+this.get('fgColor')+'; border-color: '+this.get('borderColor');
    }.property('bgColor')
  });

})( App );