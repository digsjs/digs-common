'use strict';

const define = require('../define');
const Promise = require('../promise');
const StateMachine = require('fsm-as-promised');
const _ = require('../utils');
const validator = require('../validator');
const DigsInitValidator = require('./init-validator');

StateMachine.Promise = Promise;
const eventSchema = validator.object({
  name: validator.string().required(),
  to: validator.string(),
  from: validator.alternatives()
    .try(validator.array()
      .items(validator.string()), validator.string())
    .required()
});

const DigsFSM = define({
  'static': {
    events(evts) {
      validator.assert(evts, validator.array().items(eventSchema).min(1));
      return _.reduce(evts, (definition, value) => {
        return definition.event(value);
      }, this);
    },
    event(evt) {
      validator.assert(evt, eventSchema);
      const events = this.fixed.refs.events;
      events.push(evt);
      return this.refs({
        events: events
      });
    },
    initial(state) {
      validator.assert(state, validator.string().required());
      return this.refs({
        initial: state
      });
    }
  },
  refs: {
    callbacks: {},
    initial: 'none',
    events: []
  },
  init(context) {
    Object.defineProperty(this, 'state', {
      get() {
        return this.current;
      }
    });

    StateMachine({
      initial: this.initial,
      events: this.events,
      callbacks: _.extend({}, context.stamp.fixed.methods, this.callbacks)
    }, this);
  }
})
  .compose(DigsInitValidator)
  .validateInitInstance(validator.object({
    initial: validator.string().required(),
    events: validator.array().items(eventSchema).required().min(1)
  }));

module.exports = DigsFSM;
