'use strict';

let _ = require('../../../lib').utils;
let digsObjectSuite = require('./object');

function digsDefaultsSuite(DigsDefaults) {
  return DigsDefaults;
}

module.exports = _.flow(digsObjectSuite, digsDefaultsSuite);
