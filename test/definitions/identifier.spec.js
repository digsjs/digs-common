'use strict';

const DigsIdentifier = require('../../lib/definitions/identifier');

describe(`definitions/DigsIdentifier`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsIdentifier');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(`static`, () => {
    describe(`property`, () => {
      describe(`defName`, () => {
        it(`should provide "defName"`, () => {
          expect(DigsIdentifier.defName).to.be.a('string');
        });
      });

      describe(`defaultDefName`, () => {
        it(`should provide "defaultDefName"`, () => {
          expect(DigsIdentifier.defaultDefName).to.be.a('string');
        });
      });
    });
  });

  describe(`init()`, () => {
    it(`should generate an id based on defName`, () => {
      expect(DigsIdentifier().id).to.match(/^DigsIdentifier-\d+/);
    });

    it(`should use default defName if definition has no defName`, () => {
      DigsIdentifier.defName = '';
      expect(DigsIdentifier().id).to.match(/^UnknownObject-\d+/);
    });

    it(`should not generate an id if one is provided`, () => {
      expect(DigsIdentifier({id: 'foo'}).id).to.equal('foo');
    });
  });
});
