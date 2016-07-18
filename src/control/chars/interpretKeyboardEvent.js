//var interpretKeypress = require('./interpretKeypress');
var interpretKey           = require('./interpretKey');
var interpretKeyIdentifier = require('./interpretKeyIdentifier');


function interpretKeyboardEvent(event) {
  if (event.key) {
    return interpretKey(event);
  } else if (event.keyIdentifier) {
    return interpretKeyIdentifier(event);
  }
}

module.exports = interpretKeyboardEvent;
