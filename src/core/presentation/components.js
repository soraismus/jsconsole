var SPAN = require('../../../lib/elements').SPAN;

var emptyString = '';

var space = ' ';

var _cursor = { 'jsconsole-cursor': true };
var _header = { 'jsconsole-header': true };
var promptText = { 'jsconsole-prompt-text': true };
var promptTextPostCursor = { 'jsconsole-prompt-text-post-cursor': true };

var display = {
  'jsconsole-display': true,
  'jsconsole-line-item': true
};

var oldPrompt = {
  'jsconsole-old-prompt': true,
  'jsconsole-line-item': true
};

var oldPromptResponse = {
  'jsconsole-old-prompt-response': true,
  'jsconsole-line-item': true
};

var _prompt = {
  'jsconsole-prompt': true
};

var _1 = { classes: display, style: { 'font-weight': 'normal' }};
function createDisplay(text) {
  return SPAN(
    _1,
    SPAN(null, text + '\n'));
}

var _2 = { classes: oldPrompt, style: { 'font-weight': 'normal' }};
function createOldPrompt(text) {
  return SPAN(
    _2,
    SPAN(null, text + '\n'));
}

var _3 = { classes: oldPromptResponse };
function createOldPromptReply(text) {
  return SPAN(
    _3,
    SPAN(null, '==> ' + text + '\n'));
}

var _4 = { classes: _prompt, style: { 'color': '#0d0' }};
var _5 = { classes: promptText };
var _6 = {
  classes: promptTextPostCursor,
  style: { 'position': 'relative' }
};
function createPrompt(promptLabel, preCursor, postCursor) {
  preCursor = preCursor != null ? preCursor : '';
  postCursor = postCursor != null ? postCursor : '';
  return SPAN(
    _4,
    emptySpan,
    SPAN(
      null,
      SPAN(null, promptLabel),
      SPAN(_5, preCursor),
      cursor,
      SPAN(
        _6,
        postCursor)),
    emptySpan);
}

var cursor = SPAN(
  {
    id: 'cursor',
    classes: _cursor,
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    }
  },
  space);

var emptySpan = SPAN(null, emptyString);

var header = SPAN(
    { classes: _header },
    SPAN({ style: { 'color': '#0ff' }}, 'Welcome to Lisp Console.\n'));

var postCursor = SPAN({
  classes: promptTextPostCursor,
  style: { 'position': 'relative' }
});

module.exports = {
  createDisplay: createDisplay,
  createOldPrompt: createOldPrompt,
  createOldPromptReply: createOldPromptReply,
  createPrompt: createPrompt,
  header: header,
};
