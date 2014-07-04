(function(){

  'use strict';

  if( currentLang !== 'en' ) return;
  
  var translations = {

    'nav.users': 'Users',
    'nav.domains': 'Domains',
    'nav.settings': 'Settings',

    'unknown': 'Unknown',

    'users.import_csv': 'Import users from csv file',

    'user.name': 'Name',
    'user.save': 'Save',
    'user.created': 'User {{name}} has been created successfully',
    'user.saved': 'User {{name}} has been saved',
    'user.create': 'Create',
    'user.new': 'Create new user',
    'user.edit': 'Edit user',
    'user.email': 'Email',
    'user.phone': 'Phone',
    'user.firstname': 'Firstname',
    'user.lastname': 'Lastname',
    'user.tabs.general': 'General',
    'user.tabs.settings': 'Settings',
    'user.tabs.history': 'History',
    'user.send_login_info': 'Send login info again',
    'user.sent_credentials_again': 'Login credentials have been sent successfully',
    'user.api_gen_failed': 'API generation failed. Please try again',
    'user.convert_api_user': 'Convert into API account',
    'user.api_key_generated': 'API key has been generated for {{name}}',
    'user.api_private_key': 'API private key',
    'user.api_public_key': 'API public key',
    'user.api_role_not_allowed': 'Role not allowed for API accounts',
    'user.converted_into_api': 'User {{name}} is now an API user',
    'user.converted_back': 'User {{name}} is no longer an API user',

    'user.password': 'Password',
    'user.password_confirmation': 'Repeat password',

    'user.admin': 'Administrator',
    'user.editor': 'Editor',
    'user.api.enabled': 'enabled',
    'user.api.disabled': 'disabled',

    'user.access_rights': 'Access rights',
    'user.roles.no_access': 'no access',
    'user.roles.comments_only': 'comments only',
    'user.roles.default': 'default',
    'user.roles.editor': 'editor',
    'user.roles.trustee': 'trustee',
    'user.roles.admin': 'administrator',

    'user.lang': 'Language',
    'user.photo': 'Photo',
    'user.danger': 'Danger zone',

    'user.api': 'API',
    'user.remote_clients': 'Remote clients',

    'user.cannot_delete_domain_owner': 'The domain administration account cannot be deleted!',
    'user.remove_desc': 'If you remove this account, all comments will be removed, all items shared with others will be nullified (ownership will be set to the domain owner',
    'user.remove': 'Remove this user account',
    'user.really_delete': 'Really delete this user? This action cannot be undone. Please type the user\'s name <strong>{{fullname}}</strong> into the field below to continue.',
    'user.really_remove_from_domain': 'Really remove user {{fullname}} from this domain?',
    'user.removed_from_domain': 'The user account {{fullname}} has been removed from this domain',
    'user.removed': 'User {{name}} has been removed',

    'user.notify_settings': 'Settings',
    'user.notifications': 'Notifications',

    'user.errors.prohibited_save': 'Errors prohibited this form to be saved',

    'user.security': 'Security',

    'invalid_email': 'The email address entered is not valid: {{value}}',
    'required_fields': 'Required fields',

    'domain.name': 'Domain name',
    'domain.settings': 'Settings',
    'domain.owner': 'Owner',
    'domain.fqdn': 'FQDN',
    'domain.remote_addr': 'Remote address',
    'domain.remote_user': 'Remote username',
    'domain.remote_pass': 'Remote password',
    'domain.new': 'New domain',
    'domain.edit': 'Edit domain',
    'domain.save': 'Save domain',
    'domain.saved': 'Domain {{name}} has been saved',
    'domain.created': 'Domain {{name}} has been created successfully',
    'domain.allowed_apps': 'Allowed applications',
    'domain.default_lang': 'Default language for users',
    'domain.default_country': 'Always select country',
    'domain.available_langs': 'Available languages',
    'domain.is_caminio_hosted': 'Domain is hosted on caminio',
    'domain.currency': 'Default currency for webshop',
    'domain.vat': 'VAT %',
    'domain.thumbs': 'Thumbnail sizes',
    'domain.disk_quota_m': 'Disk quota (MB)',
    'domain.upload_limit_m': 'Upload size limit (MB)',
    'domain.user_quota': 'Users quota',

    'domain.danger': 'Danger zone',
    'domain.remove': 'Remove this domain',
    'domain.remove_desc': 'Removing this domain will delete all useres and all data permanently. There is no way to undo this action',
    'domain.removed': 'Domain {{name}} has been removed',
    'domain.really_delete': 'Do you really want to delete this domain including all user accounts? Enter the domain name {{name}} to proceed',

    'domain.switch': 'Switch to this domain',

    'domain.description': 'Description',
    'domain.create': 'Create domain',

    'errors.invalid_domain_name': 'The entered value is not a valid domain name',
    'errors.already_member': 'The chosen email address is already member of this domain',

    'client.create': 'Add new client id',
    'client.saved': 'Client {{name}} has been saved',
    'client.really_delete': 'Really delete client {{name}}? This might have unexpected impact on other sites accessing through this client',
    'client.removed': '{{name}} has been removed',
    'client.domain': 'Domain name',

    'client.name': 'Domain name',
    'client.id': 'Consumer key',
    'client.secret': 'Consumer secret'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

})();
