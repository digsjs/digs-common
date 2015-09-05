'use strict';

let _ = require('lodash');
let slug = require('slug');

function slugify(str) {
  if (!_.isString(str)) {
    return str;
  }
  let slugged = slug(str);
  let slugified = slugged;
  let slugs = slugify.slugs;
  while (slugs.has(slugified)) {
    slugified = _.uniqueId(slugged + '-');
  }
  slugified = slugified.toLowerCase();
  slugs.add(slugified);
  return slugified;
}
slugify.slugs = new Set();

_.mixin({
  slugify: _.memoize(slugify)
}, {
  chain: false
});

module.exports = _;
