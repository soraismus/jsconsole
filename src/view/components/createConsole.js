var components = require('./components');
var elements   = require('../../../lib/elements');
var DIV        = elements.DIV;
var PRE        = elements.PRE;

module.exports = function (promptLabel) {
  return DIV(
    {
      style: {
        'top': '0px',
        'left': '0px',
        'right': '0px',
        'bottom': '0px',
        'position': 'absolute',
        'overflow': 'auto'
      }
    },
    PRE(
      {
        classes: { 'jsconsole': true },
        style: {
          'margin': '0px',
          'position': 'relative',
          'min-height': '100%',
          'box-sizing': 'border-box',
          'padding': '10px',
          'padding-bottom': '10px'
        }
      },
      components.header,
      components.createPrompt(promptLabel)));
};
