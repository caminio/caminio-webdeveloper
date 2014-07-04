( function( App ){

  'use strict';

  App.MediafilesFlatRoute = Em.Route.extend({
    model: function(){
      return this.store.find('mediafile');
    }
  });

  App.MediafilesFlatController = Ember.ArrayController.extend({

  });

  App.MediafilesFlatView = Em.View.extend({

    didInsertElement: function(){

      var controller = this.get('controller');

      $('#fileupload').fileupload({
        dataType: 'json',
        url: '/caminio/mediafiles',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('model', App.Mediafile.store.all('mediafile', { parent: controller.get('curSelectedItem.id') || null }));
        },
        progressall: function (e, data) {
          $('#progress').addClass('active');
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .progress-bar').css(
            'width',
            progress + '%'
          )
          .attr('aria-valuenow', progress)
          .find('.perc-text').text(progress+'%');
        }
      }).on('fileuploadsubmit', function( e, data ){
        data.formData = { parent: controller.get('curSelectedItem.id') || null,
                          parentType: 'Label' };
      });

    }

  });


})( App );