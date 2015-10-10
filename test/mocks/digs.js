'use strict';

module.exports = function digsMock(sandbox) {
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
    types: require('digs-data').types
  };
};
