'use strict';

describe('utils', function() {
  const _ = require('../lib/utils');
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create('utils');
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('slugify()', function() {
    const slug = require('slug');

    it('should return the value if it is not a string', function() {
      expect(_.slugify()).to.be.undefined;
      expect(_.slugify(1)).to.equal(1);
    });

    it('should slugify a string', function() {
      expect(_.slugify('i am slugified')).to.equal('i-am-slugified');
    });

    it('should be deterministic', function() {
      expect(_.slugify('hurble duh')).to.equal('hurble-duh');
      expect(_.slugify('hurble duh')).to.equal('hurble-duh');
    });

    it('should not return the same slug for two nonequal strings which would ' +
      'result in the same slug', function() {
      expect(slug('slugified am I')).to.equal(slug('slugified-am-I'));
      _.slugify('slugified am I');
      expect(_.slugify('slugified-am-I')).to.match(/slugified-am-i-\d+/);
    });
  });
});
