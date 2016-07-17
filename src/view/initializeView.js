var interpreter            = require('../../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;

function initializeView(root, _console) {
  createAndAttachElement(root, _console);
}

module.exports = initializeView;
