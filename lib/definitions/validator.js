'use strict';

let validator = require('../validator');
let define = require('../define');
let _ = require('../utils');

function doValidate(schema, value) {
  const result = validator.validate(value, schema, {
    allowUnknown: true
  });
  if (result.error) {
    throw result.error;
  }
  return result.value;
}

function methodValidator(methodName, schema, value) {
  const result = doValidate.call(this, schema, value);
  return this[methodName].apply(this, result);
}

function init(context) {
  doValidate.call(this, this.initValidation, context.args);
}

const DigsValidator = define({
  'static': {
    prevalidate(methodName, schema) {
      const prevalidations = this.fixed.refs.prevalidations || {};
      prevalidations[methodName] = schema;
      return this.refs({
        prevalidations: prevalidations
      });
    },
    validateInit(schema) {
      if (this.fixed.refs.initValidation) {
        throw new Error('Refusing to overwrite init validator');
      }
      return define.init(init)
        .compose(this)
        .refs({
          initValidation: schema
        });
    },
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
      const validate = _.bind(methodValidator, this, methodName, schema);
      this[methodName] = () => validate(_.toArray(arguments));
    });

    _.forOwn(this.prevalidations, (schema, methodName) => {
      const validate = _.bind(methodValidator, this, methodName, schema);
      this[methodName] = () => validate(this);
    });
  }
});

module.exports = DigsValidator;
