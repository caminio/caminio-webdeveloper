( function(){

  'use strict';

  Ember.View.reopen(Em.I18n.TranslateableAttributes);

  window.App = Ember.Application.create({
    // LOG_TRANSITIONS: true,
    // LOG_TRANSITIONS_INTERNAL: true,
    // LOG_VIEW_LOOKUPS: true,
    // LOG_ACTIVE_GENERATION: true
  });
  
  window.App._curLang = currentLang;

  window.App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: caminioHostname+'/caminio',
    headers: {
      'X-CSRF-Token': window.csrf,
      'sideload': true,
      'namespaced': true
    }
  });

  window.App.caminioVersion = caminioVersion;
  window.App.siteVersion = siteVersion;

  //window.App.Store = DS.Store.extend({
  //  didSaveRecord: function( record, data ){
  //    if( record.get('id') )
  //      this.getById(record.constructor, data.id).unloadRecord();
  //    this._super( record, data );
  //  }
  //});

  window.App.ApplicationSerializer = DS.RESTSerializer.extend({
    serializeHasMany: function(record, json, relationship) {
      // only apply if embedded option is set in record with
      // DS.hasMany( 'fieldname', { embedded: 'always' } )
      if( relationship.options.embedded && relationship.options.embedded === 'always' )
        json[relationship.key] = record.get(relationship.key).map( function(item){
          var jItem = item.serialize();
          if( item.get('id') ) // only add id if not null (case when creating new records)
            jItem._id = item.get('id');
          return jItem;
        });
      else if( relationship.options.embedded && relationship.options.embedded === 'keys' ){
        json[relationship.key] = [];
        json[relationship.key] = record.get(relationship.key).mapBy('id');
      }
    },
    serializeBelongsTo: function(record, json, relationship){
      if( relationship.options.embedded && relationship.options.embedded === 'always' &&
          record.get(relationship.key) )
        json[relationship.key] = record.get(relationship.key).toJSON();
      // added for label/webpage parent keys to be set
      else if( relationship.options.embedded && relationship.options.embedded === 'keys' ){
        json[relationship.key] = record.get(relationship.key).get('id');
      }
      else if( record.get(relationship.key) )
        json[relationship.key] = record.get(relationship.key).id;
    },
    serializeIntoHash: function(data, type, record, options) {
      var self = this;
      var root = Ember.String.decamelize(type.typeKey);
      data[root] = this.serialize(record, options);
      //if( record._relationships ){
      //  for( var i in record._relationships){
      //    data[root][i] = [];
      //    if( record._relationships[i] )
      //      record._relationships[i].forEach( function( rel ){
      //        var obj = rel.serialize( rel, options );
      //        if( rel.id ) // do not make null _ids
      //          obj._id = rel.id;
      //        data[root][i].push( obj );
      //      });
      //  }
      //}
    }, 
    typeForRoot: function(root) {
      var camelized = Ember.String.camelize(root);
      return Ember.String.singularize(camelized);
    },
    primaryKey: '_id'
  });

  currentUser.camDomains.map(function(domain){
    domain.changeUrl = '/?camDomainId='+domain._id;
  });

  window.App.set('_currentUser', currentUser);
  window.App.set('_currentUserHasMultiDomains', currentUser.camDomains.length > 1);
  window.App.set('_currentDomain', currentDomain);
  window.App.set('_availableLanguages', Em.A(['de', 'en']));

  /**
   *  Creates an array type for the ember model
   *  Strings are seperated via ','
   */
  window.DS.ArrayTransform = DS.Transform.extend({
    deserialize: function(serialized) {
      return (Ember.typeOf(serialized) == "array") ? serialized : [];
    },

    serialize: function(deserialized) {
      var type = Ember.typeOf(deserialized);
      if (type == 'array')
        return deserialized;
      else if (type == 'string')
        return deserialized.split(',').map(function(item) {
          return jQuery.trim(item);
        });
      else
        return [];
    } 
  });

  /**
   *  Creates an object for the ember model
   *  Strings are seperated via ','
   */
  window.DS.ObjectTransform = DS.Transform.extend({
    deserialize: function(serialized) {
      return Em.isNone(serialized) ? {} : serialized;
    },
    serialize: function(deserialized) {
      return Em.isNone(deserialized) ? {} : deserialized;
    } 
  });

  window.App.register("transform:array", DS.ArrayTransform);
  window.App.register("transform:object", DS.ObjectTransform);


  bootbox.setDefaults({ locale: currentLang });
  moment.lang( currentLang );
  CLDR.defaultLanguage = currentLang;

  window.setupCaminio = function setupCaminio($view){

    var toggleApps = function toggleApps(e){
      if( $(e.target).hasClass('toggle-apps-btn') || $(e.target).closest('.toggle-apps-btn').length > 0 )
        return;
      $('body').removeClass('toggle-apps');
      $(document).off('click', toggleApps);
    };

    $(document).on('keypress', function(e){
      if( $(e.target).get(0).nodeName.match(/INPUT|TEXTAREA/) )
        return;
      if( e.which === 99 && !e.ctrlKey && !e.metaKey) // character 'c'
        $('.toggle-apps-btn').click();
    });

    $view.find('.toggle-apps-btn').on('click', function(){
      $('body').toggleClass('toggle-apps');
      if( $('body').hasClass('toggle-apps') )
        setTimeout( function(){ 
          $(document).on('click', toggleApps);
        }, 10);
      else
        $(document).off('click', toggleApps);
    });

    caminio.translateDataFields();

    var u = { user: {} };
    for( var i in currentUser )
      if( !i.match(/camDomains|mediafiles/) )
        u.user[i] = currentUser[i];

    if( !App.User.store )
      return;

    App.User.store.pushPayload( 'user', u );
    App.set('emberUser', App.User.store.getById('user', currentUser._id));


  };

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if( settings.type.match(/POST|PUT|PATCH|DELETE/) )
        xhr.setRequestHeader('X-CSRF-Token', csrf);
    }
  });

  window.registeredCtrlS = [];

  window.App.setupCtrlS = function( content, msg ){
  
    if( window.registeredCtrlS.indexOf(content.id) >= 0 )
      return;

    window.registeredCtrlS.push(content.id);

    $(document).on('keydown', function ctrlSFn(e){
      if( !( e.keyCode === 83 && ( e.metaKey || e.ctrlKey ) ) )
        return;
      e.preventDefault();
      content.save().then(function(){
        notify('info', msg);
      });
    });

  }


})();
