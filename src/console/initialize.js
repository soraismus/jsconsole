var appState          = require('./appState');
var initializeUi      = require('./initializeUi');
var interpreter       = require('./interpreter');
var interpretAppState = require('./interpretAppState');
var interpretUi       = require('./interpretUi');
var modifyElement     = require('../domUtility/interpret').modifyElement;
var translate         = require('./interpret2').translate;
var translateDisplay  = require('./interpret2').translateDisplay;

var a         =  97;
var backspace =   8;
var _delete   =  46;
var down      =  40;
var e         = 101;
var enter     =  13;
var l         = 108;
var left      =  37;
var right     =  39;
var up        =  38;

function convertEventToCommand(event, transform) {
  if (event.ctrlKey) {
    event.preventDefault();
    switch (event.charCode) {
      case a:
        return interpreter.moveCursorToStart(appState);
      case e:
        return interpreter.moveCursorToEnd(appState);
      case l:
        return interpreter.clearConsole(appState);
    }
    return interpreter.noOp(appState);
  }
  if (event.altKey) {
    event.preventDefault();
    return interpreter.noOp(appState);
  }
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
      return interpreter.addChar(
        appState,
        String.fromCharCode(event.charCode));
  }
}

function display(promptLabel, text) {
  modifyElement(
    document.getElementById('console'),
    translateDisplay(promptLabel, text)[0]);
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
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform));
}

function transformUi(promptLabel, command) {
  var changes = translate(promptLabel, interpretUi(command));
  for (var index in changes) {
    modifyElement(
      document.getElementById('console'),
      changes[index]);
  }
}

module.exports = {
  display: display,
  initialize: initialize
};
