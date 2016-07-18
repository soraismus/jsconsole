var scroll = require('./control/scroll');

function initializeViewDynamics(rootChild, getCursor) {
  window.addEventListener('resize', function (event) {
    scroll(rootChild, getCursor());
  });
}

module.exports = initializeViewDynamics;
