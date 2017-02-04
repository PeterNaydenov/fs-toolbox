/*
	FS-Toolbox

	Version: 3.1.1
	GitHub: https://github.com/PeterNaydenov/fs-toolbox
	Copyright (c) 2016 Peter Naydenov
	Licensed under the MIT license.

*/

'use strict'

const
	    error_msg = {   // Error message strings
		 				    'wrong argument numbers' : 'Error: Wrong numbers or type of arguments. Please, check the documentation.'
		 				  , 'wrong by'               : 'Error: Option "by" is not defined or not correct. Please, check the documentation.'
		 				  , 'no selection'           : 'Error: No selection specified. Provide reduce criteria.'
		 				  , 'wrong deep level'       : 'Error: Deep level is an array and size is different from folder array.'
		 				  , 'cache.files empty'      : 'Error: File cache is empty. Please, fulfil files cache by using "set" or "scan" methods.'
		 				  , 'cache.write empty'      : 'Error: Cache.write is empty.'
		 				  , 'not empty'              : 'Error: Folder is not empty: '
	                }
	 ;

var	
	   fs            = require ( 'fs' )
	 , askForPromise = require ('ask-for-promise')
	 , cache         = {}
	 , writeLocation = []  // Get buffer 'write' content until all write operations are complete
	 , writeCounter  = 0   // How many records before write callback
	 , del           = {   // Delimiter symbols for files prefixes and suffixes
		 			      prefix : '-'
		 			    , suffix : '-'
	 		          }
	 ;

     cache.folders = []   // Placeholder for folders
     cache.files   = []   // Placeholder for files
     cache.read    = []   // Placeholder for files - reading operations
     cache.write   = []   // Placeholder for files - writing operations





