var components = require('../components/components');
var ERL_CURSOR = components.ERL_CURSOR;
var ERL_LINE   = components.ERL_LINE;
var ERL_POST   = components.ERL_POST;
var ERL_PRE    = components.ERL_PRE;
var ERL_PROMPT = components.ERL_PROMPT;

var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var SECTION    = elements.SECTION;
var H1         = elements.H1;
var H4         = elements.H4;

var ERL_HEADER = SECTION(
    {
      id: 'erl-header',
      classes: { 'head': true }
    },
    H1(null, 'Erlking Lisp Console\n'),
    H4(null, 'A terminal emulator and lisp interpreter\n'));

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

  return DIV(
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

var defaultCompletionLabel = '  ';
var defaultDisplayLabel = '';
var defaultErrorLabel = '...> ';
var defaultPromptLabel = '> ';
var defaultResponseLabel = '==> ';

function specifyLine(prefixes, component) {
  var completionLabel = prefixes.completionLabel || defaultCompletionLabel;
  var displayLabel = prefixes.displayLabel || defaultDisplayLabel;
  var errorLabel = prefixes.errorLabel || defaultErrorLabel;
  var promptLabel = prefixes.promptLabel || defaultPromptLabel;
  var responseLabel = prefixes.responseLabel || defaultResponseLabel;

  var entry;
  switch (component.type) {
    case 'command':
      entry = promptLabel + component.value;
      break;
    case 'response':
      entry = responseLabel + component.value;
      break;
    case 'display':
      entry = displayLabel + component.value;
      break;
    case 'completion':
      entry = completionLabel + component.value;
      break;
    case 'error':
      entry = errorLabel + component.value;
      break;
    default:
      throw new Error('invalid component type');
  }
  return ERL_LINE(entry);
}

var _erlkingConfig = {
  id: 'erlking',
  classes: { 'erlking': true, 'container': true }
};
var _consoleConfig = { id: 'erl-console' };
var _terminalConfig = { classes: { 'terminal': true }};
var _erlViewportConfig = { classes: { 'erl-viewport': true }};

module.exports = ERLKING;
