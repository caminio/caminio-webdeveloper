( function( App ){

  'use strict';

  App.MediafileController = Ember.Controller.extend({

    needs: ['mediafile'],

    isCurrent: function(){
      return this.get('content.id') === this.get('parentController.curFile.id');
    }.property('parentController.curFile'),

    actions: {

      showFileDetails: function( mediafile ){
        var controller = this;
        controller.get('parentController').set('curFile', mediafile );
      }

    }

  });



})( App );