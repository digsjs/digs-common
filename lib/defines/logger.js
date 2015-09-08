'use strict';

let common = require('..');
let define = common.define;
let DigsDefaults = require('./defaults');
let chalk = require('chalk');
let _ = common.utils;

const DigsLogger = define({
  init: function digsLoggerInit(context) {
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
  .static({
    define: 'DigsLogger'
  });

module.exports = DigsDefaults.compose(DigsLogger);
