'use strict';

let DigsValidator = require('./validator');
let define = require('../define');
let validator = require('../validator');

const DigsInitValidator = define({
  'static': {
    validateInitArgs(schema) {
      return DigsValidator.init(function init(context) {
        this.doValidate(this.initValidationArgs, context.args);
      })
        .compose(this)
        .refs({
          initValidationArgs: schema
        });
    },
    validateInitInstance(schema) {
      return DigsValidator.init(function init() {
        this.doValidate(this.initValidationInstance, this);
      })
        .compose(this)
        .refs({
          initValidationInstance: schema
        });
    },
    validator: validator
  }
});

module.exports = DigsInitValidator;
