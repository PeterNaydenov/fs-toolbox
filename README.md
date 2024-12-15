# FS Toolbox

Tool-library for working with files. Works with node version 5 and above.




## Installation

Install by writing in your terminal:

```
npm install fs-toolbox

```

Once it has been installed, it can be used by writing this line of JavaScript:

```js
import fsbox from 'fs-toolbox'

// or
let fsbox = require ( 'fs-toolbox' )
```










## Design Concept
File system contains two types of items: documents(files) and containers(folders). They are very different and there is no reason to mix them together. With this library you can do:
- Scan for all files in specified folders (many folder);
- Scan for folders inside specified folder (many folders);
- Result of scan is array with path to the files or folders;
- Apply filters (keep/remove) to the cache list of files and folders;
- Delete many files with just one operation;
- Create deep folders;




## API Interface

Here is the list of methods and а short description for each:

```
{

// * CACHE 
    set                : 'Change lib options or set cache'
  , get                : 'Return cache or specified option'
 
  , fileCacheAs        : 'Move file cache to read/write cache'
  , resetCache         : 'Reset cache for files and folders'
  , clearCache         : '...as resetCache'
  
  , scan               : 'Collect file paths. Writes result to cache'
  , scanFolder         : 'Collect sub-folder paths. Writes result to cache'
  , scanFolders        : '...as scanFolder'
   
// * FILE/FOLDER LIST MANIPULATION
  , keep               : 'Keep specified items. Uses cache'
  , keepFolder         : 'Keep only folders with specific string in the path. Uses cache.'
  , keepFolders        : '...as KeepFolder'
  , keepFolderSteps    : 'Execute sequence of reduceFolder'
  , keepFoldersSteps   : '...as keepFolderSteps'
  
  , remove             : 'Remove files specified. Uses cache.'
  , removeFolder       : 'Remove folders specified. Uses cache.'
  , removeFolders      : '...as removeFolder'
                       
  // * FILE/FOLDER MANIPULATION - cache 'file'/'read' and 'folder'
  , delete             : 'Delete file(s) specified.'
  , deleteFolder       : 'Delete folder(s). Folder should not contain files.'
  , deleteFolders      : '...as deleteFolders'
  
  , empty              : 'Delete just files. Empty will not delete sub-folders.'
  , emptyFolder        : 'Delete all files and sub-folders.'
  , emptyFolders       : '...as emptyFolder'
                       
  , read               : 'Read files and apply function to content'
  			  
  // * FILE MANIPULATION   - only cache 'write'
  , write              :  'Assert folder existnace and write file'
  
  // * HELPERS
  , makeFolder         :  'Create a folder'
  , decode             :  'Decode buffer to 'utf8' string'
  , encode             :  'Encode 'utf8' string to buffer.'

}

```









## Examples

### Cache
Result of searching for 'folders' and 'files' will be written in the cache.
Example: 
This code will scan folder '/test' for files and result will be available in cache. Callback function also will have result as 'r' argument.

```js
  fsbox.scan ( '/test', (err,r) => {
  								     // err - if error = true, else false
  								     // r - contain cache result
      })

   // Scan many folders at once
   fsbox.scan ( ['/test','/other'], (err,r) => {
            // r will be an array with file paths from both folders.
			// example : ['/test/one.txt','/test/two.txt', '/other/three.txt' ]
      })
```

Access to the cache is also available via 'get' and 'set' methods.

```js
 fsbox.set ( 'files', 'one.txt' ) // will add 'one.txt' to array of cache.files
 fsbox.set ( 'files', ['two.txt', 'three.txt'] ) // will add both files to cache.files

 fsbox.get ( 'files' ) 
 // will return array - [ 'one.txt', 'two.txt', 'three.txt' ]
 
```

Clean cache content by:

```js
     // clean all cache values
     fsbox.resetCache ()

     // clean specific cache
     fsbox.resetCache ( 'files' )

```



### List Manipulations
Collected list of items in cache could be manipulated. You can remove or keep items.
Example: Scan folder '/test' that have files `one.txt`,`animation.gif`,`other.txt`. Collect just text files.

```js
    
fsbox.keep ( 'txt', { by:'extension'}, (err,r) => {
													// r contain ['one.txt','other.txt']
				})

```

Other aproach could be to remove 'gif' files.

```js
fsbox.remove ( 'gif', {by:'extension'}, (err,r) => {
                                                     // r contain ['one.txt','other.txt']
                })

```
In 'by' criteria are available `extension`,`filename`,`name`,`prefix`,`suffix`,`path`.
- Extension is for file extension;
- filename is full filename including extension;
- name is just filename without extension;
- path is for path before filename;

For more information browse folder 'test'. Find a lot of examples for every function and case.



### Writing Files
Collect the list(array) of file paths and set them as 'file' cache. Then set cache.files for write. This command will move cache.files in cache.write. After operation cache.files will be empty and ready to collect other information.
Method 'write' will convert content to buffer with 'binary' encoding.

```js
let writeFiles = [ 'a.txt', 'b.txt', 'c.txt' ];
let content = [ 'text for file a', 'text for file b', 'text for file c' ]

fsbox.set ( 'files', writeFiles )
fsbox.fileCacheAs ( 'write' ) // if you want to use files as 'write' list
fsbox.write ( content, () => console.log ('Files are written')   )

```
It's very important to know that callback of write method will be triggered once when all writes are completed.


**Attention** : Is is risky to try send JSON and HTML directly to write. Binary encoding will transform incorrectly some of the symbols. Is much safe to use 'encode' function for all 'utf8' based files. Function 'encode' can receive also JS object. JS object will be converted to JSON first. Then to buffer.

```js
 // variable 'content' is array of objects. 
 // Will be converted to array of buffers.
 let encodedContent = content.map ( txt => fsbox.encode (txt) )

```

Here is example how to read and write files.

```js

// variable 'in' folder content [ 'in/a.txt', 'in/b.txt','in/c.txt' ]
   let out = in.map ( item => item.replace ('in','out')   )
// variable 'out' have content [ 'out/a.txt', 'out/b.txt','out/c.txt' ]

fsbox.set ('files', out )
fsbox.fileCacheAs ( 'write' )
fsbox.set ( 'files', in )

fsbox.read  ( (content,i) => 
fsbox.write (  content, {number:i}, (err,r) => console.log ( 'Files are written' )
     ))

// callback function for read is on every read. 
// Callback function of write is once when everything is written.

```
There is option to move variable 'in' in **cache.read** by using `fsbox.fileCacheAs('read')` but is not mandatory. If cache.read is not set will use cache.files.



### More
Folder 'test' can provide you information about how to use this library. Over 60 test examples are on your disposal.





## Known bugs
_(Nothing yet)_





## Links

- [History of changes](https://github.com/PeterNaydenov/fs-toolbox/blob/master/Changelog.md)
- [Migration guide](https://github.com/PeterNaydenov/fs-toolbox/blob/master/Migration.guide.md)



## Credits
'fs-toolbox' was created by Peter Naydenov.




## License
'fs-toolbox' is released under the [MIT License](https://github.com/PeterNaydenov/fs-toolbox/blob/master/LICENSE).




