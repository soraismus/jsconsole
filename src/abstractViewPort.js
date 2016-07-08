var nothing = require('./option').nothing;

var viewport = {
  timeline: {
    cachedPromptMaybe: nothing(),
    entries: {
      all: [],
      past: [],
      future: []
    },
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

module.exports = viewport;
