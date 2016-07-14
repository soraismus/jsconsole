var create         = require('../types/createViewport');
var createFrame    = require('../types/createFrame');
var createTerminal = require('../types/createTerminal');
var Frame          = require('./frame');
var Terminal       = require('./terminal');

function addChar(viewport, char) {
  return create(
    Terminal.addChar(viewport.terminal, char),
    viewport.frame);
}

function addLineEntries(frame, oldTerminal, newTerminal) {
  var offset, start;
  var newEntries = newTerminal.entries
  var oldEntries = oldTerminal.entries
  var diffCount = newEntries.length - oldEntries.length;
  var maximumSize = frame.maximumSize;

  if (diffCount < 0) {
    return viewport;
  }

  if (diffCount === 0) {
    return create(newTerminal, frame);
  }

  if (frame.offset + diffCount >= maximumSize) {
    offset = maximumSize;
    start = frame.start + ((diffCount + frame.offset) - maximumSize);
  } else {
    offset = frame.offset + diffCount;
    start = frame.start;
  }

  var out = document.getElementById('viewport').childNodes[0];
  var isScrolledToBottom = out.scrollHeight - out.clientHeight < out.scrollTop;
  console.log('scroll', 'scrollHeight: ', out.scrollHeight, 'clientHeight', out.clientHeight, 'diff',  out.scrollHeight - out.clientHeight, 'scrollTop',  out.scrollTop);
  if (isScrolledToBottom) {
    out.scrollTop = out.scrollHeight - out.clientHeight;
  }

  return create(
    newTerminal,
    createFrame(maximumSize, offset, start, frame.promptIndex));
}

function clear(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.clear(viewport.frame, terminal));
}

function completeWord(viewport, getCandidates) {
  var terminal = viewport.terminal;
  return addLineEntries(
    viewport.frame, 
    terminal,
    Terminal.completeWord(terminal, getCandidates));
}

function fastForward(viewport) {
  return create(
    viewport.terminal,
    Frame.fastForward(viewport.frame));
}

function modifyTerminal(fnName) {
  return function (viewport) {
    return create(
      Terminal[fnName](refreshTerminal(viewport)),
      Frame.resetPromptIndex(viewport.frame));
  };
}

function refreshTerminal(viewport) {
  var terminal = viewport.terminal;
  return createTerminal(terminal.entries, terminal.prompts, viewport.prompt);
}

function resize(viewport, height) {
  return create(
    viewport.terminal,
    Frame.resize(viewport.frame, height));
}

function rewind(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.rewind(viewport.frame, terminal));
}

function submit(viewport, transform) {
  //console.log('submit');
  //var out = document.getElementById('viewport').childNodes[0].childNodes[0];
  //var out = document.getElementById('jsconsole');
  //var out = document.getElementById('view');
  //var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
  //console.log('scrollHeight: ', out.scrollHeight);
  //console.log('clientHeight: ', out.clientHeight);
  //console.log('scrollTop: ', out.scrollTop);
  //console.log('isScrolledToBottom: ', isScrolledToBottom);
  //if (isScrolledToBottom) {
  //  out.scrollTop = out.scrollHeight - out.clientHeight;
  //}
  //scrollDown('viewport');
  //scrollDown('view');
  //scrollDown('jsconsole');
  //console.log('now scrollTop: ', out.scrollTop);
  var frame = viewport.frame;
  var newTerminal = Terminal.submit(refreshTerminal(viewport), transform);
  var diff = newTerminal.entries.length - viewport.terminal.entries.length;
  return create(
    newTerminal,
    createFrame(
      frame.offset + diff,
      frame.start,
      0));
}

function scrollDown(id) {
  document.getElementById(id).scrollTop =
    document.getElementById(id).scrollHeight -
      document.getElementById(id).clientHeight;
}

/*
function submit(viewport, transform) {
  console.log('submit; maximumSize: ', viewport.frame.maximumSize);
  var terminal = refreshTerminal(viewport);
  return addLineEntries(
    Frame.resetPromptIndex(viewport.frame),
    terminal,
    Terminal.submit(terminal, transform));
}
*/

module.exports = {
  addChar             : addChar,
  clear               : clear,
  completeWord        : completeWord,
  deleteLeftChar      : modifyTerminal('deleteLeftChar'),
  deletePreCursor     : modifyTerminal('deletePreCursor'),
  deleteRightChar     : modifyTerminal('deleteRightChar'),
  deleteWord          : modifyTerminal('deleteWord'),
  fastForward         : fastForward,
  moveCursorLeft      : modifyTerminal('moveCursorLeft'),
  moveCursorRight     : modifyTerminal('moveCursorRight'),
  moveCursorToEnd     : modifyTerminal('moveCursorToEnd'),
  moveCursorToStart   : modifyTerminal('moveCursorToStart'),
  resize              : resize,
  rewind              : rewind,
  submit              : submit
};
