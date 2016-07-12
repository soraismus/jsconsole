var createConsole          = require('./components/createConsole');
var interpreter            = require('../../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;

function initializeView(config) {
  createAndAttachElement(
    config.getRoot(),
    createConsole(config.promptLabel));
}

module.exports = initializeView;

