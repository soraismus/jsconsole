var SPAN = require('../lib/elements').SPAN;

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

function createDisplay(text) {
  return SPAN(
    { classes: display, style: { 'font-weight': 'normal' }},
    SPAN(null, text + '\n'));
}

function createOldPrompt(text) {
  return SPAN(
    { classes: oldPrompt, style: { 'font-weight': 'normal' }},
    SPAN(null, text + '\n'));
}

function createOldPromptReply(text) {
  return SPAN(
    { classes: oldPromptResponse },
    SPAN(null, '==> ' + text + '\n'));
}

function createPrompt(promptLabel) {
  return SPAN(
    { classes: _prompt, style: { 'color': '#0d0' }},
    emptySpan,
    SPAN(
      null,
      SPAN(null, promptLabel),
      SPAN({ classes: promptText }),
      cursor,
      relativeSpan),
    emptySpan);
}

var cursor = SPAN(
  {
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
    SPAN({ style: { 'color': '#0ff' }}, 'Welcome to MHLisp Console!\n'));

var relativeSpan = SPAN({
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
