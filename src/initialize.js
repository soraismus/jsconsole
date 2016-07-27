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


function f0() {
  var ratio;

  var viewport = document.getElementById('erl-viewport');
  var xTrack = document.getElementById('erl-x-scroll-track');
  var yTrack = document.getElementById('erl-y-scroll-track');
  var xThumb = document.getElementById('erl-x-scroll-thumb');
  var yThumb = document.getElementById('erl-y-scroll-thumb');

  var viewportWidth = viewport.offsetWidth;
  var terminalWidth = viewport.scrollWidth;

  if (viewportWidth < terminalWidth) {
    console.log('part is hidden');
  }
}

/*
`viewport.offsetWidth` is the size of the 'viewport'.
`viewport.scrollWidth` is the size of the underlying 'terminal'.

The scroll track's length should be offsetWidth / scrollWdith.


var X_SCROLLBAR = DIV(
  {
    id: 'erl-x-scroll-track',
    classes: {
      'erl-x-scroll-track': true,
      'erl-scroll-track': true
    }
  },
  DIV({
    id: 'erl-x-scroll-thumb',
    classes: {
      'erl-x-scroll-thumb': true,
      'erl-scroll-thumb': true

*/
