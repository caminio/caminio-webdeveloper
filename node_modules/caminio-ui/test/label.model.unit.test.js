/*
 * caminio-contacts
 *
 * @author david <david.reinisch@tastenwerk.com>
 * @date 02/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license comercial
 *
 */

(function(){
  
  'use strict';

  /* jshint -W024 */
  /* jshint expr:true */

  var helper = require('./helper'),
      expect = helper.chai.expect,      
      async = require('async');

  var caminio,
      domain,
      Label;

  var Attr = { name: 'a label', type: 'a type' };

  describe( 'Label', function(){

    before( function(done){
      helper.initApp( this, function(){ 
        caminio = helper.caminio;
        Label = caminio.models.Label;
        async.each( Object.keys(caminio.models), function( modelId, next ){
          caminio.models[modelId].remove({}, next);
        }, helper.getDomainAndUser( caminio, function( err, u, d ){
          domain = d;
          Attr.camDomain = d._id;
          done();
        }));
      });
    });

    it('is valid', function( done ){
      this.label = new Label( Attr );
      this.label.validate( 
       function( err ){
         expect( err ).to.not.exist;
         done();
      });
    });

    describe( 'attributes', function(){

      describe( 'has', function(){

        before( function(){
          this.label = new Label( Attr );
        });

        it('.name', function(){
          expect( this.label.name ).to.eq( Attr.name );
        });

        it('.type', function(){
          expect( this.label.type ).to.eq( Attr.type );
        });

        it('.camDomain', function(){
          expect( this.label.camDomain ).to.eq( domain._id );
        });

      });

      describe( 'validates', function(){

        before( function( done ){
          this.label.save( function( err ){
            expect(err).to.be.null;
            done();
          });
        });

        it('checks if name is already used in the domain', function( done ){
          var newLable = new Label( Attr );
          newLable.save( function( err ){
            expect( err.name ).to.eq('validation_error');
            done();
          });
        });
      });

    });

    describe('methods', function(){

      beforeEach( function(){
        Attr.name = 'other name';
        this.label = new Label( Attr );
      });

      it('.save', function( done ){
        this.label.save( function( err ){
          expect( err ).to.be.null;
          done();
        });
      });    

      it('.update', function( done ){
        var test = this;
        test.label.update( { name: 'new name' }, function( err ){
          expect( err ).to.be.null;
          done();
        });
      });

      it('.remove', function( done ){
        var test = this;
        test.label.remove( function( err ){
          expect( err ).to.be.null;
          //expect(test.contact).to.be.undefined;
          done();
        });
      });

    });

  });

})();