var toolbox = {

model : function () {
  // * Standard function model
	return {
			       error     : false
    	         , errorList : []      // Contain all error messages
    	         , list      : []      // Agregate results
    	         , set       : {}      // Contain function arguments
   		   }
 } // model func.

, scanner : function () {
 // * Default scanner object. Used by scanFiles and scanFolders functions
 	return {
			             error     : false
    	               , errorList : []      // Contain all error messages
    	               , list      : []      // Agregate results
    	               , set       : {}
			    	   , scannedFolders    : []      // Prevention of folder double scan
		    	       , foldersDeep       : []      // Deep level scan for every folder
		    	       , deep              : 10000   // Default deep level if not specified
		    	       , ignore_subfolders : []
 					}
   } // scanner func.










, scanFiles : function scanFiles () {
  // * Collect file paths
  	let m = toolbox.scanner()
  	m.afterWalk = toolbox._triggerCallbacks
    m.set = toolbox._argSetup.apply ( this, arguments )

    toolbox._scanSetup.call ( m )
	if ( m.error ) toolbox._walkFiles.call ( m, [] , [] )
    else           toolbox._walkFiles.call ( m, m.set.list , m.foldersDeep )
 
  }   // scanFiles func.










, scanFolders : function scanFolders () {
  // * Collect folder paths
  	  let m = toolbox.scanner()
  	  m.afterWalk = toolbox._triggerCallbacks
      
      m.set = toolbox._argSetup.apply ( this , arguments )
      toolbox._scanSetup.call ( m )
 	  if ( m.error )  toolbox._walkFolders.call ( m,[],[])
      else            toolbox._walkFolders.call ( m, m.set.list , m.foldersDeep )

  }  // scanFolders func.










, get : function get ( askfor ) { 
  // * Returns cache values or filename delimiters
	  var value;
	  switch ( askfor ) {
				  			case 'file'       :
				  			case 'files'      :
												value = JSON.stringify ( cache.files )
												break
							case 'folder'     : 
							case 'folders'    : 
											    value = JSON.stringify ( cache.folders )
											    break
						    case 'read'       :
						    					value = JSON.stringify ( cache.read )
						    					break
						    case 'write'      :
						    					value = JSON.stringify ( cache.write )
						    					break
						    case 'del'        :
						    case 'delimiters' :
						    					value = JSON.stringify ( del )
						    					break
						   	default           :
						   						return false
	        }

	  return  JSON.parse ( value )

   } // get func.










, set : function set ( set, d ) {
  // * Set cache values or filename delimiters
		var 
			   value
			 , data_type
			 , error = false
			 ;
		
		if ( arguments.length < 2 ) return false
		if ( d == undefined       ) return false
		
		// Define data type of input 'd'
		if ( d instanceof Array   ) data_type = 'array'
		if ( typeof d == 'string' ) data_type = 'string'

		// Validate data input 'd'
		switch ( data_type ) {
				 case 'array'  :
				 					d = JSON.parse ( JSON.stringify(d)   )
				 					let strings = d.every ( el => typeof el == 'string' )
				 					if ( !strings ) error = true
				 					break
				 case 'string' :
				 					d = [d]
				 					break
				       default :
				       				if ( !d.prefix ) error = true
				       				if ( !d.suffix ) error = true
				       				d = JSON.parse ( JSON.stringify(d)   )
			 }  // switch data_type
		if ( error ) return false
		else         value = d

		// Set data
		switch ( set ) {
			   case 'file'       :
			   case 'files'      :
							  	    cache.files = value
						  		    return true
			   case 'folder'     :
			   case 'folders'    :
						  		    cache.folders = value
			   					    return true
			   case 'del'        :
			   case 'delimiters' :
			   					    del = value
			   					    return true
			   default           :
			   		   			    return false
		} // switch set
  } // set func.










, resetCache : function resetCache ( cacheName ) {
						
						if ( !cacheName ) {
											cache.files   = []
											cache.folders = []
											cache.read    = []
											cache.write   = []
											writeCounter  = 0
						   }
						else                cache [ cacheName ] = []

						if ( cacheName == 'write' ) writeCounter = 0
   } // resetCache func.





, specifyCache : function specifyCache ( aim ) { 
	// * Moves file cache to 'read' or 'write' cache.
			cache [ aim     ] = cache['files']
			cache [ 'files' ] = []

			if ( aim == 'write' ) {
										writeLocation = toolbox.get ( 'write' )
										writeCounter  = writeLocation.length
				}
   } // specifyCache func.









, _argSetup : function _argSetup () {
  // * Find arguments and arrange them in object. Used by 'model.set'
	var 
		  a         = arguments
		, proto     = Array.prototype
		, cb, fl, opt
		;

	cb   = proto.pop.call(a)
	fl   = ( a.length > 0 ) ? proto.shift.call(a) : []
	opt  = ( a.length > 0 ) ? proto.pop.call(a)   : {}

	if ( Buffer.isBuffer(fl)     ) fl = [ fl ]
	if ( typeof fl == 'string'   ) fl = [ fl ]
	if ( typeof cb == 'function' ) cb = [ cb ]
	
	return { 
			    list         : fl
			  , options      : opt
			  , callbackList : cb 
	       }
		
 } // _argSetup func.




















, _scanSetup : function _scanSetup ( ) {
  // * Prepare and normalize scanner object.
	var 
		  set  = this.set
		, noNaN
		;

    this.ignore_subfolders  = set.options.hasOwnProperty('ignore') ? set.options.ignore : false
	this.deep               = set.options.hasOwnProperty('deep'  ) ? set.options.deep   : this.deep
	
	this.foldersDeep = ( this.deep instanceof Array ) ? set.list.map ( (el,i) => el.split('/').length + this.deep[i] ) 
										              : set.list.map (  el    => el.split('/').length + this.deep    )
	
	noNaN = this.foldersDeep.every ( v => isNaN(v) == false )
	if ( !noNaN ) {
						this.error = true;
						this.errorList.push ( error_msg['wrong deep level'] )
				}
  } // _scanSetup func.










, _triggerCallbacks : function _triggerCallbacks ( type ) {
  // * Apply callback functions after function execution.
	   var  error = this.error;

	   if ( error )   error = this.errorList
	   this.set.callbackList.forEach ( fnName => fnName ( error,  cache[type] )   )
 } // _triggerCallbacks func.




















, _walkFiles : function _walkFiles ( foldersToScan , foldersDeep ) {
  // * Collect file paths
    var 
  	      me = this
  	    , folder
 		, deep
 		, path = require ('path')
  	    ;

  	if ( foldersToScan.length == 0 ) {
  										toolbox.set ('files', me.list )
  									    return me.afterWalk ( 'files' )
  									 }

  	folder = foldersToScan.shift()
  	deep   = foldersDeep.shift()

  	let  notMatch  = me.scannedFolders.every ( sl => sl!=folder )
  	if ( notMatch )  me.scannedFolders.push ( folder )
  	else 			 return toolbox._walkFiles.call ( me, foldersToScan, foldersDeep )
					
  	
  	
 

  	fs.readdir ( folder , (err, raw ) => {
  		   if ( err ) {
  		   				 me.error = true
  		   				 me.errorList.push ( 'No such folder as [' + folder + ']' )
  		   			  }

  		   if ( !me.error ) {
  		   raw.reduce ( ( files , rawEl ) => {
  									let fname = folder + path.sep + rawEl
  									
  									// if folders
  									let stats = fs.lstatSync ( fname )
  									if ( stats.isDirectory() ) {
  																 let resume  = true;
  																 let howDeep = fname.split('/').length-1;
  																 if ( howDeep >= deep ) resume = false
  																 
  																 if ( resume && me.ignore_subfolders ) {
  																 			let dontIgnore = me.ignore_subfolders.every ( f => f != rawEl )
  																 			if ( !dontIgnore ) resume = false
  																 	  }
  																 
			  													// scan subfolders for files. Prevent double scan
			  													if ( resume ) {
			  																	let notMatch = me.scannedFolders.every ( sf => sf!=fname )
			  																	if ( notMatch ) {
			  																						foldersToScan.push  ( fname )
			  																						foldersDeep.push    ( deep )
			  																					}
			  													   }
  									     } // if directory
  									else {
							  									// ignore hidden files
							  									let  dot = rawEl.slice(0,1)
							  									if ( dot != '.' ) {
							  													    files.push   ( fname )
							  													    me.list.push ( fname )
							  									     			 }
  									     } // else directory
  									return files
  		        },[]) // raw.reduce
  		        } // !errror
  				toolbox._walkFiles.call ( me, foldersToScan, foldersDeep )
    }) // readdir
 } // _walkFiles func.




















, _walkFolders : function _walkFolders ( foldersToScan , foldersDeep ) {
  // * Collect folder paths
    var 
  	      me = this
  	    , folder
 		, deep
 		, path = require ('path')
  	    ;

  	if ( foldersToScan.length == 0 ) {
  									    toolbox.set  ( 'folders', me.list )
  									    me.afterWalk ( 'folders' )
  									    return
  									 }

  	folder = foldersToScan.shift()
  	deep   = foldersDeep.shift()

  	let  notMatch  = me.scannedFolders.every ( sl => sl!=folder )
  	if ( notMatch )  me.scannedFolders.push ( folder )
  	else {
					toolbox._walkFolders.call ( me, foldersToScan, foldersDeep )
					return
  	    }
  	
 

  	fs.readdir ( folder , (err, raw ) => {
  		   if ( err ) {
  		   				 me.error = true
  		   				 me.errorList.push ( 'No such folder as [' + folder + ']' )
  		   			  }

  		   if ( !me.error ) {
  		   raw.reduce ( ( files , rawEl ) => {
  									let fname = folder + path.sep + rawEl
  									
  									// if folders
  									let stats = fs.lstatSync ( fname )
  									if ( stats.isDirectory() ) {
  																 let resume = true;
		  													     
  																 if ( me.ignore_subfolders ) {
  																 			let dontIgnore = me.ignore_subfolders.every ( f => f != rawEl )
  																 			if ( !dontIgnore ) resume = false
  																 	  }

  																 if ( resume ) {
						  													     // Add folders to list
						  													     files.push   ( fname )
						  													     me.list.push ( fname )
				  																 // Check how deep is the scanned item
				  																 let howDeep = fname.split('/').length-1;
				  																 if ( howDeep >= deep ) resume = false
  																    }
  																 
  																 
			  													// scan subfolders for folders. Prevent double scan
			  													if ( resume ) {
			  																	let notMatch = me.scannedFolders.every ( sf => sf!=fname )
			  																	if ( notMatch ) {
			  																						foldersToScan.push  ( fname )
			  																						foldersDeep.push    ( deep )
			  																					}
			  													   }
  									     } // if directory
  								      return files
  		        },[]) // raw.reduce
  		        } // !errror
  	    toolbox._walkFolders.call ( me, foldersToScan, foldersDeep )
    }) // readdir
 } // _walkFolders func.

















, encode : function ( data ) {   // * Encode 'utf8' string to buffer
	         if ( typeof data == 'object' ) return new Buffer ( JSON.stringify(data, null, 4), 'utf8' )
	         							    return new Buffer ( data, 'utf8')
  } 


, decode : function ( data ) {   // * Decode buffer to file content
		     return new Buffer ( data , 'binary' ).toString ( 'utf8' ) 
  }









, readFile  : function readFile ( fx ) {
  // * Read file(s) and execute callback function with it
  	   var 
  	   		  me      = this
  	   		, m       = toolbox.model()
  	   		, list
  	   		;
  	   
  	   list  = me.get ( 'read'  )
  	   if ( list.length == 0 )    list  = me.get ( 'files' )
  	   if ( list.length == 0 ) {
  								  m.error = true
  								  m.errorList.push  ( error_msg [ 'cache.files empty' ] )
  								  return false
  	        }


  	   if ( !fx ) {
  	   				let content = []
  	   				content.length = list.length
  	   				list.forEach ( (file,i) => {
					  								try {         content[i] = fs.readFileSync ( file, encode )   }
					  								catch (err) { content[i] = false   }
  	   				     })
  	   				return content
  	        } 

  	   list.forEach ( (file,i)              => {
  	   fs.readFile  ( file, (err,r) => {
  	   												if ( err ) fx ( false, i )
  	   												else       fx ( r    , i )
  	   		})
  	   		})
 } // readFile func.










, writeFile : function writeFile () {
  // * Write files
  var 
	    m      = toolbox.model()
	  , number = null
	  , after  = toolbox._triggerCallbacks
	  ;
  
  m.set = toolbox._argSetup.apply ( this, arguments )
  if ( m.set.options.hasOwnProperty('number') )    number = m.set.options.number



  if ( writeLocation.length == 0 ) {
  								m.error = true
  								m.errorList.push  ( error_msg [ 'cache.write is empty' ] )
  								return after.call ( m, 'write' )
  							  }



  if ( number != null ) {
					  		 if ( writeLocation[number] === undefined ) {
  										m.error = true
  										m.errorList.push  ( error_msg [ 'cache.write is empty' ] )
  										return _writeEnd ()
					  		    }
					  		  else {
							  		  let list = writeLocation[number].split('/');
			  						  list.pop ()
			  						  let content = m.set.list[0] || ''
			  						  _writeDown ( list , number, content )
					  		       }
       }
  else {
				writeLocation.forEach (   ( filename, i ) => {
							 if ( filename === false ) {
							 								writeCounter --
							 								if ( writeCounter == 0 ) _writeEnd ()
							 								return
							      }
							 else {
															 let list = filename.split('/');
												  			 list.pop()
															 let content = m.set.list[i] || ''
															 _writeDown ( list, i, content )
							      }
				        }) // each location
       } // else number



       function _writeDown ( list , number, content ) {
				  toolbox.mkdir ( list.join('/'), ( err, r ) => {
				  						let aBuffer = Buffer.isBuffer ( content )
				  						if ( !aBuffer ) content = new Buffer ( content, 'binary' )
				  						fs.writeFile ( writeLocation[number] , content, ( err, r ) => {
							  																			 writeCounter--
							  																			 if ( writeCounter == 0 ) _writeEnd ()
							  												})
							  		}) // mkdir
	  			} // writeDown func.



	  function _writeEnd () { 
	  							after.call ( m, 'write' )
	  							writeLocation = []
	  							toolbox.resetCache ( 'write' )
	  						}



  } // writeFile func.




















, mkdir : function mkdir () {
  // * Ensure folder existence
	var  m = toolbox.model();

	m.set       = toolbox._argSetup.apply ( this, arguments )
	m.afterMake = toolbox._triggerCallbacks
	
	// Creates list of all paths required
	m.list = toolbox._arrangeAllPaths ( m.set.list )

    // Testing path string and create them if missing
    toolbox._mk.call ( m , m.list )
} // mkdir func.










, _mk : function _mk ( testList ) {
	var folder;

	// if all elements are tested
	if ( testList.length == 0 ) {
									this.set.callbackList.forEach (   cb => cb ( false, true )   )
									return
								}
	
	folder = testList.shift()
    fs.stat ( folder , ( err, stat ) => {
                                         if ( !stat )  fs.mkdir ( folder , () => toolbox._mk.call ( this , testList )   )
                                         else          toolbox._mk.call ( this , testList )
   			})
 } // _mk func.



















, _arrangeAllPaths : function _arrangeAllPaths ( folders ) {
  // * Creates list of all paths required
  var
		  testList = []
		, allpaths = []
		;

  // Arrange testing path strings in array
  folders.forEach ( (fname) => {
									let tmp = fname.split('/')
									let l   = tmp.reduce ( ( res, item, index ) => {
													                                  var newValue
													                                  if ( index > 0 ) newValue = res[index-1] + '/' + item
													                                  else newValue = item

													                                  res.push ( newValue )
													                                  return res
           										},[])
									allpaths = allpaths.concat ( l )
	       }) // each folder
    
    // Clean duplicates
    testList = allpaths.reduce ( ( res, item ) => {
    							var notMatch
    							notMatch = res.every ( el => el != item )
    							if ( notMatch ) res.push ( item )
    							return res
                       }, [] )

    return testList
 }  // _arrangeAllPaths func.




















, keep : function keep () {  
  // * Reduce 'file' cache list.
	
	var  
   		  m = toolbox.model()
	    , marker = false
	    , answer
	    , by
	    , options 
	    , selected
	    , afterReduce = toolbox._triggerCallbacks
	    ;

	m.set    = toolbox._argSetup.apply ( this, arguments )
	options  = m.set.options
	by       = options.by
	selected = m.set.list

	if ( arguments.length != 3 ) {
									m.error = true
									m.errorList.push ( error_msg['wrong argument numbers'] ) 
								 }
    
	if ( selected.length == 0 ) {
								    m.error = true
								    m.errorList.push ( error_msg['no selection'])
								}

	switch (by) {
			case 'ext'       : 
			case 'extension' : 
							    marker = 'ext'
			                    break
			case 'key'       : 
			case 'keys'      : 
			case 'prefix'    : 
						   	    marker = 'prefix'
			                    break
			case 'filename'  :
								marker = 'filename'
								break
			case 'name'      :
								marker = 'name'
								break
			case 'suffix'    : 
						   	    marker = 'suffix'
			                    break
			case 'path'      :
			                    marker = 'path'
			                    break
		  } // switch by
	
	if ( !marker ) {
					 m.errorList.push ( error_msg['wrong by'] )
					 m.error = true
	               }



   if ( m.error ) {
   					  afterReduce.call ( m, 'files')
   					  return
       			  }

	m.list = cache.files.reduce ( ( answerList, fl ) => {
		     					   				let fl_key = toolbox._find[marker](fl)
		     					   				let notFounded = selected.every ( key => fl_key != key )
		     					   				if ( !notFounded ) answerList.push(fl)
		     					   				return answerList
      			 		 }, []) // data.reduce

    toolbox.set ( 'files', m.list  )
    afterReduce.call ( m , 'files' )
  } // keep func.










, _find : {     
  // * Extract patterns.
				  'ext'      : ( str ) => str.split('/').pop().split('.').pop()
				, 'prefix'   : ( str ) => str.split('/').pop().split('.').shift().split(del.prefix).shift()
				, 'suffix'   : ( str ) => str.split('/').pop().split('.').shift().split(del.suffix).pop()
				, 'name'     : ( str ) => str.split('/').pop().split('.').shift()
				, 'filename' : ( str ) => str.split('/').pop()
				, 'path'     : ( str ) => str
  } // _find




















, keepFolders : function keepFolders () {
  // * Keeps only folders with specific string in the path.
   var 
   		  folders = cache.folders
   		, deep
   		, m = toolbox.model()
   		, options
   		, afterReduce = toolbox._triggerCallbacks
   		;
   
   // Arrange arguments ( list , options , callbackList )
   m.set   = toolbox._argSetup.apply ( this, arguments )
   options = m.set.options
   deep    = options.hasOwnProperty('deep') ? options.deep : 9999;

   m.list = folders.reduce ( ( res, fl ) => {
   												let test = fl.split ( '/' )
   												let l    = test.length

   												test.forEach ( ( el , i ) => {
									   											let fine = false
									   											let notMatch = m.set.list.every ( samle => samle != el )
									   										    
									   										    if ( !notMatch ) {
									   										    					let longPath = i + 1 + deep
									   										    					if ( longPath >= l ) fine = true
									   										    			   }
									   										    if ( fine ) res.push ( fl )
									   							})
   												return res
   			                }, []) // folders.reduce
   
   toolbox.set ( 'folders', m.list )
   afterReduce.call ( m, 'folders' )

  } // keepFolders func.




















, keepFoldersInSteps : function keepFoldersInSteps () {
  // * Reduce folder sequence. 
	var
	   	  m = toolbox.model()
   		, afterReduce = toolbox._triggerCallbacks
   		, options
   		, deep = false
   		;

   	   m.set = toolbox._argSetup.apply ( this, arguments )
   	   options = m.set.options
   	   
   	   if ( options.hasOwnProperty('deep') ) {
   	   							if ( typeof options.deep == 'number')	deep = m.set.list.map ( ()     => options.deep   )
   	   							else                                    deep = m.set.list.map ( (el,i) => options.deep[i])
						   	    
						   	    let noUndefined = deep.every ( el => el != undefined )
						 	    if ( !noUndefined ) {
						 	  						 m.error = true
						 	  						 m.errorList.push ( error_msg [ 'wrong deep level' ] )
						 	  					  }
   	      } // if deep

   	   if ( !m.error ) {
   	   					  if ( deep )  m.set.list.forEach ( ( el, i ) => toolbox.keepFolders ( [el], { deep:deep[i] }, ()=>{} )   )
   	   					  else         m.set.list.forEach (   el      => toolbox.keepFolders ( [el],                   ()=>{} )   )
   	      }
   	   
   	   afterReduce.call ( m , 'folders' )

  } // keepFoldersInSteps func.














, removeFiles : function removeFiles () {
  // * Remove files specified. Uses cache.
   var 
   		  m = toolbox.model()
   		, afterFilter = toolbox._triggerCallbacks
   		, by
   		, filterList
   		, tempList
   		;
   
   // Arrange arguments ( list , options , callbackList )
   m.set = toolbox._argSetup.apply ( this, arguments )
   by    = m.set.options.by || false;
   
   // Check for errors in arguments
   let  optionSize = Object.getOwnPropertyNames ( m.set.options )
   if ( optionSize.length == 0 ) { m.errorList.push ( error_msg['wrong argument numbers'])   }
   if ( !by                    ) { m.errorList.push ( error_msg['wrong by'])                 }
   if ( m.errorList.length > 0 ) {
   									m.error = true
   				 					return afterFilter.call ( m, 'files')
   	  }
   
   filterList = m.set.list
   m.list     = toolbox.get('files')
 
   // Filtering
   filterList.forEach ( sample => {
					   m.list = m.list.filter ( (fl) => toolbox._find[by](fl) != sample )
   			 })

   toolbox.set ( 'files', m.list )
   afterFilter.call ( m, 'files' )
  } // removeFiles func.






, removeFolders : function removeFolders () {
  // * Remove folders specified. Uses cache.
   var 
   		  folders = cache.folders
   		, m = toolbox.model()
   		, afterFilter = toolbox._triggerCallbacks
   		;
   
   // Arrange arguments ( list , options , callbackList )
   m.set   = toolbox._argSetup.apply ( this, arguments )
   
   m.list  = folders.reduce ( ( res, fl ) => {
   												let test    = fl.split ( '/' )
   												let confirm = true
   												let complete = false

   												test.forEach ( ( el , i ) => {
   																				if ( complete ) return
									   											
									   											let fine = false
									   											let notMatch = m.set.list.every ( samle => samle != el )
									   										    
									   										    // Cancel element if sample match
									   										    if ( !notMatch ) {
									   										    					confirm = false
									   										    					complete = true
									   										    	} 
									   							})
   												
   												if ( confirm ) res.push ( fl )
   												return res
   			                }, []) // folders.reduce
   
   toolbox.set ( 'folders', m.list )
   afterFilter.call ( m, 'folders' )
  } // removeFolders func.




















, deleteFiles : function deleteFiles () {
  // * Delete all file-paths in cache. 
  //   note: Fulfil cache by using scan, reduce, filter, or using 'set' method.
  	 var
  	       m = toolbox.model()
  	     , list 
  	     , after = toolbox._triggerCallbacks
  	     ;

  	 m.set = toolbox._argSetup.apply ( this, arguments )
  	 
  	 list  = toolbox.get ( 'read' )
  	 if ( list.length == 0 ) list  = toolbox.get('files')

  	 let deleteComplete = askForPromise()

  	 toolbox._deleteFiles.call ( m , deleteComplete.done , list )
  	 
  	 deleteComplete.promise.then ( () => {
							 				  toolbox.set ( 'files', [] )
							 				  after.call  ( m , 'files' )
  	 	   })
  }  //  deleteFiles func.










, deleteFolders : function deleteFolders () {
  	// * Delete all folder-paths in cache
  	var
  	       m = toolbox.model()
  	     , list 
  	     , after = toolbox._triggerCallbacks
  	     ;

  	 m.set = toolbox._argSetup.apply ( this, arguments )
  	 list  = toolbox.get('folders')

  	 let deleteComplete = askForPromise()
  	 toolbox._deleteFolders.call ( m , deleteComplete.done , list )

  	 deleteComplete.promise.then ( ()=> {
						 					 toolbox.set ( 'folders', m.list )
						 					 after.call  ( m , 'folders' )
  	 	   })
   } // deleteFolders func.




















, empty : function empty () {
  // * Delete just files. Empty will not delete sub-folders.
	var 
		  m = toolbox.model()
		, list
		, after = toolbox._triggerCallbacks
		, copy  = toolbox._copy
		;

    m.set = toolbox._argSetup.apply ( this , arguments )
    list  = copy ( m.set.list )
    
    let emptyComplete = askForPromise()
    toolbox._empty.call ( m , emptyComplete.done, list )
    emptyComplete.promise.then ( () => {
					    					 toolbox.set ( 'files', [] )
					    					 after.call  ( m , 'files' )
    		})
  
  } // empty func










, emptyFolders : function emptyFolders () {
  // * Delete all files and sub-folders.
	 var 
	 	    m       = toolbox.model()
	 	  , after   = toolbox._triggerCallbacks
	 	  , copy    = toolbox._copy
	 	  ;

	 m.set = toolbox._argSetup.apply ( this, arguments )
 	 let sortedList = toolbox._sort ( copy(m.set.list)   )

     // Create promises
     let delFilesComplete  = askForPromise()
     let delFolderComplete = askForPromise()

     toolbox._empty.call ( m, delFilesComplete.done, copy(sortedList)   )
     	
     delFilesComplete.promise
     .then ( () => {
     				  toolbox._emptyFolders.call ( m, delFolderComplete.done, sortedList)
     				  return delFolderComplete.promise
     	      })
     .then ( () => {
     				  toolbox.resetCache.call ( m )
     				  after.call ( m, 'folders' )
     	      })
  } // emptyFolders func.










  









, _empty : function _empty ( done, list ) {
	  var 
	  	     me = this
	  	   , folder
	  	   ;

	  // Finish if list is empty
	  if ( list.length == 0 ) return done()

 	  folder = list.shift()
 	  toolbox.scanFiles ( folder , ( err, r ) => {
 	  							
 	  							// No files
 	  							if ( r.length == 0 ) return toolbox._empty.call ( me, done, [] )
 	  							
								let deleteFilesComplete = askForPromise()
								toolbox._deleteFiles.call ( me, deleteFilesComplete.done, r )					

 	  							// After deletion
 	  							deleteFilesComplete.promise
 	  							.then ( () => {
												  me.list.push ( folder )
												  toolbox._empty.call ( me, done, list )
 	  									})
 	         }) // scanFiles 
  } // _empty func.










, _emptyFolders : function _emptyFolders ( done , list ) {
	  var 
	  	     me = this
	  	   , folder
	  	   ;

	  // Finish if list is empty
	  if ( list.length == 0 ) return done()
 	  
 	  folder = list.shift()
 	  toolbox.scanFolders ( folder , ( err, r ) => {

 	  							// No folders
 	  							if ( r.length == 0 ) return toolbox._emptyFolders.call ( me, done, [] )

 	  							let delFolderComplete = askForPromise()
 	  							toolbox._deleteFolders.call ( me, delFolderComplete.done , r )
 	  							
 	  							// After deletion
 	  							delFolderComplete.promise
 	  							.then ( () => {
  												 me.list.push ( folder )
  												 toolbox._emptyFolders.call ( me, done, list )
 	  									})

 	         }) //scanFolders
  }  // _emptyFolders func.










, _deleteFiles : function _deleteFiles ( done , list ) {
	var
		  me = this
		, file
		;	 	  					

	// Finish when list is empty
	if ( list.length == 0 ) return done()

	file = list.pop()
	fs.unlink (   file , () => toolbox._deleteFiles.call ( me, done, list )   )
  } // deleteFiles func.










, _deleteFolders : function _deleteFolders ( done , list ) {
	  var
	         me = this
	       , folder
	       ;
	   
	   // Finish if list is empty
	   if ( list.length == 0 ) return done()

	   folder = list.pop()
	   // Warning: If data is manually prepared - use sort before
	   fs.rmdir (   folder, ( err, r ) => {
	   								 		  if ( err ) {
	   								 		  				me.error = true
	   								 		  				me.errorList.push ( error_msg [ 'not empty' ] + folder )
	   								 		   				me.list.push ( folder )
	   								 		     }
	   								 		  toolbox._deleteFolders.call ( me, done, list )
	   						})
  }  // _deleteFolders func.










, _sort : function sort ( list ) {
		var
			   max = 0
			 , min = 1000
			 , result = []
			 ;
		
		if ( list.length <= 1 ) return list
		
		// Find size of every path in list
		let sizes = list.map ( el => {
										let temp = el.split('/')
										return temp.length
			 })
		
		// Get 'max' and 'min' values
		sizes.forEach ( el => {
										if ( el < min ) min = el
										if ( el > max ) max = el
		     })

		// Create list with weight indexes
		let weight = sizes.map ( el => el - min )

		// Create array with all possible weigth indexes
		max = max - min + 1
		let allWeights = new Array ( max )
		let counter = max
		while ( counter-- )   allWeights [ counter ] =  counter

		// Fulfil 'result' array 
		allWeights.forEach (   sample  => {
		    weight.forEach ( ( el, i ) => {
										  if ( el == sample ) result.push ( list[i] )
		      })
		      })
		return result
 } // _sort func.










, _copy : function _copy ( obj ) {
								return JSON.parse (   JSON.stringify ( obj )   )
  } // _copy func.



}; // toolbox obj.




















