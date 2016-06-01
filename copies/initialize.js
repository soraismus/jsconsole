var initialize = require('./interpret').initialize;
//var interpret = require('./interpret2').interpret;
var translate = require('./interpret2').translate;
var interpreter = require('./interpreter');

var interpretAppState = require('./interpretAppState.js');
var interpretUi = require('./interpretUi.js');
var modifyElement = require('./interpret').modifyElement;

initialize();

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

document.addEventListener(
  'keypress',
  function (event) {
    var command;
    switch (event.keyCode) {
      case 13: // enter
        command = interpreter.submit3(appState);
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
