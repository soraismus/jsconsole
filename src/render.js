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

    //scroll(rootChild, getCursor());
    scroll(document.getElementsByClassName('erl-viewport')[0], getCursor());

    controlConfig.viewport = model;
    viewModel = newViewModel;

    f0();

  };
}

module.exports = render;



function f0() {
  var viewport = document.getElementsByClassName('erl-viewport')[0];
  var xTrack = document.getElementById('erl-x-scroll-track');
  var yTrack = document.getElementById('erl-y-scroll-track');
  var xThumb = document.getElementById('erl-x-scroll-thumb');
  var yThumb = document.getElementById('erl-y-scroll-thumb');
  var cursor = document.getElementById('erl-cursor');
  var prompt = document.getElementById('erl-prompt');

  var xTrackWidth = xTrack.offsetWidth;
  var xThumbWidth = xThumb.offsetWidth;
  var viewportWidth = viewport.offsetWidth;
  var terminalWidth = viewport.scrollWidth;

  if (viewportWidth < terminalWidth) {
    var fullPromptOffsetWidth = prompt.offsetLeft + prompt.offsetWidth;

    var viewportRatio = viewportWidth / terminalWidth;
    var viewportPercentage = (100 * viewportRatio) + '%';

    var ullage = xTrackWidth - xThumbWidth;
    var xPosition = cursor.offsetLeft - fullPromptOffsetWidth;
    var cursorRatio = (xPosition / terminalWidth) * (ullage / xTrackWidth);
    var cursorPercentage = (100 * cursorRatio) + '%';

    var xThumbStyle = xThumb.style;
    xThumbStyle.left = cursorPercentage;
    xThumbStyle.width = viewportPercentage;
    xThumbStyle.visibility = 'visible';
  }
}
