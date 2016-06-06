var createAndAttachElement = require('../domUtility/interpret').createAndAttachElement;
var modifyElement          = require('../domUtility/interpret').modifyElement;

var components        = require('./components');
var translate         = require('./interpret2').translate;
var interpreter       = require('./interpreter');
var interpretAppState = require('./interpretAppState');
var interpretUi       = require('./interpretUi');

var appState = {
  history: {
    past: [],
    future: [],
    cache: [],
    display: [],
  },
  cursor: {
    pre: '',
    post: ''
  }
};

var backspace =  8;
var _delete   = 46;
var down      = 40;
var enter     = 13;
var left      = 37;
var right     = 39;
var up        = 38;

function convertEventToCommand(event, transform) {
  switch (event.keyCode) {
    case enter:
      return interpreter.submit(appState, transform);
    case backspace:
      event.preventDefault();
      return interpreter.deleteLeftChar(appState);
    case left:
      event.preventDefault();
      return interpreter.moveCursorLeft(appState);
    case right:
      event.preventDefault();
      return interpreter.moveCursorRight(appState);
    case up:
      event.preventDefault();
      return interpreter.rewindHistory(appState);
    case down:
      event.preventDefault();
      return interpreter.fastForwardHistory(appState);
    case _delete:
      event.preventDefault();
      return interpreter.deleteRightChar(appState);
    default:
      return interpreter.addChar(appState, String.fromCharCode(event.charCode));
  }
}

function handleEvent(promptLabel, transform) {
  return function (event) {
    var command = convertEventToCommand(event, transform);
    appState = interpretAppState(command)(appState);
    transformUi(promptLabel, command);
  };
}

function initialize(config) {
  var promptLabel = config.promptLabel;
  var transform   = config.transform;
  if (transform == null) {
    transform = function (value) {
      return value;
    };
  }
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform));
}

function initializeUi(promptLabel) {
  createAndAttachElement(
    document.getElementById('console'),
   {
    tag: 'div',
    style: {
      'top': '0px',
      'left': '0px',
      'right': '0px',
      'bottom': '0px',
      'position': 'absolute',
      'overflow': 'auto'
    },
    children: [
      {
        tag: 'pre',
        classes: { 'jsconsole': true },
        style: {
          'margin': '0px',
          'position': 'relative',
          'min-height': '100%',
          'box-sizing': 'border-box',
          'padding': '10px',
          'padding-bottom': '10px'
        },
        children: [
          components.header,
          components.createPrompt(promptLabel)
        ]
      }
    ]
  });
}

function transformUi(promptLabel, command) {
  var changes = translate(promptLabel, interpretUi(command));
  for (var index in changes) {
    modifyElement(
      document.getElementById('console'),
      changes[index]);
  }
}

module.exports = initialize;
