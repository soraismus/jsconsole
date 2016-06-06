var SPAN = require('./tags.js').SPAN;

var cursor               = { 'jsconsole-cursor': true };
var header                = { 'jsconsole-header': true };
var oldPrompt            = { 'jsconsole-old-prompt': true };
var oldPromptResponse    = { 'jsconsole-old-prompt-response': true };
var prompt               = { 'jsconsole-prompt': true };
var promptText           = { 'jsconsole-prompt-text': true };
var promptTextPostCursor = { 'jsconsole-prompt-text-post-cursor': true };

var promptLabelMessage = 'Lisp';
var promptLabelText = promptLabelMessage + '> ';

function createOldPrompt(text) {
  return SPAN(
    { classes: oldPrompt, style: { 'font-weight': 'normal' }},
    SPAN(null, promptLabelText + text + '\n'));
}

function createOldPromptReply(text) {
  return SPAN(
    { classes: oldPromptResponse },
    SPAN(null, '==> ' + text + '\n'));
}

var cursor = SPAN(
  {
    classes: cursor,
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    }
  },
  ' ');

var emptySpan = SPAN(null, '');

var header = SPAN(
    { classes: header },
    SPAN({ style: { 'color': '#0ff' }}, 'Welcome to MHLisp Console!\n'));

var promptLabel = SPAN(null, promptLabelText);
var promptText = SPAN({ classes: promptText });

var relativeSpan = SPAN({
  classes: promptTextPostCursor,
  style: { 'position': 'relative' }
});

var prompt = SPAN(
  {
    classes: prompt,
    style: { 'color': '#0d0' }
  },
  emptySpan,
  SPAN(null, promptLabel, promptText, cursor, relativeSpan),
  emptySpan);

module.exports = {
  createOldPrompt: createOldPrompt,
  createOldPromptReply: createOldPromptReply,
  header: header,
  prompt: prompt,
};
