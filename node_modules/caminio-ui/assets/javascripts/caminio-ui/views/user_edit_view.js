(function(App){

  'use strict';

  App.UserEditView = Ember.View.extend({

    didInsertElement: function(){

      var controller = this.get('controller');

      if( this.get('controller.model.id') )
        this.get('controller').set('apiClients',
          this.get('controller.store').find('client', { user: this.get('controller.model.id')})
        );

      this.$('#role-slider').slider({
        tooltip: 'hide',
        min: 0,
        max: 100,
        step: 20,
        value: controller.get('currentDomainRole')
      }).on('slideStop', function( options ){
        controller.get('content').set('currentDomainRole', options.value);
      });


    }

  });

  App.UsersNewView = App.UserEditView.extend();

})(App);
