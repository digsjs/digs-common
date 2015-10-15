'use strict';

const Promise = require('./promise');
const Joi = Promise.promisifyAll(require('joi'));

Joi.params = function params() {
  const arrSchema = Joi.array();
  return arrSchema.ordered.apply(arrSchema, arguments);
};

module.exports = Joi;
