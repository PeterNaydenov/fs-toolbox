'use strict'

import { expect } from 'chai'
import fsbox from '../src/fs-toolbox.js'


	
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
	   }) // it name
	




	it ( 'By filename', () => {
					 fsbox.remove ( ['general.txt', 'info.txt'], { by: 'filename'} , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.not.contain ('test/deep-test/general.txt')
											expect ( r ).to.not.contain ('test/deep-test/work/info.txt')
						     })
	   }) // it filename
	




	it ( 'By extension', () => {
					  fsbox.remove ( ['scss'], { by: 'ext' }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.have.length ( 9 )
					        })
	   }) // it extension





	it ( 'By path', () => {
					  let str = 'test/deep-test/general.txt'
					  let rm = [ str ]
					  fsbox.remove ( rm, { by: 'path' }, ( err , r ) => {
					  						expect ( err ).to.be.false
					  						expect ( r ).to.not.contain ( str )
					        })
	   }) // it path




	
	it ( 'Error handling: No options defined.', () => {
					fsbox.remove ( ['scss'], ( err, r ) => {
										   expect ( err ).to.be.an('array')
										   expect ( err ).to.have.length ( 2 )
										   expect ( r ).to.have.length ( 15 )
					        })
	      }) // it Errors


})  // describe
