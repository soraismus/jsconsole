var create = require('./createFrame');

function clear(frame, terminal) {
  return create(
    frame.maximumSize,
    0,
    terminal.entries.length,
    frame.promptIndex);
}

function fastForward(frame) {
  return create(
    frame.maximumSize,
    frame.offset,
    frame.start,
    frame.promptIndex > 0
      ? frame.promptIndex - 1
      : frame.promptIndex);
}

function resetPromptIndex(frame) {
  return create(
    frame.maximumSize,
    frame.offset,
    frame.start,
    0);
}

function rewind(frame, terminal) {
  return create(
    frame.maximumSize,
    frame.offset,
    frame.start,
    terminal.prompts.length > frame.promptIndex
      ? frame.promptIndex + 1
      : frame.promptIndex);
}

function scrollDown(frame, terminal) {
  return create(
    frame.maximumSize,
    frame.offset,
    terminal.entries.length - frame.start <= frame.maximumSize
      ? frame.start
      : frame.start + 1,
    frame.promptIndex);
}

function scrollUp(frame, terminal) {
  var maximumSize = frame.maximumSize;
  var offset = frame.offset;
  var newStart = frame.start - 1 < 0 ? 0 : frame.start - 1;

  var canIncrement =
    offset < maximumSize &&
    offset < terminal.entries.length - newStart;

  return create(
    maximumSize,
    canIncrement ? offset + 1 : offset,
    newStart,
    frame.promptIndex);
}

module.exports = {
  clear: clear,
  fastForward: fastForward,
  resetPromptIndex: resetPromptIndex,
  rewind: rewind,
  scrollDown: scrollDown,
  scrollUp: scrollUp,
};
