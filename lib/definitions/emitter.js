'use strict';

let define = require('../define');
let EventEmittable = define.convertConstructor(require('events').EventEmitter);

const DigsEmitter = define().compose(EventEmittable);

module.exports = DigsEmitter;
