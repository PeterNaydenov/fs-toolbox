'use strict'

var 
	  chai      = require ( 'chai' )
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;

chai.use(sinonChai)

/*
	  Mkdir Description: 
    ================================================
	  
	  Call:           fsbox.mkdir( folder , callback )
	  How it works : 
	                  Creates an array with sequence folders and test for 
	                  their existance. Function will create folder if it
	                  not exists.

	  Example      :
	                  folder = 'some/long/path/to/special/folder'
	                  Folder will be converted to array:
	                  [
	                       'some'
	                     , 'some/long'
	                     , 'some/long/path'
	                     , 'some/long/path/to'
	                     , 'some/long/path/to/special'
	                     , 'some/long/path/to/special/folder'
	                  ]

	  Function will test every record of this array and will create missing 
	  parts. Callback is a function or array of functions and will be executed
	  after creation or testing complete for all folders.

*/

describe ( 'makeFolder: Creates a folder', function () {
	


	it ( 'From path string' , ( done ) => {
			var path = 'test/deep-test/dir-test/second/level/of/deep';
			fsbox.makeFolder ( path , ( err , r ) => {
									expect ( err ).to.be.false
									expect ( r ).to.be.true
									done()
			            })
	   }) // it string
	


	it ( 'From array of path strings', ( done ) => {
			var list = [
						   'test/deep-test'
						 , 'test/deep-test/dir-test/again'
						 , 'test/deep-test/dir-test/again'
						 , 'test/deep-test/dir-test/second/level/of/checking'
					   ]
			fsbox.makeFolder ( list , ( err , r ) => {
								 expect ( err ).to.be.false
								 expect ( r ).to.be.true
								 done()
			     }) // mkdir
	   }) // it array
	
	



	after ( (done) => {
					var 
						  fs = require ( 'fs' )
						, list
						;
					
					// remove this list of folders
					list = [
					           'test/deep-test/dir-test/again'
					         , 'test/deep-test/dir-test/second'
					         , 'test/deep-test/dir-test/second/level'
					         , 'test/deep-test/dir-test/second/level/of'
					         , 'test/deep-test/dir-test/second/level/of/deep'
					         , 'test/deep-test/dir-test/second/level/of/checking'
					       ]

					_remove ( list , done )

					function _remove ( list, callback ) {
						var folder;
						if ( list.length == 0 ) {
													done()
													return
												 }
						folder = list.pop();
						fs.rmdir ( folder, () => { 
													_remove ( list , done ) 
												})
					} // _remove func.
	      })
})
