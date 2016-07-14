var createFrame    = require('../models/types/createFrame');
var createPrompt   = require('../models/types/createPrompt');
var createTerminal = require('../models/types/createTerminal');
var createViewport = require('../models/types/createViewport');
var rerender       = require('../view/control/rerender');
// ------------------------------------------------------------------------
var handleKeypress = require('./handleKeypress');

module.exports = function (subscribe, config) {
  config.viewport = createViewport(
    createTerminal([], [], createPrompt('', '')),
    createFrame(0, 0, 0));

  subscribe('keypress', handleKeypress(config));
};