var api = {
			  // * CACHE 
			    set                : toolbox.set             // Change lib options or set cache
			  , get                : toolbox.get             // Return cache or specified option
			 
			  , fileCacheAs        : toolbox.specifyCache    // Specify type of file cache - read/write operations
			  , resetCache         : toolbox.resetCache      // Reset cache for files and folders
			  , clearCache         : toolbox.resetCache   
			  
			  , scan               : toolbox.scanFiles          // Collect file paths. Writes result to cache
			  , scanFolder         : toolbox.scanFolders        // Collect sub-folder paths. Writes result to cache
			  , scanFolders        : toolbox.scanFolders
			   
			  // * FILE LIST MANIPULATION
			  , keep               : toolbox.keep               // Keep specified items. Uses cache
			  , keepFolder         : toolbox.keepFolders        // Keep only folders with specific string in the path. Uses cache.
			  , keepFolders        : toolbox.keepFolders 
			  , keepFolderSteps    : toolbox.keepFoldersInSteps // Execute sequence of reduceFolder
			  , keepFoldersSteps   : toolbox.keepFoldersInSteps
			  
			  , remove             : toolbox.removeFiles   // Remove files specified. Uses cache.
			  , removeFolder       : toolbox.removeFolders // Remove folders specified. Uses cache.
			  , removeFolders      : toolbox.removeFolders 
			                       
			  // * FILE MANIPULATION   - cache 'read' and 'folder'
			  , delete             : toolbox.deleteFiles   // Delete file(s) specified.
			  , deleteFolder       : toolbox.deleteFolders // Delete folder(s). Folder should not contain files.
			  , deleteFolders      : toolbox.deleteFolders 
			  
			  , empty              : toolbox.empty         // Delete just files. Empty will not delete sub-folders.
			  , emptyFolder        : toolbox.emptyFolders  // Delete all files and sub-folders.
			  , emptyFolders       : toolbox.emptyFolders
			                       
			  , read               : toolbox.readFile      // Read files and apply function to content
			  			  
			  // * FILE MANIPULATION   - cache 'write'
			  , write              : toolbox.writeFile     // Assert folder existnace and write file
			  
			  // * HELPERS - no cache operation
			  , makeFolder         : toolbox.mkdir         // Create a folder
			  , decode             : toolbox.decode        // Decode buffer to 'utf8' string
			  , encode             : toolbox.encode        // Encode 'utf8' string to buffer.
			  
			  // * PLANED BUT NOT COMPLETE
			  , sequence           : [ 'Compose sequence of library operations']
			  // TODO: Paths operations project - 2016.03.08
			  , modifyPath        : [ 'Modify cache files paths. With replace?'  ]
			  , modifyPathFolders : [ 'Modify cache folder paths' ]
		   }



module.exports = api



