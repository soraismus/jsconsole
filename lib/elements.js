var promptLabelMessage = 'Lisp'
var promptLabelText = promptLabelMessage + '> '

function createPrompt() {
  var cursor = {
    tag: 'span',
    classes: { 'jsconsole-cursor': true },
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    },
    children: [' ']
  };
  var emptySpan = { tag: 'span', children: [''] };
  var promptLabel = {
    tag: 'span',
    children: [promptLabelText]
  };
  var promptText = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text': true },
  };
  var relativeSpan = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text-post-cursor': true },
    style: {
      'position': 'relative'
    }
  };
  return {
    tag: 'span',
    classes: { 'jsconsole-prompt': true },
    style: { 'color': '#0d0' },
    children: [
      emptySpan,
      {
        tag: 'span',
        children: [
          promptLabel,
          promptText,
          cursor,
          relativeSpan
        ]
      },
      emptySpan
    ]
  };
}

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
    children: [
      {
        tag: 'span',
        children: ['==> ' + text + '\n']
      }
    ]
  };
}

module.exports = {
  createPrompt: createPrompt,
  createOldPrompt: createOldPrompt,
  createOldPromptReply: createOldPromptReply,
};
