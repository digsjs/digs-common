'use strict';

const DigsPrevalidator = require(`../../lib/definitions/prevalidator`);
const define = require(`../../lib/define`);

describe(`definitions/DigsPrevalidator`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsPrevalidator');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsPrevalidator).to.be.a('function');
  });

  describe(`static`, () => {
    describe(`method`, () => {
      describe(`prevalidate()`, () => {
        it(`should be a function`, () => {
          expect(DigsPrevalidator.prevalidate).to.be.a('function');
        });

        it(`should create a definition which creates an object with a ` +
          `"prevalidations" property`,
          () => {
            expect(DigsPrevalidator.prevalidate()()).to.have
              .property('prevalidations');
          });
      });
    });
  });

  describe(`init()`, () => {
    it(`should validate the object when a function is called`, () => {
      const validator = DigsPrevalidator.validator;
      const MyDef = define({
        methods: {
          foo() {
          }
        }
      }).compose(DigsPrevalidator)
        .prevalidate('foo',
          validator.object({
            bar: validator.string().required()
          }));

      const myDef = MyDef();
      expect(() => myDef.foo()).to.throw(Error);
      myDef.bar = 'baz';
      expect(() => myDef.foo()).not.to.throw();
    });
  });
});

