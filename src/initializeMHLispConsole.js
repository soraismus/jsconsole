var initialize    = require('./console/initialize');
var interpretLisp = require('./mhlisp/mhlisp');

var promptLabel = 'Lisp> ';

initialize({
  promptLabel: promptLabel,
  transform: interpretLisp
});
