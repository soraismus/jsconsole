var a =  97;
var e = 101;
var h = 104;
var l = 108;
var u = 117;
var w = 119;

var backspace =   8;
var _delete   =  46;
var down      =  40;
var enter     =  13;
var left      =  37;
var right     =  39;
var up        =  38;
var tab       =   9;

function interpretKeypress(event) {
  if (event.ctrlKey) {
    switch (event.charCode) {
      case a:
        return wrap('moveCursorToStart');
      case e:
        return wrap('moveCursorToEnd');
      case h:
        return wrap('deleteLeftChar');
      case l:
        return wrap('clear');
      case u:
        return wrap('deletePreCursor');
      case w:
        return wrap('deleteWord');
      default:
        return wrap('noOp');
    }
  }

  switch (event.keyCode) {
    case enter:
      return wrap('submit');
    case backspace:
      return wrap('deleteLeftChar');
    case left:
      return wrap('moveCursorLeft');
    case right:
      return wrap('moveCursorRight');
    case up:
      return wrap('rewind');
    case down:
      return wrap('fastForward');
    case _delete:
      return wrap('deleteRightChar');
    case tab:
      return wrap('completeWord');
    default:
      return { name: 'addChar', char: String.fromCharCode(event.charCode) };
  }
}

function wrap(actionName) {
  return { name: actionName };
}

module.exports = interpretKeypress;
