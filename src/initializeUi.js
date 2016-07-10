var components             = require('./components');
var interpreter            = require('../lib/interpreter');
var createAndAttachElement = interpreter.createAndAttachElement;
var modifyElement          = interpreter.modifyElement;
var elements               = require('../lib/elements');
var DIV                    = elements.DIV;
var PRE                    = elements.PRE;

function initializeUi(promptLabel) {
  createAndAttachElement(
    document.getElementById('viewport'),
    DIV(
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
        components.createPrompt(promptLabel))));
}

module.exports = initializeUi;
