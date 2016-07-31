var diff          = require('./view/control/diff');
var getViewModel  = require('./view/control/recreateConsole');
var modifyElement = require('./../lib/interpreter').modifyElement;
var scroll        = require('./view/control/scroll');

function render(_viewModel, rootChild, getCursor, controlConfig) {
  var viewModel = _viewModel;
  return function (model) {
    var labels = { promptLabel: controlConfig.promptLabel };
    var newViewModel = getViewModel(labels, model);
    modifyElement(rootChild, diff(newViewModel, viewModel));

    scroll(document.getElementsByClassName('erl-viewport')[0], getCursor());

    controlConfig.viewport = model;
    viewModel = newViewModel;

    document.dispatchEvent(new Event('terminal-render'))
  };
}

module.exports = render;
