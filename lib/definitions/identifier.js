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
    const defName = this.defName = stamp.defName || stamp.defaultDefName;
    this.id = this.id || _.uniqueId(`${defName}#`);
  },
  methods: {
    toString() {
      return `${this.defName}<${this.id}>`;
    }
  }
});

module.exports = DigsIdentifier;
