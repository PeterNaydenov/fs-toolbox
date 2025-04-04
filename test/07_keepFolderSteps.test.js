'use strict'

import { expect } from 'chai'
import fsbox from '../src/fs-toolbox.js'

	
/*
	  KeepFolderSteps Description: 
    ================================================
	  
	 Execute sequence of 'keepFolder' function with each of list members.

*/

describe ( 'keepFolderSteps: Sequence of "keepFolders"', function () {
	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'default', () => {
						fsbox.keepFolderSteps ( ['one-1', 'two-1'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 4 )
						     })
	   }) // it default
	




	it ( 'aliase', () => {
						fsbox.keepFoldersSteps ( ['one-1', 'two-1'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 4 )
						     })
	   }) // it aliase





	it ( 'deep: number', () => {
						var 
							  list = ['one-1', 'two-1']
							, init = [ 
										  'test/deep-test/folder-test/one-1/two-1'
										, 'test/deep-test/folder-test/one-1/two-1/three-1'
										, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1'
										, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1/five-1' 
									 ]
							;

						fsbox.set ( 'folders' , init )
						fsbox.keepFolderSteps ( list , { deep: 1 }, ( err, r ) => {
													expect ( err ).to.be.false
													expect ( r ).to.have.length ( 1 )
									    })
	   }) // it deep number





	it ( 'deep: array', () => {
				var 
					  list = ['one-1','two-1']
					, init = [ 
								  'test/deep-test/folder-test/one-1/two-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1/five-1' 
							 ]
					;

				fsbox.set ( 'folders' , init )
				fsbox.keepFolderSteps ( list , { deep: [2,99] }, ( err, r ) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 2 )
							    })
	   }) // it deep array





    it ( 'Error handling: Deep error', () => {
    			var 
					  list = ['one-1','two-1']
					, init = [ 
								  'test/deep-test/folder-test/one-1/two-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1'
								, 'test/deep-test/folder-test/one-1/two-1/three-1/four-1/five-1' 
							 ]
					;

				fsbox.set ( 'folders' , init )
				fsbox.keepFolderSteps ( list , { deep: [2] }, ( err, r ) => {
											expect ( err ).to.be.an ( 'array' )
											expect ( err ).to.have.length ( 1 )
											expect ( r   ).to.have.length ( 4 )
							    })
       }) // error deep



})  // describe


