( function( App ){

  'use strict';

  App.LabelsComponent = Ember.Component.extend({

    didInsertElement: function(){

      this.set('labels', App.User.store.find('label', this._getOpts() ));
      this.set('user', App.User.store.getById('user', currentUser._id));

    },

    _getOpts: function( opts ){
      opts = opts || {};
      if( this.get('filterForType') )
        opts.type = this.get('filterForType');
      return opts;
    },

    actions: {
      
      'removeLabel': function( label ){
        var self = this;
        bootbox.confirm( Em.I18n.t('label.really_delete', {name: label.get('name')}), function( result ){
          if( result ){
            label.deleteRecord();
            label.save()
              .then(function(){
                self.set('labels', App.User.store.find('label', self._getOpts() ));
                notify('info', Em.I18n.t('label.deleted', {name: label.get('name')}));
              })
              .catch( function(err){
                notify('error', err);
              });
          }
        });
      },

      'toggleLabel': function( label ){
        if( !this.get('content.labels') )
          return;
        if( this.get('content.labels').findBy('id', label.get('id')) )
          this.get('content.labels').removeObject(label);
        else
          this.get('content.labels').pushObject(label);  
      },

      'showLabelContactsOrAddLabel': function( label ){
        if( this.get('controller.selectedContacts.length') > 0 ){
          this.get('controller.selectedContacts').forEach( function( contact ){
            if( contact.get('labels').findBy('id', label.get('id')) )
              contact.get('labels').removeObject( label );
            else
              contact.get('labels').pushObject( label );
            $('tr[data-id='+contact.get('id')+'] td').block();
            contact.save().then(function(){
              $('tr[data-id='+contact.get('id')+'] td').unblock();
            });
          });
        } else {
          var controller = this.get('controller');
          var limit = 30;
          App.User.store.find('contact', { labels: label.get('id') }).then(function(contacts){
            controller.set('total', contacts.get('length'));
            controller.set('contacts', Em.A(contacts));
          });
        }
      },

      'editLabel': function( label ){
        var self = this;
        var store = App.User.store;
        if( !label ){
          label = store.createRecord('label', this._getOpts({ userAccess: this.get('user') }));
        }

        bootbox.dialog({ title: Em.I18n.t('name'), 
                         message: getEditLabelContent( label ),
                         className: 'edit-label-modal',
                         buttons: {
                            save: {
                              label: Em.I18n.t('save'),
                              className: "primary",
                              callback: saveEvent
                            }
                          }
                        }).on('shown.bs.modal', onShowBootbox)
                          .on('hide.bs.modal', onHideBootbox);
        
        function saveEvent(){
          var $color = $('.bootbox .color.active');
          if( !$color.length )
            $color = $('.bootbox .color:first').addClass('active');

          label.set('bgColor', $color.attr('data-bg-color'));
          label.set('fgColor', $color.attr('data-fg-color'));
          label.set('borderColor', $color.attr('data-border-color'));

          var user = App.User.store.getById('user', currentUser._id);
          if( $('.bootbox .private').is(':checked') ){
            label.get('usersAccess').pushObject( user );
          } else {
            label.get('usersAccess').removeObject( user );
          }

          label.set('name', $('.edit-label-modal .name').val());
          saveLabel();
        }

        function saveLabel(){
          var newRecord = label.id ? false : true;
          label
            .save()
            .then( function(label){
              if( newRecord )
                notify('info', Em.I18n.t('label.created', {name: label.get('name')}) );
              else
                notify('info', Em.I18n.t('label.saved', {name: label.get('name')}) );
              self.set('labels', App.User.store.find('label', self._getOpts() ));
            })
            .catch( function(err){
              console.error(err);
              notify('error', err);
            });
        }

        function onShowBootbox(){
          var $box = $(this);

          $box.find('form').on('submit', function(e){ 
            e.preventDefault(); 
            saveEvent();
            $box.modal('hide');
          });
          setTimeout(function(){
            $box.find('input[type=text]:first').focus();
          },500);
          $box.find('.color').on('click', function(){
            $box.find('.color').removeClass('active');
            $(this).addClass('active');
          });
          $box.find('input[type=checkbox]').attr('checked',label.get('private'));
          $box.find('.color[data-bg-color='+label.get('bgColor')+']').addClass('active');
        }

        function onHideBootbox(){
          if( label.isDirty )
            label.deleteRecord();
        }

      }
    }
  });

  function getEditLabelContent( label ){
    var str = '<form class="bootbox-form">'+
              '<div class="form-group row">'+
              '<input type="text" value="'+(label.get('name') || '')+'" autocomplete="off" class="bootbox-input bootbox-input-text form-control name col-md-12">'+
              '</div>'+
              '<div class="row margin-top clearfix colors"><label class="control-label col-md-3">'+Em.I18n.t('label.select_color')+'</label>'+
                '<div class="col-md-9">'+
                  caminio.labels.getColors()+
                '</div>'+
              '</div>'+
              '<div class="row margin-top clearfix colors"><label class="control-label col-md-3">'+Em.I18n.t('label.private')+'</label>'+
                '<div class="col-md-9">'+
                  '<input type="checkbox" class="private">'+
                '</div>'+
              '</div>'+
              '</form>';
    return str;
  }

})( App );
