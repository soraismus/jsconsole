var createFrame       = require('./models/types/createFrame');
var createPrompt      = require('./models/types/createPrompt');
var createTerminal    = require('./models/types/createTerminal');
var createViewport    = require('./models/types/createViewport');
var diff              = require('./diff');
var initializeControl = require('./control/initializeControl');
var initializeView    = require('./view/initializeView');
var interpreter       = require('./../lib/interpreter');
var recreateConsole   = require('./view/control/recreateConsole');

function getInitialModel() {
  return createViewport(
    createTerminal([], [], createPrompt('', '')),
    createFrame(0, 0, 0));
}

function initialize(config) {
  var getCandidates = config.getCandidates;
  var nodeId = config.nodeId;
  var promptLabel = config.promptLabel;
  var transform = config.transform;

  var getRoot = function () {
    return document.getElementById(nodeId);
  };

  var controlConfig = {
    getCandidates: getCandidates,
    getRoot: getRoot,
    getViewport: function () {
      return getRoot().childNodes[0];
    },
    promptLabel: promptLabel,
    transform: transform,
    viewport: getInitialModel()
  };

  var viewConfig = {
    promptLabel: promptLabel,
    getRoot: getRoot
  };

  initializeView(viewConfig);
  initializeControl(subscribe, rerender, controlConfig);
}

function rerender(_viewport, config) {
  var promptLabel = { promptLabel: config.promptLabel };
  interpreter.modifyElement(
    config.getViewport(),
    diff(
      recreateConsole(promptLabel, _viewport),
      recreateConsole(promptLabel, config.viewport)));
  config.viewport = _viewport;
}

function subscribe(eventType, eventHandler) {
  window.addEventListener(eventType, eventHandler);
}

module.exports = initialize;
