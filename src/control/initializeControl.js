var getViewport       = require('./getViewport');
var interpretKeyboardEvent = require('./chars/interpretKeyboardEvent');

function initializeControl(subscribe, render, config) {
  var handleEvent = function (getAction) {
    return function (event) {
      render(getViewport(getAction(event), config));
    };
  }

  subscribe('keydown', handleEvent(interpretKeyboardEvent));
}

module.exports = initializeControl;
