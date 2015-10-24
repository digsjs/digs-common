'use strict';

const Promise = require('./promise');

module.exports = Promise.promisifyAll(require('graceful-fs'));
