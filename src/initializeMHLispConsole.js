var initialize = require('./initialize.js');
var interpretLisp = require('./mal-lisp.js');

var display = function (value) {};

initialize(interpretLisp(display));
