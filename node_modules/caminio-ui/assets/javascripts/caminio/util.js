( function(){

  'use strict';

  window.caminio = window.caminio || {};

  // deprecated. use util. instead
  window.caminio.uid = uid;
  window.caminio.generatePassword = generatePassword;
  window.caminio.translateDataFields = translateDataFields;
  
  window.caminio.util = window.caminio.util || {};
  window.caminio.generatePassword = generatePassword;
  window.caminio.translateDataFields = translateDataFields;
  window.caminio.util.uid = uid;
  window.caminio.util.generatePassword = generatePassword;
  window.caminio.util.translateDataFields = translateDataFields;
  window.caminio.util.createNum = createNum;
  window.caminio.util.fqdnify = fqdnify;
  
  window.caminio.util.currencyCode2Symbol = transformCurrencyCode2Symbol;

  var passwordConditionsRegExp = /(?=^[^\s]{6,128}$)((?=.*?\d)(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[^\w\d\s])(?=.*?[a-z])|(?=.*?[^\w\d\s])(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[A-Z])(?=.*?[^\w\d\s]))^.*/;

  /**
   * generate a uid of given length
   *
   * @method uid
   * @param {Number} length
   * @return {String} a uid of given length
   */
  function uid( length ){
    var charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i)
        retVal += charset.charAt(Math.floor(Math.random() * n));
    return retVal;
  }

  /**
   * generate a valid password of given length
   *
   * @method generatePassword
   * @param {Number} length
   * @return {String} a valid password
   */
  function generatePassword( length ){
    var password = uid(length);
    var charset = "!$#-_?|><";
    var randChar = Math.floor(Math.random() * charset.length);
    var randPos = Math.floor(Math.random() * length);

    var res = password.substring(0,randPos-1) +
              charset.charAt( randChar ) +
              password.substring(randPos+1,length-1);

    // must contain a number, one uppercase character and one special char
    if( !passwordConditionsRegExp.test(res) )
      return generatePassword( length );
    return res;

  }

  /**
   * translates all data fields set with
   * data-translate
   *
   * @method translateDataFields
   *
   */
  function translateDataFields(){
    $(function(){
      $('[data-translate]').each( function(){
        $(this).text( Ember.I18n.t($(this).attr('data-translate')) );
      });
      $('[data-translate-title]').each( function(){
        $(this).attr('title', Ember.I18n.t($(this).attr('data-translate-title')) );
      });
    });
  }

  /**
   * transforms a currency code ISO 4217
   * into according symbols
   */
  function transformCurrencyCode2Symbol( currencyCode ){
    switch( currencyCode ){
      case 'EUR':
        return '&euro;';
      case 'GBP':
        return '&#163;';
      case 'USD':
        return '$';
    }
  }

  function createNum( num, places ){
    places = places || 5;
    num = num.toString();
    while( num.length < places )
      num = '0'+num;
    return num;
  }

  function fqdnify( domainName ){
    var fqdn = domainName
    if( fqdn.indexOf('http') != 0 )
      fqdn = 'http://'+domainName;
    if( fqdn[fqdn.length-1] === '/' )
      return fqdn.substring(0, fqdn.length-2);
    return fqdn;
  }

})();
