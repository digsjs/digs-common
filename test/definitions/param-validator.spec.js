'use strict';

const DigsParamValidator = require('../../lib/definitions/param-validator');
const define = require('../../lib/define');

describe(`DigsParamValidator`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsParamValidator');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsParamValidator).to.be.a('function');
  });

  describe(`static methods`, () => {
    describe(`DigsParamValidator.validateParams()`, () => {
      it(`should be a function`, () => {
        expect(DigsParamValidator.validateParams).to.be.a('function');
      });

      it(`should create a definition which creates an object with a ` +
        `"paramValidations" property`,
        () => {
          expect(DigsParamValidator.validateParams()()).to.have
            .property('paramValidations');
        });
    });
  });


  describe(`init`, () => {
    it(`should validate the object when a function is called`, () => {
      const validator = DigsParamValidator.validator;
      const MyDef = define({
        methods: {
          foo() {
          }
        }
      }).compose(DigsParamValidator)
        .validateParams('foo',
          validator.array().ordered(validator.string().required()));

      const myDef = MyDef();
      expect(() => myDef.foo()).to.throw(Error);
      expect(() => myDef.foo('baz')).not.to.throw();
    });
  });
});
