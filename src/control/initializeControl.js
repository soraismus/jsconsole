var handleKeypress = require('./handleKeypress');

module.exports = function (subscribe, config) {
  subscribe('keypress', handleKeypress(config));
};
