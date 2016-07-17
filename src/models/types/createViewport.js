function getPrompt(terminal, frame) {
  return frame.promptIndex === 0
    ? terminal.prompt
    : terminal.prompts[frame.promptIndex - 1];
}

module.exports = function (terminal, frame, scroll) {
  return {
    terminal: terminal,
    frame: frame,
    prompt: getPrompt(terminal, frame),
    scroll: scroll
  };
};
