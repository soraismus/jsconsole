var initializeControl = require('./control/initializeControl');
var initializeView    = require('./view/initializeView');

function getRoot(nodeId) {
  return function () {
    return document.getElementById(nodeId);
  };
}

function initialize(config) {
  config.getRoot = getRoot(config.nodeId);
  initializeView(config);
  initializeControl(subscribe, config);
}

function subscribe(eventType, eventHandler) {
  document.addEventListener(eventType, eventHandler);
}

module.exports = initialize;
