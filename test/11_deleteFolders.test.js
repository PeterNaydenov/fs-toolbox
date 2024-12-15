'use strict'

import { expect } from 'chai'
import fsbox from '../src/fs-toolbox.js'


	
/*
	  DeleteFolders Description: 
    ================================================
	  
	 Delete all folder-paths in cache

*/

describe ( 'deleteFolders: Delete all folder-paths in cache.', function () {
	var 
		  fs = import ( 'fs' )
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





   it ( 'Standard behavior', ( done ) => {
		  var 
		       files   = [
		  			          'test/deep-test/dir-test/empty/fold/may.txt'
					  		, 'test/deep-test/dir-test/empty/fold/other.txt'
		  			     ]
		  	  , folder = 'test/deep-test/dir-test/empty/fold'
		  	  ;

		  fsbox.set ( 'files', files )
		  fsbox.delete ( () => {
		  						  fsbox.deleteFolder ( ( err, r ) => {
		  						  			expect(err).to.be.false
		  						  			expect(r).to.be.empty
		  						  			done()
		  						       })
		        })

	   }) // it standard





   it ( 'Error handling: Content available', ( done ) => {
   					    var 
					       files   = [
					  			       'test/deep-test/dir-test/empty/fold/may.txt'
					  			     ]
					  	  , folder = [
					  	  				  'test/deep-test/dir-test/empty/fold'
					  	  				, 'test/deep-test/dir-test/empty'
					  	  			 ]
					  	  ;
			
					  fsbox.set ( 'file',   files  )
					  fsbox.set ( 'folder', folder )
					  
					  fsbox.delete ( () => {
					  						  fsbox.deleteFolder ( ( err, r ) => {
					  						  			expect( err ).to.be.an('array')
					  						  			expect( err ).to.have.length(2)
					  						  			expect( r   ).to.have.length(2)
					  						  			done()
					  						       })
					        })
      }) // non existing file





   after ( ( done ) => {
   					var folder = 'test/deep-test/dir-test'
   					fsbox.emptyFolder ( folder , () => done() )
      }) // after





})  // describe
