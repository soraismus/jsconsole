var initialize = require('./initialize.js');
var interpretLisp = require('./mal-lisp.js');

function transform(_string) {
  return _string + _string;
}

initialize(interpretLisp);
