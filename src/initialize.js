var getInitialModel        = require('./models/getInitialModel');
var getInitialViewModel    = require('./view/control/recreateConsole');
var initializeControl      = require('./control/initializeControl');
var initializeView         = require('./view/initializeView');
var initializeViewDynamics = require('./view/initializeViewDynamics');
var render                 = require('./render');
var subscribe              = require('./subscribe');

function initialize(config) {
  var root = document.getElementById(config.nodeId);
  var initialModel = getInitialModel();
  var promptLabel = config.promptLabel;
  var labels = { promptLabel: promptLabel };
  var viewModel = getInitialViewModel(labels, initialModel);

  initializeView(root, viewModel);

  var rootChild = root.childNodes[0];

  var getCursor = function () {
    return document.getElementById('erl-cursor');
  };

  initializeViewDynamics(rootChild, getCursor);

  var controlConfig = {
    getCandidates: config.getCandidates,
    promptLabel: promptLabel,
    transform: config.transform,
    viewport: initialModel
  };

  initializeControl(
    subscribe,
    render(viewModel, rootChild, getCursor, controlConfig),
    controlConfig);
}

module.exports = initialize;
