( function( App ){

  'use strict';

  var defaultRoles = {};
  defaultRoles[ currentDomain._id ] = 50;

  App.User = DS.Model.extend({
    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    nickname: DS.attr('string'),
    email: DS.attr('string'),
    roles: DS.attr('object', { defaultValue: defaultRoles }),
    currentDomainRole: function( ns, val ){
      if( val )
        Ember.set( this.get('roles'), currentDomain._id, val);
      return Ember.get( this.get('roles'), currentDomain._id) || 0;
    }.property('roles'),
    isAdmin: function(){
      return this.get('superuser') || this.get('roles')[currentDomain._id] === 100;
    }.property('roles.'+currentDomain._id),
    isEditor: function(){
      return this.get('superuser') || this.get('roles')[currentDomain._id] >= 60;
    }.property('roles.'+currentDomain._id),
    isTrusted: function(){
      return this.get('superuser') || this.get('roles')[currentDomain._id] >= 80;
    }.property('roles.'+currentDomain._id),
    lang: DS.attr('string', { defaultValue: currentDomain.lang || 'en' }),
    description: DS.attr('string'),
    superuser: DS.attr('boolean'),
    password: DS.attr(),
    passwordConfirmation: DS.attr(),
    camDomains: DS.attr('array'),
    apiEnabled: DS.attr('boolean'),
    apiPublicKey: DS.attr('string'),
    apiPrivateKey: DS.attr('string'),
    apiUser: DS.attr('boolean', { defaultValue: false }),
    clients: DS.hasMany('client'),
    remotePicUrl: DS.attr('string'),
    mediafiles: DS.hasMany('mediafile', { embedded: 'always' }),
    notify: DS.attr('object'),
    picUrl: function(){
      if( this.get('remotePicUrl') )
        return this.get('remotePicUrl');
      return '/caminio/profile_pics/'+this.get('id')+'?d='+moment().toDate().getTime().toString();
      //return '/images/bot_128x128.png';
    }.property('remotePicUrl'),
    mailto: function(){
      return 'mailto:'+this.get('email');
    }.property('email'),
    inCurrentDomain: function(){
      return this.get('camDomains').indexOf(currentDomain._id) >= 0;
    }.property('camDomains'),
    fullname: function(){
      var name = '';
      if( this.get('firstname') && this.get('firstname').length > 0 )
        name += this.get('firstname');
      if( name.length > 0 && this.get('lastname') && this.get('lastname').length > 0 )
        name += ' ';
      if( this.get('lastname') && this.get('lastname').length > 0 )
        name += this.get('lastname');
      if( name.length < 2 )
        name += this.get('email');
      return name;
    }.property('firstname', 'lastname'),
    name: function(){
      return this.get('fullname');
    }.property('firstname','lastname'),
    apiUserRightsObserver: function(){
      if( this.get('apiUser') && this.get('roles.'+currentDomain._id) > 60 ){
        this.set('roles.'+currentDomain._id, 60);
        $('#role-slider').slider('setValue',60);
        notify('error', Em.I18n.t('user.api_role_not_allowed'));
      }
    }.observes('apiUser','roles.'+currentDomain._id)
  });

})( App );
