var components = require('../components/components');
var ERL_ENTRY  = components.ERL_ENTRY;
//var ERL_HEADER = components.ERL_HEADER;
//var ERL_INPUT  = components.ERL_INPUT;
var ERL_PROMPT = components.ERL_PROMPT;
var ERL_PRE    = components.ERL_PRE;
var ERL_POST   = components.ERL_POST;
var ERL_CURSOR = components.ERL_CURSOR;
var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var PRE        = elements.PRE;
var SECTION    = elements.SECTION;

/*
function ERLKING(prefixes, viewport) {
  var promptLabel = prefixes.promptLabel;
  var prompt = viewport.prompt;
  var frame = viewport.frame;
  var entries = viewport.terminal.entries
    .slice(frame.start, frame.start + frame.offset)
    .map(specifyEntry.bind(null, prefixes));
  return DIV(
    _erlkingConfig,
    PRE(
      _consoleConfig,
      entries,
      ERL_INPUT(
        promptLabel,
        prompt.preCursor,
        prompt.postCursor)));
}
*/

function ERLKING(prefixes, viewport) {
  var promptLabel = prefixes.promptLabel;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var entries = viewport.terminal.entries
    .slice(frame.start, frame.start + frame.offset)
    .map(specifyEntry.bind(null, prefixes));

  return SECTION(
    _erlkingConfig,
    DIV(
      null,
      SECTION(
        _terminalConfig,
        DIV(
          _terminalViewportConfig,
          entries,
          ERL_PROMPT(promptLabel),
          ERL_PRE(prompt.preCursor),
          ERL_CURSOR,
          ERL_POST(prompt.postCursor)))));
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

var _erlkingConfig = {
  id: 'erlking',
  classes: { 'erlking': true, 'container': true }
};
var _consoleConfig = { id: 'erl-console' };
var _terminalConfig = { classes: { 'terminal': true }};
var _terminalViewportConfig = { classes: { 'terminal-viewport': true }};

module.exports = ERLKING;
