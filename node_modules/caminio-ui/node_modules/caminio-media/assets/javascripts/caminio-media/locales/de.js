(function(){

  'use strict';

  if( currentLang !== 'de' ) return;

  var translations = {
    
    'media_manager.title': 'Media Manager',
    'media.upload': 'Datei hochladen',
    'media.insert_selected': 'Ausgewähltes Bild einfügen',

    'media.labels.title': 'Labels',
    'media.files.title': 'Dateien',
    'media.webpages.title': 'Webseiten',

    'drop_files_here': 'Hochladen',
    'upload': 'Hochladen',
    'perc_completed': 'Prozent abgeschlossen',

    'file.edit': '{{name}} bearbeiten',
    'file.actions': 'Aktionen',
    'file.name': 'Dateiname',
    'file.content_type': 'Dateityp',
    'file.size': 'Größe',
    'file.description': 'Beschreibung',
    'file.remove': 'Datei löschen',
    'file.delete': 'Diese Datei löschen',
    'file.really_delete': 'Soll diese Datei ({{name}}) wirklich gelöscht werden?',
    'file.copyright': 'Copyright',
    'file.saved': 'Datei {{name}} wurde gespeichert',
    'file.deleted': 'Datei {{name}} wurde gelöscht',
    'file.teaser': 'Teaser',
    'file.teaser_desc': 'Bild is Teaser (klick invertiert Status)',
    'file.hidden': 'Versteckt',
    'file.visible': 'Sichtbar',
    'file.hidden_desc': 'Dieses Bild im Galeriemodus nicht verwenden',

    'files.new_order_saved': 'Neue Ordnung wurde gespeichert',

    'img.orig': 'Original',
    'img.thumbs': 'Thumbnails'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();
