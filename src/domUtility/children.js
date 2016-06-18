function identifyChild(mode) {
  return function(specifier, index) {
    var result = { mode: mode, key: { index: index }};
    result.key[mode] = specifier;
    return result;
  };
}

function identifyChildren(mode) {
  return function(specifier, index) {
    var result = { mode: mode, key: {}};
    result.key[mode] = specifier;
    return result;
  };
}

module.exports = {
  childByClass: identifyChild('class'),
  childByQuery: identifyChild('query'),
  childByTag: identifyChild('tag'),
  childrenByClass: identifyChildren('class'),
  childrenByQuery: identifyChildren('query'),
  childrenByTag: identifyChildren('tag')
};
