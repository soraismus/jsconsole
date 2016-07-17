var getViewport       = require('./getViewport');
var interpretKeypress = require('./interpretKeypress');

function initializeControl(subscribe, rerender, config) {
  var handleEvent = function (getAction) {
    return function (event) {
      var action = getAction(event);
      rerender(action, getViewport(action, config));
    };
  }

  subscribe('keypress', handleEvent(interpretKeypress));
}

module.exports = initializeControl;
