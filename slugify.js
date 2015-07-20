'use strict';

let _ = require('lodash');
let slug = require('slug');
let slugs = new Set();

module.exports = function slugify(str) {
  if (!_.isString(str)) {
    return str;
  }
  let slugged = slug(str);
  let slugified = slugged;
  while (slugs.has(slugified)) {
    slugified = _.uniqueId(slugged + '-');
  }
  slugified = slugified.toLowerCase();
  slugs.add(slugified);
  return slugified;
};
