var abstractViewPort  = require('./abstractViewPort');
var browserViewPort   = require('./browserViewPort');
var initializeUi      = require('./initializeUi');
var interpreter       = require('./interpreter');
var rerender          = require('./rerender');
var createVariant     = require('./variant').create;

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

function command(value) {
  return createVariant('command', value);
}

function viewPort(value) {
  return createVariant('viewPort', value);
}

function getNextAbstractViewPort(event, transform) {
  event.preventDefault();
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return viewPort(interpreter.moveCursorToStart(abstractViewPort));
      case e:
        return viewPort(interpreter.moveCursorToEnd(abstractViewPort));
      case h:
        return viewPort(interpreter.deleteLeftChar(abstractViewPort));
      case l:
        return command({ command: 'clearConsole' });
      case u:
        return viewPort(interpreter.deletePreCursor(abstractViewPort));
      case w:
        return viewPort(interpreter.deleteWord(abstractViewPort));
      default:
        return viewPort(interpreter.noOp(abstractViewPort));
    }
  }
  if (event.altKey) {
    return viewPort(interpreter.noOp(abstractViewPort));
  }
  switch (event.keyCode) {
    case enter:
      return viewPort(interpreter.submit(abstractViewPort, transform));
    case backspace:
      return viewPort(interpreter.deleteLeftChar(abstractViewPort));
    case left:
      return viewPort(interpreter.moveCursorLeft(abstractViewPort));
    case right:
      return viewPort(interpreter.moveCursorRight(abstractViewPort));
    case up:
      return viewPort(interpreter.rewindHistory(abstractViewPort));
    case down:
      return viewPort(interpreter.fastForwardHistory(abstractViewPort));
    case _delete:
      return viewPort(interpreter.deleteRightChar(abstractViewPort));
    default:
      return viewPort(interpreter.addChar(
        abstractViewPort,
        String.fromCharCode(event.charCode)));
  }
}

function handleEvent(promptLabel, transform) {
  return function (event) {
    viewPortOrCommand = getNextAbstractViewPort(event, transform);
    newTerminal = createBrowserViewPort(
      browserViewPort,
      viewPortOrCommand,
      abstractViewPort);
    abstractViewPort = viewPortOrCommand.case({
      command: function () { return abstractViewPort; },
      viewPort: function (viewPort) { return viewPort; }
    });
    browserViewPort = newTerminal;
    rerender( 
      document.getElementById('console'),
      { promptLabel: promptLabel },
      browserViewPort);
  };
}

function initialize(config) {
  var promptLabel = config.promptLabel;
  var transform   = config.transform;
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform));
}

function createBrowserViewPort(terminal, viewPortOrCommand, prevViewPort) {
  return viewPortOrCommand.case({
    command: function () {
      return {
        displayItems: [],
        maximumSize: terminal.maximumSize,
        prompt: prevViewPort.prompt
      };
    },
    viewPort: function (newViewPort) {
      var maximumSize = terminal.maximumSize;
      var newEntries = newViewPort.timeline.entries.past;
      var prevEntries = prevViewPort.timeline.entries.past;
      var diffCount = newEntries.length - prevEntries.length;
      var newDisplayItems = (diffCount === 0)
        ?  terminal
            .displayItems
            .slice(0, maximumSize)
        : terminal
            .displayItems
            .concat(newEntries.slice(0, diffCount).reverse())
            .slice(0, maximumSize);
      return {
        displayItems: newDisplayItems,
        maximumSize: maximumSize,
        prompt: newViewPort.prompt
      };
    }
  });
}

module.exports = initialize;
