'use strict';

const DigsInitValidator = require('../../lib/definitions/init-validator');
const DigsValidator = require('../../lib/definitions/validator');
const validator = require('../../lib/validator');

describe(`definitions/DigsInitValidator`, () => {
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

  describe(`static`, () => {
    describe(`property`, () => {
      it(`should provide static property "validator"`, () => {
        expect(DigsInitValidator.validator).to.equal(validator);
      });
    });
    describe(`method`, () => {
      describe(`validateInitArgs()`, () => {
        beforeEach(() => {
          sandbox.stub(DigsValidator.fixed.methods, 'doValidate');
        });

        it(`should be a function`, () => {
          expect(DigsInitValidator.validateInitArgs).to.be.a('function');
        });

        it(`should provide a definition which provides an object with an` +
          `"initValidationArgs" property`,
          () => {
            expect(DigsInitValidator.validateInitArgs('foo')())
              .to
              .have
              .property(
                'initValidationArgs');
          });

        it(`should provide an object which validates upon initialization`,
          () => {
            DigsInitValidator.validateInitArgs('foo')();
            expect(DigsValidator.fixed.methods.doValidate).to.have.been
              .calledWithExactly(
                'foo',
                []);
          });

        describe(`when called multiple times`, () => {
          it(`should use only the last specified validation schema`, () => {
            DigsInitValidator.validateInitArgs('foo').validateInitArgs('bar')();
            expect(DigsValidator.fixed.methods.doValidate).to.have.been
              .calledWithExactly(
                'bar',
                []);
          });

          it(`should provide an object with "initValidation" property using ` +
            `only the last specified validation schema`,
            () => {
              expect(DigsInitValidator.validateInitArgs('foo')
                .validateInitArgs('bar')().initValidationArgs).to.equal('bar');
            });
        });
      });

      describe(`validateInitInstance()`, () => {
        beforeEach(() => {
          sandbox.stub(DigsValidator.fixed.methods, 'doValidate');
        });

        it(`should be a function`, () => {
          expect(DigsInitValidator.validateInitInstance).to.be.a('function');
        });

        it(`should provide a definition which provides an object with an` +
          `"initValidationInstance" property`,
          () => {
            expect(DigsInitValidator.validateInitInstance('foo')()).to.have
              .property('initValidationInstance');
          });

        it(`should provide an object which validates upon initialization`,
          () => {
            const obj = DigsInitValidator.validateInitInstance('foo')();
            expect(DigsValidator.fixed.methods.doValidate).to.have.been
              .calledWithExactly(
                'foo',
                obj);
          });

        describe(`when called multiple times`, () => {
          it(`should use only the last specified validation schema`, () => {
            const obj = DigsInitValidator.validateInitInstance('foo')
              .validateInitInstance('bar')();
            expect(DigsValidator.fixed.methods.doValidate).to.have.been
              .calledWithExactly(
                'bar',
                obj);
          });

          it(`should provide an object with "initValidationInstance" ` +
            `property using only the last specified validation schema`,
            () => {
              expect(DigsInitValidator.validateInitInstance('foo')
                .validateInitInstance('bar')()
                .initValidationInstance).to.equal('bar');
            });
        });
      });
    });
  });
});
