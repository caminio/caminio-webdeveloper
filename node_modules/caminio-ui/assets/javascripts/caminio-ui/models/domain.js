(function( App ){

  'use strict';

  App.Domain = DS.Model.extend({
    name: DS.attr('string'),
    fqdn: DS.attr('string'),
    description: DS.attr('string'),
    preferences: DS.attr('object'),
    custom: DS.attr('object'),
    lang: DS.attr('string', { defaultValue: 'de'}),
    diskQuotaM: DS.attr('number'),
    isCaminioHosted: DS.attr('boolean', { defaultValue: true }),
    remoteAddr: DS.attr('string'),
    remoteUser: DS.attr('string'),
    remotePass: DS.attr('string'),
    diskUploadLimitM: DS.attr('number'),
    usersQuota: DS.attr('number'),
    allowedAppNames: DS.attr('array'),
    user: DS.belongsTo('user', { embedded: 'always' }),
    availableLangs: function( key, value ){
      if( arguments.length < 2 )
        return this.get('preferences.availableLangs');
      var pref = this.get('preferences');
      if( !pref )
        return;
      pref.availableLangs = value.split(',').replace(/\ /g,'');
      this.set('preferences', pref);
    }.property('preferences'),
    thumbs: function( key, value ){
      if( arguments.length < 2 )
        return this.get('preferences.thumbs');
      var pref = this.get('preferences');
      if( !pref )
        return;
      pref.thumbs = value.split(',').replace(/\ /g,'');
      this.set('preferences', pref);
    }.property('preferences')
  });

})( App );
