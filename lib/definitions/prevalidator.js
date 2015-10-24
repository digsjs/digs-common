'use strict';

const DigsValidator = require('./validator');
const define = require('../define');
const _ = require('../utils');

const DigsPrevalidator = define({
  'static': {
    prevalidate(methodName, schema) {
      const prevalidations = this.fixed.refs.prevalidations || {};
      prevalidations[methodName] = schema;
      return this.refs({
        prevalidations: prevalidations
      });
    }
  },
  init() {
    _.forOwn(this.prevalidations, (schema, methodName) => {
      const validate = _.bind(this.methodValidator,
        this,
        this[methodName],
        schema);
      this[methodName] = () => validate(this);
    });
  }
})
  .compose(DigsValidator);

module.exports = DigsPrevalidator;
