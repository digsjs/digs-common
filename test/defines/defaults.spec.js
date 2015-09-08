'use strict';

let DigsDefaults = require('../../lib/defines').DigsDefaults;
let digsDefaultsSuite = require('./suites/defaults');
let _ = require('../../lib/').utils;

describe('defines.DigsDefaults', _.partial(digsDefaultsSuite, DigsDefaults));
