var getViewport       = require('./getViewport');
var interpretKeypress = require('./interpretKeypress');

function initializeControl(subscribe, render, config) {
  var handleEvent = function (getAction) {
    return function (event) {
      render(getViewport(getAction(event), config));
    };
  }

  subscribe('keypress', handleEvent(interpretKeypress));
}

module.exports = initializeControl;
