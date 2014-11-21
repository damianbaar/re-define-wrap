re-define-wrap
==========================

`re-define` plugin for wrapping js files. It may be handy when you need to add some wrapper function around your code.

Usage:

```
var wrapFile = require('re-define-wrap')({
      './filepath.js': '!function() { }'
  or  './filepath.js': 'var a = 10; function init(startVal) { }; init(a);'
  or  './filepath.js': '(function (startVal) { })(10)'
  })
```
