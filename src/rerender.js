var components             = require('./components');
var interpreter            = require('../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;
var elements               = require('../lib/elements');
var DIV                    = elements.DIV;
var PRE                    = elements.PRE;

function rerender(node, prefixes, browserViewPort) {
  var completionLabel = prefixes.completionLabel;
  var displayLabel = prefixes.displayLabel;
  var errorLabel = prefixes.errorLabel;
  var promptLabel = prefixes.promptLabel;
  var responseLabel = prefixes.responseLabel;
  node.innerHTML = '';
  createAndAttachElement(
    node, // document.getElementById('console'),
    DIV(
      {
        style: {
          'top': '0px',
          'left': '0px',
          'right': '0px',
          'bottom': '0px',
          'position': 'absolute',
          'overflow': 'auto'
        }
      },
      PRE(
        {
          classes: { 'jsconsole': true },
          style: {
            'margin': '0px',
            'position': 'relative',
            'min-height': '100%',
            'box-sizing': 'border-box',
            'padding': '10px',
            'padding-bottom': '10px'
          }
        },
        components.header,
        browserViewPort.viewItems.map(renderComponent),
        components.createPrompt(promptLabel))));
}

function renderComponent(component) {
  switch (component.type) {
    case 'command':
      return components.creatOldPrompt('...> ' + component.value);
    case 'response':
      return components.creatOldPromptReply(component.value);
    case 'display':
      return components.creatOldPrompt(component.value);
    case 'completion':
      return components.creatOldPrompt('  ' + component.value);
    case 'error':
      return components.creatOldPrompt('...> ' + component.value);
    default:
      throw new Error('invalid component type');
  }
}

module.exports = render;
