var initialize = require('./initialize.js');
var interpretLisp = require('./mal-lisp.js');

var promptLabel = 'Lisp > ';

var display = function (value) {};

initialize({
  promptLabel: promptLabel,
  transform: interpretLisp(display)
});
