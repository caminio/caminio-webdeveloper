/*
 * caminio-media
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */


var helper = require('../helper'),
    fixtures = helper.fixtures,
    expect = helper.chai.expect;

'use strict';

describe( 'Mediafile', function(){

  var caminio;
  var Mediafile;

  before( function(done){
    var test = this;
    helper.initApp( this, function(){ 
      caminio = helper.caminio;
      Mediafile = caminio.models.Mediafile;
      caminio.models.Mediafile.create( { name: 'mylabel' }, function( err, mediafile ){
        test.parent = mediafile;
        done();
      })
    });
  });

  describe( 'building a media file', function(){

    it('requires a name', function( done ){
      var mf = new Mediafile({});
      mf.validate( function (err){
        expect(err).to.have.property('errors'); 
        expect(err.errors).to.have.property('name');
        done();
      });
    });

  });

  describe( '#relPath', function(){
  
    it('with simple filename and extension', function(){
      var mf = new Mediafile({ name: 'test.jpg' });
      expect( mf.relPath ).to.eql( 'test.jpg' );
    });

    it('with simple filename and NO extension', function(){
      var mf = new Mediafile({ name: 'test' });
      expect( mf.relPath ).to.eql( 'test' );
    });

    it('with multi-dots', function(){
      var mf = new Mediafile({ name: 'test.is.my.test.jpg' });
      expect( mf.relPath ).to.eql( 'test.is.my.test.jpg' );
    });

    it('with parent', function(){
      var mf = new Mediafile({ parent: this.parent, name: 'test.jpg' });
      expect( mf.relPath ).to.eql( this.parent._id+'/test.jpg' );
    });

  });

  describe( '#thumbPath', function(){
  
    it('with simple filename and extension', function(){
      var mf = new Mediafile({ name: 'test.jpg' });
      expect( mf.thumbPath() ).to.eql( '/files/test.jpg' );
    });

    it('with simple filename and NO extension', function(){
      var mf = new Mediafile({ name: 'test' });
      expect( mf.thumbPath() ).to.eql( '/files/test' );
    });

    it('with multi-dots', function(){
      var mf = new Mediafile({ name: 'test.is.my.test.jpg' });
      expect( mf.thumbPath() ).to.eql( '/files/test.is.my.test.jpg' );
    });

    it('with parent', function(){
      var mf = new Mediafile({ parent: this.parent, name: 'test.jpg' });
      expect( mf.thumbPath() ).to.eql( '/files/'+this.parent._id+'/test.jpg' );
    });

  });

});
