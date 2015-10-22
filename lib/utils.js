'use strict';

let _ = require('lodash');
let slug = require('slug');

function slugify(str) {
  if (!_.isString(str)) {
    return str;
  }
  const slugs = slugify.slugs;
  const slugified = slug(str).toLowerCase();
  let uniqueSlug = slugified;
  while (slugs.has(uniqueSlug)) {
    uniqueSlug = _.uniqueId(`${slugified}-`);
  }
  slugs.add(uniqueSlug);
  return uniqueSlug;
}
slugify.slugs = new Set();

function isSingular(value) {
  return _.size(value) === 1;
}

const noChainOpts = {
  chain: false
};

_.mixin({
  slugify: _.memoize(slugify),
  isSingular: isSingular
}, noChainOpts);

module.exports = _;
