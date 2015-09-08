'use strict';

let DigsObject = require('../../lib/defines').DigsObject;
let digsObjectSuite = require('./suites/object');
let _ = require('../../lib').utils;

describe('defines.DigsObject', _.partial(digsObjectSuite, DigsObject));
