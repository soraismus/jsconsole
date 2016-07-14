var initializeControl = require('./control/initializeControl');
var initializeView    = require('./view/initializeView');

function scale(offsetHeight) {
  //return Math.floor(offsetHeight / 19.6);

  //var _scale = offsetHeight < 260 ? 2 : 1.5;
  //return Math.floor(8 + _scale * (offsetHeight - 160) / 30);

  if (offsetHeight < 160) {
    return 8;
  } else if (offsetHeight < 200) {
    return 11;
  } else if (offsetHeight < 230) {
    return 12;
  } else if (offsetHeight < 260) {
    return 14;
  } else if (offsetHeight < 290) {
    return 16;
  } else if (offsetHeight < 330) {
    return 18;
  } else if (offsetHeight < 360) {
    return 21;
  } else if (offsetHeight < 400) {
    return 23;
  } else if (offsetHeight < 420) {
    return 25;
  } else if (offsetHeight < 450) {
    return 26;
  } else {
    return 28;
  }

  // 8 + 1.5 * (size - 160) / 30

  // ...  ...   should be
  // 157 . 8 .  8                  160
  // 205  10   11                  205
  // 233  11   12/13               230
  // 260  13   14                  260
  // 288  14   16                  290
  // 327  16   18/19               330
  // 362  18   21                  360
  // 396  20   23                  400
  // 422  21   24/25               420
  // 446  22   26?                 450
  // 520  26   ?                   520
}

function getRoot(nodeId) {
  return function () {
    return document.getElementById(nodeId);
  };
}

function getRootSize(getRoot) {
  return function () {
    return scale(getRoot().offsetHeight);
  };
}

function initialize(config) {
  config.getRoot = getRoot(config.nodeId);
  initializeView(config);
  config.getRootSize = getRootSize(config.getRoot);
  initializeControl(subscribe, config);

  window.onresize = function () {
    console.log('RESIZE');
    console.log(document.getElementById('viewport').offsetHeight);
  };
}

function subscribe(eventType, eventHandler) {
  //document.addEventListener(eventType, eventHandler);
  window.addEventListener(eventType, eventHandler);
}

module.exports = initialize;
