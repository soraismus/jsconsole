var initialize = require('./interpret').initialize;
var interpret = require('./interpret2');
var interpreter = require('./interpreter');

// function (interpret) {}

initialize();

var appState = {
  history: { past: [], future: [] },
  cursor: { pre: '', post: '' }
};

document.addEventListener(
  'keypress',
  function (event) {
    var command;
    switch (event.keyCode) {
      case 13: // enter
        command = interpreter.submit(appState);
        break;
      case 8: // backspace
        command = interpreter.deleteLeftChar(appState);
        break;
      case 37: // left;
        event.preventDefault();
        command = interpreter.moveCursorLeft(appState);
        break;
      case 39: // right;
        event.preventDefault();
        command = interpreter.moveCursorRight(appState);
        break;
      case 38: // up;
        command = interpreter.rewindHistory(appState);
        break;
      case 40: // down;
        command = interpreter.fastForwardHistory(appState);
        break;
      case 46: // delete
        command = interpreter.deleteRightChar(appState);
        break;
      case 0:
        command = interpreter.addChar(
          appState,
          String.fromCharCode(event.charCode));
        break;
    }
    appState = interpret(appState, command);
  });
