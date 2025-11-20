# Release History



## 3.1.11 ( 2024.11.20 )
- [x] Dependency update. Ask-for-promise@3.1.0



## 3.1.10 ( 2024.12.18 )
- [x] Dependency update. Ask-for-promise@3.0.1



## 3.1.9 ( 2024.12.15 )
- [x] Dependency update. Ask-for-promise@2.0.5
- [x] Convert library to ES module;
- [x] Rollup build introduced. FS-toolbox can be used as CommonJS and ESM modules;



## 3.1.8 ( 2024.02.04 )
- [x] Dependency update. Ask-for-promise@2.0.3



## 3.1.7 ( 2021.03.02 )
- [x] Dependency update;



## 3.1.4 (2017.12.29)
- [x] Dependency update;
- [x] Test coverage tools;
- [x] Project structure refactoring;



## 3.1.3 (2017.04.12)
- [x] Buffer creation with `buffer.from()`. `new Buffer()` is deprecated;
- [x] Dependency update;


## 3.1.2
- [x] Dependency update;



## 3.1.1
- [x] Hot fix for method 'encode'. Working with JS objects;



## 3.1.0
- [x] Method 'encode' was added. Encode 'utf8' content before write it;
- [x] Method 'encode' could receive as a content JS object;
- [x] Use method 'encode' before send JSON and HTML content to 'write';
- [ ] Error in method 'encode' - working with JS objects;




## 3.0.0 (2016-09-30)
- [x] Method 'write' works with any kind file-encoding;
- [x] Method 'write' accept buffer objects;
- [x] Method 'write' has auto-conversion to buffer. Uses 'binary' for encoding.
- [ ] Binary encoding that method 'write' provide is not works fine with '.json' and '.html';
- **! Upgrade to 3.1.x and use method 'encode' for all 'utf8' based content**;
- [x] Documentation update;
- [x] Refactoring: function 'read' returns buffer object
- [x] Method 'resetCache' was extended. Now reset of only specific cache is available;
- [x] Method 'decode' was added. Convert buffer type object to 'utf8' string if needed;
- [x] Refactoring: Function 'write' works with buffer objects and 'utf8' strings;
- [x] Preventing crash of method 'set' on: fsbox.set('files', undefined);
- [x] Tests for method 'decode' were added;
- [x] All tests methods were updated according changes;
- [x] Upgrade notes are available.



## 2.1.1 (2016-06-05)

 - [x] Works only with 'utf8' encoded files;
 - [x] Remove and keep methods have new 'by' option 'path'. Path contains full path of the file;
 - [x] Tests for method 'remove' and 'keep' by 'path' were added;
 - [ ] Crash of method 'set' on: fsbox.set('files', undefined);



## 2.1.0 (2016-04-24)

 - [x] Works only with 'utf8' encoded files;
 - [x] Documentation update;
 - [x] Method 'read' was added;
 - [x] Tests for method 'read' were added;
 - [ ] Crash of method 'set' on: fsbox.set('files', undefined);



## 2.0.0 (2016-04-21)

 - [x] Works only with 'utf8' encoded files;
 - [x] Initial documentation;
 - [x] Refactoring: function 'reduce' was renamed to 'keep';
 - [x] Refactoring: function 'reduceFolder' was renamed to 'keepFolder';
 - [x] Refactoring: function 'reduceFolderSteps' was renamed to 'keepFolderSteps';
 - [x] Refactoring: function 'filter' was renamed to 'remove';
 - [x] Refactoring: function 'filterFolder' was renamed to 'removeFolder';
 - [ ] Crash of method 'set' on: fsbox.set('files', undefined);



## 1.0.2 (2016-03-12)

 - [x] Node module;
 - [x] Test package;
 - [x] Works only with 'utf8' encoded files;
 - [ ] Documentation;