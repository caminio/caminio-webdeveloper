( function( App ){

  'use strict';

  var currentCrop;

  App.MediafileThumbController = Ember.ObjectController.extend({

    genThumbId: function(){
      return 'thumb_'+this.get('content');
    }.property(),

    genThumbSizes: function(){
      var dim = this.get('content').split('x');
      var w = dim[0];
      var h = dim[1];

      var availableW = $('#modal .modal-dialog .col-md-6:first').width();
      var ratio = 1;
      if( w > availableW / 2 )
        ratio = (availableW/2) / w;
      if( h > 100 );
        ratio = 100 / h;
      return "width: "+w*ratio+"px; height: "+h*ratio+"px";
    }.property(),

    actions: {
      'editThumb': function(dim){

        var self = this;
        $('.thumb.active').removeClass('active');
        $('.thumb[data-dim='+dim+']').addClass('active');
        if( currentCrop )
          currentCrop.destroy();
        var coords = this.get('parentController.content').getThumbDim( dim );
        var cropOptions = {
          onChange: showPreview,
          onSelect: showPreviewAndWriteThumb,
          aspectRatio: parseInt(dim.split('x')[0])/parseInt(dim.split('x')[1])
        };
        if( coords )
          cropOptions.setSelect = [ coords.selX, coords.selY, coords.selX2, coords.selY2 ];

        currentCrop = $.Jcrop('#crop-img', cropOptions);

        function showPreviewAndWriteThumb( coords ){
          showPreview(coords);
          var $thumb = $('.thumb.active');

          self.get('parentController.content').setThumbDim( dim, genCoords($thumb,coords) );
          var content = self.get('parentController.content');
          $.ajax({
            url: '/caminio/mediafiles/'+content.get('id'),
            type: 'put',
            dataType: 'json',
            data: {
              mediafile: content.toJSON(),
              crop: true
            }
          });
          //self.get('parentController.content').save();
        }
      }
    }

  });

  function showPreview(coords){

    if( coords.w < 10 )
      return;

    var $thumb = $('.thumb.active');
    if( !domainSettings.thumbs )
      return console.error('no domainSettings.thumbs settings were found. aborting');
    
    updatePreviewThumb( $thumb,
                        genCoords($thumb,coords));

  }

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

  function genCoords($thumb,coords){

    var thumbW = ($thumb.width());
    var thumbH = ($thumb.height());

    var origThumbW = parseInt($thumb.find('.thumb-body').attr('data-size').split('x')[0]);
    var origThumbH = parseInt($thumb.find('.thumb-body').attr('data-size').split('x')[1]);

    var x1 = $('#crop-img').width() / App.origW;
    var x2 = thumbW / coords.w;
    var x3 = (origThumbW / coords.w);

    // var y1 = $('#crop-img').height() / App.origH;
    // var y2 = thumbH / coords.h;
    // var y3 = origThumbH / coords.h;

    var ratio = x1 * x2;

    var data = {
      w: Math.round( ratio * App.origW ),
      h: Math.round( ratio * App.origH ),
      x: Math.round(x2 * coords.x),
      y: Math.round(x2 * coords.y),
      selX: Math.round(coords.x),
      selY: Math.round(coords.y),
      selX2: Math.round(coords.x2),
      selY2: Math.round(coords.y2)
    };

    data.resizeW = Math.round( App.origW * x3 );
    data.resizeH = Math.round( App.origH * x3 );
    data.cropX = Math.round(x3 * coords.x);
    data.cropY = Math.round(x3 * coords.y);
    
    return data;
  }

})( App );