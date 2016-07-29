var detectCssScrollbar = require('../detectCssScrollbar');
var scroll             = require('./control/scroll');

function initializeViewDynamics(rootChild, getCursor) {
  console.log('detectCssScrollbar()', detectCssScrollbar());

  window.addEventListener('resize', function (event) {
    scroll(
      document.getElementsByClassName('erl-viewport')[0],
      getCursor());
  });
}

module.exports = initializeViewDynamics;
