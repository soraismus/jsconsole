var nothing = require('./option').nothing;

function createTimeline(cachedPromptMaybe, past, future) {
  return {
    cachedPromptMaybe: cachedPromptMaybe,
    prompts: {
      past: past,
      future: future
    }
  };
}

function createPrompt(preCursor, postCursor) {
  return {
    preCursor: preCursor,
    postCursor: postCursor
  };
}

function createTerminal(entries, timeline, prompt) {
  return  {
    entries: entries,
    timeline: timeline,
    prompt: prompt
  };
}

var terminal;

terminal = createTerminal(
  [],
  createTimeline(nothing(), [], []),
  createPrompt('', ''));

terminal = {
  entries: [],
  timeline: {
    cachedPromptMaybe: nothing(),
    prompts: {
      past: [],
      future: []
    }
  },
  prompt: {
    preCursor: '',
    postCursor: ''
  }
};

module.exports = terminal;
