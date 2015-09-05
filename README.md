# digs-common [![NPM](https://nodei.co/npm/digs-common.png?compact=true)](https://www.npmjs.com/package/digs-common)  
[![Build Status](https://travis-ci.org/digsjs/digs-common.svg?branch=master)](https://travis-ci.org/digsjs/digs-common) [![Join the chat at https://gitter.im/digsjs/digs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/digsjs/digs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> A moatload of common objects and functions shared by various Digs-related packages

## Usage

In addition to an abstraction layer over several packages, there's also some common "stamps" in here.

```js
let common = require('digs-common');
let _ = common.utils; // `lodash` with some mixins
let Promise = common.Promise; // `bluebird`
let validate = common.validate; // `joi`
let define = common.define; // `stampit`

// example of a mixin (from package `slug`)
_.slugify('Hello, World!') // 'hello-world' 
```

### Defines

```js
let defines = require('digs-common').defines;

// stamp accepting Digs instance as second parameter;
// a Digs instance is just a Hapi server.
const DigsObject = defines.DigsObject;

// like the above, but containing logging functions
const DigsLogger = defines.DigsLogger;
```

## Author

[Christopher Hiller](http://boneskull.com)

## License

MIT
