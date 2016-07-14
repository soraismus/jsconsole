var components = require('../components/components');
var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var PRE        = elements.PRE;

function recreateConsole (prefixes, viewport) {
  var entries = viewport.terminal.entries;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var completionLabel = prefixes.completionLabel;
  var displayLabel = prefixes.displayLabel;
  var errorLabel = prefixes.errorLabel;
  var promptLabel = prefixes.promptLabel;
  var responseLabel = prefixes.responseLabel;

  return DIV(
    {
      id: 'view',
      classes: { 'view': true }
    },
    PRE(
      {
        id: 'jsconsole',
        classes: { 'jsconsole': true }
      },
      components.header,
      entries.slice(frame.start, frame.start + frame.offset).map(renderComponent.bind(null, prefixes)),
      components.createPrompt(
        promptLabel,
        prompt.preCursor,
        prompt.postCursor)));
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

module.exports = recreateConsole;
