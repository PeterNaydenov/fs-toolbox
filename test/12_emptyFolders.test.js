'use strict'

var 
	  chai      = require ( 'chai' )
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;


	
/*
	  EmptyFolders Description: 
    ================================================
	  
	 Delete all files and sub-folders.

*/

describe ( 'emptyFolders: Delete all files and sub-folders', function () {
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
					  fsbox.write ( content , ( err , r ) => done ()   )
	}) // before





   it ( 'Single folder', ( done ) => {
					  var folder = 'test/deep-test/dir-test';
			
					  fsbox.emptyFolder ( folder, ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							_scan()
					  		})
					  
					  function _scan ( ) {
								fsbox.scanFolders ( folder, ( err , r) => {
									  			expect ( err ).to.be.false
									  			expect ( r ).to.be.empty
									  			done()
									  		})
					  		} // _scan func. 
	}) // it single





   it ( 'Multiple folder', ( done ) => {
					  var  files   = [
					  					    'test/deep-test/dir-test/empty'
					  					  , 'test/deep-test/dir-test/empty/fold'
					  					  , 'test/deep-test/dir-test'
					  				];

					  fsbox.emptyFolders ( files, ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							_scanAgain()
					  		})
					  
					  function _scanAgain ( ) {
									  		fsbox.scan ( files, ( err , r) => {
											  			expect ( err ).to.be.an('array')
											  			expect ( err ).have.length ( 2 )
											  			expect ( r ).to.be.empty
											  			done()
									  			})
					  		} // _scan func. 
	  }) // it multiple



})  // describe




