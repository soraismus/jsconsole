var getInitialModel   = require('./models/getInitialModel');
var initializeControl = require('./control/initializeControl');
var initializeView    = require('./view/initializeView');

var diff            = require('./view/control/diff');
var modifyElement   = require('./../lib/interpreter').modifyElement;
var recreateConsole = require('./view/control/recreateConsole');

var createConsole          = require('./view/components/createConsole');

function getCursorOffset(cursor, viewport) {
  var margin = 5;
  return cursor.offsetLeft + cursor.offsetWidth + margin - viewport.offsetWidth;
}

function initialize(config) {
  var getCandidates = config.getCandidates;
  var nodeId = config.nodeId;
  var promptLabel = config.promptLabel;
  var transform = config.transform;

  var root = document.getElementById(nodeId);
  var viewModel = createConsole(promptLabel);

  initializeView(root, viewModel);

  // ----------------------------------------------------------------------
  var rootChild = root.childNodes[0];

  var getCursor = function () {
    return root.getElementsByClassName('jsconsole-cursor')[0];
  };

  var controlConfig = {
    getCandidates: getCandidates,
    promptLabel: promptLabel,
    transform: transform,
    viewport: getInitialModel()
  };

  var render = function (model) {
    var _promptLabel = { promptLabel: promptLabel };
    var newViewModel = recreateConsole(_promptLabel, model);
    modifyElement(rootChild, diff(newViewModel, viewModel));
    scroll(rootChild, getCursorOffset(getCursor(), rootChild));
    controlConfig.viewport = model;
    viewModel = newViewModel;
  };

  initializeControl(subscribe, render, controlConfig);
  // ----------------------------------------------------------------------
}

function scroll(node, cursorOffset) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
  node.scrollLeft = cursorOffset;
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
