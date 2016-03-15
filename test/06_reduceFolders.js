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
	  ReduceFolder Description: 
    ================================================
	  
	 Reduce list of folders in cache. Keep folder paths that contain 
	 specific words. Fulfil first cache with data by using 'fsbox.scanFolder' 
	 function or set( 'folders', ['array with paths'] ).

	 Examples:
	            > fsbox.reduceFolder (  'images' , callback_func )
	            Will reduce 'cache.folders'. Will keep folders that have 
	            'images' in a path
	            
	            > fsbox.reduceFolder ( ['images' , 'pics'] , callback_func )
	            Will reduce 'cache.folders'. Will keep folders with 'images' or 
	            'pics' in a path.
	            
	            > fsbox.reduceFolder ( ['images' , 'pics'] , [ callback, callback ] )
	            Like prev. example. Will execute array of callbacks on complete.

			   - Let's substitute ['images', 'pics'] with pathList
			   
			   > fsbox.reduceFolder ( pathList, options, callback )
			   Reduce folder list with options.
			   Option list : 
			   				 - deep - reduce subfolders depth after selected word


	       
	  
*/

describe ( 'reduceFolder: Reduce list of folders', function () {
	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'With string' , () => {
						fsbox.reduceFolder ( 'one-1', ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.be.an('array')
											expect ( r ).to.have.length ( 8 )
						     })
	   }) // it with string
	




	it ( 'With array', () => {
						fsbox.reduceFolder ( ['one-1', 'two-1'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.be.an('array')
											expect ( r ).to.have.length ( 12 )
						     })
	   }) // it with array
	




	it ( 'Deep option', () => {
					  fsbox.reduceFolder ( ['one-1'], { deep:0 }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length(1)
					        })
	   }) // it deep
	


})  // describe
