'use strict'

import { expect } from "vitest"
import fsbox from '../src/fs-toolbox.js'


	
/*
	  Empty Description: 
    ================================================
	  
	 Delete just files. Empty will not delete sub-folders.

*/

describe ( 'empty: Delete all files in folder', function () {
	var fs;
	import ( 'fs' ).then ( res => fs = res )


	beforeEach (() => new Promise((done) => {
					  var    files   = [
					  			  	       'test/deep-test/dir-test/ahoy/mala/may.txt'
					  			  	     , 'test/deep-test/dir-test/ahoy/mala/other.txt'
					  			       ]
					  	   , content = [
					  	   				    'hello from content'
					  	   				  , 'other content'
					  	   			   ]
					  			  ;
					  fsbox.set   ( 'files' , files )
					  fsbox.fileCacheAs ( 'write' )
					  fsbox.write ( content , ( err , r ) => done ()   )
	 })) // before





   it ( 'Single folder', () => new Promise((done) => {
					  var    files   = 'test/deep-test/dir-test/ahoy';
			
					  fsbox.empty ( files, ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							_scan()
					  		})
					  
					  function _scan ( ) {
									  		fsbox.scan ( files, ( err , r) => {
									  			expect ( err ).to.be.false
									  			expect ( r ).to.be.empty
									  			done()
									  		})
					  		} 
	 })) // it single





   it ( 'Multiple folder', () => new Promise((done) => {
					  var  files   = [
					  					  'test/deep-test/dir-test/ahoy'
					  					, 'test/deep-test/dir-test/ahoy/mala'
					  				];

					  fsbox.empty ( files, ( err , r ) => {
					  							expect ( err ).to.be.false
					  							expect ( r ).to.be.empty
					  							_scanAgain()
					  		})
					  
					  function _scanAgain ( ) {
									  		fsbox.scan ( files, ( err , r) => {
											  			expect ( err ).to.be.false
											  			expect ( r ).to.be.empty
											  			done()
									  			})
					  		} // _scan func. 
	 })) // it multiple








	afterAll(() => new Promise((done) => {
		                  _deleteFile ( 'test/deep-test/dir-test/ahoy/mala/other.txt' )
		 		.then ( () => {
		  				  _deleteFile ( 'test/deep-test/dir-test/ahoy/mala/may.txt'   )
		  			  })
		 		.then ( () => {
			  					 _remove ( [
					  			 			    'test/deep-test/dir-test/ahoy'
					  			 			  , 'test/deep-test/dir-test/ahoy/mala'
					  			 		 ])
		  			  })

		  function _deleteFile ( filename ) {
		  return new Promise ( (resolve, reject ) => {
		  			 fs.unlink ( filename , () => resolve(true)   )
		  })
		  } // _deleteFile

		  function _remove ( list ) {
		  	var folder;
		  	if ( list.length == 0 ) return done()
		  	folder = list.pop()
		    fs.rmdir ( folder , ( err , r ) => _remove ( list )  )
		  } // _remove

	 })) // after



})  // describe
