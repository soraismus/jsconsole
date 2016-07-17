var diff            = require('../../diff');
var modifyElement   = require('../../../lib/interpreter').modifyElement;
var recreateConsole = require('./recreateConsole');
var scroll          = require('../../scroll');

function getScrollState(viewport) {
  var scrollLeft = viewport.scrollLeft;
  var scrollTop = viewport.scrollTop;
  return {
    horizontal: scrollLeft === 0
      ? { atEdge: { origin: true }}
      : scrollLeft === viewport.scrollWidth - viewport.clientWidth
        ? { atEdge: { origin: false }}
        : { atEdge: false },
    vertical: scrollTop === 0
      ? { atEdge: { origin: true }}
      : scrollTop === viewport.scrollHeight - viewport.clientHeight
        ? { atEdge: { origin: false }}
        : { atEdge: false }
  };
}

function getScrollTargets(cursor, viewport) {
  var margin = 5;
  return {
    horizontal:
      cursor.offsetLeft + cursor.offsetWidth + margin - viewport.offsetWidth
  };
}

function rerender (promptLabel, controlConfig) {
  return function (action, viewport) {
    var _promptLabel = { promptLabel: promptLabel };
    var scrollState = getScrollState(controlConfig.getViewport());
    modifyElement(
      controlConfig.getViewport(),
      diff(
        recreateConsole(_promptLabel, viewport),
        recreateConsole(_promptLabel, controlConfig.viewport)));
    scroll(
      controlConfig.getViewport(),
      viewport.scroll,
      scrollState,
      getScrollTargets(
        controlConfig.getCursor(),
        controlConfig.getViewport()));
    controlConfig.viewport = viewport;
  };
}

module.exports = rerender;
