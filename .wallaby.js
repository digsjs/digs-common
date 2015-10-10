'use strict';

module.exports = function wallabyConfig() {
  return {
    files: [
      'lib/**/*.js',
      {
        pattern: 'test/mocks/*.js',
        instrument: false
      }
    ],
    tests: [
      'test/**/*.spec.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha',
    bootstrap: function bootstrap(wallaby) {
      var path = require('path');
      require(path.join(wallaby.localProjectDir, 'test', 'fixture'));
    }
  };
};
