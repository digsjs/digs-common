'use strict';

const DigsObject = require('../../lib/definitions/object');
const digsMock = require('../mocks/digs');

describe('DigsObject', function digsObjectSuite() {
  let sandbox;
  let digs;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsObject');
    digs = digsMock(sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a function', () => {
    expect(DigsObject).to.be.a('function');
  });

  it('should throw if not passed a parameter', () => {
    expect(DigsObject).to.throw(Error);
  });

  it('should throw if not passed a "digs" param and value with ' +
    '"namespace" and "project" app settings',
    () => {
      expect(() => {
        DigsObject({});
      }).to.throw(Error);
    });

  it('should not throw if passed a "digs" param and value with ' +
    '"namespace" and "project" app settings',
    () => {
      expect(() => {
        DigsObject({}, digs);
      }).not.to.throw();
    });

  it('should have a "namespace" property', () => {
    expect(DigsObject({}, digs).namespace).to
      .equal(digsMock(sandbox).namespace);
  });

  it('should have a "project" property', () => {
    expect(DigsObject({},
      digs).project).to.equal(digsMock(sandbox).project);
  });

  it('should have a "_digs" property', () => {
    expect(DigsObject({}, digs)._digs).to.equal(digs);
  });
});
