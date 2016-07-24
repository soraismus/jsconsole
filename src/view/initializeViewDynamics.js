var scroll = require('./control/scroll');

function initializeViewDynamics(rootChild, getCursor) {
  window.addEventListener('resize', function (event) {
    scroll(
      document.getElementsByClassName('erl-viewport')[0],
      getCursor());
  });
}

module.exports = initializeViewDynamics;
