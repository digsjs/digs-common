'use strict';

let events = require('events');
let _ = require('lodash');
let digsUtil = require('./digs-util');
let slugify = require('./slugify');

class DigsEmitter extends events.EventEmitter {

  constructor() {
    super();

    let name = slugify(this.constructor.name);
    this.id = _.uniqueId(`${name}-`);

    return new Proxy(this, {
      get: function (target, name) {
        let prop = name in target && target[name];
        let schemata;
        if (prop && _.isFunction(prop) && (schemata = prop.schemata)) {
          return function() {
            digsUtil.assertParams(arguments, schemata);
            return prop.apply(this, arguments);
          };
        }
        return target[name];
      }
    });
  }

  toString() {
    return `<${this.constructor.name}#${this.id}>`;
  }

  static create(prototype) {
    return _.create(DigsEmitter.prototype, prototype);
  }
}

module.exports = DigsEmitter;
