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
var tab       =   9;

function command(value) {
  return createVariant('command', value);
}

function viewport(value) {
  return createVariant('viewport', value);
}

function getViewportOrCommand(event, transform, getCandidates) {
  event.preventDefault();
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return viewport(interpreter.moveCursorToStart(abstractViewPort));
      case e:
        return viewport(interpreter.moveCursorToEnd(abstractViewPort));
      case h:
        return viewport(interpreter.deleteLeftChar(abstractViewPort));
      case l:
        return command({ command: 'clearConsole' });
      case u:
        return viewport(interpreter.deletePreCursor(abstractViewPort));
      case w:
        return viewport(interpreter.deleteWord(abstractViewPort));
    }
    switch (event.keyCode) {
      case down:
        return command({ command: 'scrollDown' });
      case up:
        return command({ command: 'scrollUp' });
      default:
        return viewport(interpreter.noOp(abstractViewPort));
    }
  }
  if (event.altKey) {
    return viewport(interpreter.noOp(abstractViewPort));
  }
  switch (event.keyCode) {
    case enter:
      return viewport(interpreter.submit(abstractViewPort, transform));
    case backspace:
      return viewport(interpreter.deleteLeftChar(abstractViewPort));
    case left:
      return viewport(interpreter.moveCursorLeft(abstractViewPort));
    case right:
      return viewport(interpreter.moveCursorRight(abstractViewPort));
    case up:
      return viewport(interpreter.rewindHistory(abstractViewPort));
    case down:
      return viewport(interpreter.fastForwardHistory(abstractViewPort));
    case _delete:
      return viewport(interpreter.deleteRightChar(abstractViewPort));
    case tab:
      return viewport(
        interpreter.completeWord(
          abstractViewPort,
          getCandidates));
    default:
      return viewport(interpreter.addChar(
        abstractViewPort,
        String.fromCharCode(event.charCode)));
  }
}

function handleEvent(promptLabel, transform, getCandidates) {
  return function (event) {
    viewportOrCommand = getViewportOrCommand(event, transform, getCandidates);
    frame = createFrame(
      browserViewPort,
      viewportOrCommand,
      abstractViewPort);
    abstractViewPort = viewportOrCommand.case({
      command: function () { return abstractViewPort; },
      viewport: function (viewport) { return viewport; }
    });
    browserViewPort = frame;
    rerender(
      document.getElementById('console'),
      { promptLabel: promptLabel },
      abstractViewPort,
      frame);
  };
}

function initialize(config) {
  var promptLabel   = config.promptLabel;
  var transform     = config.transform;
  var getCandidates = config.getCandidates;
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform, getCandidates));
}

// TODO: Create factories for `frame` and `viewport` to reduce coupling.
function createFrame(frame, viewportOrCommand, prevViewPort) {
  return viewportOrCommand.case({
    command: function (command) {
      switch (command.command) {
        case 'clearConsole':
          return {
            maximumSize: frame.maximumSize,
            offset: 0,
            start: frame.start
          };
        case 'scrollDown':
          return {
            maximumSize: frame.maximumSize,
            offset: frame.offset,
            //start: prevViewPort.timeline.entries.all.length - frame.start >= frame.offset ? frame.start : frame.start + 1
            start: prevViewPort.timeline.entries.all.length - frame.start <= frame.maximumSize ? frame.start : frame.start + 1
          };
        case 'scrollUp':
          return {
            maximumSize: frame.maximumSize,
            offset: frame.offset,
            start: frame.start - 1 < 0 ? 0 : frame.start - 1
          };
      }
    },
    viewport: function (newViewPort) {
      var newDisplayItems, offset, start;

      var maximumSize = frame.maximumSize;
      var newEntries = newViewPort.timeline.entries.all;
      var prevEntries = prevViewPort.timeline.entries.all;
      var diffCount = newEntries.length - prevEntries.length;

      if (diffCount === 0) { // Some kind of prompt modification.
        offset = frame.offset;
        start = frame.start;
      } else if (diffCount > 0) { // Submittal, word completion, or scrollDown.
        if (frame.offset + diffCount >= maximumSize) {
          offset = maximumSize;
          start = frame.start + ((diffCount + frame.offset) - maximumSize);
        } else {
          offset = frame.offset + diffCount;
          start = frame.start;
        }

      }
      return {
        maximumSize: maximumSize,
        offset: offset,
        start: start
      };
    }
  });
}

function window(size, array) {
  return array.length <= size
    ? array.slice()
    : array.slice(array.length - size);
}

module.exports = initialize;
