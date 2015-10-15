'use strict';

const DigsValidator = require('../../lib/definitions/validator');
const validator = require('../../lib/validator');

describe(`definitions/DigsValidator`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsValidator');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsValidator).to.be.a('function');
  });

  describe(`static`, () => {
    describe(`property`, () => {
      it(`should provide "validator"`, () => {
        expect(DigsValidator.validator).to.equal(validator);
      });
    });
  });

  describe(`method`, () => {
    let dv;

    beforeEach(() => {
      dv = DigsValidator();
    });

    describe(`doValidate()`, () => {
      beforeEach(() => {
        sandbox.stub(validator, 'validate').returns({
          value: 'foo'
        });
      });

      it(`should have method doValidate()`, () => {
        expect(dv.doValidate).to.be.a('function');
      });

      it(`should defer to validator.validate()`, () => {
        dv.doValidate('foo', 'bar');
        expect(validator.validate).to.have.been.calledOnce;
      });

      it(`should allow unknown values by default`, () => {
        dv.doValidate('foo', 'bar');
        expect(validator.validate).to.have.been.calledWith('bar',
          'foo',
          {
            allowUnknown: true
          });
      });

      it(`should allow setting of options explicitly`, () => {
        dv.doValidate('foo', 'bar', {
          allowUnknown: false
        });
        expect(validator.validate).to.have.been.calledWith('bar', 'foo', {
          allowUnknown: false
        });
      });

      it(`should throw if error returned by validator.validate()`, () => {
        validator.validate.restore();
        sandbox.stub(validator, 'validate').returns({
          error: new Error()
        });
        expect(() => dv.doValidate('foo', 'bar')).to.throw(Error);
      });

      it(`should return the value returned by validator.validate() if no error`,
        () => {
          expect(dv.doValidate('foo', 'bar')).to.equal('foo');
        });
    });

    describe(`methodValidator()`, () => {
      beforeEach(() => {
        sandbox.stub(dv, 'doValidate').returns('foo');
      });

      it(`should be a function`, () => {
        expect(dv.methodValidator).to.be.a('function');
      });

      describe(`if method not present`, () => {
        it(`should throw`, () => {
          expect(() => dv.methodValidator(dv.myFunc)).to.throw(Error,
            'unknown function');
        });
      });

      describe(`if method present`, () => {
        beforeEach(() => {
          dv.myFunc = sandbox.stub().returnsArg(0);
        });

        it(`should defer to DigsValidator#doValidate()`, () => {
          dv.methodValidator(dv.myFunc, 'foo', 'bar', 'opts');
          expect(dv.doValidate).to.have.been.calledWithExactly('foo',
            'bar',
            'opts');
        });

        it(`should call method with the result of DigsValidator#doValidate()`,
          () => {
            dv.methodValidator(dv.myFunc, 'foo', 'bar', 'opts');
            expect(dv.myFunc).to.have.been.calledWithExactly('foo');
          });
      });
    });
  });
});
