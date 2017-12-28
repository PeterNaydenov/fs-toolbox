'use strict'

var 
	  chai      = require ( 'chai' )
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;

chai.use ( sinonChai )





describe ('scan: Scan for files', function () {

	it('Single folder scan.', (done) => {
	    var folder; 

	    folder = 'test/deep-test';
	    fsbox.scan ( folder , function ( err, r ) { 
												expect(err).to.be.false
												expect(r).to.be.a('array')
			 })

        folder = './test/deep-test';
	    fsbox.scan ( folder , ( err, r ) => { 
												expect(err).to.be.false
												expect(r).to.be.a('array')
												done()
			 })
	    }) // it single scan



	it ( 'Muptiple folder scan.' , function (done) {
		 var 
		 	  folderList_1 = [
			 					  'test/deep-test/branch'
			 					, 'test/deep-test/work/css/micro'
		 				     ]
		 	, folderList_2 = [
		 	 					  'test/deep-test/branch'
			 					, 'test/deep-test/work/css/micro'
			 					, 'test/deep-test/work/css'
		 					 ]
		 	;
		 	 
		 	 fsbox.scan ( folderList_1 , ( err, r ) => {
		 	 											 expect ( err ).to.be.false
		 	 											 expect ( r ).to.be.an('array')
		 	 											 expect ( r ).to.have.length(3)
		 	       })

		 	 fsbox.scan ( folderList_2, ( err , r ) => {
														 expect ( err ).to.be.false
														 expect ( r ).to.be.an('array')
														 expect ( r).to.have.length(7)	
		 	 											 done()
		 	       })
	   }) // it muptiple scans



	it ( 'Many callback functions.', ( done ) => {
		var folder = 'test/deep-test', a, b;
	    
	    fsbox.scan ( folder , [ 
	    						   ( err, r ) => { a=true }
	    						 , ( err, r ) => { b=true }
	    						 , ( err, r ) => {
				    						 	  expect(a).to.be.true
				    						 	  expect(b).to.be.true
				    						 	  expect(err).to.be.false
				    						 	  expect(r).to.be.an('array')
				    						 	  done()
	    						               }
	    	                  ])
	    }) // it callback array



	it ( 'Single scan reduced by deep-level restriction' , (done) => {
			var 
				   folder  = 'test/deep-test'
				 , options = {}
				 ;

				 options.deep = 0
				 fsbox.scan ( folder, options , function ( err, r ) {
				 				expect(err).to.be.false
				 				expect(r).to.be.an('array')
				 				expect(r).to.have.length(1)
				      }) // scan

				 options.deep = 1
				 fsbox.scan ( folder , options, function ( err, r) {
				 				expect(err).to.be.false
				 				expect(r).to.be.an('array')
				 				expect(r).to.have.length(3)
				      }) // scan

				 options.deep = 2
				 fsbox.scan ( folder, options , function ( err, r) {
				 				expect(err).to.be.false
				 				expect(r).to.be.an('array')
				 				expect(r).to.have.length(3)
				 				done()
				      }) // scan

	    }) // it deep level





	it ( 'Multiple scan reduced by deep-level restriction' , (done) => {
				var 
					   folderList_1 = [
				 	 				       'test/deep-test/branch'
					 				     , 'test/deep-test/work'
		 					          ]
					,  folderList_2 = [
				 	 				       'test/deep-test'
					 				     , 'test/deep-test/work/css/micro'
		 					          ]
					,  folderList_3 = [
				 	 				       'test/deep-test/work/css'
					 				     , 'test/deep-test/work/css/micro'
		 					          ]
		 			, options       = {}
		 			;

		 		options.deep = 0
		 		fsbox.scan ( folderList_1 , options, ( err, r) => {
		 															expect ( err ).to.be.false
		 															expect ( r ).to.be.an('array')
		 															expect ( r ).to.have.length(2)
		 		     })

		 		options.deep = 1
		 		fsbox.scan ( folderList_2, options , ( err, r ) => {
		 															  expect ( err ).to.be.false
		 															  expect ( r ).to.be.an('array')
		 															  expect ( r ).to.have.length(5)
		 		    })

		 		options.deep = 1
		 		fsbox.scan ( folderList_3 , options , ( err , r ) => {
		 																expect ( err ).to.be.false
		 																expect ( r ).to.be.an ( 'array' )
		 																expect ( r ).to.have.length(6)
		 															    done()
		 		    })
       }) // it multiple scan deep level





	it ( 'Multiple scan with diferent deep-level restrictions' , (done) => {
		var 
				   options    = {}
				,  folderList = [
				 	 		         'test/deep-test/branch'
					 		       , 'test/deep-test/work'
		 					    ]
		 		;

		 		options.deep = [ 3 , 1 ]
		 		fsbox.scan ( folderList , options , ( err , r ) => {
		 																expect ( err ).to.be.false
		 																expect ( r   ).to.be.an('array')
		 																expect ( r   ).to.have.length(2)
		 																done()
		 			  })
	   }) // it different deep level restrictions





	it ( 'Ignore folder names' , ( done ) => {
		var 
			  folder     = 'test/deep-test'
			, options    = {}
			, ignoreCSS  = ['css']
			, ignoreList = ['micro','branch']

			options.ignore = ignoreCSS
			fsbox.scan ( folder, options , function ( err, r ) {
																	expect ( err ).to.be.false                                                         // no error
																	expect ( r   ).to.be.an('array')                                                     // to have results
																	expect ( r   ).to.not.contain('test/deep-test/work')                                 // to not have folder names in result
																	expect ( r   ).to.contain('test/deep-test/branch/branchData.txt')
																	expect ( r   ).to.not.contain('test/deep-test/work/css/micro/gallery.scss')          // ignore content of ignored folders
			     }) // scan

			options.ignore = ignoreList
			fsbox.scan ( folder , options , function ( err, r) {
																	expect ( err ).to.be.false
																	expect ( r   ).to.be.an('array')
																	expect ( r   ).to.not.contain ( 'test/deep-test/branch/branchData.txt')
																	expect ( r   ).to.not.contain ( 'test/deep-test/work/css/micro/gallery.scss')         
																	expect ( r   ).to.contain     ( 'test/deep-test/work/css/special-2016/gallery-color.scss')
																	done()
			     }) // scan

	    }) // it ignore folders




    it ( 'Get files cache.', (done) => {
	    var folder; 

	    folder = 'test/deep-test';
	    fsbox.scan ( folder , function ( err, r ) { 
												
												let cache  = fsbox.get ( 'files' )
												let result = cache.every ( (item, id) => cache[id] == r[id] )
												expect ( result ).to.be.true
												done()
			 })
	    }) // it cache





	it ( 'Error handling: Single folder does not exist', ( done ) => {
		var folder = 'nothing';
		fsbox.scan ( folder, function ( err, r ) { 
													expect(err).to.be.an('array')
													expect(err).to.contain('No such folder as [nothing]')
													expect(r).to.be.an('array')
													expect(r).to.be.empty
													done()
						})
	   }) // it error : Folder not exists





	it ( 'Error handling: Multiple folder does not exist', ( done ) => {
		var folder = [
						  'nothing'
						, 'nothing-2'
					 ];

		fsbox.scan ( folder, function ( err, r ) { 
													expect(err).to.be.an('array')
													expect(err).to.have.length(2)
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
  			  fsbox.scan ( folders , options , ( err, r ) => {
  			  									expect ( err ).to.be.an('array')
  			  									expect ( r ).to.be.an ( 'array' )
  			  									expect ( r ).to.be.empty
  			  									done()
  			      })
     }) // it error: Different sizes





	it ( 'Error handling: Different sizes of folder array and deep array. Folder < Deep.' , ( done ) => {
  			  var
  			  		  folders = [
   				        			  'test/deep-test/work'
  			  		            ]
  			  		, deep    = [ 0, 1 ]
  			  		, options = {}
  			  		;

  			  options.deep = deep
  			  fsbox.scan ( folders , options , ( err, r ) => {
  			  									expect ( err ).to.be.false
  			  									expect ( r ).to.be.an ( 'array' )
  			  									expect ( r ).to.have.length ( 1 )
  			  									done()
  			      })
     }) // it error: Different sizes
}) // describe







