var interpreter            = require('../../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;

function initializeView(root, viewModel) {
  createAndAttachElement(root, viewModel);
}

module.exports = initializeView;
