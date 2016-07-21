var diff          = require('./view/control/diff');
var getViewModel  = require('./view/control/recreateConsole');
var modifyElement = require('./../lib/interpreter').modifyElement;
var scroll        = require('./view/control/scroll');

var viewModel;

function render(_viewModel, rootChild, getCursor, controlConfig) {
  viewModel = _viewModel;

  return function (model) {
    var newViewModel = getViewModel({ promptLabel: controlConfig.promptLabel }, model);
    modifyElement(rootChild, diff(newViewModel, viewModel));
    scroll(rootChild, getCursor());
    controlConfig.viewport = model;
    viewModel = newViewModel;
  };
}

module.exports = render;
