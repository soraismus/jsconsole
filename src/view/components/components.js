var SPAN = require('../../../lib/elements').SPAN;

function ERL_ENTRY(text) {
  return SPAN(
    _entryConfig,
    SPAN(null, text + newline));
}

function ERL_INPUT(prompt, preCursor, postCursor) {
  preCursor = preCursor != null ? preCursor : emptyString;
  postCursor = postCursor != null ? postCursor : emptyString;
  return SPAN(
    _inputConfig,
    emptySpan,
    SPAN(
      null,
      ERL_PROMPT(prompt),
      ERL_PRE(preCursor),
      ERL_CURSOR,
      ERL_POST(postCursor)),
    emptySpan);
}

function ERL_POST(text) {
  return SPAN(_postConfig, text);
}

function ERL_PRE(text) {
  return SPAN(_preConfig, text);
}

function ERL_PROMPT(text) {
  return SPAN(_promptConfig, text);
}

var emptyString = '';
var newline = '\n';
var space = ' ';

var emptySpan = SPAN(null, emptyString);

var ERL_CURSOR = SPAN(
  {
    id: 'erl-cursor',
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    }
  },
  space);

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

var _entryConfig = {
  classes: { 'erl-line': true },
  style: { 'font-weight': 'normal' }
};

var _inputConfig = { id: 'erl-input', style: { 'color': '#0d0' }};
var _postConfig = { id: 'erl-post', style: { 'position': 'relative' }};
var _preConfig = { id: 'erl-pre' };
var _promptConfig = { id: 'erl-prompt' };

module.exports = {
  ERL_ENTRY: ERL_ENTRY,
  ERL_INPUT: ERL_INPUT,
  ERL_HEADER: ERL_HEADER,
};
