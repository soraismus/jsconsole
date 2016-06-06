function identifyChild(mode) {
  return function(specifier, index) {
    var result = { mode: mode, key: { index: index }};
    result.key[mode] = specifier;
    return result;
  };
}

module.exports = {
  childByClass: identifyChild('class'),
  childByQuery: identifyChild('query'),
  childByTag: identifyChild('tag')
};
