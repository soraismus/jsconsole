var createFrame    = require('../models/types/createFrame');
var createPane     = require('../models/types/createPane');
var createPrompt   = require('../models/types/createPrompt');
var createTerminal = require('../models/types/createTerminal');
var createViewport = require('../models/types/createViewport');
var rerender       = require('../view/control/rerender');
var Viewport       = require('../models/actions/viewport');

var diff = require('../diff');
var recreateConsole = require('../view/control/recreateConsole');

var interpreter = require('../../lib/interpreter');

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

function getViewport(event, transform, getCandidates, config) {
  var viewport = config.viewport;
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

function handleKeypress(config) {
  var promptLabel   = config.promptLabel;
  var transform     = config.transform;
  var getCandidates = config.getCandidates;
  return function (event) {
    var _viewport = getViewport(event, transform, getCandidates, config);
    interpreter.modifyElement(
      document.getElementById('viewport').childNodes[0],
      diff(
        recreateConsole({ promptLabel: promptLabel }, _viewport),
        recreateConsole({ promptLabel: promptLabel }, config.viewport)));
    config.viewport = _viewport;

    var x0 = document.getElementById('viewport');
    var x1 = document.getElementById('view');
    var x2 = document.getElementById('jsconsole');
    scrollDown(x0);
    scrollDown(x1);
    scrollDown(x2);
  };
}

function scrollDown(node) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
}

module.exports = handleKeypress;
