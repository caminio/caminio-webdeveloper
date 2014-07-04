( function( App ){

  'use strict';

  App.IndexRoute = Ember.Route.extend({
    setupController: function( controller ){
      _loadAppointments( controller );
    }
  });

  App.IndexController = Ember.Controller.extend({
  });

  App.AppointmentsItemController = Ember.Controller.extend({
  });

  App.ApplicationView = Em.View.extend({
    didInsertElement: function(){
      setupCaminio(this.$());
      this.$('.mini-apps-container').html(
        $('.apps-container').html()
      );
    }
  });

  function _loadAppointments( controller ){
    //$.getJSON( '/caminio/appointments?start='+moment().format('YYYY-MM-DD')+'&end='+moment().add('d',1).format('YYYY-MM-DD')+'&limit=2&force-all=1' )
    $.getJSON( '/caminio/appointments?start='+moment().toISOString()+'&limit=2&force-all=1' )
      .then( function( appointments ){
        controller.set('appointments', appointments);      
      });
  }

})( App );
