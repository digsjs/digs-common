'use strict';

const DigsParamValidator = require('../../lib/definitions/validator');

describe(`DigsValidator`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsValidator');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsParamValidator).to.be.a('function');
  });
});
