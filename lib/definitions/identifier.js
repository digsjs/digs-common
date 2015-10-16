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
    const defName = stamp.defName || stamp.defaultDefName;
    const id = context.instance.id || _.uniqueId(`${defName}#`);
    Object.defineProperties(this, {
      id: {
        value: id,
        writable: false,
        configurable: false
      },
      defName: {
        value: defName,
        writable: false,
        configurable: false
      }
    });
  },
  methods: {
    toString() {
      return `${this.defName}<${this.id}>`;
    }
  }
});

module.exports = DigsIdentifier;
