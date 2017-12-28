'use strict'

var 
	  chai          = require ( 'chai' )
	, sinon         = require ( 'sinon'           )
	, sinonChai     = require ( 'sinon-chai'      )
	, expect        = chai.expect
	, askForPromise = require ( 'ask-for-promise' )
	, fsbox         = require ( '../src/fs-toolbox'   )
	;

chai.use ( sinonChai )

/*
	  Read Description: 
    ================================================
	  
	 Read and write files with different encoding - 'binary' or 'utf8'.
	 Decode to string for manipulate result.
	 TODO: write buffer?

*/






describe ( 'Encoding', function () {
	var 
		  fs = require ( 'fs' )
		, folders
		;



beforeEach ( done => 
fsbox.emptyFolder ( 'test/encoding-test/out', () => done()   
	  ))

it ( 'Read and write binary file' , done => {
		   let 
		        folder         = [ 'test/encoding-test/in' ]
		      , haveList    = askForPromise ()
		      , wasWritten  = askForPromise ()
		   	  ;


		   fsbox.scan   ( folder, (err,list) => haveList.done ( list )   )
		   haveList
		      .onComplete ( l => {
		    						let choosen =  _extract ( l, 'jpg' );

		    						fsbox.resetCache ()
		    						fsbox.set ( 'files', choosen.name )
		    						fsbox.fileCacheAs ( 'write' )
		    						
		    						fsbox.set  ( 'file', l[choosen.ID] )
		    						fsbox.read ( (content, i) => fsbox.write ( content, () => wasWritten.done() )   )
		             })

		    wasWritten
		       .onComplete ( () => { 
		       						  fsbox.resetCache ()
		       						  fsbox.scan ( 'test/encoding-test/out', (err,r ) => {
		       						  					fsbox.keep ( 'jpg', { by : 'extension' }, (err,r)=> { 
		       						  						                expect(r).to.be.an('array')
		       						  						                expect(r).to.have.length (1)
		       						  							            done ()
		       						  					     })
		       						  		})
		             })
	}) // it read binary file





it ( 'Decode buffer', done => {
			   let 
			        folder         = [ 'test/encoding-test/in' ]
			      , haveList    = askForPromise ()
			   	  ;
			   
			   fsbox.scan   ( folder, (err,list) => haveList.done ( list )   )
			   
			   haveList
			    .onComplete ( l => {
			    					  let choosen = _extract ( l, 'js' )

			    					  fsbox.resetCache ()
			    					  fsbox.set ( 'file', l[choosen.ID]  )
			    					  fsbox.read ( (content,i) => {
																		 let js = fsbox.decode ( content )
																		 expect (js).to.be.a ( 'string' )
																		 done ()
			    					       })
			             })
    }) // it decode buffer





it ( 'Decode string' , () => {
				let result = fsbox.decode ( 'test string' )
				expect ( result ).to.be.a ( 'string' )
				expect ( result ).to.be.equal ( 'test string' )
      }) // it decode 





it ( 'JS object content-> Convert to JSON' )





it ( 'Write string to file', done => {
						let 
							   wasWritten = askForPromise ()
							 , filename   = 'test/encoding-test/out/outside.txt'
							 ;

						fsbox.resetCache ()
						fsbox.set ( 'file' , filename   )
						fsbox.fileCacheAs ( 'write' )
						fsbox.write ( 'outside text is here. Bam!', () => wasWritten.done ()   )

						wasWritten
						 .onComplete ( () => {
						  // * Check if written. Scan,filter, compare
						 						fsbox.resetCache ()
						 						fsbox.scan ( 'test/encoding-test/out', (err,r) => {
						 										fsbox.keep ('outside', {by:'name'}, ( err,r ) => {
						 												   let result = ( filename == r[0] ) ? true : false;
						 												   expect ( result ).to.be.true
						 												   done ()
						 										     })				
						 						       })
						       })
   }) // it write string to file







it ( 'Copy mixed files' , function (done ) {
						let
						      filesIN
						    , filesOUT
						    , haveList   = askForPromise ()
						    , wasWritten = askForPromise ()
				   			, buffers
						    ;
						


						fsbox.resetCache ()
						fsbox.scan ( 'test/encoding-test/in', ( err, r ) => {
																filesIN  = r
																filesOUT = r.map ( fl => fl.replace('/in','/out')   )
																buffers  = new Array ( filesOUT.length )
																haveList.done ()
						     })

						haveList
						   .onComplete ( () => {
						   	// * Read and write operations
						   				 let haveCopy  = askForPromise ( filesOUT );


				   				         fsbox.set ( 'files', filesOUT )
				   				         fsbox.fileCacheAs ( 'write' )

						   				 fsbox.set ( 'files', filesIN )

						   				 fsbox.read  ( (content, i) => 
						   				 fsbox.write ( content , { number:i }, () => wasWritten.done ()
						   				 	  ))
						         })

						wasWritten
						  .onComplete ( () => {
						  						fsbox.resetCache ()
						  						fsbox.scan ( 'test/encoding-test/out', (err,r) => {
						  									   expect(r).have.length(14)
						  						 	           done ()
						  					 	     })
						        })
     }) // it copy files



})  // describe




















function _extract ( l , extension ) {
									let choosen = {};

									l.every ( (el,i) => {
															let ext = el.split ('.').pop ()
															if ( ext == extension ) {
																				    choosen.ID   = i
																				    choosen.name = el.replace ( '/in', '/out' )
																				    return false
																 }
															return true
										      })

									return choosen
} // _extract func.










