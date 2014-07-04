(function(){

  'use strict';

  if( currentLang !== 'en' ) return;
  
  var translations = {

    'de': 'Deutsch',
    'en': 'English',

    'hi': 'Hi',
    'or': 'or',
    'at': 'at',
    'ago': 'ago',
    'sign_out': 'Sign out',
    'edit_profile': 'Edit profile',
    'other_domains': 'Other domains',
    'change_password': 'Change password',
    'only_mine': 'Only mine',

    'go_to_dashboard': 'go to dashboard',
    'go_to_calendar': 'go to calendar',
    'apps.settings': 'Settings',
    'apps.domains': 'Domains',
    'apps.lineup': 'Line-up',
    'apps.web': 'WebMaker',
    'apps.shop': 'Shop',
    'apps.people': 'Contacts',
    'apps.calendar': 'Calendar',
    'apps.open_app_bar': 'Open app panel, also with: shortcut [c]',
    'apps.profile': 'Profile',

    'today_is': 'Today is',
    'today': 'today',
    'yesterday': 'Yesterday',
    'tomorrow': 'tomorrow',
    'last_login': 'Last login',
    'live_ticker': 'Live ticker',
    'live_ticker.post': 'Post',
    'live_ticker.something_to_say': 'Write a note or message',
    'live_ticker.message': 'Message',
    'live_ticker.media': 'Pictures / files',
    'name': 'Name',
    'title': 'Title',
    'filename': 'Filename',
    'save': 'Save',
    'back': 'Back',
    'edit': 'Edit',
    'show': 'Show',
    'close': 'Close',
    'done': 'Done',
    'cancel': 'Cancel',
    'create': 'Create',
    'remove': 'Remove',
    'delete': 'Delete',
    'undo': 'Undo',
    'delete_selected': 'Delete selected',
    'root': 'root',
    'actions': 'Actions',
    'preview': 'Preview',
    'more': 'more',
    'perc_completed': 'percent completed',
    'status': 'Status',
    'total': 'Total',
    'adv_search': 'Advanced search',

    'o_clock': 'o\'clock',

    'cut': 'Cut',
    'copy': 'Copy',
    'paste': 'Paste',

    'email': 'Email',
    'phone': 'Phone',
    'address': 'Address',
    'street': 'Street',
    'zip': 'Zip',
    'state': 'State',
    'country': 'Country',
    'city': 'City',

    'properties': 'properties',
    'date': 'Date',
    'time': 'Time',

    'select_all': 'Select all',
    'upload_file': 'Upload a file',

    'published': 'published',
    'draft': 'draft',
    'published_click_to_change': 'published - click to change status',
    'draft_click_to_change': 'draft - click to change status',

    'user_activity': 'User activity',
    'disk_quota': 'Disk Quota',
    'users_quota': 'Users',
    'latest_activities': 'Latest activities',
    'users_in_total': 'Users in total',
    'please_select': 'Please select...',
    'select_country': 'Select country...',

    'required_fields': 'Required field',

    'last_modified': 'Modified',
    'created': 'Created',
    'created_by': 'Created by',
    'created_at': 'Created at',
    'updated': 'Updated',
    'updated_by': 'Updated by',
    'updated_at': 'Updated at',
    
    'settings': 'Settings',

    'unsaved_data_continue': 'The opened form contains unsaved data which would be lost. Really continue?',
    
    'labels': 'Labels',
    'labels.title': 'Labels',
    'labels.new': 'New label',
    'labels.select_entries_then_click_on_label': 'Select one or more items then click on the label to add them',
    'labels.items_selected': 'label {{count}} items with',
    'labels.no_labels': 'No labels set',
    'labels.click': 'Click a label to mark this element with it',

    'content_here': 'Here should go some text!',

    'translation.title': 'Language',

    'label.created': 'Label {{name}} has been created successfully',
    'label.saved': 'Label settings for {{name}} have been saved successfully',
    'label.delete': 'Delete this label',
    'label.really_delete': 'Really delete label {{name}}',
    'label.deleted': 'Label {{name}} has been deleted successfully',
    'label.private': 'Private',

    'label.select_color': 'Select color',

    'errors.db_field': '{{name}}: {{message}}',
    'errors.required': 'This field is required',
    'errors.invalid_email_address': 'The email address is invalid',
    'errors.duplicate_key': '{{name}} is duplicate and can\'t be saved twice',
    
    'really_delete': 'Really delete label {{name}}',

    'pic.drop_here': 'Upload'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();
