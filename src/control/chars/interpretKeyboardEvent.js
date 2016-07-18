var interpretKey           = require('./interpretKey');
var interpretKeyCode       = require('./interpretKeyCode');
var interpretKeyIdentifier = require('./interpretKeyIdentifier');

function interpretKeyboardEvent(event) {
  //if (event.key != null) {
  if (false) {
    return interpretKey(event);
  //} else if (event.keyIdentifier != null) {
  } else if (false) {
    return interpretKeyIdentifier(event);
  } else {
    return interpretKeyCode(event);
  }
}

module.exports = interpretKeyboardEvent;
