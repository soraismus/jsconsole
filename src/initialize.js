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

function convertEventToCommand(event) {
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

function _initialize(transform) {
  if (transform == null) {
    transform = function (value) {
      return value;
    };
  }

  initialize();

  document.addEventListener(
    'keypress',
    function (event) {
      var command;
      switch (event.keyCode) {
        case 13: // enter
          command = interpreter.submit3(appState, transform);
          break;
        case 8: // backspace
          event.preventDefault();
          command = interpreter.deleteLeftChar3(appState);
          break;
        case 37: // left;
          event.preventDefault();
          command = interpreter.moveCursorLeft3(appState);
          break;
        case 39: // right;
          event.preventDefault();
          command = interpreter.moveCursorRight3(appState);
          break;
        case 38: // up;
          event.preventDefault();
          command = interpreter.rewindHistory3(appState);
          break;
        case 40: // down;
          event.preventDefault();
          command = interpreter.fastForwardHistory3(appState);
          break;
        case 46: // delete
          event.preventDefault();
          command = interpreter.deleteRightChar3(appState);
          break;
        case 0:
          command = interpreter.addChar3(appState, String.fromCharCode(event.charCode));
          break;
        default:
          command = interpreter.addChar3(appState, String.fromCharCode(event.charCode));
          break;
      }
      var changes = translate(interpretUi(command));
      for (var index in changes) {
        modifyElement(
          document.getElementById('console'),
          changes[index]);
      }
      appState = interpretAppState(command)(appState);
    });
}

module.exports = _initialize;
