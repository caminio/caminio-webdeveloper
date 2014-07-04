(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {
    'search': 'Search',
    'term': 'Search term',
    'search.label': 'Label',
    'search.type': 'Type',
    'search.date_range': 'Date range',
    'dashboard.no_upcoming_appointments': 'No upcoming appointments!'
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

})();
