(function(){

  Handlebars.registerHelper( 'equal', function(lvalue, rvalue, options ){
    if( arguments.length < 3 )
      throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue === this.get(rvalue) )
      return options.fn(this);
    if(  typeof(options.inverse) === 'function' )
      return options.inverse(this);
  });

  Handlebars.registerHelper( 'equal2', function(lvalue, rvalue, options ){
    if( arguments.length < 3 )
      throw new Error("Handlebars Helper equal needs 2 parameters");
    if( typeof(this) === 'object' && this[lvalue] )
      lvalue = this[lvalue];
    if( typeof(this) === 'object' && this[rvalue] )
      rvalue = this[rvalue];

    lvalue = typeof(this.get) === 'function' ? this.get(lvalue) : ( typeof(App.get(lvalue)) === 'undefined' ? lvalue : App.get(lvalue) );
    rvalue = typeof(this.get) === 'function' ? this.get(rvalue) : ( typeof(App.get(rvalue)) === 'undefined' ? rvalue : App.get(rvalue) );

    if( lvalue === rvalue )
      return options.fn(this);
    if(  typeof(options.inverse) === 'function' )
      return options.inverse(this);
  });


  Ember.Handlebars.helper('dynamicPartial', function(name, options) {
    return Ember.Handlebars.helpers.partial.apply(this, arguments);
  });

  Ember.Handlebars.registerHelper( 'tKey', function( key, options ){
    var attr = this.get(key);
    if( options.hash.prefix )
      attr = options.hash.prefix+'.'+attr;
    return Em.I18n.t(attr);
  });

})();
