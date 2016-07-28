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
    f1();
    f2();

  };
}

module.exports = render;

function getPercentage(number) {
  return (100 * number) + '%';
}

function f0() {
  var viewport = document.getElementsByClassName('erl-viewport')[0];
  var xTrack = document.getElementById('erl-x-scroll-track');
  var xThumb = document.getElementById('erl-x-scroll-thumb');
  var cursor = document.getElementById('erl-cursor');
  var prompt = document.getElementById('erl-prompt');

  var xTrackWidth = xTrack.offsetWidth;
  var viewportWidth = viewport.offsetWidth;
  var terminalWidth = viewport.scrollWidth;

  if (viewportWidth < terminalWidth) {
    var fullPromptOffsetWidth = prompt.offsetLeft + prompt.offsetWidth;
    var start = fullPromptOffsetWidth;

    var viewportRatio = viewportWidth / terminalWidth;
    var xThumbWidth = viewportRatio * xTrackWidth;
    var viewportPercentage = getPercentage(viewportRatio);
    var ullage = xTrackWidth - xThumbWidth;
    var xPosition = cursor.offsetLeft + cursor.offsetWidth - start;
    var cursorRatio = (xPosition / terminalWidth) * (ullage / xTrackWidth);
    var cursorPercentage = getPercentage(cursorRatio);

    var xThumbStyle = xThumb.style;
    xThumbStyle.left = cursorPercentage;
    xThumbStyle.width = viewportPercentage;
    xThumbStyle.visibility = 'visible';
  }
}

function f1() {
  var viewport = document.getElementsByClassName('erl-viewport')[0];
  var yTrack = document.getElementById('erl-y-scroll-track');
  var yThumb = document.getElementById('erl-y-scroll-thumb');
  var cursor = document.getElementById('erl-cursor');

  var yTrackHeight = yTrack.offsetHeight;
  var viewportHeight = viewport.offsetHeight;
  var terminalHeight = viewport.scrollHeight;

  if (viewportHeight < terminalHeight) {
    var start = viewport.offsetTop;

    var _viewportRatio = viewportHeight / terminalHeight;
    var yThumbHeight = _viewportRatio * yTrackHeight;
    var _viewportPercentage = getPercentage(_viewportRatio);
    var _ullage = yTrackHeight - yThumbHeight;
    var yPosition = cursor.offsetTop + cursor.offsetHeight - start;
    var _cursorRatio = (yPosition / terminalHeight) * (_ullage / yTrackHeight);
    var _cursorPercentage = getPercentage(_cursorRatio);

    var yThumbStyle = yThumb.style;
    yThumbStyle.top = _cursorPercentage;
    yThumbStyle.height = _viewportPercentage;
    yThumbStyle.visibility = 'visible';
  }
}

function f2() {
  var viewport = document.getElementsByClassName('erl-viewport')[0];
  var yTrack = document.getElementById('erl-y-scroll-track');
  var yThumb = document.getElementById('erl-y-scroll-thumb');

  var yThumbHeight = yThumb.offsetHeight;
  var yTrackHeight = yTrack.offsetHeight;
  var viewportHeight = viewport.offsetHeight;

  var _ullage = yTrackHeight - yThumbHeight;

  function mouseMove_vertical(event) {
    var _top = event.clientY - yTrack.getBoundingClientRect().top;
    var top = _top < 0 ? 0 : _top > _ullage ? _ullage : _top;
    var topPx = top + 'px';
    yThumb.style.top = topPx;
  };

  function mouseDown_vertical() {
    document.addEventListener('mousemove', mouseMove_vertical);
    document.addEventListener('mouseup', mouseUp_vertical);
  };

  function mouseUp_vertical() {
    document.removeEventListener('mousemove', mouseMove_vertical);
    document.removeEventListener('mouseup', mouseUp_vertical);
  };

  yThumb.removeEventListener('mousedown', mouseDown_vertical);
  yThumb.addEventListener('mousedown', mouseDown_vertical);
}

// ------------------------------------------------------------------------
function mouseMove_horizontal(event) {
  var _left = event.clientX - container.offsetLeft - horizontalTrack.offsetLeft;
  var left = _left < 0 ? 0 : _left > horizontalUllage ? horizontalUllage : _left;
  horizontalHandle.style.left = left + 'px';
  orb.style.left = (left - 150) + 'px';
};

function mouseDown_horizontal() {
  document.addEventListener('mousemove', mouseMove_horizontal);
  document.addEventListener('mouseup', mouseUp_horizontal);
};

function mouseUp_horizontal() {
  document.removeEventListener('mousemove', mouseMove_horizontal);
  document.removeEventListener('mouseup', mouseUp_horizontal);
};

//horizontalHandle.addEventListener('mousedown', mouseDown_horizontal);
