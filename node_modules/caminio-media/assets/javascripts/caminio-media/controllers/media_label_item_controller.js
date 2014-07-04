( function( App ){

  'use strict';

  App.MediaLabelItemController = Ember.Controller.extend({

    matchCurLabelLevel: function(){
      return true;
    }.property('parentController.curLabelLevel'),

    matchCurWebpageLevel: function(){
      return true;
    }.property('parentController.curWebpageLevel'),

    isCurrent: function(){
      return this.get('content.id') === this.get('parentController.curItem.id');
    }.property('parentController.curItem'),

    actions: {

      openLabel: function( item ){
        this.get('parentController').send('goToLevel', item);
      }

    }

  });



})( App );