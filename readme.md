# Strapper

Useful tool for bootstrapping a project from an existing file set.

### Install
```bash
$ npm i -g strapper
```

### Usage
At the momment the scope of this module only covers copying files from an existing folder on disk. This is however intended to increase to cover github repo's/tarball downloads in the future.


```bash
$ stapper [-f] ./my-source ./my-destination
```

##### Programatically
```javascript
var strapper = require('strapper');

strapper(src, dest, err => {
  if (err) throw err;

  // complete
});
```
