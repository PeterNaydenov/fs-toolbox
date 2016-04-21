'use strict'

var 
	  chai      = require ( 'chai' )
	, expect    = require ( 'chai' ).expect
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, fsbox     = require ( '../fs-toolbox')
	;

chai.use(sinonChai)



describe ( 'keep: Reduce list of files', function () {
	
	var scan;
	
	before ( (done) => {
					 var folder = 'test/deep-test'
					 fsbox.scan ( folder , ( err, r ) => {
					 			scan = r
					 			done()
					 })

					 fsbox.set('del',{ prefix:'-', suffix : '-' })
	       }) // before





	it ('By name', () => {
			var 
				  list = ['general', 'info']
				, str  = 'info'
				;

			fsbox.set ( 'files', scan )
			fsbox.keep ( list, { by : 'name' }, ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(2)
			     })

			fsbox.set ( 'files', scan )
			fsbox.keep ( str, { by : 'name' }, ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(1)
			     })
	    }) // it name
	




	it ('By extension', () => {
			var
				   get_txt    = ['txt']
				 , get_scss   = ['scss']
				 , get_both   = ['txt','scss']
				 , get_none   = []
				 , get_string = 'txt'
				 ;
			
			fsbox.set ( 'files', scan )
			fsbox.keep ( get_txt, { by : 'extension' } , ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(3)
					 		})
			
			fsbox.set ( 'files', scan )
			fsbox.keep ( get_scss, { by : 'ext' }, ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(6)
			                })

			fsbox.set ( 'files', scan )
			fsbox.keep ( get_both, { by : 'ext' }, ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(9)
			                })

			// error handling...
			fsbox.set ( 'files', scan )
			fsbox.keep ( get_none, { by : 'ext' }, ( err, r ) => {
										expect ( err ).to.be.an('array')
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(9)
			                })

			fsbox.set ( 'files', scan )
			fsbox.keep ( get_string, { by : 'ext' }, ( err, r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(3)
			                })
	     }) // it extension





	it ('By filename: name+extension', () => {
			var 
				  list = ['general.txt', 'info.txt']
				, str  = 'info.txt'
				;
			
			fsbox.set ( 'files', scan )
			fsbox.keep ( list , { by : 'filename' }, ( err , r ) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(2)
			     })

			fsbox.set ( 'files', scan )
			fsbox.keep ( str, { by : 'filename' }, ( err, r) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length(1)
			     })
	    }) // it filename





	it ('By file prefix (content key) ', () => {
			var select = ['gallery']

			fsbox.set ( 'files', scan )
			fsbox.keep ( select , { by : 'key' }, ( err , r) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length ( 3 )
			     })

			fsbox.set ( 'files', scan )
			fsbox.keep ( select , { by : 'prefix' }, ( err , r) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length ( 3 )
			     })
	   }) // it key





	it ('By file suffix', () => {
			var select = ['struct']

			fsbox.set ( 'files', scan )
			fsbox.keep ( select , { by : 'suffix' }, ( err , r) => {
										expect ( err ).to.be.false
										expect ( r   ).to.be.an('array')
										expect ( r   ).to.have.length ( 2 )
			     })
		}) // it suffix





    it ( 'Many callbacks functions.' , ( done ) => {

    	 var 
    	 		  list = ['info']
    	 		, opt = { by : 'key' }
    	 		, a
    	 		, b
    	 		;
	    
	     fsbox.set ( 'files', scan )
	     fsbox.keep ( list , opt, [ 
	    						   		 ( err, r ) => { a = true }
	    						 	   , ( err, r ) => { b = true }
	    						 	   , ( err, r ) => {
				    						 	  		  expect ( a ).to.be.true
				    						 	  		  expect ( b ).to.be.true
				    							  		  expect ( a ).to.equal(b)

				    						 	  		  expect( err ).to.be.false
				    						 	  		  expect(r).to.be.an('array')
				    						 	  		  done()
	    						               		   }
	    	                        ])
       })  // it many callbacks





	it ('Error handling', () => {

			fsbox.set ( 'files', scan )
			// wrong 'by' key
			fsbox.keep ( ['info'], { by : 'strange' }, ( err , r ) => {
									expect ( err ).to.be.an('array')
									expect ( err ).to.contain('Error: Option "by" is not defined or not correct. Please, check the documentation.')
									expect ( r ).to.have.length(9)
			   })

			fsbox.set ( 'files', scan )
			// missing 'options' argument
			fsbox.keep ( ['info'], ( err , r) => {
									expect ( err ).to.be.an('array')
									expect ( err ).to.contain ('Error: Wrong numbers or type of arguments. Please, check the documentation.')
									expect ( r ).to.have.length(9)
			             })
	   }) // it errors
})