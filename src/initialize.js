var createFrame    = require('./models/createFrame');
var createPrompt   = require('./models/createPrompt');
var createTerminal = require('./models/createTerminal');
var createViewport = require('./models/createViewport');
var initializeUi   = require('./initializeUi');
var rerender       = require('./rerender');
var Viewport       = require('./models/viewport');

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

var viewport = createViewport(
  createTerminal([], [], createPrompt('', '')),
  createFrame(23, 0, 0, 0));

function getViewport(event, transform, getCandidates) {
  event.preventDefault();
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return Viewport.moveCursorToStart(viewport);
      case e:
        return Viewport.moveCursorToEnd(viewport);
      case h:
        return Viewport.deleteLeftChar(viewport);
      case l:
        return Viewport.clear(viewport);
      case u:
        return Viewport.deletePreCursor(viewport);
      case w:
        return Viewport.deleteWord(viewport);
    }
    switch (event.keyCode) {
      case down:
        return Viewport.scrollDown(viewport);
      case up:
        return Viewport.scrollUp(viewport);
      default:
        return Viewport.noOp(viewport);
    }
  }
  if (event.altKey) {
    return Viewport.noOp(viewport);
  }
  switch (event.keyCode) {
    case enter:
      return Viewport.submit(viewport, transform);
    case backspace:
      return Viewport.deleteLeftChar(viewport);
    case left:
      return Viewport.moveCursorLeft(viewport);
    case right:
      return Viewport.moveCursorRight(viewport);
    case up:
      return Viewport.rewind(viewport);
    case down:
      return Viewport.fastForward(viewport);
    case _delete:
      return Viewport.deleteRightChar(viewport);
    case tab:
      return Viewport.completeWord(viewport, getCandidates);
    default:
      return Viewport.addChar(
        viewport,
        String.fromCharCode(event.charCode));
  }
}

function handleEvent(config) {
  var nodeId        = config.nodeId;
  var promptLabel   = config.promptLabel;
  var transform     = config.transform;
  var getCandidates = config.getCandidates;
  return function (event) {
    viewport = getViewport(event, transform, getCandidates);
    rerender(
      document.getElementById(nodeId),
      { promptLabel: promptLabel },
      viewport);
  };
}

function initialize(config) {
  var promptLabel = config.promptLabel;
  initializeUi(promptLabel);
  document.addEventListener('keypress', handleEvent(config));
}

module.exports = initialize;
