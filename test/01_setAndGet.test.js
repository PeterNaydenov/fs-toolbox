'use strict'

var 
	  chai      = require ( 'chai' )
	, sinon     = require ( 'sinon' )
	, sinonChai = require ( 'sinon-chai')
	, expect    = chai.expect
	, fsbox     = require ( '../src/fs-toolbox')
	;

chai.use ( sinonChai )

/*
	  Set & Get - Description: 
    ================================================
	  
	  Set: 
	       - Change content of 'cache.files' and 'cache.folders'. 
	       - Change files delimiters used for separate prefixes 
	         and suffixes in a filename.

	  Get: 
	       - Returns value of 'cache.files' and 'cache.folders'. 
	       - Returns delimiter values.
	  
*/

describe ( 'set & get: Controls cache and filename delimiters', function () {



	it ( 'Cache files::string' , () => {
			var 
			      file = 'string.txt'
			    , result 
			    ;
			
			fsbox.set ( 'file' , file )
			result = fsbox.get ('file')

			expect ( result ).to.be.an('array')
			expect ( result ).to.have.length(1)
			expect ( result[0] ).to.equal ( file )
	   }) // it files string
	



    
    it ( 'Cache files::set string twice' )





	it ( 'Cache.files::array', () => {
			var 
			      file = ['string.txt']
			    , result
			    , result_2
			    , value_check
			    ;
			
			fsbox.set ( 'files' , file )
			result = fsbox.get ('files')
			
			value_check = result.every ( ( el, i ) => result[i]==file[i]   )

			file = [ 'wrong.txt' ]
			result_2 = fsbox.get ( 'files' )

			expect ( result ).to.be.an('array')
			expect ( result ).to.have.length(1)
			expect ( result ).to.not.equal ( file )

			expect ( result_2 ).to.not.contain('wrong.txt')

			expect ( value_check ).to.be.true
		})  // it files array
	




    it ( 'Cache.files:: array twice' )
    // Set files. Then set again files with array





	it ( 'Cache.folders::string', () => {
			var 
			      file = 'test/deep-test'
			    , result 
			    ;
			
			fsbox.set ( 'folder' , file )
			result = fsbox.get ('folder')

			expect ( result ).to.be.an('array')
			expect ( result ).to.have.length(1)
			expect ( result[0] ).to.equal ( file )
	    }) // it folders string
	




	it ( 'Cache.folders::array', () => { 
			var 
			      folder = [
			      				  'test/deep-test'
			      				, 'test/deep-test/folder-test'
			      		   ]
			    , result
			    , result_2
			    , value_check
			    ;
			
			fsbox.set ( 'folders' , folder )
			result = fsbox.get ('folders')
			
			value_check = result.every ( ( el, i ) => result[i] == folder[i]   )

			folder[0]='what/is/this'
			result_2 = fsbox.get('folders')

			expect ( result ).to.have.length(2)
			expect ( result ).to.not.equal ( folder )

			expect ( result_2 ).to.not.contain('what/is/this')
			
			expect ( value_check ).to.be.true
	   }) // it folders array





	it ( 'Reset cache', () => {
    					var 
    						   files
    						 , files_reset
    						 , folders
    						 , folders_reset
    						 ;

    					fsbox.set ( 'files',    ['test/deep-test/cache.txt'] )
    					fsbox.set ( 'folders' , ['test/deep-test']           )

    					files   = fsbox.get ( 'files'   )
    					folders = fsbox.get ( 'folders' )

    					fsbox.resetCache()

    					files_reset   = fsbox.get ( 'files'   )
    					folders_reset = fsbox.get ( 'folders' )

    					expect ( files ).to.be.an('array')
    					expect ( files ).to.have.length(1)
    					
    					expect ( folders ).to.be.an('array')
    					expect ( folders ).to.have.length(1)

    					expect ( files_reset   ).to.have.length(0)
    					expect ( folders_reset ).to.have.length(0)

       }) // it reset	





	it ( 'delimiters' , () => {
				var
				 	  del = {
				 	 		     prefix : '_'
				 	 		   , suffix : '+'
				 	        }
				 	, before
				 	, after
				 	;

				before = fsbox.get ( 'del' )

				fsbox.set ( 'delimiters', del )
				after = fsbox.get ( 'del' )

				expect ( before.prefix ).to.equal('-')
				expect ( before.suffix ).to.equal('-')

				expect ( after.prefix ).to.equal('_')
				expect ( after.suffix ).to.equal('+')

	   }) // it delimiters





	it ( 'Error handling: Wrong data format', () => {
				var
					   num = 1 				  // number values are not valid
					 , obj = { custom : 12 }  // object must have prefix and suffix
					 , arr = [ {else:false} ] // array should contain only strings
					 , result
					 ;

				result = fsbox.set ( 'files', num )
				expect ( result ).to.be.false

				result = fsbox.set ( 'files', obj )
				expect ( result ).to.be.false

				result = fsbox.set ( 'files', arr )
				expect ( result ).to.be.false
	   }) // it wrong data


	 after ( () => {
	 					fsbox.set('del', { prefix: '-', suffix:'-' })
	       })



})  // describe
