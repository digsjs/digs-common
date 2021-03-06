'use strict';

const define = require('../define');
const _ = require('../utils');
const DigsInitValidator = require('./init-validator');
const chalk = require('chalk');

const validator = DigsInitValidator.validator;
const DEFAULT_LOG_COLORS = {
  debug: 'black',
  ok: 'green',
  error: 'red',
  info: 'blue',
  warn: 'yellow'
};

const digsSchema = validator.object({
  settings: validator.object({
    app: validator.object({
      namespace: validator.string()
        .required()
        .description('digs server namespace'),
      project: validator.string()
        .required()
        .description('digs server project')
    })
      .description('app-specific initialization options')
      .required()
  })
    .description('initialization options')
    .required()
})
  .description('digs (Hapi server) instance')
  .unknown();

const DigsLogger = define({
  refs: {
    logColors: DEFAULT_LOG_COLORS
  },
  'static': {
    defaultLogColors: DEFAULT_LOG_COLORS,
    logMethodsPrototype(colors) {
      validator.assert(colors, validator.object()
        .required()
        .description('log level -> color mapping'));
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
  },
  init(context) {
    return _.extend(this, context.stamp.logMethodsPrototype(this.logColors));
  }
});

const DigsHapiProxy = define({
  'static': {
    hapiProxyMethods: [
      'expose',
      'register',
      'method',
      'handler',
      'route',
      'decorate'
    ],
    hapiMethodsPrototype(server, proxyMethods) {
      return _(proxyMethods)
        .map((methodName) => {
          return [
            methodName, () => {
              return server[methodName].apply(server, arguments);
            }
          ];
        })
        .object()
        .value();
    }
  },
  init(context) {
    const def = context.stamp;
    return _.extend(this,
      def.hapiMethodsPrototype(this.digs, def.hapiProxyMethods));
  }
});

const DigsObject = define({
  'static': {
    digsSchema: digsSchema
  },
  init(context) {
    const digs = _.first(context.args);
    const appSettings = digs.settings.app;

    _.defaults(this, {
      namespace: appSettings.namespace,
      project: appSettings.project,
      digs: digs
    });
  }
})
  .compose(DigsInitValidator)
  .validateInitArgs(validator.params(digsSchema)
    .description('digs server')
    .min(1))
  .compose(DigsHapiProxy)
  .compose(DigsLogger);

module.exports = DigsObject;
