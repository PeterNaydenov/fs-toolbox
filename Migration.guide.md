## Migration Guide


### From 2.x.x to 3.x.x
Until now **fs-toolbox** was a tool for working with 'utf8' encoded files like '.html', '.css', '.js', '.txt', etc. With version 3 this limitation was eliminated.

Changes are:

- **Content of files is coming as buffer object**. Edit string content wil need decoding. Example:

```js
fsbox.read ( (content,i) => {
		//  'content' will contain buffer object. You need to decode it.
		let textContent = fsbox.decode ( content )
		console.log ( textContent ) 
})

```

Conversion of 'string' to 'buffer' object is automated inside method 'write' and programmers don't have to think about it.


- **Method 'write' can not use 'cache.files' directly anymore**. The method 'write' is potentially harmful. That's why 'cache.files' should be specified as 'for write' imperatively:

```js
 fsbox.set ( 'files', fileList )
 fsbox.fileCacheAs ( 'write' ) // declare that file list is for writing
 fsbox.write ( content, callbackFunction )

```

These are all code changes needed for this upgrade. / from v.2.x to v.3.x. / 



### From 1.x.x to 2.x.x
Renaming of some methods.
 - was 'reduce', now is 'keep'
 - was 'reduceFolder', now is 'keepFolder'
 - was 'reduceFolder', now is 'keepFolder'
 - was 'reduceFolderSteps', now is 'keepFolderSteps'
 - was 'filter', now is 'remove'
 - was 'filterFolder', now is 'removeFolder'

These are all code changes to consider for this upgrade. / from v.1.x to v.2.x. / 


