var components             = require('./components');
var domUtility             = require('../domUtility/interpret');
var createAndAttachElement = domUtility.createAndAttachElement;
var DIV                    = require('../domUtility/elements').DIV;
var PRE                    = require('../domUtility/elements').PRE;

function initializeUi(promptLabel) {
  domUtility.createAndAttachElement(
    document.getElementById('console'),
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
