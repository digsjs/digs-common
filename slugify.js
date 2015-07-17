'use strict';

let _ = require('lodash'),
  slug = require('slug');

let slugs = new Set(),
  debug = require('debug')('digs:digs-common:slugify');

module.exports = function slugify(str) {
  if (!_.isString(str)) {
    return str;
  }
  let slugged = slug(str),
    slugified = slugged;
  while (slugs.has(slugified)) {
    slugified = _.uniqueId(slugged + '-');
  }
  slugified = slugified.toLowerCase();
  slugs.add(slugified);
  if (str !== slugified) {
    debug(`slugified: "${str}" => "${slugified}"`);
  }
  return slugified;
};
