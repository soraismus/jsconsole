var promptLabelMessage = 'Lisp'
var promptLabelText = promptLabelMessage + '> '

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

  var header = {
    tag: 'span',
    classes: { 'jsconsole-header': true },
    children: [
      {
        tag: 'span',
        style: { 'color': '#0ff' },
        children: ['Welcome to JQConsole!\nUse jqconsole.Write() to write and jqconsole.Input() to read.\n']
      }
    ]
  };

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

var prompt = {
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

var textArea = {
  tag: 'div',
  style: {
    'position': 'absolute',
    'width': '1px',
    'height': '0px',
    'overflow': 'hidden',
    'left': '30px',
    'top': '40px'
  },
  children: [
    {
      tag: 'textarea',
      attribs: {
        'wrap': 'off',
        'autocapitalize': 'off',
        'autocorrect': 'off',
        'spellcheck': false
      },
      style: {
        'position': 'absolute',
        'width': '2px'
      }
    }
  ]
};

function createPrompt() {
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

  cursor: cursor,
  emptySpan: emptySpan,
  header: header,
  prompt: prompt,
  promptLabel: promptLabel,
  promptText: promptText,
  relativeSpan: relativeSpan,
  textArea: textArea,

  promptLabelMessage: promptLabelMessage,
  promptLabelText: promptLabelText,
};
