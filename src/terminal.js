var createPrompt   = require('./models/createPrompt');
var createTerminal = require('./models/createTerminal');
var createTimeline = require('./models/createTimeline');
var nothing        = require('./option').nothing;

module.exports = createTerminal(
  [],
  createTimeline(nothing(), [], []),
  createPrompt('', ''));
