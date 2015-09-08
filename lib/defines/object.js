'use strict';

let common = require('..');
let define = common.define;
let EventEmitter = require('events').EventEmitter;
let validate = common.validate;
let _ = common.utils;

const EventEmittable = define.convertConstructor(EventEmitter);

const DigsObject = define({
  init: function init(context) {
    const digs = _.first(context.args);
    validate.assert(digs, validate.object({
      settings: validate.object({
        app: validate.object({
          namespace: validate.string()
            .required(),
          project: validate.string()
            .required()
        })
          .required()
          .unknown()
      })
        .required()
        .unknown()
    })
      .required()
      .unknown());
    const appSettings = digs.settings.app;
    this.namespace = appSettings.namespace;
    this.project = appSettings.project;
    this._digs = digs;
  }
})
  .compose(EventEmittable);

module.exports = DigsObject;
