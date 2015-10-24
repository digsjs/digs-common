'use strict';

const DigsValidator = require('./validator');
const define = require('../define');
const _ = require('../utils');

const DigsParamValidator = define({
  'static': {
    validateParams(methodName, schema) {
      const paramValidations = this.fixed.refs.validations || {};
      paramValidations[methodName] = schema;
      return this.refs({
        paramValidations: paramValidations
      });
    }
  },
  init() {
    _.forOwn(this.paramValidations, (schema, methodName) => {
      const validate = _.bind(this.methodValidator,
        this,
        this[methodName],
        schema);
      this[methodName] = function paramValidator() {
        return validate(_.toArray(arguments));
      };
    });
  }
})
  .compose(DigsValidator);

module.exports = DigsParamValidator;
