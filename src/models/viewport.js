var create      = require('./createViewport');
var createFrame = require('./createFrame');
var Frame       = require('./frame');
var Terminal    = require('./terminal');

function addChar(viewport, char) {
  return create(
    Terminal.addChar(viewport.terminal, char),
    viewport.frame);
}

function clearViewport(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.clear(viewport.frame, terminal));
}

function completeWord(viewport, getCandidates) {
  var terminal = viewport.terminal;
  return resize(
    viewport.frame, 
    terminal,
    Terminal.completeWord(terminal, getCandidates));
}

function modifyTerminal(fnName) {
  return function (viewport) {
    return create(
      Terminal[fnName](viewport.terminal),
      viewport.frame);
  };
}

function resize(frame, oldTerminal, newTerminal) {
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

  return create(
    newTerminal,
    createFrame(maximumSize, offset, start));
}

function scrollDown(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.scrollDown(viewport.frame, terminal));
}

function scrollUp(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.scrollUp(viewport.frame, terminal));
}

function submit(viewport, transform) {
  var terminal = viewport.terminal;
  return resize(
    viewport.frame,
    terminal,
    Terminal.submit(terminal, transform));
}

module.exports = {
  addChar             : addChar,
  clearViewport       : clearViewport,
  completeWord        : completeWord,
  deleteLeftChar      : modifyTerminal('deleteLeftChar'),
  deletePreCursor     : modifyTerminal('deletePreCursor'),
  deleteRightChar     : modifyTerminal('deleteRightChar'),
  deleteWord          : modifyTerminal('deleteWord'),
  fastForwardHistory  : modifyTerminal('fastForwardHistory'),
  moveCursorLeft      : modifyTerminal('moveCursorLeft'),
  moveCursorRight     : modifyTerminal('moveCursorRight'),
  moveCursorToEnd     : modifyTerminal('moveCursorToEnd'),
  moveCursorToStart   : modifyTerminal('moveCursorToStart'),
  rewindHistory       : modifyTerminal('rewindHistory'),
  scrollDown          : scrollDown,
  scrollUp            : scrollUp,
  submit              : submit
};
