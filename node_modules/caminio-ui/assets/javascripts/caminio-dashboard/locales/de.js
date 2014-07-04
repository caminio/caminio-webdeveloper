(function(){

  'use strict';

  if( currentLang !== 'de' ) return;

  var translations = {
    'search': 'Suchen',
    'term': 'Suchbegriff',
    'search.label': 'Label',
    'search.type': 'Typ',
    'search.date_range': 'Zeitraum',
    'dashboard.no_upcoming_appointments': 'Keine anstehenden Termine!'
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

})();
