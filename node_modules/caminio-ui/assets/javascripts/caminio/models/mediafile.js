( function(App){

  'use strict';

  App.Mediafile = DS.Model.extend({
    name: DS.attr(),
    contentType: DS.attr(),
    size: DS.attr('number'),
    createdAt: DS.attr('date'),
    preferences: DS.attr('object'),
    updatedAt: DS.attr('date'),
    createdBy: DS.belongsTo('user'),
    updatedBy: DS.belongsTo('user'),
    description: DS.attr(),
    copyright: DS.attr(),
    position: DS.attr('number'),
    isHidden: DS.attr('boolean', { defaultValue: false }),
    isTeaser: DS.attr('boolean', { defaultValue: false }),
    thumbnails: DS.attr('array'),
    parent: DS.attr('string'),
    relPath: DS.attr('string'),
    url: function(){
      return '/caminio/domains/'+currentDomain._id+'/preview/'+this.get('relPath');
    }.property('name'),
    publicUrl: function(){
      return '/files/'+this.get('relPath');
    }.property('name'),
    isImage: function(){
      return this.get('contentType').indexOf('image') === 0;
    }.property('contentType'),
    humanSize: function(){
      return filesize(this.get('size'));
    }.property('size'),
    preferencesAsStr: function(){
      return JSON.stringify(this.get('preferences'));
    }.property('preferences'),
    getThumbDim: function( dim ){
      if( this.get('preferences').thumbs && this.get('preferences').thumbs[dim] )
        return this.get('preferences').thumbs[dim];
      return null;
    },
    setThumbDim: function( dim, val ){
      var pref = this.get('preferences');
      pref.thumbs = pref.thumbs || {};
      pref.thumbs[dim] = val;
      this.set('preferences', pref);
    },
    updateRelPath: function(){
      var pth = this.get('parent') ? this.get('parent') : '';
      pth = pth.length > 0 ? pth + '/' : '';
      this.set('relPath', pth+this.get('name') );
    }.observes('name','parent'),
    getBackgroundImage: function(){
      if( this.get('isImage') )
        return 'background-image: url("'+this.get('url')+'");';
    }.property('contentType')
  });

})(App);
