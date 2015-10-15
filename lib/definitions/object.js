'use strict';

let define = require('../define');
let _ = require('../utils');
let DigsInitValidator = require('./init-validator');
let chalk = require('chalk');

const validator = DigsInitValidator.validator;

const DEFAULT_LOG_COLORS = {
  debug: 'black',
  ok: 'green',
  error: 'red',
  info: 'blue',
  warn: 'yellow'
};

const DigsObject = define({
  'static': {
    defaultLogColors: DEFAULT_LOG_COLORS,
    logMethods(colors) {
      validator.assert(colors, validator.object().required());
      return _(colors)
        .pick((color) => _.isFunction(chalk[color]))
        .mapValues((color, methodName) => {
          const func = chalk[color];
          return function logProxy(data, tags) {
            return this.log(func(data), [methodName].concat(tags || []));
          };
        })
        .value();
    }
  },
  refs: {
    logColors: DEFAULT_LOG_COLORS
  },
  init(context) {
    const digs = _.first(context.args);
    const appSettings = digs.settings.app;

    _.defaults(this, {
      namespace: appSettings.namespace,
      project: appSettings.project,
      digs: digs
    });

    return _.extend(this, DigsObject.logMethods(this.logColors));
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
      this.digs.log(tags, data);
    }
  }
})
  .compose(DigsInitValidator)
  .validateInit(validator.array()
    .ordered(validator.object({
      settings: validator.object({
        app: validator.object({
          namespace: validator.string().required(),
          project: validator.string().required()
        }).required()
      }).required()
    }))
    .min(1));

module.exports = DigsObject;
