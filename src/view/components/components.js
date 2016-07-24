var SPAN = require('../../../lib/elements').SPAN;

function ERL_INPUT(promptText, preText, postText) {
  return SPAN(
    null,
    ERL_PROMPT(promptText),
    ERL_PRE(preText),
    ERL_CURSOR,
    ERL_POST(postText));
}

function ERL_LINE(text) {
  return SPAN(_lineConfig, text + newline);
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

var ERL_CURSOR = SPAN(
  {
    id: 'erl-cursor',
    classes: { 'erl-cursor': true, 'erl-cursor': true },
  },
  underscore);

var _lineConfig = {
  classes: { 'erl-line': true },
};

var _postConfig = {
  id: 'erl-post',
  classes: { 'erl-post': true },
  style: { 'position': 'relative' }
};

var _preConfig = {
   id: 'erl-pre',
   classes: { 'erl-pre': true }
};

var _promptConfig = {
  id: 'erl-prompt',
  classes: { 'erl-prompt': true, 'erl-prompt': true }
};

module.exports = {
  ERL_CURSOR : ERL_CURSOR,
  ERL_INPUT  : ERL_INPUT,
  ERL_LINE   : ERL_LINE,
  ERL_POST   : ERL_POST,
  ERL_PRE    : ERL_PRE,
  ERL_PROMPT : ERL_PROMPT
};
