var initialize = require('./console/initialize');
var interpretLisp = require('./mhlisp/mhlisp');

var promptLabel = 'Lisp> ';

var display = function (value) {};

initialize({
  promptLabel: promptLabel,
  transform: interpretLisp(display)
});
