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
	  ReduceFolderSteps Description: 
    ================================================
	  
	 Execute sequence of 'reduceFolder' function with each of list members.

*/

describe ( 'reduceFolderSteps: Sequence of "reduceFolders"', function () {
	var folders;
	


	before ( ( done ) => {
			fsbox.scanFolders ( 'test/deep-test', ( err , r ) => {
																	folders = r
																	done()
			     })
	   }) // before





	it ( 'default', () => {
						fsbox.reduceFolderSteps ( ['one-1', 'two-1'] , ( err , r) => {
											expect ( err ).to.be.false
											expect ( r ).to.have.length ( 4 )
						     })
	   }) // it default
	




	it ( 'aliase', () => {
						fsbox.reduceFoldersSteps ( ['one-1', 'two-1'] , ( err , r) => {
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
						fsbox.reduceFolderSteps ( list , { deep: 1 }, ( err, r ) => {
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
				fsbox.reduceFolderSteps ( list , { deep: [2,99] }, ( err, r ) => {
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
				fsbox.reduceFolderSteps ( list , { deep: [2] }, ( err, r ) => {
											expect ( err ).to.be.an ( 'array' )
											expect ( err ).to.have.length ( 1 )
											expect ( r   ).to.have.length ( 4 )
							    })
       }) // error deep



})  // describe


