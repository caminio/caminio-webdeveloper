(function( App ){
  
  'use strict';

  App.MediafileEditorView = Ember.View.extend({

    didInsertElement: function(){
      var controller = this.get('controller');
      var $modal = this.$('.modal');
      this.$('.modal')
        .modal()
        .on('shown.bs.modal', function(){

          App.origW = $('#crop-img').get(0).clientWidth;
          App.origH = $('#crop-img').get(0).clientHeight;

          var cropContW = $modal.find('.col-md-6:first').width();
          var cropContH = 300;

          $('#crop-img').css({
            width: (App.origW > cropContW ? cropContW : App.origW ),
            height: (App.origH > cropContH ? cropContH : App.origH )
          });

          $modal.find('.thumb').each(function(){
            updatePreviewThumb( $(this), controller.get('content').getThumbDim( $(this).attr('data-dim') ) );
          });

          $modal.find('.thumb:first').click();

        });

    }

  });

  function updatePreviewThumb( $thumb, coords ){
    if( !coords )
      return;
    $thumb.find('img').css({
      width: coords.w + 'px',
      height: coords.h + 'px',
      marginLeft: '-' + coords.x + 'px',
      marginTop: '-' + coords.y + 'px'
    });
  }

})( App );