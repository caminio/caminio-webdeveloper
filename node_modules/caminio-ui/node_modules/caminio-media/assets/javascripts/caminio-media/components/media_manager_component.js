( function( App ){

  'use strict';

  App.MediaManagerComponent = Ember.Component.extend({

    breadcrumbs: Em.A(),

    updateBreadcrumbs: function(){
      if( this.get('curItem') )
        return collectBreadCrumbs.call(this, this.get('curItem') );
    }.observes('curItem'),

    actions: {

      'cancelClose': function(){
        this.get('curFile').rollback();
        this.set('curFile', null);
      },

      'insertImage': function(){
        this.get('parentView.controller').send('insertImage', this.get('curFile'));
        $('#media-library').modal('hide');
      },

      'treeItemSelected': function( label, select ){
        this.set('mediafiles', App.User.store.find('mediafile', { parent: label.id }));
        if( this.get('curSelectedItem.id') === label.get('id') && !select )
          return this.set('curSelectedItem',null);
        this.set('curSelectedItem', label);
      },

      'goToRootLevel': function(){
        this.set('labels', App.User.store.find('label') );
        this.set('curSelectedItem', null);
        this.set('curItem', null);
        this.set('mediafiles', App.User.store.find('mediafile', { parent: 'null' }));
        if( 'Webpage' in App )
          this.set('webpages', App.User.store.find('webpage', { parent: 'null' }));
        this.set('breadcrumbs', Em.A());
      },

      'goToLevel': function( item ){
        this.set('labels', null );
        this.set('curItem', item);
        this.set('mediafiles', App.User.store.find('mediafile', { parent: item.get('id') }));
        if( 'Webpage' in App )
          this.set('webpages', App.User.store.find('webpage', { parent: item.get('id') }));
      },

      'goLevelBack': function(){
        var item = this.get('curItem.parent');
        if( !item )
          return this.send('goToRootLevel');
        this.send('goToLevel', item);
      },

      'saveFile': function( file ){
        file.save().then(function(){
          notify('info', Em.I18n.t('file.saved', {name: file.get('name')}));
        });
      },

      'removeFile': function( file ){
        var self = this;
        file.deleteRecord();
        file.save().then(function(){
          notify('info', Em.I18n.t('file.deleted', {name: file.get('name')}));
          self.set('mediafiles', App.Mediafile.store.find('mediafile', { parent: self.get('curItem.id') }));
          self.set('curFile',null);
        });
      }

    },

    didInsertElement: function(){

      var controller = this.get('controller');
      if( controller.get('item') )
        controller.send('goToLevel', controller.get('item'));
      else
        controller.send('goToRootLevel');

      $('#fileupload').fileupload({
        dataType: 'json',
        dropZone: $('#dropzone'),
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          //App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('mediafiles', App.Mediafile.store.find('mediafile', { parent: controller.get('curItem.id') }));
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
        if( controller.get('curItem') )
          data.formData = { parent: controller.get('curItem.id'),
                            parentType: controller.get('curItem').constructor.name };
      });

      $(document).on('dragover', function(){
        $('#dropzone').addClass('hovered');
      }).on('dragleave drop', function(){
        $('#dropzone').removeClass('hovered');
      });
    }

  });

  function collectBreadCrumbs( item ){
    this.set('labels', null );
    this.set('breadcrumbs', Em.A());
    this.set('curSelectedItem', item);
    this.set('mediafiles', App.User.store.find('mediafile', { parent: item.get('id') }));
    if( 'Webpage' in App )
      this.set('webpages', App.User.store.find('webpage', { parent: item.get('id') }) );
    addParent.call(this, item );
  }

  function addParent( item ){
    if( !item )
      return;
    this.get('breadcrumbs').unshiftObject(item);
    addParent.call(this, item.get('parent'));
  }


})( App );