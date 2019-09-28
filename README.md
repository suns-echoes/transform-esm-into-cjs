Transform ES modules into CommonJS
==================================

The `transform-esm-into-cjs` utility transforms ES modules into CommonJS without adding any unnecessary code.

Warning: *If module exports default and named members, default member will be named "default".*

Warning: *If default and named members are imported from the same module, default member will be named "default".*


Installation
------------

`npm i --save-dev @suns-echoes/transform-esm-into-cjs`


Import
------

```js
// Import utility distribution file
import { transformESMIntoCJS } from '@suns-echoes/transform-esm-into-cjs';
```

```js
// Import utility from source
import { transformESMIntoCJS } from '@suns-echoes/transform-esm-into-cjs/src';
// or
import { transformESMIntoCJS } from '@suns-echoes/transform-esm-into-cjs/src/transform-esm-into-cjs';
```


Usage
-----

```js
const cjsCode = transformESMIntoCJS(esmCode, silent);
```


### Arguments

* `<string>` `source` - original source code (ESM);
* `<boolean>` `[silent=false]` - Optional, mute warnings (def.: false).


### Returns

* `<string>` - transformed source code (CJS).


Examples
--------

### Transform ESM code into CJS code and mute warnings:

input string:

```js
import { MyModule } from 'my-module';
```

transformation script:

```js
const output = transformESMIntoCJS(input, true);
```

output string:

```js
const { MyModule } = require('my-module');
```


License
-------

Licensed under MIT

Copyright (c) 2019 Aneta Suns
