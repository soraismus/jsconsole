var _display      = require('./console/initialize').display;
var initialize    = require('./console/initialize').initialize;
var interpretLisp = require('./mhlisp/mhlisp');

var promptLabel = 'Lisp> ';

var display = function (value) {
  _display(promptLabel, value);
};

initialize({
  promptLabel: promptLabel,
  transform: interpretLisp
});
