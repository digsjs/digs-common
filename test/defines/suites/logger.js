'use strict';

let digsDefaultsSuite = require('./defaults');
let _ = require('../../../lib').utils;

function digsLoggerSuite(DigsLogger) {
  const Server = require('hapi').Server;
  const chalk = require('chalk');

  chalk.enabled = false;

  const SERVER_CFG = {
    app: {
      namespace: 'digs',
      project: 'home'
    }
  };

  let sandbox;
  let digs;

  beforeEach(function() {
    sandbox = sinon.sandbox.create('DigsLogger');
    digs = new Server(SERVER_CFG);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should have a log() function', function() {
    expect(DigsLogger({}, digs).log).to.be.a('function');
  });

  it('should have convenience logging methods', function() {
    const dl = DigsLogger({}, digs);
    expect(dl.debug).to.be.a('function');
    expect(dl.ok).to.be.a('function');
    expect(dl.info).to.be.a('function');
    expect(dl.warn).to.be.a('function');
    expect(dl.error).to.be.a('function');
  });

  describe('log()', function() {
    let dl;

    beforeEach(function() {
      dl = DigsLogger({}, digs);
      sandbox.stub(dl._digs, 'log');
    });

    it('should not call digs.log() if no parameters passed', function() {
      dl.log();
      expect(dl._digs.log).not.to.have.been.called;
    });

    it('should call digs.log()', function() {
      dl.log('foo');
      expect(dl._digs.log).to.have.been.calledOnce;
    });

    it('should insert default tags', function() {
      dl.log('foo');
      expect(dl._digs.log).to.have.been.calledWithExactly([
        dl.namespace,
        dl.project
      ], 'foo');
    });

    it('should append any other tags to the list of tags', function() {
      dl.log('bar', 'foo');
      expect(dl._digs.log).to.have.been.calledWithExactly([
        dl.namespace,
        dl.project,
        'foo'
      ], 'bar');
    });

    describe('convenience methods', function() {
      _.each([
        'debug',
        'ok',
        'error',
        'info',
        'warn'
      ], function(methodName) {
        it(`should add "${methodName}" to the list of tags`, function() {
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
  return DigsLogger;
}

module.exports = _.flow(digsDefaultsSuite, digsLoggerSuite);
