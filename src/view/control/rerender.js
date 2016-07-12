var interpreter            = require('../../../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;
var recreateConsole        = require('./recreateConsole');

function rerender(node, prefixes, viewport) {
  node.innerHTML = '';
  createAndAttachElement(
    node,
    recreateConsole(prefixes, viewport));
}

module.exports = rerender;
