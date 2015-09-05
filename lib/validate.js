'use strict';

let validate = require('joi');

function invalidParams() {
  return new Error('Invalid parameters');
}

function validateParams(args, schemata) {
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
    throw invalidParams();
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
    throw invalidParams();
  }

  _(args)
    .filter(function(arg, pos) {
      return schemata[pos];
    })
    .each(function(arg, pos) {
      let schema = schemata[pos];
      let desc = validate.describe(schema);
      let label = desc.label;
      compile(validate.validate(arg, schema), label || pos);
    });

  return retval;
}

function assertParams() {
  let retval = _.validateParams.apply(null, arguments);
  if (retval.errors) {
    let msg = _.toArray(retval.errors).join('\n');
    throw new Error(msg);
  }
  return retval.values;
}

validate.assertParams = assertParams;
validate.validateParams = validateParams;

module.exports = validate;