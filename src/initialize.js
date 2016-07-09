var terminal      = require('./terminal');
var frame         = require('./frame');
var initializeUi  = require('./initializeUi');
var interpreter   = require('./interpreter');
var rerender      = require('./rerender');
var createVariant = require('./variant').create;

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

function Command(value) {
  return createVariant('command', value);
}

function Terminal(value) {
  return createVariant('terminal', value);
}

function getTerminalOrCommand(event, transform, getCandidates) {
  event.preventDefault();
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return Terminal(interpreter.moveCursorToStart(terminal));
      case e:
        return Terminal(interpreter.moveCursorToEnd(terminal));
      case h:
        return Terminal(interpreter.deleteLeftChar(terminal));
      case l:
        return Command({ command: 'clearConsole' });
      case u:
        return Terminal(interpreter.deletePreCursor(terminal));
      case w:
        return Terminal(interpreter.deleteWord(terminal));
    }
    switch (event.keyCode) {
      case down:
        return Command({ command: 'scrollDown' });
      case up:
        return Command({ command: 'scrollUp' });
      default:
        return Terminal(interpreter.noOp(terminal));
    }
  }
  if (event.altKey) {
    return Terminal(interpreter.noOp(terminal));
  }
  switch (event.keyCode) {
    case enter:
      return Terminal(interpreter.submit(terminal, transform));
    case backspace:
      return Terminal(interpreter.deleteLeftChar(terminal));
    case left:
      return Terminal(interpreter.moveCursorLeft(terminal));
    case right:
      return Terminal(interpreter.moveCursorRight(terminal));
    case up:
      return Terminal(interpreter.rewindHistory(terminal));
    case down:
      return Terminal(interpreter.fastForwardHistory(terminal));
    case _delete:
      return Terminal(interpreter.deleteRightChar(terminal));
    case tab:
      return Terminal(
        interpreter.completeWord(
          terminal,
          getCandidates));
    default:
      return Terminal(interpreter.addChar(
        terminal,
        String.fromCharCode(event.charCode)));
  }
}

function handleEvent(promptLabel, transform, getCandidates) {
  return function (event) {
    terminalOrCommand = getTerminalOrCommand(event, transform, getCandidates);
    console.log('old frame: ', frame);
    console.log('old offset: ', frame.offset);
    console.log('old start: ', frame.start);
    newFrame = createFrame(
      frame,
      terminalOrCommand,
      terminal);
    console.log('new frame: ', newFrame);
    console.log('new offset: ', newFrame.offset);
    console.log('new start: ', newFrame.start);
    terminal = terminalOrCommand.case({
      command: function () { return terminal; },
      terminal: function (terminal) { return terminal; }
    });
    frame = newFrame;
    rerender(
      document.getElementById('console'),
      { promptLabel: promptLabel },
      terminal,
      newFrame);
  };
}

function initialize(config) {
  var promptLabel   = config.promptLabel;
  var transform     = config.transform;
  var getCandidates = config.getCandidates;
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(promptLabel, transform, getCandidates));
}

// TODO: Create factories for `frame` and `terminal` to reduce coupling.
function createFrame(frame, terminalOrCommand, prevViewPort) {
  return terminalOrCommand.case({
    command: function (command) {
      switch (command.command) {
        case 'clearConsole':
          return {
            maximumSize: frame.maximumSize,
            offset: 0,
            start: prevViewPort.entries.length
          };
        case 'scrollDown':
          var length = prevViewPort.entries.length;
          return {
            maximumSize: frame.maximumSize,
            offset: frame.offset,
            start: length - frame.start <= frame.maximumSize
              ? frame.start
              : frame.start + 1
          };
        case 'scrollUp':
          var newStart = frame.start - 1 < 0 ? 0 : frame.start - 1;
          return {
            maximumSize: frame.maximumSize,
            offset: frame.offset < frame.maximumSize && (frame.offset < (prevViewPort.entries.length - newStart))
              ? frame.offset + 1
              : frame.offset,
            start: newStart
          };
      }
    },
    terminal: function (newViewPort) {
      var offset, start;
      var maximumSize = frame.maximumSize;
      var newEntries = newViewPort.entries
      var prevEntries = prevViewPort.entries
      var diffCount = newEntries.length - prevEntries.length;
      if (diffCount === 0) {
        offset = frame.offset;
        start = frame.start;
      } else if (diffCount > 0) {
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

module.exports = initialize;
