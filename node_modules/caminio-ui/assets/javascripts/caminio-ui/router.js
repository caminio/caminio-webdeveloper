( function( App ){

  'use strict';

  App.Enums = {};
  App.Enums.availableAppNames = [ 'dashboard', 'admin','people','shop','lineup', 'rocksol', 'calendar', 'projects', 'social-networks'];

  App.Router.map( function(){

    // domains
    this.resource( 'domains', { path: '/domains' }, function(){
      this.route( 'new' );
      this.resource('domain.edit', { 'path' : '/:id' });
    });

    this.resource('settings');

    this.resource( 'users', { path: '/users' }, function(){
      this.route( 'new' );
      this.resource('user.edit', { 'path' : '/:id' });
    });

  });

  // domains
  App.DomainsIndexRoute = Ember.Route.extend({
    setupController: function( controller, model ) {
      controller.set('domains', this.store.find('domain'));
    }
  });

  App.SettingsRoute = Ember.Route.extend({
    setupController: function(controller, model){
      if( this.store.getById('domain', currentDomain._id ) ){
        controller.set('domain', this.store.getById('domain', currentDomain._id));
      } else
        this.store.find('domain', { _id: currentDomain._id }).then( function( domain ){
          controller.set('domain', domain.content[0]);
          $('#domain-settings').val( JSON.stringify( controller.get('domain.preferences'), null, 2 ) );
        });
        
    }
  });

  App.DomainsNewRoute = Ember.Route.extend({
    setupController: function( controller, model ){
      var user = this.store.createRecord('user', { admin: true });
      controller.set('user', user);
      controller.set('domain', this.store.createRecord('domain', { user: user }));
    },
    actions: {
      create: function( model ) {
        var self = this;
        model.save().then(function(){
          self.transitionTo( 'domains' );
          notify('info', Ember.I18n.t('domain.created', {name: model.get('name')}) );
        }).catch(function(err){
          console.error(err);
          var errors = err.responseJSON.errors;
          for( var i in errors )
            errors[i] = Ember.I18n.t('errors.'+errors[i]);
          model.set('errors', errors );
          notify.processError( err.responseJSON );
        });
      }
    }
  });

  App.DomainEditRoute = Ember.Route.extend({
    model: function( prefix, options ){
      return this.store.find('domain', options.params.id);
    },
    setupController: function( controller, model ){
      controller.set('domain', this.store.find('domain', model.id));
    },
    actions: {
      save: function() {
        var self = this;
        var model = this.get('controller.domain.content');
        model.save().then(function(){
          self.transitionTo( 'domains' );
          notify('info', Ember.I18n.t('domain.saved', {name: model.get('name')}) );
        }).catch(function(err){
          notify.processError( err.responseJSON );
        });
      },
    }
  });

  // users
  App.UsersIndexRoute = Ember.Route.extend({
    setupController: function( controller, model ) {
      controller.set('users', this.store.find('user') );
    }
  });

  App.UserEditRoute = Ember.Route.extend({
    model: function(params){
      var model = this.store.find('user', params.id);
      return model;
    }
  });

  App.UsersNewRoute = Ember.Route.extend({
    model: function() {
      var roles = {};
      roles[currentDomain._id] = 40;
      var model = this.store.createRecord('user', { roles: roles });
      return model;
    }
  });

  App.IndexRoute = Ember.Route.extend({
    redirect: function() {
      this.transitionTo( 'users' );
    }
  });

  App.ApplicationController = Ember.Controller.extend({

    isSuperUser: function(){
      return currentUser.superuser;
    }.property()

  });

  App.ApplicationRoute = Ember.Route.extend({
    actions: {
      goToUsers: function () {
        this.transitionTo( 'users' );
      },
      goToUser: function( model ) {
        this.transitionTo( 'user.edit', model );
      },
      goToDomains: function () {
        this.transitionTo( 'domains' );
      },
      goToDomain: function( model ) {
        this.transitionTo( 'domain.edit', model );
      },
      switchDomainId: function( model ){
        location.href = "/caminio/admin?camDomainId="+model.get('id');
      },
      edit: function( model ) {
        this.transitionTo( 'user.edit', model.copy() );
      },
      importCSV: function(){
        bootbox.dialog({
          title: Em.I18n.t('users.import_csv'),
          message: '<form action="/caminio/usersexchange/import.csv" method="post" enctype="multipart/form-data">'+
                   '<input type="file" name="csv_file"></form>', 
          buttons: {
            upload: {
              label: 'upload',
              className: 'primary',
              callback: function(e){
                var $form = $(e.target).closest('.modal').find('form');
                $form.slideUp();
                $form.after('<div class="progress progress-striped active"><div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">processing import</span></div></div>');
                $form.submit();
              }
            }
          }
        });
      },

      cancel: function( model ) {
        Ember.run( model, "destroy" );
        this.store.refresh(App.User);
        this.transitionTo( 'users' );      
      }
    }
  });

  App.ApplicationView = Em.View.extend({
    didInsertElement: function(){
      setupCaminio(this.$());
    }
  });


})( App );
