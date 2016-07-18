var property = 'keyIdentifier'; 

var a = 'U+0041';
var e = 'U+0045';
var h = 'U+0048';
var l = 'U+004C';
var u = 'U+0055';
var w = 'U+0057';

var backspace = 'U+0008';
var _delete   = 'U+0075';
var down      = 'Down';
var enter     = 'Enter';
var left      = 'Left';
var right     = 'Right';
var space     = 'U+0020';
var tab       = 'U+0009';
var up        = 'Up';

var withoutShift = {
  'U+0041': 'a',
  'U+0042': 'b',
  'U+0043': 'c',
  'U+0044': 'd',
  'U+0045': 'e',
  'U+0046': 'f',
  'U+0047': 'g',
  'U+0048': 'h',
  'U+0049': 'i',
  'U+004A': 'j',
  'U+004B': 'k',
  'U+004C': 'l',
  'U+004D': 'm',
  'U+004E': 'n',
  'U+004F': 'o',
  'U+0050': 'p',
  'U+0051': 'q',
  'U+0052': 'r',
  'U+0053': 's',
  'U+0054': 't',
  'U+0055': 'u',
  'U+0056': 'v',
  'U+0057': 'w',
  'U+0058': 'x',
  'U+0059': 'y',
  'U+005A': 'z',
  'U+0030': '0',
  'U+0031': '1',
  'U+0032': '2',
  'U+0033': '3',
  'U+0034': '4',
  'U+0035': '5',
  'U+0036': '6',
  'U+0037': '7',
  'U+0038': '8',
  'U+0039': '9',
  'U+00C0': '`',
  'U+00BD': '-',
  'U+00BB': '=',
  'U+00DB': '[',
  'U+00DD': ']',
  'U+00DC': '\\',
  'U+00BA': ';',
  'U+00DE': '\'',
  'U+00BC': ',',
  'U+00BE': '.',
  'U+00BF': '/',
  'U+0020': ' '
};

var withShift = {
  'U+0041': 'A',
  'U+0042': 'B',
  'U+0043': 'C',
  'U+0044': 'D',
  'U+0045': 'E',
  'U+0046': 'F',
  'U+0047': 'G',
  'U+0048': 'H',
  'U+0049': 'I',
  'U+004A': 'J',
  'U+004B': 'K',
  'U+004C': 'L',
  'U+004D': 'M',
  'U+004E': 'N',
  'U+004F': 'O',
  'U+0050': 'P',
  'U+0051': 'Q',
  'U+0052': 'R',
  'U+0053': 'S',
  'U+0054': 'T',
  'U+0055': 'U',
  'U+0056': 'V',
  'U+0057': 'W',
  'U+0058': 'X',
  'U+0059': 'Y',
  'U+005A': 'Z',
  'U+0030': ')',
  'U+0031': '!',
  'U+0032': '@',
  'U+0033': '#',
  'U+0034': '$',
  'U+0035': '%',
  'U+0036': '^',
  'U+0037': '&',
  'U+0038': '*',
  'U+0039': '(',
  'U+00C0': '~',
  'U+00BD': '_',
  'U+00BB': '+',
  'U+00DB': '{',
  'U+00DD': '}',
  'U+00DC': '|',
  'U+00BA': ':',
  'U+00DE': '"',
  'U+00BC': '<',
  'U+00BE': '>',
  'U+00BF': '?',
  'U+0020': ' '
};

function interpretKeyIdentifier(event) {
  var value = event[property];

  if (event.ctrlKey) {
    switch (value) {
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

  switch (value) {
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
      return isCharacter(value) 
        ? { name: 'addChar', char: getCharacter(value, event.shiftKey) }
        : wrap('noOp');
  }
}

function getCharacter(value, shiftKey) {
  return shiftKey ? withShift[value] : withoutShift[value];
}

function isCharacter(value) {
  return value in withoutShift || value in withShift;
}

function wrap(actionName) {
  return { name: actionName };
}

module.exports = interpretKeyIdentifier;
