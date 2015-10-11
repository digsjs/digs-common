'use strict';

const _ = require('../../lib').utils;
const DigsObject = require('../../lib/definitions/object');
const chalk = require('chalk');
const DigsLogger = require('../../lib/definitions/logger');

describe(`DigsLogger`, () => {
  chalk.enabled = false;

  let sandbox;
  let digs;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsLogger');
    digs = require('../mocks/digs')(sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be composed from DigsObject`, () => {
    const methods = DigsObject.fixed.methods;
    _.each(methods, (method, methodName) => {
      expect(DigsLogger.fixed.methods[methodName]).to.equal(method);
    });

    const init = DigsObject.fixed.init;
    _.each(init, (method) => {
      expect(_.contains(DigsLogger.fixed.init, method)).to.be.true;
    });
  });

  it('should have a log() function', () => {
    expect(DigsLogger({}, digs).log).to.be.a('function');
  });

  it('should have convenience logging methods', () => {
    const dl = DigsLogger({}, digs);
    _.each(_.keys(dl.colors), (func) => {
      expect(dl[func]).to.be.a('function');
    });
  });

  describe('log()', () => {
    let dl;

    beforeEach(() => {
      dl = DigsLogger({}, digs);
    });

    it('should not call digs.log() if no parameters passed', () => {
      dl.log();
      expect(dl._digs.log).not.to.have.been.called;
    });

    it('should call digs.log()', () => {
      dl.log('foo');
      expect(dl._digs.log).to.have.been.calledOnce;
    });

    it('should insert default tags', () => {
      dl.log('foo');
      expect(dl._digs.log).to.have.been.calledWithExactly([
        dl.namespace,
        dl.project
      ], 'foo');
    });

    it('should append any other tags to the list of tags', () => {
      dl.log('bar', 'foo');
      expect(dl._digs.log).to.have.been.calledWithExactly([
        dl.namespace,
        dl.project,
        'foo'
      ], 'bar');
    });

    describe('convenience methods', () => {
      _.each([
        'debug',
        'ok',
        'error',
        'info',
        'warn'
      ], (methodName) => {
        it(`should add "${methodName}" to the list of tags`, () => {
          dl[methodName]('foo');
          expect(dl._digs.log).to.have.been.calledWithExactly([
            dl.namespace,
            dl.project,
            methodName
          ], 'foo');
        });
      });
    });
  });
});
