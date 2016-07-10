var create = require('./createFrame');

function clear(frame, terminal) {
  return create(frame.maximumSize, 0, terminal.entries.length);
}

function scrollDown(frame, terminal) {
  return create(
    frame.maximumSize,
    frame.offset,
    terminal.entries.length - frame.start <= frame.maximumSize
      ? frame.start
      : frame.start + 1);
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
    newStart);
}

module.exports = {
  clear: clear,
  scrollDown: scrollDown,
  scrollUp: scrollUp,
};
