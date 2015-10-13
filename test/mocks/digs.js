'use strict';

module.exports = function digsMock(sandbox, types) {
  if (!types) {
    types = require('digs-data').types;
  }
  return {
    namespace: 'digs',
    project: 'home',
    settings: {
      app: {
        namespace: 'digs',
        project: 'home'
      }
    },
    log: sandbox.stub(),
    types: types
  };
};
