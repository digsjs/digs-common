'use strict';

const define = require('../define');
const _ = require('../utils');

const DigsIdentifier = define({
  'static': {
    defName: 'DigsIdentifier',
    defaultDefName: 'UnknownObject'
  },
  init(context) {
    const stamp = context.stamp;
    this.id =
      this.id ||
      _.uniqueId(`${stamp.defName || DigsIdentifier.defaultDefName}-`);
  }

});

module.exports = DigsIdentifier;
