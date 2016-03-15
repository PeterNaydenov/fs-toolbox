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
	  FilterFolder Description: 
    ================================================
	  
	 Filter list of folders in cache. Remove folder paths that contain 
	 specific words. Fulfil first cache with data by using 'fsbox.scanFolder' 
	 function or set( 'folders', ['array with paths'] ).

	 Examples:
	            > fsbox.filterFolder (  'images' , callback_func )
	            Will filter 'cache.folders'. Will remove folders that have 
	            'images' in a path
	            
	            > fsbox.filterFolder ( ['images' , 'pics'] , callback_func )
	            Will filter 'cache.folders'. Will remove folders with 'images' or 
	            'pics' in a path.
	            
	            > fsbox.filterFolder ( ['images' , 'pics'] , [ callback, callback ] )
	            Like prev. example. Will execute array of callbacks on complete.
	  
*/

describe ( 'filterFolder: Filter list of folders', function () {
	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'With string' , () => {
					   fsbox.filterFolder ( 'one-1', ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 11 )
						     })
	   }) // it with string
	




	it ( 'With array', () => {
					 fsbox.filterFolders ( ['one-1', 'work'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 7 )
						     })
	   }) // it with array
	




	it ( 'Options are not in use', () => {
					  fsbox.filterFolders ( ['one-1', 'work'], { deep:0 }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length(7)
					        })
	   }) // it deep
	


})  // describe
