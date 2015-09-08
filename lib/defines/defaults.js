'use strict';

let DigsObject = require('./object');
let common = require('..');
let define = common.define;
let path = require('path');
let _ = common.utils;

const DEFAULTS_FILE = 'defaults.json';

const DigsDefaults = define({
  init: function digsDefaultsInit(context) {
    try {
      const dirname = path.dirname(module.parent.filename);
      const defaultsFile = path.join(dirname, DEFAULTS_FILE);
      const packageDefaults = require(defaultsFile);
      const defaults = packageDefaults[context.stamp.define];

      _.defaults(context.instance, defaults);
    } catch (ignored) {
      // ignored
    }
  }
})
  .static({
    define: 'DigsDefaults'
  });

module.exports = DigsObject.compose(DigsDefaults);
