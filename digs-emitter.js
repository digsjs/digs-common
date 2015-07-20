'use strict';

let events = require('events');
let _ = require('lodash');
let slugify = require('./slugify');
let Promise = require('bluebird');

class DigsEmitter extends events.EventEmitter {

  constructor() {
    super();

    createId(this);
    createValidatorProxies(this);
  }

  toString() {
    return `<${this.constructor.name}#${this.id}>`;
  }

  when(fulfilledEvent, rejectedEvent) {
    rejectedEvent = rejectedEvent || 'error';
    debug(`${this}: Waiting for event "${fulfilledEvent}"...`);
    return new Promise(function(resolve, reject) {
      this.once(fulfilledEvent, function(data) {
        this.removeListener(rejectedEvent, reject);
        resolve(data);
      })
        .once(rejectedEvent, reject);
    }.bind(this));
  }

  /**
   * Create a DigsEmitter instance from raw object
   * @param {Object} prototype Some object
   * @returns {DigsEmitter} DigsEmitter instance
   */
  static create(prototype) {
    let obj = _.create(DigsEmitter.prototype, prototype);
    createId(obj);
    createValidatorProxies(obj);
    return obj;
  }
}

function createId(ctx) {
  let name = slugify(ctx.constructor.name);
  ctx.id = ctx.id || _.uniqueId(`${name}-`);
  return ctx;
}

function createValidatorProxies(ctx) {
  let assertParams = require('./digs-util').assertParams;

  _.each(_.functions(ctx), function(funcName) {
    let schemata;
    let func = this[funcName];
    if (_.has(this, funcName) && _.isArray((schemata = func.schemata))) {
      this[funcName] = function validatorProxy() {
        assertParams(arguments, schemata);
        return func.apply(this, arguments);
      };
    }
  }, ctx);

  return ctx;
}

module.exports = DigsEmitter;
