( function( App ){

  App.Router.map( function(){
    this.route('change_password', { path: '/passwd/:id' });
    this.resource('index', { path: '/:id' });
  });

  // users
  App.IndexRoute = Ember.Route.extend({
    model: function( params ){
      return this.store.find('user', params.id);
    },
    actions: {
      changePassword: function(){
        this.render('password_modal',{
          into: 'index',
          outlet: 'modal'
        });
      },
      changePic: function(){
        this.render('pic_modal',{
          into: 'index',
          outlet: 'modal'
        });
      },
      closeModal: function(){
        this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'index'
        });
      },
    }
  });

  App.ChangePasswordRoute = App.IndexRoute.extend({
    model: function( params ){
      return this.store.find('user', params.id);
    },
    setupController: function(controller,model){
      this.set('indexCtrl', this.controllerFor('index'));
      this.get('indexCtrl').set('model', model );
    },
    renderTemplate: function(){
      this.render('index',{
        into: 'application',
        controller: this.get('indexCtrl')
      });
      this.render('password_modal',{
        into: 'index',
        outlet: 'modal'
      });
    }
  });

  App.IndexController = Ember.ObjectController.extend({
    statName: function( name, value ){
      var content = this.get('content');
      if( arguments.length > 1 ){
        var nameParts = value.split(/\s+/);
        content.set('firstname', nameParts[0] );
        content.set('lastname', nameParts[1] );
      }
      return content.get('name');
    }.property(),

    actions: {

      save: function(){
        var user = this.get('model');
        user.save().then(function(){
          if( user.get('id') === currentUser._id )
            notify('info', Em.I18n.t('profile.your_saved'));
          else
            notify('info', Em.I18n.t('profile.saved', { name: user.get('name') }));
        });
      },
      setLang: function(lang){
        var user = this.get('model');
        user.set('lang', lang);
        user.save().then(function(){
          notify('info', Em.I18n.t('profile.lang_saved', { lang: lang }));
        });
      },
      useGravatar: function(){
        var user = this.get('model');

        if( user.get('remotePicUrl') )
          user.set('remotePicUrl', null);
        else{
          user.get('mediafiles').removeObject(user.get('mediafiles.firstObject'));

          var hash = md5( user.get('email').toLowerCase() );
          user.set('remotePicUrl', 'https://secure.gravatar.com/avatar/'+hash+'?s=128');
        }
        user.save().then(function(){
          notify('info', Em.I18n.t('profile.avatar_saved'));
        });
        
      }
    }
  });

  App.PasswordModalView = Ember.View.extend({
    didInsertElement: function(){
      this.$('#modal').modal()
        .find('input[type=password]:first').focus();
    }
  });

  App.PicModalView = Ember.View.extend({
    didInsertElement: function(){
      this.$('#modal').modal();

      var controller = this.get('controller');
      var user = this.get('controller.content');

      this.$('#fileupload').fileupload({
        dataType: 'json',
        dropZone: this.$('.title'),
        url: '/caminio/profile_pic',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },1000);
          user.reload();
          $('.top-panel img.avatar').attr('src', '/caminio/profile_pics/'+user.get('id')+'?d='+moment().toDate().getTime().toString());
          notify('info', Em.I18n.t('profile.avatar_saved'));
          $('#modal').modal('hide');
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
        data.formData = { only_one: true };
      });

    }
  });

  App.PasswordModalController = Ember.ObjectController.extend({
    needs: ['index'],
    oldPassword: '',
    newPassword: '',
    oldPasswordError: false,
    newPasswordError: false,
    actions: {
      close: function(){
        $('#modal').modal('hide');
        this.send('closeModal');
      },
      savePassword: function(){
        var self = this;
        this.set('oldPasswordError',false);
        this.set('newPasswordError',false);
        var user = this.get('controllers.index.content');
        if( !this.get('oldPassword') )
          return this.set('oldPasswordError', true);
        if( !this.get('newPassword') || !this.get('newPassword').match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,60})/) )
          return this.set('newPasswordError', true);
        $.post('/caminio/accounts/'+user.get('id')+'/change_password',
          { oldPassword: this.get('oldPassword'),
            newPassword: this.get('newPassword') }).done(function(response){
              notify('info', Em.I18n.t('profile.password_saved'));
              $('#modal').modal('hide');
              self.send('closeModal');
              self.set('oldPassword','');
              self.set('newPassword','');
            }).fail(function(xhr,textStatus,text){
              if( text === 'Forbidden' )
                return self.set('oldPasswordError',true);
            });
      }
    }
  });

  App.ApplicationView = Em.View.extend({
    didInsertElement: function(){
      setupCaminio(this.$());
    }
  });



})( App );
