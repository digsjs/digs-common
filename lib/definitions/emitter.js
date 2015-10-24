'use strict';

const define = require('../define');
const EventEmittable = define
  .convertConstructor(require('events').EventEmitter);

const DigsEmitter = define().compose(EventEmittable);

module.exports = DigsEmitter;
