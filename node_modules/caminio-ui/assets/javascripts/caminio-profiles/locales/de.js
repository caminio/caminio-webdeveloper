(function(){

  'use strict';

  if( currentLang !== 'de' ) return;
  
  var translations = {
        
    'profile.my': 'Mein Profil',
    'profile.of': 'Profil von',
    'profile.change_password': 'Kennwot ändern',
    'profile.change_picture': 'Profilbild ändern',
    'profile.use_gravatar': 'Gravatar verwenden',
    'profile.stop_gravatar': 'Gravatar nicht mehr verwenden',
    'profile.avatar_saved': 'Dein Profilbild wurde aktualisiert',
    'profile.currently_using_gravatar': 'Dein Bild wird momentan von http://gravatar.com bezogen',

    'profile.change_lang': 'Sprache',
    'profile.lang_saved': 'Deine Profilsprache ist nun "{{lang}}". Bitte lade die Seite neu, damit alle Änderungen wirksam werden',
    'profile.old_password': 'Altes Passwort',
    'profile.new_password': 'Neues Passwort',
    'profile.your_name': 'Dein Name',
    'profile.email': 'Email',
    'profile.phone': 'Telefon',
    'profile.your_saved': 'Deine Profildaten wurden gespeichert',
    'profile.saved': 'Profil von {{name}} wurde gespeichert',
    'profile.name_placeholder': 'z.B.: Anna Muster',
    'profile.will_be_exposed_to_others': 'Der hier angegebene Name ist für andere Benutzer sichtbar',
    'profile.password_saved': 'Dein neues Passwort wurde gespeichert',
    'missing_old_password': 'Das alte Passwort stimmt nicht überein',
    'password_criteria': 'Dein neues Passwort muss mindestens 6 Zeichen, mind. eine Zahl, mind. einen Klein- und mind. einen Großbuchstaben beinhalten.',
    'pic.change': 'Dein Profilbild ändern',
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();