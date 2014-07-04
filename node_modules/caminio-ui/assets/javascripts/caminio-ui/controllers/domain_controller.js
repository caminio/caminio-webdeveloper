$(function(){

  'use strict';

  var domainControllerCommon = {

    emailError: function(){
      if( this.get('errors') )
        return ('email' in this.get('errors'));
    }.property('errors'),

    nameError: function(){
      if( this.get('errors') )
        return ('name' in this.get('errors'));
    }.property('errors'),

    availableAppNames: function(){
      return [
        { id: 'contacts', text: 'contacts' },
        { id: 'admin', text: 'admin'}
      ];
    }.property(),

    languages: function(){
      return App.get('_availableLanguages');
    }.property(),

    isWebshopEnabled: function(){
      return this.get('domain.allowedAppNames').indexOf('shop') >= 0;
    }.property('domain.allowedAppNames'),

    actions: {

      removeDomain: function( model ) {
        model = ( model instanceof DS.PromiseObject ) ? model.content : model;
        var self = this;
        bootbox.prompt( Em.I18n.t('domain.really_delete', { name: model.get('name') }), function( name ){
          if( name === model.get('name') ){
            model.deleteRecord();
            model.save().then(function(){
              notify('info', Em.I18n.t('domain.removed', {name: model.get('name') }));
              self.transitionToRoute('domains');
            });
          }
        });
      },

    }
  };

  App.DomainEditController = Ember.Controller.extend( domainControllerCommon );
  App.DomainsNewController = Ember.Controller.extend( domainControllerCommon );
  App.DomainsController = Ember.Controller.extend( domainControllerCommon );

});
