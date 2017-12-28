'use strict'

var 
	  chai      = require ( 'chai' )
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;

chai.use ( sinonChai )



describe ( 'scanFolders: Scan for Folder names', function () {	
	


	it ( 'Scan for folders' , (done) => {
				
				var folder = 'test/deep-test/work';
				
				fsbox.scanFolders ( folder , ( err , r) => {
															 expect ( err ).to.be.false
															 expect ( r ).to.be.an('array')
															 expect ( r ).to.have.length(3)
															 done()
					})
	    }) // it scan for folders





	it ( 'Scan for folders with option: Deep level 0' , ( done ) => {
				var
					   folder  = 'test/deep-test/folder-test'
					 , options = {}
					 ;

				
				options.deep = 0
				fsbox.scanFolders ( folder , options, ( err, r ) => {
															 expect ( err ).to.be.false
															 expect ( r ).to.be.an('array')
															 expect ( r ).to.have.length(3)
															 done()
				     })
	    })  // it scan deep 0
	




	it ( 'Scan for folders with option: Deep level 1' , ( done ) => {
			   var
			    	  folder = 'test/deep-test/folder-test'
			    	, options = {}
			    	;

			   options.deep = 1
			   fsbox.scanFolders ( folder , options , ( err , r ) => {
			   												 expect ( err ).to.be.false
			   												 expect ( r ).to.be.an('array')
			   												 expect ( r ).to.have.length(8)
			   												 done()
			        })
	   }) // it scan deep 1
	




	it ( 'Ignore folder names' , ( done) => {
				var
					   folder  = 'test/deep-test/folder-test'
					 , options = {}
					 , ignore  = ['one-1' , 'one-2']

					 options.ignore = ignore
					 fsbox.scanFolders ( folder , options, ( err , r) => {
					 									 expect ( err ).to.be.false
					 									 expect ( r   ).to.be.an('array')
					 									 expect ( r   ).to.have.length(3)
					 									 done()
					    })
	  }) // it ignore folder names





	it ( 'Mixed ignore and deep::number', ( done ) => {
				 var
				        folder  = [ 
				        			  'test/deep-test/folder-test/one-1'
				        			, 'test/deep-test/folder-test'
				        		  ]
				      , options = {}
				      , ignore  = ['one-2']
				      ;

				 options.ignore = ignore
				 options.deep   = 2
				 fsbox.scanFolders ( folder , options , ( err , r ) => {
				 										expect ( err ).to.be.false
				 										expect ( r   ).to.be.an('array')
				 										expect ( r   ).to.not.contain ('test/deep-test/folder-test/one-1/two-1/three-1/four-1/five-1')
				 										expect ( r   ).to.not.contain ('test/deep-test/folder-test/one-2')
				 										done()
				    }) 

	   }) // it mix ignore + deep
	




	it ( 'Mixed ignore and deep::array', ( done ) => {
				 var
				        folder  = [ 
				        			  'test/deep-test/folder-test/one-1'
				        			, 'test/deep-test/folder-test'
				        			, 'test/deep-test/folder-test/one-1/two-1/three-1'
				        		  ]
				      , options = {}
				      , ignore  = ['one-2']
				      , deep    = [ 0, 1000, 1000]
				      ;

				options.deep = deep
				options.ignore = ignore
				
				fsbox.scanFolders ( folder , options , ( err , r ) => {
												 expect ( err ).to.be.false
												 expect ( r   ).to.be.an('array')
												 expect ( r ).to.contain ( 'test/deep-test/folder-test/one-1/two-1/three-1/four-1/five-1' )
												 expect ( r ).to.not.contain ( 'test/deep-test/folder-test/one-1/two-1/three-1/' )
												 expect ( r ).to.not.contain ( 'test/deep-test/folder-test/one-2' )
				 								 done()
				    })
	   }) // it mix ignore + deep





  it ( 'Error handling. Error if folder does not exist', ( done ) => {
			var folder = 'nothing';
			fsbox.scanFolders ( folder, function ( err, r ) { 
												 expect(err).to.be.a('array')
												 expect(err).to.contain('No such folder as [nothing]')
												 expect(r).to.be.an('array')
												 expect(r).to.be.empty
												 done()
						})
	   }) // it error : Folder not exists





  it ( 'Error handling: Different sizes of folder array and deep array. Folder > Deep.' , ( done ) => {
  			  var
  			  		  folders = [
   				        			  'test/deep-test/folder-test/one-1'
				        			, 'test/deep-test/folder-test'
				        			, 'test/deep-test/folder-test/one-1/two-1/three-1'
  			  		            ]
  			  		, deep    = [ 1, 0 ]
  			  		, options = {}
  			  		;

  			  options.deep = deep
  			  fsbox.scanFolders ( folders , options , ( err, r ) => {
  			  									expect ( err ).to.be.an('array')
  			  									expect ( r ).to.be.an ( 'array' )
  			  									expect ( r ).to.be.empty
  			  									done()
  			      })
     }) // it error different sizes





  it ( 'Error handling: Different sizes of folder array and deep array. Folder < Deep.' , ( done ) => {
  			  var
  			  		  folders = [
   				        			  'test/deep-test/folder-test/one-1'
  			  		            ]
  			  		, deep    = [ 0, 1 , 12 ]
  			  		, options = {}
  			  		;

  			  options.deep = deep
  			  fsbox.scanFolders ( folders , options , ( err, r ) => {
  			  									expect ( err ).to.be.false
  			  									expect ( r ).to.be.an ( 'array' )
  			  									expect ( r ).to.have.length ( 3 )
  			  									done()
  			      })
     }) // it error different sizes





}) // describe





