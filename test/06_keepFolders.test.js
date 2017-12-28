'use strict'

var 
	  chai      = require ( 'chai' )
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;

chai.use ( sinonChai )

/*
	  KeepFolder Description: 
    ================================================
	  
	 Reduce list of folders in cache. Keep folder paths that contain 
	 specific words. Fulfil first cache with data by using 'fsbox.scanFolder' 
	 function or set( 'folders', ['array with paths'] ).

	 Examples:
	            > fsbox.keepFolder (  'images' , callback_func )
	            Will be applied to 'cache.folders' and will keep folders that have 
	            'images' in a path
	            
	            > fsbox.keepFolder ( ['images' , 'pics'] , callback_func )
	            Will be applied to 'cache.folders' and will keep folders with 'images' or 
	            'pics' in a path.
	            
	            > fsbox.keepFolder ( ['images' , 'pics'] , [ callback, callback ] )
	            Like prev. example. Will execute array of callbacks on completion.

			   - Let's substitute ['images', 'pics'] with pathList
			   
			   > fsbox.keepFolder ( pathList, options, callback )
			   Reduce folder list with options.
			   Option list : 
			   				 - deep - reduce subfolders depth after selected word


	       
	  
*/

describe ( 'keepFolder: Reduce list of folders', function () {
	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'With string' , () => {
						fsbox.keepFolder ( 'one-1', ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.be.an('array')
											expect ( r ).to.have.length ( 8 )
						     })
	   }) // it with string
	




	it ( 'With array', () => {
						fsbox.keepFolder ( ['one-1', 'two-1'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.be.an('array')
											expect ( r ).to.have.length ( 12 )
						     })
	   }) // it with array
	




	it ( 'Deep option', () => {
					  fsbox.keepFolder ( ['one-1'], { deep:0 }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length(1)
					        })
	   }) // it deep
	


})  // describe
