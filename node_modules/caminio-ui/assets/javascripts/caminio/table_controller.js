( function( App ){

  'use strict';

  App._selTableItems = Ember.A();
  App.TableController = Ember.ArrayController.extend({

    page: 1,
    numRows: 10,
    pages: [],

    sortProperties: [],
    sortAscending: true,

    availableRows: [10,30,50],

    closestPages: function(){
      var start = this.get('page');
      var end = this.get('pages')[ this.get('pages').length-1];
      if( start > 3 )
        start = start-3;
      else if( start > 2 )
        start = start-2;
      else if( start > 1 )
        start = start-1;
      end = (start + 5 <= end ) ? start + 5 : end;
      if( end - 5 < start && this.get('pages').length > 5 )
        start = end - 5;
      return this.get('pages').slice( start-1, end );
    }.property('pages.length'),

    paginatedContent: function(){
      var start = (this.get('page') - 1 ) * this.get('numRows');
      var end = this.get('page') * this.get('numRows');
      var pages = parseInt(this.get('content.length') / this.get('numRows'));
      if( this.get('content.length') % this.get('numRows') > 0 )
        pages += 1;
      this.set('pages',[]);
      for( var i=1; i<=pages; i++ )
        this.get('pages').push(i);
      return this.get('arrangedContent').slice(start,end);
    }.property('arrangedContent.[]', 'page', 'numRows'),

    someSelected: function(){
      return ( App.get('_selTableItems.length') > 0 && App.get('_selTableItems.length') < this.get('content.length'));
    }.property('App._selTableItems.length'),

    oneOrMoreSelected: function(){
      return App.get('_selTableItems.length') > 0;
    }.property('App._selTableItems.length'),

    actions: {

      sortByColumn: function( columnName, forceAscending ){
        if( this.get('sortProperties').indexOf( columnName ) >= 0 )
          this.set('sortAscending', forceAscending || !this.get('sortAscending') );
        this.set('sortProperties', [ columnName ] );
      },

      selectAllTableItems: function(){
        var self = this;
        if( App._selTableItems.length >= this.get('content.length') )
          return App._selTableItems.clear();
        if( App._selTableItems.length > 0 ){
          App._selTableItems.clear();
          return this.get('content').forEach(function(item){
            App._selTableItems.pushObject( item );
          });
        }
        this.get('paginatedContent').forEach(function(item,i){
          if( i <= self.get('numRows') )
            App._selTableItems.pushObject( item );
        });
      
      },

      goToPage: function( page ){
        this.set('page', page);
      },

      goToLastPage: function(){
        this.set('page', this.get('pages.lastObject'));
      },

      goToFirstPage: function(){
        this.set('page', 1);
      }

    }

  });

  App.TableItemController = Ember.ObjectController.extend({

    isSelectedTableItem: function(){
      var item = this.get('content');
      var isSelected = App._selTableItems.findBy('id', item.id);
      return typeof(isSelected) === 'object';
    }.property('App._selTableItems.@each'),

    curTranslation: function(){
      return this.get('content.translations').findBy('locale', App._curLang);
    }.property('App._curLang'),

    actions: {
    
      selectTableItem: function(){
        var item = this.get('content');
        var isSelected = App._selTableItems.findBy('id', item.id);
        if( isSelected )
          return App._selTableItems.removeObject( item );
        App._selTableItems.pushObject( item );
      }

    }

  });

  App.TableFooterPageItemController = Em.ObjectController.extend({
    isActive: function(){
      return this.get('content') === this.get('parentController.page');
    }.property('parentController.page')
  });

  App.TableHeaderItemController = Em.ObjectController.extend({
    isSortingAsc: function(){
      return ( this.get('parentController.sortProperties').indexOf(this.get('content.name')) >= 0 &&
          this.get('parentController.sortAscending') );
    }.property('parentController.sortProperties.@each', 'parentController.sortAscending'),
    isSortingDesc: function(){
      return ( this.get('parentController.sortProperties').indexOf(this.get('content.name')) >= 0 &&
          !this.get('parentController.sortAscending') );
    }.property('parentController.sortProperties.@each', 'parentController.sortAscending'),
    calculateStyle: function(){
      var style = '';
      if( this.get('content.width') )
        style += 'width: ' + this.get('content.width') + ';';
      if( this.get('content.align') )
        style += 'text-align: '+this.get('content.align') + ';';
      return style;
    }.property('content.width', 'content.align')
  });

})( App );
