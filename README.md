# FS Toolbox

Tool-library for working with files. Module works with node version 5 and above.





## Installation

Install by writing in your terminal:

```
npm install fs-toolbox --save-dev

```

Once it has been installed, it can be used by writing this line of JavaScript:

```js
var fsbox = require ( 'fs-toolbox')

```





## Design Concept
File system contains two types of items: documents(files) and containers(folders). They are very differents and there is no reason to mix them together. With this library you can do:
- Scan for all files in specified folders (many folder);
- Scan for folders inside specified folder (many folders);
- Result of scan is array with absolute path to the files or folders;
- Apply filters (keep/remove) to the scan results;
- Delete many files with just one operation;
- Create deep folders;











## Examples

Folder 'test' can provide you information about how to use this library. Over 60 test examples are on your disposal.





## Known bugs
_(Nothing yet)_





## Release History

### 2.0.0 (2016-04-21)

 - [x] Initial documentation;
 - [x] Refactoring: function 'reduce' was renamed to 'keep';
 - [x] Refactoring: function 'reduceFolder' was renamed to 'keepFolder';
 - [x] Refactoring: function 'reduceFolderSteps' was renamed to 'keepFolderSteps';
 - [x] Refactoring: function 'filter' was renamed to 'remove';
 - [x] Refactoring: function 'filterFolder' was renamed to 'removeFolder';

### 1.0.2 (2016-03-12)

 - [x] Node module;
 - [x] Test package;
 - [-] Documentation;




## Credits
'fs-toolbox' was created by Peter Naydenov.




## License
'fs-toolbox' is released under the [MIT License](http://opensource.org/licenses/MIT).