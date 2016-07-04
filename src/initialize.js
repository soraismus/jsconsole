var abstractViewPort  = require('./abstractViewPort');
var appState          = require('./appState');
var browserViewPort   = require('./browserViewPort');
var initializeUi      = require('./initializeUi');
var interpreter       = require('./interpreter');
var interpretAppState = require('./interpretAppState');
var interpretUi       = require('./interpretUi');
var modifyElement     = require('../lib/interpreter').modifyElement;
var rerender          = require('./rerender');
var translate         = require('./interpret2').translate;
var translateDisplay  = require('./interpret2').translateDisplay;

var a =  97;
var e = 101;
var h = 104;
var l = 108;
var u = 117;
var w = 119;

var backspace =   8;
var _delete   =  46;
var down      =  40;
var enter     =  13;
var left      =  37;
var right     =  39;
var up        =  38;

function getNextAbstractViewPort(event, transform) {
  event.preventDefault();
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return interpreter.moveCursorToStart(appState);
      case e:
        return interpreter.moveCursorToEnd(appState);
      case h:
        return interpreter.deleteLeftChar(appState);
      case l:
        return interpreter.clearConsole(appState);
      case u:
        return interpreter.deletePreCursor(appState);
      case w:
        return interpreter.deleteWord(appState);
      default:
        return interpreter.noOp(appState);
    }
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
    newAbstractViewPort = getNextAbstractViewPort(event, transform);
    newBrowserViewPort = createBrowserViwePort(
      browserViewPort,
      newAbstractViewPort,
      abstractViewPort);
    abstractViewPort = newAbstractViewPort;
    browserViewPort = newBrowserViewPort;
    rerender( 
      document.getElementById('console'),
      { promptLabel: promptLabel },
      browserViewPort);
    //transformUi(promptLabel, command);
  };
}

function initialize(config) {
  var promptLabel = config.promptLabel;
  var transform   = config.transform;
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform));
}

/*
function transformUi(promptLabel, command) {
  var changes = translate(promptLabel, interpretUi(command));
  for (var index in changes) {
    modifyElement(
      document.getElementById('console'),
      changes[index]);
  }
}
*/

function createBrowserViwePort(
    browserViewPort,
    newAbstractViewPort,
    origAbstractViewPort,
    clearViewPort) {
  if (!!clearViewPort) {
    return {
      displayItems: [],
      prompt: newAbstractViewPort.prompt
    };
  }
  var newEntries = newAbstractViewPort.timeline.entries;
  var origEntries = origAbstractViewPort.timeline.entries;
  var diffCount = newEntries.length - origEntries.length;
  var newDisplayItems = diffCount === 0
    ?  displayItems: browserViewPort
        .displayItems
        .slice(0, browserViewPort.maximumSize)
    : displayItems: browserViewPort
        .displayItems
        .concat(newEntries.slice(0, diffCount).reverse())
        .slice(0, browserViewPort.maximumSize);
  return {
    displayItems: newDisplayItems,
    prompt: newAbstractViewPort.prompt
  };
}

module.exports = initialize;
