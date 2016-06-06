var initialize        = require('./interpret').initialize;
var translate         = require('./interpret2').translate;
var interpreter       = require('./interpreter');
var interpretAppState = require('./interpretAppState.js');
var interpretUi       = require('./interpretUi.js');
var modifyElement     = require('./interpret').modifyElement;

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
      return interpreter.submit3(appState, transform);
    case backspace:
      event.preventDefault();
      return interpreter.deleteLeftChar3(appState);
    case left:
      event.preventDefault();
      return interpreter.moveCursorLeft3(appState);
    case right:
      event.preventDefault();
      return interpreter.moveCursorRight3(appState);
    case up:
      event.preventDefault();
      return interpreter.rewindHistory3(appState);
    case down:
      event.preventDefault();
      return interpreter.fastForwardHistory3(appState);
    case _delete:
      event.preventDefault();
      return interpreter.deleteRightChar3(appState);
    default:
      return interpreter.addChar3(appState, String.fromCharCode(event.charCode));
  }
}

function transformUi(promptLabel, command) {
  var changes = translate(promptLabel, interpretUi(command));
  for (var index in changes) {
    modifyElement(
      document.getElementById('console'),
      changes[index]);
  }
}

function handleEvent(promptLabel, transform) {
  return function (event) {
    var command = convertEventToCommand(event, transform);
    appState = interpretAppState(command)(appState);
    transformUi(promptLabel, command);
  };
}

function _initialize(config) {
  var promptLabel = config.promptLabel;
  var transform   = config.transform;

  if (transform == null) {
    transform = function (value) {
      return value;
    };
  }

  initialize(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform));
}

module.exports = _initialize;
