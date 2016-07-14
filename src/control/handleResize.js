var diff = require('../diff');
var interpreter = require('../../lib/interpreter');
var recreateConsole = require('../view/control/recreateConsole');
var Viewport = require('../models/actions/viewport');

function handleResize(config) {
  return function (event) {
    var oldViewport = config.viewport;
    console.log('new size: ', config.getRootSize());
    var newViewport = Viewport.resize(config.viewport, config.getRootSize());
    interpreter.modifyElement(
      document.getElementById('viewport').childNodes[0],
      diff(
        recreateConsole({ promptLabel: config.promptLabel }, newViewport),
        recreateConsole({ promptLabel: config.promptLabel }, oldViewport)));
    config.viewport = newViewport;
  };
}

module.exports = handleResize;
