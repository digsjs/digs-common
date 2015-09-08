'use strict';

let common = require('..');
let define = common.define;
let DigsObject = require('./object');
let chalk = require('chalk');
let _ = common.utils;

const DigsLogger = define({
  refs: {
    colors: {
      debug: 'black',
      ok: 'green',
      error: 'red',
      info: 'blue',
      warn: 'yellow'
    }
  },
  init(context) {
    const instance = context.instance;
    const logMethods = _.mapValues(instance.colors,
      function logMethod(color, methodName) {
        return function logProxy(data, tags) {
          return this.log(chalk[color](data), [methodName].concat(tags || []));
        };
      });
    return _.extend(instance, logMethods);
  },
  methods: {
    log(data, tags) {
      if (!arguments.length) {
        return;
      }
      tags = [
        this.namespace,
        this.project
      ].concat(tags || []);
      this._digs.log(tags, data);
    }
  }
})
  .compose(DigsObject);

module.exports = DigsLogger;
