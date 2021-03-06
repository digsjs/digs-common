'use strict';

const DigsFSM = require('../../lib/definitions/fsm');
const _ = require('../../lib/utils');

describe(`definitions/DigsFSM`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create('DigsFSM');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should be a function`, () => {
    expect(DigsFSM).to.be.a('function');
  });

  describe(`static`, () => {
    describe(`method`, () => {
      describe(`initial()`, () => {
        it(`should be a function`, () => {
          expect(DigsFSM.initial).to.be.a('function');
        });

        it(`should throw if no string value passed`, () => {
          expect(() => DigsFSM.initial()).to.throw();
        });

        it(`should set an initial state`, () => {
          expect(DigsFSM.initial('foo').event({
            name: 'foo',
            from: 'none'
          })().current).to.equal('foo');
        });
      });

      describe(`event()`, () => {
        it(`should be provided`, () => {
          expect(DigsFSM.event).to.be.a('function');
        });

        it(`should throw if no opts passed`, () => {
          expect(DigsFSM.event).to.throw(Error);
        });

        it(`should not throw if an appropriate object passed`, () => {
          expect(() => DigsFSM.event({
            name: 'foo',
            from: 'bar',
            to: 'baz'
          })).not.to.throw();
        });

        it(`should throw if "from" is an array containing a non-string`, () => {
          expect(() => DigsFSM.event({
            name: 'foo',
            from: [1, 'bar'],
            to: 'baz'
          })).to.throw(Error);
        });

        it(`should not throw if "from" is an array of strings`, () => {
          expect(() => DigsFSM.event({
            name: 'foo',
            from: ['quux'],
            to: 'baz'
          })).not.to.throw();
        });

        it(`should populate "events" ref`, () => {
          const definition = DigsFSM.event({
            name: 'foo',
            from: ['quux'],
            to: 'baz'
          });
          expect(definition.fixed.refs.events).to.be.an('array');
        });
      });

      describe(`events()`, () => {
        it(`should throw if not passed an array of events`, () => {
          expect(() => DigsFSM.events([])).to.throw(Error);
          expect(() => DigsFSM.events([{}])).to.throw(Error);
          expect(() => DigsFSM.events([1])).to.throw(Error);
        });

        it(`should not throw if passed an array of events`, () => {
          expect(() => DigsFSM.events([
            {
              name: 'foo',
              from: 'bar',
              to: 'baz'
            }
          ])).not.to.throw();
        });

        it(`should call DigsFSM.event() for each event`, () => {
          sandbox.stub(DigsFSM, 'event').returns(DigsFSM);
          DigsFSM.events([
            {
              name: 'foo',
              from: 'bar',
              to: 'baz'
            }, {
              name: 'winken',
              from: 'blinken',
              to: 'nod'
            }
          ]);
          expect(DigsFSM.event).to.have.been.calledTwice;
        });
      });
    });

    describe(`callback`, () => {
      it(`should be a function`, () => {
        expect(DigsFSM.callback).to.be.a('function');
      });

      it(`should throw if not passed a function name and function`, () => {
        expect(DigsFSM.callback).to.throw(Error);
      });

      it(`should throw if not passed a function name`, () => {
        expect(() => DigsFSM.callback(() => {
        })).to.throw(Error);
      });

      it(`should throw if not passed a function`, () => {
        expect(() => DigsFSM.callback('foo')).to.throw(Error);
      });

      it(`should not throw if passed a name and a function`, () => {
        expect(() => DigsFSM.callback('foo', () => {
        })).not.to.throw();
      });

      it(`should call "methods"`, () => {
        sandbox.spy(DigsFSM, 'methods');
        DigsFSM.callback('foo', () => {
        });
        expect(DigsFSM.methods).to.have.been.calledOnce;
      });

      it(`should populate "fixed.methods"`, () => {
        const def = DigsFSM.callback('foo', () => {
        });
        expect(def.fixed.methods.foo).to.be.a('function');
      });
    });

    describe(`callbacks`, () => {
      it(`should throw if not passed an object`, () => {
        expect(DigsFSM.callbacks).to.throw(Error);
      });

      it(`should not throw if passed an object`, () => {
        expect(() => DigsFSM.callbacks({
          foo() {
          }
        })).not.to.throw();
      });

      it(`should call DigsFSM.callback() for each key/value pair`, () => {
        sandbox.stub(DigsFSM, 'callback').returns(DigsFSM);
        DigsFSM.callbacks({
          foo() {
          },
          bar() {
          }
        });
        expect(DigsFSM.callback).to.have.been.calledTwice;
      });
    });
  });

  describe(`init()`, () => {
    it(`should throw if instance does not contain nonempty "initial" prop`,
      () => {
        expect(() => DigsFSM({
          initial: '',
          events: ['foo', 'bar']
        })).to.throw(Error);
      });

    it(`should throw if instance does not contain nonempty "events" prop`,
      () => {
        expect(() => DigsFSM({
          initial: 'foo',
          events: []
        })).to.throw(Error);
      });

    describe(`when setup thru static methods`, () => {
      it(`should create a FSM`, () => {
        const callbacks = {
          onleavefoo: sandbox.stub().returns(Promise.resolve()),
          onbar: sandbox.stub().returns(Promise.resolve()),
          onenterbaz: sandbox.stub().returns(Promise.resolve()),
          onenteredbaz: sandbox.stub().returns(Promise.resolve())
        };
        const fsm = DigsFSM
          .methods(callbacks)
          .initial('foo').events([
            {
              name: 'bar',
              from: 'foo',
              to: 'baz'
            }
          ])();
        expect(fsm.current).to.equal('foo');
        return fsm.bar()
          .then(() => {
            _.each(callbacks, (func) => expect(func).to.have.been.calledOnce);
          });
      });
    });

    describe(`when passed an instance`, () => {
      it(`should create a FSM`, () => {
        const callbacks = {
          onleavefoo: sandbox.stub().returns(Promise.resolve()),
          onbar: sandbox.stub().returns(Promise.resolve()),
          onenterbaz: sandbox.stub().returns(Promise.resolve()),
          onenteredbaz: sandbox.stub().returns(Promise.resolve())
        };
        const fsm = DigsFSM({
          initial: 'foo',
          callbacks: callbacks,
          events: [
            {
              name: 'bar',
              from: 'foo',
              to: 'baz'
            }
          ]
        });
        expect(fsm.current).to.equal('foo');
        return fsm.bar()
          .then(() => {
            _.each(callbacks, (func) => expect(func).to.have.been.calledOnce);
          });
      });

      it(`should alias "state" to "current"`, () => {
        const fsm = DigsFSM({
          events: [
            {
              name: 'foo',
              from: 'none',
              to: 'foo'
            }
          ]
        });
        expect(fsm.state).to.equal(fsm.current);
      });
    });
  });
})
;
