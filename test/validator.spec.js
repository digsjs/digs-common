'use strict';

const validator = require('../lib/validator');

describe(`validator`, () => {
  describe(`methods`, () => {
    describe(`params()`, () => {
      it(`should be a function`, () => {
        expect(validator.params).to.be.a('function');
      });

      it(`should return a schema`, () => {
        expect(validator.params().isJoi).to.be.true;
      });

      it(`should return a schema in which all parameters are contained ` +
        `within an ordered array`,
        () => {
          const schema = validator.params(validator.string(),
            validator.number());
          expect(() => validator.assert(['foo', 0], schema)).not.to.throw();
        });
    });
  });
});
