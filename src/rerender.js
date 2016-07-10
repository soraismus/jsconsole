var components             = require('./components');
var interpreter            = require('../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;
var elements               = require('../lib/elements');
var DIV                    = elements.DIV;
var PRE                    = elements.PRE;

function rerender(node, prefixes, viewport) {
  var entries = viewport.terminal.entries;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var completionLabel = prefixes.completionLabel;
  var displayLabel = prefixes.displayLabel;
  var errorLabel = prefixes.errorLabel;
  var promptLabel = prefixes.promptLabel;
  var responseLabel = prefixes.responseLabel;
  node.innerHTML = '';
  createAndAttachElement(
    node,
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
        entries.slice(frame.start, frame.start + frame.offset).map(renderComponent.bind(null, prefixes)),
        components.createPrompt(
          promptLabel,
          prompt.preCursor,
          prompt.postCursor))));
}

function renderComponent(prefixes, component) {
  var promptLabel = prefixes.promptLabel;
  switch (component.type) {
    case 'command':
      return components.createOldPrompt(promptLabel + component.value);
    case 'response':
      return components.createOldPromptReply(component.value);
    case 'display':
      return components.createOldPrompt(component.value);
    case 'completion':
      return components.createOldPrompt('  ' + component.value);
    case 'error':
      return components.createOldPrompt('...> ' + component.value);
    default:
      throw new Error('invalid component type');
  }
}

module.exports = rerender;
