var createFrame    = require('./models/createFrame');
var createPrompt   = require('./models/createPrompt');
var createTerminal = require('./models/createTerminal');
var createTimeline = require('./models/createTimeline');
var createViewport = require('./models/createViewport');
var nothing        = require('./option').nothing;

module.exports = createViewport(
  createTerminal(
    [],
    createTimeline(nothing(), [], []),
    createPrompt('', '')),
  createFrame(23, 0, 0));
