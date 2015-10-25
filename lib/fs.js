'use strict';

const Promise = require('./promise');

const fs = Promise.promisifyAll(require('graceful-fs'));

fs.mkdirp = Promise.promisify(require('mkdirp'));

module.exports = fs;
