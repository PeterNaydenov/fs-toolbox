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
	  Remove Description: 
    ================================================
	  
	 Removes files from cache on file-paths matching criteria. 
	 Cache should have data before. Fill with data by using 'fsbox.scan' 
	 function or set( 'folders', ['array with paths'] ).
	  
*/

describe ( 'remove: Filter list of files', function () {
	var folders;
	


	beforeEach ( ( done ) => {
			fsbox.scan ( 'test/deep-test', ( err , r ) => {
					 										 folders = r
															 done()
			     })
	   }) // before





	it ( 'By name' , () => {
					   fsbox.remove ( 'general', { by:'name' }, ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.not.contain ('test/deep-test/general.txt')
						     })
	   }) // it with string
	




	it ( 'By filename', () => {
					 fsbox.remove ( ['general.txt', 'info.txt'], { by: 'filename'} , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.not.contain ('test/deep-test/general.txt')
											expect ( r ).to.not.contain ('test/deep-test/work/info.txt')
						     })
	   }) // it with array
	




	it ( 'By extension', () => {
					  fsbox.remove ( ['scss'], { by: 'ext' }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length ( 3 )
					        })
	   }) // it deep
	
	it ( 'Error handling: No options defined.', () => {
					fsbox.remove ( ['scss'], ( err, r ) => {
										   expect ( err ).to.be.an('array')
										   expect ( err ).to.have.length ( 2 )
										   expect ( r ).to.have.length ( 9 )
					        })
	      }) // it Errors


})  // describe