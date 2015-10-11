'use strict';

let Promise = require('./promise');
module.exports = Promise.promisifyAll(require('joi'));
