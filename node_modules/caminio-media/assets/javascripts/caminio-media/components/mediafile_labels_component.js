( function( App ){

  'use strict';

  App.MediafileLabelsComponent = App.LabelsComponent.extend({

    filterForType: 'mediafile',

    hasSelectedItems: function(){
      return this.get('controller.selectedItems.length') > 0;
    }.property('controller.selectedItems.length')

  });

})( App );
