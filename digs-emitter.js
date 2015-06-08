'use strict';

let events = require('events');

class DigsEmitter extends events.EventEmitter {
  toString() {
    return `<${this.constructor.name}#${this.id}>`;
  }
}

module.exports = DigsEmitter;
