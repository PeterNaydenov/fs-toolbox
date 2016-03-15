'use strict'

var 
	  chai      = require ( 'chai' )
	, expect    = require ( 'chai' ).expect
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, fsbox     = require ( '../fs-toolbox')
	;

chai.use(sinonChai)

/*
	  Delete Description: 
    ================================================
	  
	 Delete all file-paths in cache

*/

describe ( 'delete: Delete all file-paths in cache.', function () {
	var 
		  fs = require ( 'fs' )
		, folders
		;



	beforeEach ( ( done ) => {
					  var    files   = [
					  			  	       'test/deep-test/dir-test/empty/fold/may.txt'
					  			  	     , 'test/deep-test/dir-test/empty/fold/other.txt'
					  			       ]
					  	   , content = [
					  	   				    'hello from content'
					  	   				  , 'other content'
					  	   			   ]
					  			  ;
					  fsbox.set   ( 'files' , files )
					  fsbox.write (   content , ( err , r ) => done ()   )
	}) // before





   it ( 'existing file', ( done ) => {
					  var file = 'test/deep-test/dir-test/empty/fold/other.txt';
			
					  fsbox.set ('files', file )
					  fsbox.delete ( ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							done()
					  		})
	   }) // it existing file





   it ( 'Non existing file', ( done ) => {
   					  var file = 'test/deep-test/dir-test/empty/fold/non.txt';
			
					  fsbox.set ('files', file )
					  fsbox.delete ( ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							done()
					  		})
      }) // non existing file





   after ( ( done ) => {
   					var folder = 'test/deep-test/dir-test'
   					fsbox.emptyFolder ( folder , () => done() )
      }) // after





})  // describe
