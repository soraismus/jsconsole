var components = require('../components/components');
var ERL_CURSOR = components.ERL_CURSOR;
var ERL_LINE  = components.ERL_LINE;
var ERL_POST   = components.ERL_POST;
var ERL_PRE    = components.ERL_PRE;
var ERL_PROMPT = components.ERL_PROMPT;

var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var SECTION    = elements.SECTION;
var H1         = elements.H1;

var ERL_HEADER = SECTION(
    {
      id: 'erl-header',
      classes: { 'head': true }
    },
    H1(null, 'Welcome to ErlKing Lisp Console.\n'));

var emptyString = '';
function ERLKING(prefixes, viewport) {
  var promptLabel = prefixes.promptLabel;
  var prompt = viewport.prompt;
  var frame = viewport.frame;

  var lines = viewport.terminal.entries
    .slice(frame.start, frame.start + frame.offset)
    .map(specifyLine.bind(null, prefixes));

  var preCursor = prompt.preCursor != null ? prompt.preCursor : emptyString;
  var postCursor = prompt.postCursor != null ? prompt.postCursor : emptyString;

  return SECTION(
    _erlkingConfig,
    DIV(
      null,
      ERL_HEADER,
      SECTION(
        _terminalConfig,
        DIV(
          _erlViewportConfig,
          lines,
          ERL_PROMPT(promptLabel),
          ERL_PRE(prompt.preCursor),
          ERL_CURSOR,
          ERL_POST(prompt.postCursor)))));
}

function specifyLine(prefixes, component) {
  var completionLabel = '  ';
  var displayLabel = '';
  var errorLabel = '...> ';
  var promptLabel = prefixes.promptLabel;
  var responseLabel = '==> ';
  switch (component.type) {
    case 'command':
      return ERL_LINE(promptLabel + component.value);
    case 'response':
      return ERL_LINE(responseLabel + component.value);
    case 'display':
      return ERL_LINE(displayLabel + component.value);
    case 'completion':
      return ERL_LINE(completionLabel + component.value);
    case 'error':
      return ERL_LINE(errorLabel + component.value);
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
var _erlViewportConfig = { classes: { 'erl-viewport': true }};

module.exports = ERLKING;
