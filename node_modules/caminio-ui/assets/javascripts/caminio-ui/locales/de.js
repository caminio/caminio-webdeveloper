(function(){

  'use strict';

  if( currentLang !== 'de' ) return;
  
  var translations = {

    'nav.users': 'Benutzerkonten',
    'nav.domains': 'Domänen',
    'nav.settings': 'Einstellungen',

    'unknown': 'Unbekannt',

    'users.import_csv': 'Benutzerkonten von CSV importieren',

    'user.name': 'Name',
    'user.save': 'Speichern',
    'user.created': '{{name}} wurde erfolgreich gespeichert',
    'user.saved': '{{name}} wurde gespeichert',
    'user.create': 'Konto erstellen',
    'user.new': 'Neues Benutzerkonto',
    'user.edit': 'BenutzerIn bearbeiten',
    'user.email': 'Email',
    'user.phone': 'Telefon',
    'user.firstname': 'Vorname',
    'user.lastname': 'Nachname',
    'user.tabs.general': 'Allgemein',
    'user.tabs.settings': 'Einstellungen',
    'user.tabs.history': 'Protokoll',
    'user.send_login_info': 'Login Informationen noch einmal schicken',
    'user.sent_credentials_again': 'Login Information wurden erfolgreich versandt',
    'user.api_gen_failed': 'API Schlüsselerzeugung fehlgeschlagen. Bitte nochmal probieren',
    'user.convert_api_user': 'API Konto konvertieren',
    'user.api_key_generated': 'API Schlüssel wurde für {{name}} erzeugt',
    'user.api_private_key': 'API private key',
    'user.api_public_key': 'API public key',
    'user.api_role_not_allowed': 'Rolle nicht erlaubt für API Konten',
    'user.converted_into_api': '{{name}} ist jetzt ein API Konto',
    'user.converted_back': '{{name}} ist jetzt ein reguläres Konto',

    'user.password': 'Passwort',
    'user.password_confirmation': 'Wiederholen',

    'user.admin': 'AdministratorIn',
    'user.editor': 'RedakteurIn',
    'user.api.enabled': 'aktiviert',
    'user.api.disabled': 'deaktiviert',

    'user.access_rights': 'Zugriffsrechte',
    'user.roles.no_access': 'Kein Zugriff',
    'user.roles.comments_only': 'Nur kommentieren',
    'user.roles.default': 'Standard',
    'user.roles.editor': 'Redaktion',
    'user.roles.trustee': 'Vertrauliche Redaktion',
    'user.roles.admin': 'Administration',

    'user.lang': 'Sprache',
    'user.photo': 'Photo',
    'user.danger': 'Gefahrenzone',

    'user.errors.prohibited_save': 'Mindestens ein Fehler hinderte das Formular gespeichert zu werden',

    'user.security': 'Sicherheit',

    'user.api': 'API',
    'user.remote_clients': 'Fernzugriffe',

    'user.cannot_delete_domain_owner': 'Das Domänenadministrationskonto kann nicht gelöscht werden!',
    'user.remove_desc': 'Wenn dieses Benutzerkonto gelöscht wird, werden alle Kommentare und Nachrichten, die von diesem Konto aus erstellt wurden, ebenfalls gelöscht. Webseiten und andere geteilte Inhalte werden anulliert; die Besitzerschaft auf den Domänenadministrator übertragen',
    'user.remove': 'Dieses Benutzerkonto löschen',
    'user.really_delete': 'Dieses Benutzerkonto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden. Um fortzufahren, gib den vollen Namen des Benutzerkontos <strong>{{fullname}}</strong> in das Feld unterhalb ein',
    'user.removed': 'Das Benutzerkonto {{name}} wurde gelöscht',
    'user.really_remove_from_domain': 'Das Benutzerkonto {{fullname}} von dieser Domäne entfernen?',
    'user.removed_from_domain': 'Das Benutzerkonto {{fullname}} wurde von dieser Domäne entfernt',

    'user.notify_settings': 'Einstellungen',
    'user.notifications': 'Benachrichtigungen',

    'invalid_email': 'Die Emailadresse {{value}} ist ungültig',

    'domain.name': 'Name',
    'domain.settings': 'Einstellungen',
    'domain.owner': 'Besitzer',
    'domain.fqdn': 'FQDN',
    'domain.remote_addr': 'Entfernter Server Adresse',
    'domain.remote_user': 'Entfernter Server Login',
    'domain.remote_pass': 'Entfernter Server Passwort',
    'domain.new': 'Neue Domäne',
    'domain.edit': 'Domäne bearbeiten',
    'domain.save': 'Domäne speichern',
    'domain.saved': '{{name}} wurde gespeichert',
    'domain.created': '{{name}} wurde erfolgreich erstellt',
    'domain.allowed_apps': 'Erlaubte Anwendungen',
    'domain.default_lang': 'Standardsprache für Benutzerkonten',
    'domain.default_country': 'Immmer Land vorauswählen',
    'domain.currency': 'Standardwährung für Webshop',
    'domain.vat': 'MwSt %',
    'domain.available_langs': 'Verfügbare Sprachen',
    'domain.is_caminio_hosted': 'Domain wird auf caminio bereitgestellt',
    'domain.thumbs': 'Thumbnailgrößen',

    'domain.danger': 'Gefahrenzone',
    'domain.remove': 'Diese Domäne löschen',
    'domain.remove_desc': 'Wenn du diese Domäne löscht, werden alle Benutzerkonten und Daten unwiderruflich gelöscht.',
    'domain.removed': 'Domäne {{name}} wurde gelöscht',
    'domain.really_delete': 'Möchtest du die Domäne {{name}} unwiderruflich löschen? Um fortzufahren, gib bitte den Namen der Domäne <strong>{{name}}</strong> hier ein',

    'domain.disk_quota_m': 'Festplatten Quota (MB)',
    'domain.upload_limit_m': 'Upload limit (MB)',
    'domain.user_quota': 'Benutzerkonten Quota',

    'domain.switch': 'Auf diese Domäne wechseln',

    'domain.description': 'Beschreibung',
    'domain.create': 'Domäne erstellen',

    'errors.invalid_domain_name': 'Ungültiger Domänenname',
    'errors.already_member': 'Die angegebene Email Adresse ist bereits Mitglied dieser Domäne',

    'client.create': 'Neuen API Key erstellen',
    'client.saved': 'API Key {{name}} wurde gespeichert',
    'client.really_delete': 'Soll {{name}} wirklich gelöscht werden? Das könnte negative Auswirkungen auf andere Seiten haben',
    'client.removed': '{{name}} wurde gelöscht',

    'client.domain': 'Domäne',

    'client.name': 'Domänenname',
    'client.id': 'Consumer key',
    'client.secret': 'Consumer secret'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

})();
