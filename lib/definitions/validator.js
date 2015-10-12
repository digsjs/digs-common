'use strict';

let validator = require('../validator');
let define = require('../define');
let _ = require('../utils');

const DigsValidator = define({
  'static': {
    validator: validator
  },
  methods: {
    doValidate(schema, value, opts) {
      opts = _.defaults(opts || {}, {
        allowUnknown: true
      });
      const result = validator.validate(value, schema, opts);
      if (result.error) {
        throw result.error;
      }
      return result.value;
    },
    methodValidator(method, schema, value, opts) {
      if (!_.isFunction(method)) {
        throw new Error(`unknown function`);
      }
      const result = [].concat(this.doValidate(schema, value, opts));
      return method.apply(this, result);
    }
  }
});

module.exports = DigsValidator;
