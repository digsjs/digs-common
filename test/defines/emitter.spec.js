'use strict';

const DigsEmitter = require('../../lib/definitions/emitter');

describe(`DigsEmitter`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsEmitter');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should have EventEmitter behavior`, (done) => {
    const emitter = DigsEmitter();
    emitter.on('foo', (data) => {
      expect(data).to.equal('bar');
      done();
    });
    emitter.emit('foo', 'bar');
  });

  describe(`gotchas`, () => {
    // see https://github.com/stampit-org/stampit/issues/148

    it(`should break if init() is used`, () => {
      expect(DigsEmitter.init()).to.be.undefined;
    });

    it(`should support composition`, () => {
      const define = require('../../lib/define');
      expect(DigsEmitter.compose(define())).to.be.a('function');
    });
  });
});
