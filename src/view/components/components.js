/*
var ERL_HEADER = SPAN(
    { id: 'erl-header', },
    SPAN(
      { id: 'erl-banner', style: { 'color': '#0ff' }
      },
      'Welcome to ErlKing Lisp Console.\n'));
*/

var PRE  = require('../../../lib/elements').PRE;
var SPAN = require('../../../lib/elements').SPAN;

function ERL_ENTRY(text) {
  return PRE(_entryConfig, text + newline);
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
var underscore = '_';

var emptySpan = SPAN(null, emptyString);

var ERL_CURSOR = SPAN(
  {
    id: 'erl-cursor',
    classes: { 'erl-cursor': true, 'erl-cursor': true },
  },
  underscore);

var _entryConfig = {
  classes: { 'erl-line': true, 'erl-line': true },
};

var _postConfig = {
  id: 'erl-post',
  classes: { 'erl-post': true },
  style: { 'position': 'relative' }
};

var _preConfig = {
   id: 'erl-pre',
   classes: { 'erl-pre': true, 'erl-input': true }
};

var _promptConfig = {
  id: 'erl-prompt',
  classes: { 'erl-prompt': true, 'erl-prompt': true }
};

module.exports = {
  ERL_CURSOR : ERL_CURSOR,
  ERL_ENTRY  : ERL_ENTRY,
  ERL_POST   : ERL_POST,
  ERL_PRE    : ERL_PRE,
  ERL_PROMPT : ERL_PROMPT
};
