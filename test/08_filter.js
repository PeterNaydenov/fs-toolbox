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
	  Filter Description: 
    ================================================
	  
	 Filter list of files in cache. Remove file paths matching criteria. 
	 Fulfil first cache with data by using 'fsbox.scan' 
	 function or set( 'folders', ['array with paths'] ).
	  
*/

describe ( 'filter: Filter list of files', function () {
	var folders;
	


	beforeEach ( ( done ) => {
			fsbox.scan ( 'test/deep-test', ( err , r ) => {
					 										 folders = r
															 done()
			     })
	   }) // before





	it ( 'By name' , () => {
					   fsbox.filter ( 'general', { by:'name' }, ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.not.contain ('test/deep-test/general.txt')
						     })
	   }) // it with string
	




	it ( 'By filename', () => {
					 fsbox.filter ( ['general.txt', 'info.txt'], { by: 'filename'} , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.not.contain ('test/deep-test/general.txt')
											expect ( r ).to.not.contain ('test/deep-test/work/info.txt')
						     })
	   }) // it with array
	




	it ( 'By extension', () => {
					  fsbox.filter ( ['scss'], { by: 'ext' }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length ( 3 )
					        })
	   }) // it deep
	
	it ( 'Error handling: No options defined.', () => {
					fsbox.filter ( ['scss'], ( err, r ) => {
										   expect ( err ).to.be.an('array')
										   expect ( err ).to.have.length ( 2 )
										   expect ( r ).to.have.length ( 9 )
					        })
	      }) // it Errors


})  // describe
