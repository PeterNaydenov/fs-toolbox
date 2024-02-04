'use strict'

var 
	  chai      = require ( 'chai' )
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;


	
/*
	  RemoveFolder Description: 
    ================================================
	  
	 Removes folder paths that contain specific words. 
	 Fulfil first cache with data by using 'fsbox.scanFolder' function or set( 'folders', ['array with paths'] ).

	 Examples:
	            > fsbox.removeFolder (  'images' , callback_func )
	            Will be applied on 'cache.folders' and will remove folders that have 
	            'images' in a path
	            
	            > fsbox.removeFolder ( ['images' , 'pics'] , callback_func )
	            Will be applied on 'cache.folders' and will remove folders with 'images' or 
	            'pics' in a path.
	            
	            > fsbox.removeFolder ( ['images' , 'pics'] , [ callback, callback ] )
	            Like prev. example. Will execute array of callbacks on complete.
	  
*/

describe ( 'removeFolder: Filter list of folders', function () {
	
	

	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'With string' , () => {
					   fsbox.removeFolder ( 'one-1', ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 11 )
						     })
	   }) // it with string
	




	it ( 'With array', () => {
					 fsbox.removeFolders ( ['one-1', 'work'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 7 )
						     })
	   }) // it with array
	




	it ( 'Options are not in use', () => {
					  fsbox.removeFolders ( ['one-1', 'work'], { deep:0 }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length(7)
					        })
	   }) // it deep
	


})  // describe
