'use strict'

var 
	  chai          = require ( 'chai' )
	, sinon         = require ( 'sinon'           )
	, sinonChai     = require ( 'sinon-chai'      )
	, expect        = chai.expect
	, askForPromise = require ( 'ask-for-promise'   )
	, fsbox         = require ( '../src/fs-toolbox' )
	;

chai.use ( sinonChai )

/*
	  Read Description: 
    ================================================
	  
	 Assert folder existnace and write file(s).
	  - Expect that filenames == content
	  - If filenames > content, then last files will have no content
	  - If content > filenames, then not all of content will be written in files
	  - Argument 'options' is not in use

*/

describe ( 'read: Read files(s)', function () {
	var 
		  fs = require ( 'fs' )
		, folders
		;



it ( 'Single file' , (done) => {
					   let list         = [ 'test/deep-test/general.txt' ]
					   let getContent   = askForPromise ()
					   
					   fsbox.set  ( 'files', list )
					   fsbox.read ( (content,i) => {
													 let str = fsbox.decode ( content )
													 getContent.done ( str )
					         })

					   getContent.promise.then ( (results) => {
			   													  expect ( results ).to.be.an('string')
			   													  done()  
					   		 })
	    }) // it single file





it ( 'Multiple files', ( done ) => {
					  var    list   = [
					  			  	       'test/deep-test/general.txt'
					  			  	     , 'test/deep-test/work/info.txt'
					  			       ]
					  			  ;
					   let getContent   = list.map ( file => askForPromise() )
					   let readPromises = getContent.map ( o => o.promise )
					   
					   fsbox.set  ( 'files', list )
					   fsbox.read ( (content,i) => {   
					   									let str = fsbox.decode ( content )
					   									getContent[i].done ( str )   
					   				 })

					   Promise.all ( readPromises ).then ( (results) => {
					   													  expect ( results ).to.be.an('array')
					   													  expect ( results ).to.have.length(2)
					   													  expect ( results[0]).to.be.equal('Read from ‘deep-test/general.txt’.')
					   													  done()  
					   		 })
	}) // it multiple file





it ( 'No arguments', () => {
					  var    list   = [
					  			  	       'test/deep-test/general.txt'
					  			  	     , 'test/deep-test/work/work/info.txt'
					  			       ];
					  fsbox.set ( 'files', list )
					  let result = fsbox.read()
					  expect ( result ).to.be.an ( 'array' )
					  expect ( result[1] ).to.be.false
   }) // it no arguments





it ( 'Error Handling: Wrong filename', ( done ) => {
					  var    list   = [
					  			  	       'test/deep-test/general.txt'
					  			  	     , 'test/deep-test/work/work/work/info.txt'
					  			       ]
					  			  ;
					   let getContent   = list.map ( file => askForPromise() )
					   let readPromises = getContent.map ( o => o.promise )
					   
					   fsbox.set  ( 'files', list )
					   fsbox.read ( (content,i) => {
													 getContent[i].done ( content )
					         })

					   Promise.all ( readPromises ).then ( (results) => {
					   													  expect ( results ).to.be.an('array')
					   													  expect ( results ).to.have.length(2)
					   													  expect ( results[1]).to.be.false
					   													  done()  
					   		 })
	}) // it multiple file






})  // describe
