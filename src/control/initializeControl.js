var createFrame    = require('../models/types/createFrame');
var createPane     = require('../models/types/createPane');
var createPrompt   = require('../models/types/createPrompt');
var createTerminal = require('../models/types/createTerminal');
var createViewport = require('../models/types/createViewport');
var rerender       = require('../view/control/rerender');
var Viewport       = require('../models/actions/viewport');


// ------------------------------------------------------------------------


var diff = require('../diff');
var recreateConsole = require('../view/control/recreateConsole');

var interpreter = require('../../lib/interpreter');




var handleKeypress = require('./handleKeypress');
var handleResize   = require('./handleResize');

module.exports = function (subscribe, config) {
  config.viewport = createViewport(
    createTerminal([], [], createPrompt('', '')),
    createFrame(0, 0, 0));

  subscribe('keypress', handleKeypress(config));
  subscribe('resize', handleResize(config));
};
