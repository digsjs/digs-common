'use strict';

let DigsValidator = require('./validator');
let define = require('../define');
let validator = require('../validator');

const DigsInitValidator = define({
  'static': {
    validateInit(schema) {
      return DigsValidator.init(function init(context) {
        this.doValidate(this.initValidation, context.args);
      })
        .compose(this)
        .refs({
          initValidation: schema
        });
    },
    validator: validator
  }
});

module.exports = DigsInitValidator;
