/**
 * CaminioAPI v1.0
 *
 * written by thorsten zerha (thorsten.zerha@tastenwerk.com)
 *
 * (2014) by TASTENWERK http://tastenwerk.com
 */
(function(){

  'use strict';
  /*global marked: true, CLDR: true, paymill: true */

  var App;
  var currentUser;
  var currentDomain;

  var options = {
    rootElement: '#caminio-api-root',
    lang: 'en'
  };

  /**
   * @class CaminioAPI
   * @constructor
   */
  var CaminioAPI = window.CaminioAPI = Ember.Namespace.create({ VERSION: '1.0'});

  /**
   * initialize the caminio API
   * @method init
   * @param options {Object} a hash of options
   *
   * available options
   * - host (required) e.g.: https://camin.io
   * - fqdn (optional) e.g.: http://my.hostname.where.images.are.stored.com
   * - apiKey (required) e.g.: '12345...XZZ' (generate the API key inside a caminio user form
   * - lang (default: 'en') a language attribute (wherever translations are available, they will be used)
   * - rootElement (default: '#caminio-api-root') e.g.: '#my-container'
   * - defaultCountry (default: '') set the select2 CountryView to this country
   */
  CaminioAPI.init = function initCaminioAPI( customOptions ){
  
    for( var i in customOptions )
      options[i] = customOptions[i];

    if( !options.apiKey )
      throw new Error('no apiKey option present');
    if( !options.host )
      throw new Error('no host option present');

    CLDR.defaultLanguage = options.lang;

    App = Em.Application.create({
      rootElement: options.rootElement
    });

    App.options = options;

    $.ajaxSetup({
      headers: {
        Authorization: 'API-KEY '+options.apiKey
      }
    });

    App.ApplicationRoute = Em.Route.extend({
      beforeModel: function(){

        return new Promise( getUser );

        function getUser( response, reject ){
          $.getJSON( options.host+'/caminio/accounts/mine' )
            .done( function( user ){
              currentUser = user;
              currentDomain = user.camDomains[0];
              response();
            })
            .fail( reject );
        }

      }
    });

    App.ApplicationView = Em.View.extend();
    App.ApplicationController = Em.Controller.extend();

    App.vendors = vendors;
    App.util = util;
    App.basket = CaminioAPI.ShopOrder.create();

    setupHelpers( App );

    return App;

  };

  /**
   * @class CaminioAPIModel
   * @constructor
   * @private
   */
  var CaminioAPIModel = Ember.Object.extend( Ember.Copyable, {
    init: function(){
    },
    copy: function(){
      // copy method is used by the PhotoEditRoute to create a clone of the model
      // we create a clone to preserve the original incase Cancel button is clicked
      return Em.run( this.constructor, 'create', this.serialize() );
    },
    serialize: function(){
      // Our presistance layer doesn't know about the fields that custom models need to preserve
      // for this reason, we need a serialize function that will return a version of this model
      // that can be saved to localStorage
      throw new Error(Ember.String.fmt('%@ has to implement serialize() method which is required to convert it to JSON.', [this]));
    }
  });

  CaminioAPIModel.reopenClass({
    storageKey: '_id',
    _cache: Em.A(),
    pushPayload: function( attrs ){
      var content = this.create( parseTranslations( attrs ) );
      this._cache.pushObject( content );
      return content;
    },

  });

  /**
   * @class ShopCustomer
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.ShopCustomer = CaminioAPIModel.extend({
    firstname: '',
    lastname: '',
    title: '',
    gender: '',
    organization: '',
    
    shipFirstname: '',
    shipLastname:  '',
    shipOrganization: '',
    shipStreet: '',
    shipZip: '',
    shipCity: '',
    shipCountry: '',
    shipState:  '',

    billOrganization: '',
    billFirstname:  '',
    billLastname:  '',
    billStreet:  '',
    billZip:  '',
    billCity: '',
    billCountry: '',
    billState: '',

    phone: '',
    email: '',

    useOrigName: true,
    useShipForBill: true,
    hasErrors: function(){
      return (Em.isEmpty( this.get('firstname') ) || Em.isEmpty( this.get('lastname') ) || Em.isEmpty( this.get('email') ) );
    }.property('firstname','lastname','email')
  });


  /**
   * @class ShopOrder
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.ShopOrder = CaminioAPIModel.extend({
    order_items: Em.A(),
    shop_customer: null,
    priceTotal: function(){
      var total = 0;
      this.get('order_items').forEach(function(item){ 
        var subtotal = item.get('price') * item.get('amount');
        total += subtotal + subtotal * 0.01 * item.get('vat'); 
      });
      return total;
    },
    number: function(){
      return this.get('formattedNumber').replace(/-/g,'');
    }.property('formattedNumber'),
    cvc: 111,
    expiryMonth: null,
    expiryYear: null,
    holderName: 'Test Demo',
    formattedNumber: '4111-1111-1111-1111',
    apiError: null,
    validNumber: function(){
      return paymill.validateCardNumber( this.get('number') );
    }.property('number'),
    numberEnteredAndInvalid: function(){
      return !Em.isEmpty(this.get('formattedNumber')) && !this.get('validNumber');
    }.property('formattedNumber'),
    validCvc: function(){
      return paymill.validateCvc( this.get('cvc'), this.get('number') );
    }.property('number','cvc'),
    cvcEnteredAndInvalid: function(){
      return !Em.isEmpty(this.get('cvc')) && !this.get('validCvc');
    }.property('number','cvc'),
    holderNameEntered: function(){
      return !Em.isEmpty(this.get('holderName'));
    }.property('holderName'),
    validExpiry: function(){
      return paymill.validateExpiry( this.get('expiryMonth'), this.get('expiryYear') );
    }.property('expiryYear','expiryMonth'),
    allValid: function(){
      return this.get('validExpiry') && this.get('validCvc') && this.get('validNumber') && this.get('holderNameEntered');
    }.property('number','cvc','expiryMonth','expiryYear'),
    invAllValid: function(){
      return !this.get('allValid');
    }.property('number','cvc','expiryMonth','expiryYear'),
    years: ['',2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
    months: ['','01','02','03','04','05','06','07','08','09','10','11','12'],
    formattedPriceTotal: function(){
      return new Handlebars.SafeString('&#163; ' + util.priceIncl( this.priceTotal(), 0 ) );
    }.property('order_items.@each'),
    getCardDataObject: function(){
      return {
        number: this.get('number'),
        exp_month: this.get('expiryMonth'),
        exp_year: this.get('expiryYear'),
        cvc: this.get('cvc'),
        amount_int: ( this.priceTotal() * 100),
        currency: 'GBP',
        cardholder: this.get('holderName')
      };
    },
    getCheckDataObject: function(){
      return {
        ids: this.get('order_items').map(function(item){ return { id: item.get('_id'), amount: item.get('amount') }; }),
        priceTotal: this.priceTotal()
      };
    },
    createToken: function( callback ){
      console.log('App', App.options.host+'/caminio/shop_orders', JSON.parse(JSON.stringify(this)));
      $.ajax({
        url: App.options.host + '/caminio/shop_orders',
        type: 'post',
        data: JSON.parse(JSON.stringify(this))
      }).done( function( result ){
        callback( null, result );  
      }).fail( function( err ){
        callback( err.responseJSON );
      });
    }
  });

  /**
   * @class OrderItem
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.OrderItem = CaminioAPIModel.extend({
    item: null,
    price: 0,
    vat: 0,
    amount: null,
    lineup_Entry: null
  });

  /**
   * @class CardData
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.CardData = CaminioAPIModel.extend({
  });

  /**
   * @class LineupEntry
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.LineupEntry = CaminioAPIModel.extend({
    title: null,
    curTranslation: function(){
      var cur = this.get('translations').findBy('locale', CaminioAPI.lang);
      if( cur )
        return cur;
      return this.get('translations.firstObject');
    }.property('translations'),
    venue: function(){
      return this.get('lineup_events.firstObject.lineup_org');
    }.property('lineup_events'),
    coach: function(){
      return this.get('lineup_jobs.firstObject.lineup_person');
    }.property('lineup_jobs'),
    serialize: function() {
      return this.getProperties([ 'id', 'title' ]);
    }
  });

  /**
   * @class LineupEntry
   * @module CaminioAPI
   * @method find
   * @param conditions {Object} a hash of conditions for fetching
   *
   * loads one or many LineupEntries
   */
  CaminioAPI.LineupEntry.find = function findLineupEntry( id, conditions ){

    if( typeof(id) === 'object' )
      conditions = id;

    conditions = conditions || {};
    
    var promise = new Promise( getAndInitLineupEntries );
    promise = promise.then( getCoachMediafiles );
    return promise;

    function getAndInitLineupEntries( response, reject ){
      $.getJSON( options.host+'/caminio/lineup_entries/events', conditions)
        .then(function( items ){
          if( typeof(id) === 'string' )
            return response( CaminioAPI.LineupEntry.pushPayload( items.find(function(i){ return i._id === id; }) ) );
          response( 
                   Ember.A( 
                           items.map( function( item ){
                                          return CaminioAPI.LineupEntry.pushPayload( item );
                                        }) 
                  )
          );
        })
        .fail(function(){
          reject();
        });

    }

    function getCoachMediafiles( workshops ){
      return new Promise( function( resolve, reject ){
        if( !workshops )
          return resolve();
        workshops = workshops instanceof Array ? workshops : [ workshops ];
        var ids = [];
        var workshop_ids = [];
        workshops.forEach(function(workshop){
          ids.push( workshop.get('lineup_jobs.firstObject.lineup_person._id') );
          workshop_ids.push( workshop.get('_id') );
        });
        $.getJSON( options.host+'/caminio/mediafiles', { parent: 'in('+ids.join(',')+')' })
          .done(function( mediafiles ){
            mediafiles.forEach(function(mediafile){
              mediafile.url = (options.fqdn ? options.fqdn : options.host)+'/files/'+mediafile.relPath;
              var item = workshops.findBy('_id',workshop_ids[ ids.indexOf(mediafile.parent) ]);
              item.set('coachPic', mediafile);
            });
            resolve( typeof(id) === 'string' ? workshops[0] : workshops );
          })
          .fail( reject );
      });
    }

  };

  /**
   * @class ShopItem
   * @module CaminioAPI
   * @constructor
   */
  CaminioAPI.ShopItem = CaminioAPIModel.extend({
    title: null,
    init: function(){
      this.set('mediafiles', Em.A());
    },
    serialize: function() {
      return this.getProperties([ 'id', 'title' ]);
    }
  });

  CaminioAPI.ShopItem.reopenClass({

    getCategories: function(){
      var cats = Em.A();
      this._cache.forEach(function(item){
        if( !item.get('categories') )
          return;
        item.get('categories').forEach(function(cat){
          var c = cats.findBy('name',cat);
          if( c )
            return c.count += 1;
          cats.pushObject({ name: cat, count: 1 });
        });
      });
      return cats;
    }

  });

  /**
   * @class ShopItem
   * @module CaminioAPI
   * @method find
   * @param conditions {Object} a hash of conditions for fetching
   *
   * loads one or many ShopItems
   */
  CaminioAPI.ShopItem.find = function findShopItem( id, conditions ){

    if( typeof(id) === 'object' )
      conditions = id;

    conditions = conditions || {};

    if( typeof(id) === 'string' && this._cache.get('length') > 0 )
      return this._cache.findBy('_id', id );

    var defaultsNoOverride = { status: 'published' };
    for( var i in defaultsNoOverride )
      conditions[i] = defaultsNoOverride[i];

    return new Promise( getAndInitShopItems );

    function getAndInitShopItems( response, reject ){
      $.getJSON( options.host+'/caminio/shop_items', conditions )
      .then(function( items ){
        items = Ember.A( items.map( function( item ){
          return CaminioAPI.ShopItem.pushPayload( item );
        }) );
        loadMediafiles( items, continueCache, reject );
      })
      .fail(function(){
        reject();
      });

      function continueCache( result ){
        if( id && typeof(id) === 'string' )
          return response( result[0] );
        response( result );
      }
    }


  };

  function parseTranslations( attrs ){
    var parsedAttrs = attrs;
    if( !('translations' in attrs) || attrs.translations.length < 1 )
      return parsedAttrs;

    var curTranslation = attrs.translations.find(function(tr){ if( tr.locale === options.lang ) return tr; });

    // use 'en' if no translation found
    if( !curTranslation )
      curTranslation = attrs.translations.find(function(tr){ if( tr.locale === 'en' ) return tr; });

    // use first if no translation found
    if( !curTranslation )
      curTranslation = attrs.translations[0];

    for( var i in curTranslation ){
      if( i.match(/title|subtitle|metaDescription|metaKeywords|categories/) )
        parsedAttrs[i] = curTranslation[i];
      if( i.match(/content|aside/) )
        parsedAttrs[i] = (curTranslation[i] ? marked( curTranslation[i] ) : '');
    }

    return parsedAttrs;
  }

  function loadMediafiles( items, response, reject ){
    var ids = items.mapBy('_id').join(',');
    $.getJSON( options.host+'/caminio/mediafiles', { parent: 'in('+ids+')' })
      .done(function( mediafiles ){
        mediafiles.forEach(function(mediafile){
          mediafile.url = (options.fqdn ? options.fqdn : options.host)+'/files/'+mediafile.relPath;
          var item = items.findBy('_id',mediafile.parent);
          item.mediafiles.pushObject( mediafile );
          item.teaser = item.mediafiles.get('firstObject');
        });
        response( items );
      })
      .fail( reject );
  }


  function setupHelpers( App ){
    App.Select2CountryView = Ember.Select.extend({

      prompt: Em.I18n.t('select_country'),
      classNames: ['input-xlarge'],

      willInsertElement: function(){

        var self = this;
        this.set('optionLabelPath', 'content.text');
        this.set('optionValuePath', 'content.id');

        var dfd = $.ajax({
          url: 'https://camin.io/caminio/util/countries?lang='+App.options.lang,
          crossDomain: true,
          dataType: 'json'
        });
        dfd.done( function( response ){
          var countries = [];
          for( var code in response )
            countries.push({ id: code, text: response[code] });
          countries.sort(function(a,b){
            if( a.text.toLowerCase() < b.text.toLowerCase() ) return -1;
            if( a.text.toLowerCase() > b.text.toLowerCase() ) return 1;
            if( a.text.toLowerCase() === b.text.toLowerCase() ) return 0;
          });
          self.set('content', countries);
          setTimeout(function(){
            if( self.get('value') )
              self.$().select2('val', self.get('value'));
            else if( App.options.defaultCountry )
              self.set('value', App.options.defaultCountry);
          },100);
        });
        return dfd;
      },

      didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, 'processChildElements');
      },

      processChildElements: function() {
        var self = this;
        this.$().select2();
      },

      willDestroyElement: function () {
        this.$().select2("destroy");
      },

      selectedDidChange : function(){
        var self = this;
        setTimeout(function(){
          if( self.get('value') )
            self.$().select2('val', self.get('value'));
        },100);
      }.observes('value')

    });
  }

  // 3rdparty addons
  var vendors = {};

  // paymill.com
  vendors.paymill = {};
  vendors.paymill.requestToken = function( cardModel, options ){
    cardModel.set('transactionActive',true);
    paymill.createToken( cardModel.getCardDataObject(), function( err, paymillResult ){
      cardModel.set('transactionActive',false);
      if( err )
        return cardModel.set('apiError', err.apierror);
      console.log('result', paymillResult);
      cardModel.createToken( function(err, caminioResult){
        $.ajax({  url: options.postUrl, 
                  type: 'post',
                  data: { paymillToken: paymillResult.token, caminioToken: caminioResult.token, order: cardModel.getCheckDataObject() }
        }).done(function(response){
          console.log(response);
        });
      })
    });
  };

  var util = {};
  util.priceIncl = function( price, vat ){
    return (parseFloat(price) + parseFloat(price) * parseFloat(vat) * 0.01 ).toFixed(2);
  }

})();
