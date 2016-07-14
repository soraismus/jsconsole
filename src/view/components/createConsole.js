var components = require('./components');
var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var PRE        = elements.PRE;

module.exports = function (promptLabel) {
  return DIV(
    {
      id: 'view',
      classes: { 'view': true }
    },
    PRE(
      {
        id: 'jsconsole',
        classes: { 'jsconsole': true }
      },
      components.header,
      components.createPrompt(promptLabel)));
};
