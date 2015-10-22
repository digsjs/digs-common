'use strict';

describe('utils', () => {
  const _ = require('../lib/utils');
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('utils');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('slugify()', () => {
    const slug = require('slug');

    it('should return the value if it is not a string', () => {
      expect(_.slugify()).to.be.undefined;
      expect(_.slugify(1)).to.equal(1);
    });

    it('should slugify a string', () => {
      expect(_.slugify('i am slugified')).to.equal('i-am-slugified');
    });

    it('should be deterministic', () => {
      expect(_.slugify('hurble duh')).to.equal('hurble-duh');
      expect(_.slugify('hurble duh')).to.equal('hurble-duh');
    });

    it('should not return the same slug for two nonequal strings which would ' +
      'result in the same slug',
      () => {
        expect(slug('slugified am I')).to.equal(slug('slugified-am-I'));
        _.slugify('slugified am I');
        expect(_.slugify('slugified-am-I')).to.match(/slugified-am-i-\d+/);
      });
  });

  describe(`isSingular()`, () => {
    it(`should be a function`, () => {
      expect(_.isSingular).to.be.a('function');
    });

    it(`should return false on an empty array`, () => {
      expect(_.isSingular([])).to.be.false;
    });

    it(`should return false on an empty object`, () => {
      expect(_.isSingular({})).to.be.false;
    });

    it(`should return false on an array with more than one member`, () => {
      expect(_.isSingular([1, 2])).to.be.false;
    });

    it(`should return false on an object with more than one property`, () => {
      expect(_.isSingular({foo: 'bar', baz: 'quux'})).to.be.false;
    });

    it(`should return true on an array with one member`, () => {
      expect(_.isSingular([1])).to.be.true;
    });

    it(`should return true on an object with one member`, () => {
      expect(_.isSingular({foo: 'bar'})).to.be.true;
    });

    it(`should return false on a two-character string`, () => {
      expect(_.isSingular('pi')).to.be.false;
    });

    it(`should return true on a one-character string`, () => {
      expect(_.isSingular('f')).to.be.true;
    });

    it(`should return false on any number`, () => {
      expect(_.isSingular(0)).to.be.false;
      expect(_.isSingular(1)).to.be.false;
      expect(_.isSingular(-1)).to.be.false;
      expect(_.isSingular(2)).to.be.false;
      expect(_.isSingular(Infinity)).to.be.false;
    });

    it(`should return false on null`, () => {
      expect(_.isSingular(null)).to.be.false;
    });

    it(`should return false on undefined`, () => {
      expect(_.isSingular()).to.be.false;
    });
  });

  describe(`isMultiple()`, () => {
    it(`should be a function`, () => {
      expect(_.isMultiple).to.be.a('function');
    });

    it(`should return false on an empty array`, () => {
      expect(_.isMultiple([])).to.be.false;
    });

    it(`should return false on an empty object`, () => {
      expect(_.isMultiple({})).to.be.false;
    });

    it(`should return true on an array with more than one member`, () => {
      expect(_.isMultiple([1, 2])).to.be.true;
    });

    it(`should return true on an object with more than one property`, () => {
      expect(_.isMultiple({foo: 'bar', baz: 'quux'})).to.be.true;
    });

    it(`should return false on an array with one member`, () => {
      expect(_.isMultiple([1])).to.be.false;
    });

    it(`should return false on an object with one member`, () => {
      expect(_.isMultiple({foo: 'bar'})).to.be.false;
    });

    it(`should return true on a two-character string`, () => {
      expect(_.isMultiple('pi')).to.be.true;
    });

    it(`should return false on a one-character string`, () => {
      expect(_.isMultiple('f')).to.be.false;
    });

    it(`should return false on any number`, () => {
      expect(_.isMultiple(0)).to.be.false;
      expect(_.isMultiple(1)).to.be.false;
      expect(_.isMultiple(-1)).to.be.false;
      expect(_.isMultiple(2)).to.be.false;
      expect(_.isMultiple(Infinity)).to.be.false;
    });

    it(`should return false on null`, () => {
      expect(_.isMultiple(null)).to.be.false;
    });

    it(`should return false on undefined`, () => {
      expect(_.isMultiple()).to.be.false;
    });
  });
});
