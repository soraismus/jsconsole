var components = require('../components/components');
var ERL_ENTRY  = components.ERL_ENTRY;
var ERL_HEADER = components.ERL_HEADER;
var ERL_INPUT  = components.ERL_INPUT;
var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var PRE        = elements.PRE;

function ERLKING(prefixes, viewport) {
  var promptLabel = prefixes.promptLabel;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var entries = viewport.terminal.entries
    .slice(frame.start, frame.start + frame.offset)
    .map(specifyEntry.bind(null, prefixes));

  return DIV(
    _erlkonigConfig,
    PRE(
      _consoleConfig,
      ERL_HEADER,
      entries,
      ERL_INPUT(
        promptLabel,
        prompt.preCursor,
        prompt.postCursor)));
}

function specifyEntry(prefixes, component) {
  var completionLabel = '  ';
  var displayLabel = '';
  var errorLabel = '...> ';
  var promptLabel = prefixes.promptLabel;
  var responseLabel = '==> ';
  switch (component.type) {
    case 'command':
      return ERL_ENTRY(promptLabel + component.value);
    case 'response':
      return ERL_ENTRY(responseLabel + component.value);
    case 'display':
      return ERL_ENTRY(displayLabel + component.value);
    case 'completion':
      return ERL_ENTRY(completionLabel + component.value);
    case 'error':
      return ERL_ENTRY(errorLabel + component.value);
    default:
      throw new Error('invalid component type');
  }
}

var _erlkingConfig = { id: 'erlking' };
var _consoleConfig = { id: 'erl-console' };

module.exports = ERLKING;
