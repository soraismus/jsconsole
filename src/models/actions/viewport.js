var create         = require('../types/createViewport');
var createFrame    = require('../types/createFrame');
var createScroll   = require('../types/createScroll');
var createTerminal = require('../types/createTerminal');
var Frame          = require('./frame');
var Terminal       = require('./terminal');

var compelDown = { compel: true, origin: false };

var compelLeft = createScroll({
  horizontal: { compel: true, origin: true },
  vertical: compelDown
});

var compelRight = createScroll({
  horizontal: { compel: true, origin: false },
  vertical: compelDown
});

var preferRight = createScroll({
  horizontal: { compel: false, origin: false },
  vertical: compelDown
});

var noScroll = createScroll({
  horizontal: false,
  vertical: compelDown
});

function addChar(viewport, char) {
  return create(
    Terminal.addChar(viewport.terminal, char),
    viewport.frame,
    preferRight);
}

function completeWord(viewport, getCandidates) {
  var frame = viewport.frame;
  var newTerminal =
    Terminal.completeWord(refreshTerminal(viewport), getCandidates);
  var diff = newTerminal.entries.length - viewport.terminal.entries.length;
  return create(
    newTerminal,
    createFrame(
      frame.offset + diff,
      frame.start,
      0),
    preferRight);
}

function clear(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.clear(viewport.frame, terminal),
    preferRight);
}

function fastForward(viewport) {
  return create(
    viewport.terminal,
    Frame.fastForward(viewport.frame),
    preferRight);
}

function modifyTerminal(fnName) {
  return function (viewport) {
    return create(
      Terminal[fnName](refreshTerminal(viewport)),
      Frame.resetPromptIndex(viewport.frame),
      preferRight);
  };
}

function refreshTerminal(viewport) {
  var terminal = viewport.terminal;
  return createTerminal(terminal.entries, terminal.prompts, viewport.prompt);
}

function rewind(viewport) {
  var terminal = viewport.terminal;
  return create(
    terminal,
    Frame.rewind(viewport.frame, terminal),
    preferRight);
}

function submit(viewport, transform) {
  var frame = viewport.frame;
  var newTerminal = Terminal.submit(refreshTerminal(viewport), transform);
  var diff = newTerminal.entries.length - viewport.terminal.entries.length;
  return create(
    newTerminal,
    createFrame(
      frame.offset + diff,
      frame.start,
      0),
    compelLeft);
}

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
  rewind              : rewind,
  submit              : submit
};
