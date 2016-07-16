var handleKeypress  = require('./handleKeypress');

function initializeControl(subscribe, rerender, config) {
  subscribe('keypress', handleKeypress(rerender, config));
};

module.exports = initializeControl;
