# digs-common [![NPM](https://nodei.co/npm/digs-common.png?compact=true)](https://www.npmjs.com/package/digs-common)  
[![Build Status](https://travis-ci.org/digsjs/digs-common.svg?branch=master)](https://travis-ci.org/digsjs/digs-common) [![Join the chat at https://gitter.im/digsjs/digs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/digsjs/digs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> A moatload of common objects and functions shared by various Digs-related packages

## Usage

```js
const common = require('digs-common');
const _ = common.utils; // `lodash` with some mixins
const Promise = common.Promise; // `bluebird`
const validator = common.validator; // `joi`
const define = common.define; // `stampit`
const definitions = common.definitions; // definitions ("stamps")

// example of a mixin (from package `slug`)
_.slugify('Hello, World!') // 'hello-world' 
```

## API

### Definitions

A "definition" is simply a "[stamp](https://npmjs.com/package/stampit)".  These
are provided for use in plugins.  They ease the addition of common functionality
to any object.

```js
const definitions = require('digs-common').definitions;
```

The following factory functions ("stamps") can be combined *in any way
you can think of* to create new objects.

#### DigsObject

The `DigsObject` factory accepts a required second parameter, which is a [Digs]
instance.  Of course, this is simply a [Hapi](https://npmjs.com/package/hapi)
[`Server`](http://hapijs.com/api#new-serveroptions).

##### Logging Functionality

The definition provides the following logging methods (configurable), for
convenience:

- `error(tags, data)`
- `warn(tags, data)`
- `info(tags, data)`
- `debug(tags, data)`
- `ok(tags, data)`

Each of these is an alias to
[`Server#log`](http://hapijs.com/api#serverlogtags-data-timestamp).  The "level"
used will be added as a tag (in addition to the `namespace` and `project`
tags, and any other tags passed).  For example:

```js
const digs = require('digs');

digs({
  app: {
    namespace: 'digs',
    project: 'home'
  }
})
  .then((digsServer) => {
    const obj = DigsObject({}, digsServer);
    obj.info(['foo'], 'Bar!');
    // -> digsServer.log(['digs', 'home', 'info', 'foo'], 'Bar!');
  });
```

Additional tags *must* be specified as an `Array`.  This allows you to simply:

```js
obj.info('Bar!');
```

if no extra tags are necessary.

A `log()` method is also available which bypasses the "level":

```js
obj.log(['baz'], 'Quux!');
// -> digsServer.log(['digs', 'home', 'baz'], 'Quux!');
```

##### Custom Logging Functions

To configure the "levels", provide a `logColors` object when instantiating:

```js
const obj = DigsObject({
  logColors: {
    good: 'green',
    bad: 'yellow',
    ugly: 'red'
  }
}, digsServer);
```

Each color must be a valid [chalk](https://www.npmjs.com/package/chalk) color.

#### Server Method Passthroughs

An object created with `DigsObject()` also has the following methods which pass
through to the `Server` instance:

- `expose()`
- `register()`
- `method()`
- `handler()`
- `route()`
- `decorate()`

Currently, this list is fixed, but it may be changed to support all `Server`
methods available in a plugin context.

### DigsEmitter

`DigsEmitter` is a handy way to add `EventEmitter` functionality to any object.

The following code:

```js
const obj = DigsEmitter()
  .methods({
    bonk() {
      this.emit('bonk');
    }
  });
```

is *roughly* equivalent to:

```js
class DigsEmitter extends EventEmitter {
  bonk() {
    this.emit('bonk');
  }
};

const obj = new DigsEmitter();
```

See the [stampit] docs for more info.

### DigsFSM

With `DigsFSM`, any object can be composed into a Promise-driven finite state
machine.

```js
const fsm = DigsFSM
  .methods({
    onbar(options) {
      console.log(`The "bar" event happened in state "${options.from}"`);
    }
  })
  .initial('foo')
  .events([
    {
      name: 'bar',
      from: 'foo',
      to: 'baz'
    }
  ])();

// triggers onbar() above; changes state to "baz"
fsm.bar()
  .then(() => {
    fsm.state === fsm.current === 'baz' // true
  });
```

The Promise implementation used is
[bluebird](https://www.npmjs.com/package/bluebird).

See the [fsm-as-promised](https://www.npmjs.com/package/fsm-as-promised) docs
for more information.

#### DigsIdentifier

`DigsIdentifier` provides a way to identify objects.  Each object is assigned
a unique identifier (property `id`) if an identifier is not provided.

In addition, any definition composed from `DigsIdentifier` can identify itself,
creating string representations (via `Object.prototype.toString()`) convenient
for logging.

```js
const HotDog = DigsIdentifier
  .static({
    defName: 'HotDog'
  });

const hotDog = HotDog();
`${hotDog}: I need mustard.`; // HotDog<HotDog#1>: I need mustard.
hotDog.id; // HotDog#1

const anotherHotDog = HotDog();
`${anotherHotDog}: I need ketchup.`; // HotDog<HotDog#2>: I need ketchup.
anotherHotDog.id; // HotDog#2

const bratwurst = HotDog({
  id: 'bratwurst'
});
`${bratwurst}: I need kraut.`; // HotDog<bratwurst>: I need kraut.
bratwurst.id; // bratwurst
```

#### DigsParamValidator, DigsPrevalidator & DigsInitValidator

TODO; general idea is that method parameter, object state upon method call, and
instantiation can all be easily validated via
[Joi](https://www.npmjs.com/package/joi).

## Author

[Christopher Hiller](http://boneskull.com)

## License

MIT

[Digs]: https://www.npmjs.com/package/digs
[stampit]: https://npmjs.com/package/stampit
