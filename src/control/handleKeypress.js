var Viewport = require('../models/actions/viewport');

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

function getViewport(event, config) {
  var command;
  var viewport = config.viewport;

  event.preventDefault();

  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        command = 'moveCursorToStart';
        break;
      case e:
        command = 'moveCursorToEnd';
        break;
      case h:
        command = 'deleteLeftChar';
        break;
      case l:
        command = 'clear';
        break;
      case u:
        command = 'deletePreCursor';
        break;
      case w:
        command = 'deleteWord';
        break;
      default:
        return viewport;
    }

    return Viewport[command](viewport);
  }

  switch (event.keyCode) {
    case enter:
      return Viewport.submit(viewport, config.transform);
    case backspace:
      command = 'deleteLeftChar';
      break;
    case left:
      command = 'moveCursorLeft';
      break;
    case right:
      command = 'moveCursorRight';
      break;
    case up:
      command = 'rewind';
      break;
    case down:
      command = 'fastForward';
      break;
    case _delete:
      command = 'deleteRightChar';
      break;
    case tab:
      return Viewport.completeWord(viewport, config.getCandidates);
    default:
      return Viewport.addChar(
        viewport,
        String.fromCharCode(event.charCode));
  }

  return Viewport[command](viewport);
}

function handleKeypress(rerender, config) {
  var _config = {
    getCandidates: config.getCandidates,
    getViewport: config.getViewport,
    promptLabel: config.promptLabel,
    transform: config.transform,
    viewport: config.viewport
  };
  
  return function (event) {
    rerender(getViewport(event, _config), _config);
    scrollDown(_config.getViewport());
  };
}

function scrollDown(node) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
}

module.exports = handleKeypress;
