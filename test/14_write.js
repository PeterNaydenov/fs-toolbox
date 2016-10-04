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
	  Write Description: 
    ================================================
	  
	 Assert folder existnace and write file(s).
	  - Expect that filenames == content
	  - If filenames > content, then last files will have no content
	  - If content > filenames, then not all of content will be written in files
	  - Argument 'options' is not in use

*/

describe ( 'write: Write file(s)', function () {
	var 
		  fs = require ( 'fs' )
		, folders
		;



	it ( 'Single file' , (done) => {
					   fsbox.set('files', 'test/deep-test/dir-test/ahoy/mala/may.txt')
					   fsbox.fileCacheAs ( 'write' )
					   fsbox.write ( 'hello from content', ( err, r ) => {
											expect ( err ).to.be.false
											done()
						     })
	    }) // it single file





	it ( 'Multiple files', ( done ) => {
					  var    files   = [
					  			  	       'test/deep-test/dir-test/ahoy/mala/may.txt'
					  			  	     , 'test/deep-test/dir-test/ahoy/mala/other.txt'
					  			       ]
					  	   , content = [
					  	   				    'hello from content'
					  	   				  , 'other content'
					  	   			   ]
					  			  ;
					  fsbox.set ( 'files' , files )
					  fsbox.fileCacheAs ( 'write' )
					  fsbox.write ( content , ( err , r ) => {
					  												done ()
					  		})
	}) // it multiple file





   it ( 'Overwrite files', ( done ) => {
					  var    files   = [
					  			  	       'test/deep-test/dir-test/ahoy/mala/may.txt'
					  			  	     , 'test/deep-test/dir-test/ahoy/mala/other.txt'
					  			       ]
					  	   , content = [
					  	   				    '2 hello from content'
					  	   				  , '2 other content'
					  	   			   ]
					  			  ;
					  fsbox.set ( 'files' , files )
					  fsbox.fileCacheAs ( 'write' )
					  fsbox.write (   content , ( err , r ) => done ()   )
	}) // it overwrite





    it ( 'Error handling: No filelist in cache' , () => {
    				fsbox.resetCache()
    				fsbox.write ( 'Test hamburger', ( err, r ) => {
    													expect ( err ).to.be.an('array')
    													expect ( r ).to.be.empty
    				     })
       }) // it no cache





    it ( 'Error handling: False instead filename' )





	after ( ( done ) => {
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
		  			 fs.unlink ( filename , () => resolve()   )
		  })
		  } // _deleteFile

		  function _remove ( list ) {
		  	var folder;
		  	if ( list.length == 0 ) return done()
		  	folder = list.pop()
		    fs.rmdir ( folder , ( err , r ) => _remove ( list )  )
		  } // _remove

	}) // after



})  // describe
