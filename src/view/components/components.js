var PRE  = require('../../../lib/elements').PRE;
var SPAN = require('../../../lib/elements').SPAN;

function ERL_ENTRY(text) {
  //return SPAN(_entryConfig, SPAN(null, text + newline));
  return PRE(_entryConfig, text + newline);
}

/*
// tortola does not consolidate PROMPT+INPUT+CURSOR as a distinct concept.
function ERL_INPUT(prompt, preCursor, postCursor) {
  preCursor = preCursor != null ? preCursor : emptyString;
  postCursor = postCursor != null ? postCursor : emptyString;
  return SPAN(
    _inputConfig,
    SPAN(
      null,
      ERL_PROMPT(prompt),
      ERL_PRE(preCursor),
      ERL_CURSOR,
      ERL_POST(postCursor)));
}
*/

// Has no tortola analogue.
function ERL_POST(text) {
  return SPAN(_postConfig, text);
}

// Corresponds to 'terminal-input'.
function ERL_PRE(text) {
  return SPAN(_preConfig, text);
}

function ERL_PROMPT(text) {
  return SPAN(_promptConfig, text);
}

var emptyString = '';
var newline = '\n';
var space = ' ';
var underscore = '_';

var emptySpan = SPAN(null, emptyString);

/*
var ERL_CURSOR = SPAN(
  {
    id: 'erl-cursor',
    classes: { 'erl-cursor': true, 'terminal-cursor': true },
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    }
  },
  space);
*/
var ERL_CURSOR = SPAN(
  {
    id: 'erl-cursor',
    classes: { 'erl-cursor': true, 'terminal-cursor': true },
  },
  underscore);

/*
var ERL_HEADER = SPAN(
    {
      id: 'erl-header',
    },
    SPAN(
      {
        id: 'erl-banner',
        style: { 'color': '#0ff' }
      },
      'Welcome to ErlKing Lisp Console.\n'));
*/

var _entryConfig = {
  classes: { 'erl-line': true, 'terminal-line': true },
  //style: { 'font-weight': 'normal' }
};

/*
var _inputConfig = {
  id: 'erl-input',
  classes: { 'erl-input': true },
  style: { 'color': '#0d0' }
};
*/

var _postConfig = {
  id: 'erl-post',
  classes: { 'erl-post': true },
  style: { 'position': 'relative' }
};

// tortola has no concept of ERL_POST.
var _preConfig = {
   id: 'erl-pre',
   classes: { 'erl-pre': true, 'terminal-input': true }
};

var _promptConfig = {
  id: 'erl-prompt',
  classes: { 'erl-prompt': true, 'terminal-prompt': true }
};

module.exports = {
  ERL_ENTRY  : ERL_ENTRY,
  //ERL_INPUT  : ERL_INPUT,
  //ERL_HEADER : ERL_HEADER,

  ERL_PROMPT : ERL_PROMPT,
  ERL_PRE    : ERL_PRE,
  ERL_CURSOR : ERL_CURSOR,
  ERL_POST   : ERL_POST
};
