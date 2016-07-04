var nothing = require('./option').nothing;

var abstractViewPort = {
  timeline: {
    cachedPromptMaybe: nothing(),
    entries: {
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

module.exports = abstractViewPort;
