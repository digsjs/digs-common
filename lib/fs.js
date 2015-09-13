'use strict';

let Promise = require('./promise');

module.exports = Promise.promisifyAll(require('graceful-fs'));
