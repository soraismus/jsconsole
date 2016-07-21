var components           = require('../components/components');
var createPrompt         = components.createPrompt;
var createOldPrompt      = components.createOldPrompt;
var createOldPromptReply = components.createOldPromptReply;
var elements             = require('../../../lib/elements');
var DIV                  = elements.DIV;
var PRE                  = elements.PRE;

function recreateConsole (prefixes, viewport) {
  var promptLabel = prefixes.promptLabel;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var entries = viewport.terminal.entries
    .slice(frame.start, frame.start + frame.offset)
    .map(renderComponent.bind(null, prefixes));

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
      entries,
      createPrompt(
        promptLabel,
        prompt.preCursor,
        prompt.postCursor)));
}

function renderComponent(prefixes, component) {
  var promptLabel = prefixes.promptLabel;
  switch (component.type) {
    case 'command':
      return createOldPrompt(promptLabel + component.value);
    case 'response':
      return createOldPromptReply(component.value);
    case 'display':
      return createOldPrompt(component.value);
    case 'completion':
      return createOldPrompt('  ' + component.value);
    case 'error':
      return createOldPrompt('...> ' + component.value);
    default:
      throw new Error('invalid component type');
  }
}

module.exports = recreateConsole;
