'use strict';

let _ = require('lodash');
let Joi = require('joi');
let ass = require('assert'); // this is not a political statement.
let errors = require('./errors');
let DigsEmitter = require('./digs-emitter');

let InvalidParameterError = errors.InvalidParameterError;
let debug = require('debug')('digs:digs-common:digs-util');

let DigsUtil = DigsEmitter.create({

  validate(value, schema) {
    if (arguments.length < 2) {
      throw new InvalidParameterError();
    }
    return Joi.validate(value, schema);
  },

  validateParams(args, schemata) {

    let retval = {
      errors: null,
      values: null
    };

    function compile(result, label) {
      if (result.error) {
        retval.errors = retval.errors || {};
        retval.errors[label] = result.error;
      }
      if (result.value) {
        retval.values = retval.values || {};
        retval.values[label] = result.value;
      }
    }

    if (arguments.length < 2) {
      throw new InvalidParameterError();
    }

    args = _.toArray(args);
    if (_.isFunction(schemata)) {
      if (schemata.schema) {
        schemata = [].concat(schemata.schema);
      } else {
        schemata = schemata.schemata;
      }
    }
    if (!schemata) {
      throw new InvalidParameterError();
    }

    debug('<validateParams>: validating args: %j', args);

    _.each(args, function (arg, pos) {
      let schema = schemata[pos];
      if (schema) {
        let desc = Joi.describe(schema);
        let label = desc.label;
        if (label) {
          return compile(DigsUtil.validate(arg, schema), label);
        }
        compile(DigsUtil.validate(arg, schema), pos);
      }
    });

    return retval;
  },

  assertParams() {
    let retval = DigsUtil.validateParams.apply(null, arguments);
    if (retval.errors) {
      let msg = _.toArray(retval.errors).join('\n');
      throw new InvalidParameterError(msg);
    }
    return retval.values;
  },

  assert() {
    if (arguments.length > 1) {
      let retval = DigsUtil.validate.apply(null, arguments);
      ass(retval.error === null);
      return retval.value;
    }
    ass(arguments[0]);
  },

  errorize(err) {
    if (_.isError(err)) {
      return err;
    }
    return new Error(err);
  }

});

module.exports = DigsUtil;
