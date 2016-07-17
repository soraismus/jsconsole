var getInitialModel   = require('./models/getInitialModel');
var initializeControl = require('./control/initializeControl');
var initializeView    = require('./view/initializeView');
var rerender          = require('./view/control/rerender');

function initialize(config) {
  var getCandidates = config.getCandidates;
  var nodeId = config.nodeId;
  var promptLabel = config.promptLabel;
  var transform = config.transform;

  var getRoot = function () {
    return document.getElementById(nodeId);
  };

  var viewConfig = {
    promptLabel: promptLabel,
    getRoot: getRoot
  };

  initializeView(viewConfig);

  var controlConfig = {
    getCandidates: getCandidates,
    getCursor: function () {
      return getRoot().getElementsByClassName('jsconsole-cursor')[0];
    },
    getViewport: function () {
      return getRoot().childNodes[0];
    },
    promptLabel: promptLabel,
    transform: transform,
    viewport: getInitialModel()
  };

  var _rerender = rerender(promptLabel, controlConfig);

  initializeControl(subscribe, _rerender, controlConfig);
}

function subscribe(eventType, eventHandler) {
  window.addEventListener(eventType, supressDefault(eventHandler));
}

function supressDefault(handleEvent) {
  return function (event) {
    event.preventDefault();
    handleEvent(event);
  };
}

module.exports = initialize;
