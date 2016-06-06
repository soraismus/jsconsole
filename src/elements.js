var SPAN = require('./tags.js').SPAN;

var promptLabelMessage = 'Lisp'
var promptLabelText = promptLabelMessage + '> '

var cursor = SPAN(
  {
    classes: { 'jsconsole-cursor': true },
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
    { classes: { 'jsconsole-header': true }},
    SPAN({ style: { 'color': '#0ff' }}, 'Welcome to MHLisp Console!\n'));

var promptLabel = SPAN(null, promptLabelText);
var promptText = SPAN({ classes: { 'jsconsole-prompt-text': true }});

var relativeSpan = SPAN({
  classes: { 'jsconsole-prompt-text-post-cursor': true },
  style: { 'position': 'relative' }
});

var prompt = SPAN(
  {
    classes: { 'jsconsole-prompt': true },
    style: { 'color': '#0d0' }
  },
  emptySpan,
  SPAN(null, promptLabel, promptText, cursor, relativeSpan),
  emptySpan);

function createOldPrompt(text) {
  return {
    tag: 'span',
    classes: { 'jsconsole-old-prompt': true },
    style: {
      'font-weight': 'normal'
    },
    children: [
      {
        tag: 'span',
        children: [promptLabelText + text + '\n']
      }
    ]
  };
}

function createOldPromptReply(text) {
  return {
    tag: 'span',
    classes: { 'jsconsole-old-prompt-response': true },
    children: [
      {
        tag: 'span',
        children: ['==> ' + text + '\n']
      }
    ]
  };
}

module.exports = {
  createOldPrompt: createOldPrompt,
  createOldPromptReply: createOldPromptReply,

  cursor: cursor,
  emptySpan: emptySpan,
  header: header,
  prompt: prompt,
  promptLabel: promptLabel,
  promptText: promptText,
  relativeSpan: relativeSpan,

  promptLabelMessage: promptLabelMessage,
  promptLabelText: promptLabelText,
};
