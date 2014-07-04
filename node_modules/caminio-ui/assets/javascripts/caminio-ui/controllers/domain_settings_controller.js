(function(App){

  'use strict';

  App.SettingsController = Ember.Controller.extend({
    actions: {
      saveSettings: function( domain ){
        try{
          domain.set('preferences', JSON.parse($('#domain-settings').val()));
          domain.save().then(function(){
            notify('info', Em.I18n.t('domain.saved', {name: domain.get('name')}));
          });
        } catch(e){
          console.error(e);
          notify('error', 'json parse error');
        }
      }
    }
  });

  App.SettingsView = Ember.View.extend({
    didInsertElement: function(){
      if( this.get('controller.domain') )
        $('#domain-settings').val( JSON.stringify( this.get('controller.domain.preferences'), null, 2 ) );
    }
  });

})(App);