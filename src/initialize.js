var appState          = require('./appState');
var initializeUi      = require('./initializeUi');
var interpreter       = require('./interpreter');
var interpretAppState = require('./interpretAppState');
var interpretUi       = require('./interpretUi');
var modifyElement     = require('../lib/interpreter').modifyElement;
var translate         = require('./interpret2').translate;
var translateDisplay  = require('./interpret2').translateDisplay;

var a =  97;
var e = 101;
var l = 108;

var backspace =   8;
var _delete   =  46;
var down      =  40;
var enter     =  13;
var left      =  37;
var right     =  39;
var up        =  38;

function convertEventToCommand(event, transform) {
  event.preventDefault();
  if (event.ctrlKey) {
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
    return interpreter.noOp(appState);
  }
  switch (event.keyCode) {
    case enter:
      return interpreter.submit(appState, transform);
    case backspace:
      return interpreter.deleteLeftChar(appState);
    case left:
      return interpreter.moveCursorLeft(appState);
    case right:
      return interpreter.moveCursorRight(appState);
    case up:
      return interpreter.rewindHistory(appState);
    case down:
      return interpreter.fastForwardHistory(appState);
    case _delete:
      return interpreter.deleteRightChar(appState);
    default:
      return interpreter.addChar(
        appState,
        String.fromCharCode(event.charCode));
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

module.exports = initialize;
