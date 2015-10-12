'use strict';

const DigsInitValidator = require('../../lib/definitions/init-validator');
const DigsValidator = require('../../lib/definitions/validator');
const validator = require('../../lib/validator');

describe(`DigsInitValidator`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsInitValidator');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsInitValidator).to.be.a('function');
  });

  describe(`static properties`, () => {
    it(`should provide static property "validator"`, () => {
      expect(DigsInitValidator.validator).to.equal(validator);
    });
  });

  describe(`static methods`, () => {
    describe(`DigsInitValidator.validateInit()`, () => {
      beforeEach(() => {
        sandbox.stub(DigsValidator.fixed.methods, 'doValidate');
      });

      it(`should be a function`, () => {
        expect(DigsInitValidator.validateInit).to.be.a('function');
      });

      it(`should provide a definition which provides an object with an` +
        `"initValidation" property`, () => {
          expect(DigsInitValidator.validateInit('foo')()).to.have.property(
            'initValidation');
        });

      it(`should provide an object which validates upon initialization`, () => {
        DigsInitValidator.validateInit('foo')();
        expect(DigsValidator.fixed.methods.doValidate).to.have.been
          .calledWithExactly(
            'foo',
            []);
      });

      describe(`when called multiple times`, () => {
        it(`should use only the last specified validation schema`, () => {
          DigsInitValidator.validateInit('foo').validateInit('bar')();
          expect(DigsValidator.fixed.methods.doValidate).to.have.been
            .calledWithExactly(
              'bar',
              []);
        });

        it(`should provide an object with "initValidation" property using ` +
          `only the last specified validation schema`,
          () => {
            expect(DigsInitValidator.validateInit('foo')
              .validateInit('bar')().initValidation).to.equal('bar');
          });
      });
    });
  });
});
