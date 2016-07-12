module.exports = function (buffer, prefixes) {
  var prompt = buffer.prompt;
  var frame = buffer.frame;
  var start = frame.start;
  return {
    entries: buffer.terminal.entries.slice(start, start + frame.offset),
    preCursor: prompt.preCursor,
    postCursor: prompt.postCursor
  };
};
