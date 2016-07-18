var getInitialModel        = require('./models/getInitialModel');
var getInitialViewModel    = require('./view/components/createConsole');
var initializeControl      = require('./control/initializeControl');
var initializeView         = require('./view/initializeView');
var initializeViewDynamics = require('./view/initializeViewDynamics');
var render                 = require('./render');
var subscribe              = require('./subscribe');

function initialize(config) {
  var root = document.getElementById(config.nodeId);
  var promptLabel = config.promptLabel;
  var viewModel = getInitialViewModel(promptLabel);

  initializeView(root, viewModel);

  var rootChild = root.childNodes[0];

  var getCursor = function () {
    return root.getElementsByClassName('jsconsole-cursor')[0];
  };

  initializeViewDynamics(rootChild, getCursor);

  var controlConfig = {
    getCandidates: config.getCandidates,
    promptLabel: promptLabel,
    transform: config.transform,
    viewport: getInitialModel()
  };

  initializeControl(
    subscribe,
    render(viewModel, rootChild, getCursor, controlConfig),
    controlConfig);
}

module.exports = initialize;
