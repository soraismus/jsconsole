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

    /*
    f0();
    f1();
    f2();
    f3();
    */

    document.dispatchEvent(new Event('terminal-render'))
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

  var xThumbStyle = xThumb.style;

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

    xThumbStyle.left = cursorPercentage;
    xThumbStyle.width = viewportPercentage;
    xThumbStyle.visibility = 'visible';
  } else {
    xThumbStyle.left = 0;
    xThumbStyle.width = '100%';
    xThumbStyle.visibility = 'hidden';
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

  var yThumbStyle = yThumb.style;

  if (viewportHeight < terminalHeight) {
    var start = viewport.offsetTop;

    var _viewportRatio = viewportHeight / terminalHeight;
    var yThumbHeight = _viewportRatio * yTrackHeight;
    var _viewportPercentage = getPercentage(_viewportRatio);
    var _ullage = yTrackHeight - yThumbHeight;
    var yPosition = cursor.offsetTop + cursor.offsetHeight - start;
    var _cursorRatio = (yPosition / terminalHeight) * (_ullage / yTrackHeight);
    var _cursorPercentage = getPercentage(_cursorRatio);

    yThumbStyle.top = _cursorPercentage;
    yThumbStyle.height = _viewportPercentage;
    yThumbStyle.visibility = 'visible';
  } else {
    yThumbStyle.top = 0;
    yThumbStyle.height = '100%';
    yThumbStyle.visibility = 'hidden';
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
    var topRatio = top / yTrackHeight;
    yThumb.style.top = getPercentage(topRatio);

    // --------------------------------------------------------------------
    viewport.scrollTop = topRatio * viewport.scrollHeight;
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

function f3() {
  var viewport = document.getElementsByClassName('erl-viewport')[0];
  var xTrack = document.getElementById('erl-x-scroll-track');
  var xThumb = document.getElementById('erl-x-scroll-thumb');

  var xThumbWidth = xThumb.offsetWidth;
  var xTrackWidth = xTrack.offsetWidth;
  var viewportWidth = viewport.offsetWidth;

  var _ullage = xTrackWidth - xThumbWidth;

  function mouseMove_horizontal(event) {
    var _left = event.clientX - xTrack.getBoundingClientRect().left;
    var left = _left < 0 ? 0 : _left > _ullage ? _ullage : _left;
    var leftRatio = left / xTrackWidth;
    xThumb.style.left = getPercentage(leftRatio);

    // --------------------------------------------------------------------
    viewport.scrollLeft = leftRatio * viewport.scrollWidth;
  };

  function mouseUp_horizontal() {
    document.removeEventListener('mousemove', mouseMove_horizontal);
    document.removeEventListener('mouseup', mouseUp_horizontal);
  };

  function mouseDown_horizontal() {
    document.addEventListener('mousemove', mouseMove_horizontal);
    document.addEventListener('mouseup', mouseUp_horizontal);
  };

  xThumb.removeEventListener('mousedown', mouseDown_horizontal);
  xThumb.addEventListener('mousedown', mouseDown_horizontal);
}

function __scroll(node, x, y) {
  node.scrollLeft = x;
  node.scrollTop = y;
}
