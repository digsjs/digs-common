'use strict';

const DigsObject = require('../../lib/definitions/object');
const digsMock = require('../mocks/digs');
const chalk = require('chalk');
const _ = require('../../lib').utils;

chalk.enabled = false;

describe('definitions/DigsObject', () => {
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

  describe(`static`, () => {
    describe(`method`, () => {
      describe(`logMethods()`, () => {
        it(`should throw if not passed a "colors" parameter`, () => {
          expect(DigsObject.logMethods).to.throw(Error);
        });

        it(`should not create functions for colors which chalk does not have`,
          () => {
            expect(DigsObject.logMethods({debug: 'taupe'})).to.eql({});
          });

        it(`should create functions for colors which chalk has`, () => {
          expect(DigsObject.logMethods({debug: 'blue'}).debug)
            .to
            .be
            .a('function');
        });
      });
    });
  });

  describe(`init()`, () => {
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

    it('should have a "digs" property', () => {
      expect(DigsObject({}, digs).digs).to.equal(digs);
    });

    it(`should call DigsObject#logMethods`, () => {
      sandbox.spy(DigsObject, 'logMethods');
      const d = DigsObject({}, digs);
      expect(DigsObject.logMethods).to.have.been.calledWithExactly(d.logColors);
    });
  });

  describe(`method`, () => {
    let d;

    beforeEach(() => {
      d = DigsObject({}, digs);
    });

    describe(`generated`, () => {
      it('should have logging methods based on logColors', () => {
        _.each(_.keys(d.logColors), (func) => {
          expect(d[func]).to.be.a('function');
        });
      });

      _.each(_.keys(DigsObject.defaultLogColors), (methodName) => {
        it(`should add "${methodName}" to the list of tags`, () => {
          d[methodName]('foo');
          expect(d.digs.log).to.have.been.calledWithExactly([
            d.namespace,
            d.project,
            methodName
          ], 'foo');
        });
      });
    });

    describe('log()', () => {
      it(`should have a log() function`, () => {
        expect(d.log).to.be.a('function');
      });

      it('should not call digs.log() if no parameters passed', () => {
        d.log();
        expect(d.digs.log).not.to.have.been.called;
      });

      it('should call digs.log()', () => {
        d.log('foo');
        expect(d.digs.log).to.have.been.calledOnce;
      });

      it('should insert default tags', () => {
        d.log('foo');
        expect(d.digs.log).to.have.been.calledWithExactly([
          d.namespace,
          d.project
        ], 'foo');
      });

      it('should append any other tags to the list of tags', () => {
        d.log('bar', 'foo');
        expect(d.digs.log).to.have.been.calledWithExactly([
          d.namespace,
          d.project,
          'foo'
        ], 'bar');
      });
    });
  });
});
