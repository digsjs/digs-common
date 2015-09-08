'use strict';

let DigsLogger = require('../../lib/defines').DigsLogger;
let digsLoggerSuite = require('./suites/logger');
let _ = require('../../lib').utils;

describe('defines.DigsLogger', _.partial(digsLoggerSuite, DigsLogger));
