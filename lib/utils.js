'use strict';

const _ = require('lodash');
const slug = require('slug');

const stringify = _.partialRight(require('stringify-object'), {
  indent: '  '
});

function slugify(str) {
  if (_.isNotString(str)) {
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

function isMultiple(value) {
  return _.size(value) > 1;
}

const mixins = _(_)
  .functions()
  .filter((funcName) => _.startsWith(funcName, 'is'))
  .map((funcName) => {
    const negatedFuncName = `isNot${funcName.substring(2)}`;
    return [negatedFuncName, _.negate(_[funcName])];
  })
  .object()
  .extend({
    slugify: _.memoize(slugify),
    isSingular: isSingular,
    isMultiple: isMultiple,
    stringify: stringify,
    dump: stringify
  })
  .value();

const noChainOpts = {
  chain: false
};

_.mixin(mixins, noChainOpts);

module.exports = _;
