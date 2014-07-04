$(function(){

  'use strict';
  
  /**
   * notify - a small notification handler
   *
   * @param {String} type [error,info]
   * @param {String} msg the message
   * @param {Object} options
   * @param {Boolean} options.keepVisible does not remove the notification after timeout
   * @param {Function} options.undo a function that will be triggered when user clicks on 'undo'
   * @param {Boolean} options.clearAll removes all current notifications before showing the new one
   */
  function notify( type, msg, options ){
    options = options || {};

    if( arguments.length === 1 && typeof(type) === 'object' ){
      options = type;
      type = msg = null;
    }
    if( options.clearAll )
      $('#notifications .notifications-collection').html('');

    if( !type )
      return;
    
    var $notification = $('<section/>');
    checkNotificationCollection();
    $notification
      .addClass('notification notification-'+type)
      .html(msg);

    if( options.undo )
      $notification.append( renderUndo(options.undo) );

    $notification.append( renderClose() );

    $('#notifications .notifications-collection').append( $notification );
    $notification.slideDown();

    if( !options.keepVisible )
      setTimeout( function(){
        $notification.slideUp();
        setTimeout( function(){
          $notification.remove();
        },500);
      }, (options.undo ? 15000 : 5000) );
    
  }

  notify.processError = function notifyProcessError( obj, name ){
    if( typeof( obj.responseJSON ) === 'object' )
      obj = obj.responseJSON;
    if( typeof(obj.details) === 'object' ){
      if( obj.details.code && obj.details.code === 11000 )
        notify( 'error', Ember.I18n.t('errors.duplicate_key', {name: obj.details.err.split(' dup key: { :')[1].replace(/[\\\\"\}]*/g,'')}));
      else if( obj.details.errors ){
        for( var key in obj.details.errors ){
          var err = obj.details.errors[key];
          notify( 'error', Ember.I18n.t(err.message, {value: err.value}) );
        }
      }
      else if( obj.details.message )
        notify( 'error', obj.details.message );
      else
        notify( 'error', obj.details );
    } else if( typeof(obj.error) === 'object' ){
      if( obj.error.message )
        notify('error', obj.error.message);
    } else if( obj.errors ){
      for( var field in obj.errors )
        if( obj.errors[field].split('.').length > 1 )
          return notify('error', Ember.I18n.t(obj.errors[field], {name: name}));
        notify( 'error', Ember.I18n.t('errors.db_field', {name: field, message: obj.errors[field]}) );
    } else {
      notify( 'error', obj.details );
    }
  };

  function checkNotificationCollection(){
    if( $('#notifications .notifications-collection').length )
      return;
    $('#notifications').html(
      $('<div/>').addClass('notifications-collection')
    );
  }

  function renderUndo( action ){

    if( typeof(action) !== 'function' )
      throw new Error('options.undo must be a function');

    var $undo = $('<a/>').addClass('undo').attr('href','#');
    $undo
      .html('<div class="text">'+Ember.I18n.t('undo')+'</div>')
      .on('click', action);
    return $undo;
  }

  function renderClose(){
    var $close = $('<a/>').addClass('close').attr('href','#');
    $close.html('<span class="hide">'+Ember.I18n.t('close')+'</span>');
    $close.on('click', function closeNotification(e){
      e.preventDefault();
      $(this).closest('.notification').remove();
    });
    return $close;
  }

  window.notify = notify;

});
