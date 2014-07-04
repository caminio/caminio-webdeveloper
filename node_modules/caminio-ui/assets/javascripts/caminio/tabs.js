$.fn.switchTabs = function switchTabs( options ){

  var settings = $.extend({
  }, options );

  var $tabsNav = $(this);
  var $tabsContent = $('.switch-tabs-content[data-tabs-id='+$(this).attr('data-tabs-id')+']');

  $tabsNav.find('li').on('click', function(e){
    e.preventDefault();
    if( $(this).hasClass('disabled') )
      return;
    $tabsNav.find('li').removeClass('active');
    $tabsContent.find('section').hide();
    $($tabsContent.find('section')[$(this).index()]).show()
                          .addClass('active')
                          .find('.js-get-focus').focus();
    $(this).addClass('active');
    if( options && typeof( options.activate ) === 'function' )
      options.activate( $(this) );
  });

  // select either tab marked with 'active' or
  // first tab
  var $active = $tabsNav.find('li.active');
  if( !$active.length )
    $active = $tabsNav.find('li:first');
  $active.click();

};