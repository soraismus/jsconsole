var initialize = require('./initialize.js');

function transform(_string) {
  return _string + _string;
}

initialize(transform);
