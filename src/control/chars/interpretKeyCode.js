/*
Letter/Key  charCode  keyCode
----------  --------  -------
A 65   65
Z 90   90
a 97   65
z 122  90

1 49   49
9 57   57
0 48   48

` 96   192
- 45   173
= 61   61
[ 91   219
] 93   221
\ 92   220
; 59   59
' 39   222
, 44   188
. 46   190
/ 47   191

~ 126
_ 95
+ 43
{ 123
} 125
| 124
: 59  ????? 58
" 34
< 60
> 62
? 63

! 33
@ 64
# 35
$ 36
% 37
^ 94
& 38
* 42
( 40
) 41

Tab    0,9
Enter  0,13
Down   0,40
Left   0,37
Right  0,39
Up     0,38
*/

var withShift = {
  48: 41, // )
  49: 33, // !
  50: 64, // @
  51: 35, // #
  52: 36, // $
  53: 37, // %
  54: 94, // ^
  55: 38, // &
  56: 42, // *
  57: 40, // (
  59: 58, // :
  61: 43, // +
  65: 65, // A
  66: 66, // B
  67: 67, // C
  68: 68, // D
  69: 69, // E
  70: 70, // F
  71: 71, // G
  72: 72, // H
  73: 73, // I
  74: 74, // J
  75: 75, // K
  76: 76, // L
  77: 77, // M
  78: 78, // N
  79: 79, // O
  80: 80, // P
  81: 81, // Q
  82: 82, // R
  83: 83, // S
  84: 84, // T
  85: 85, // U
  86: 86, // V
  87: 87, // W
  88: 88, // X
  89: 89, // Y
  90: 90, // Z
  173: 95, // _
  188: 60, // <
  190: 62, // >
  191: 63, // ?
  192: 126, // ~
  219: 123, // {
  220: 124, // |
  221: 125, // }
  222: 34, // "
};

var withoutShift = {
  48: 48, // 0
  49: 49, // 1
  50: 50, // 2
  51: 51, // 3
  52: 52, // 4
  53: 53, // 5
  54: 54, // 6
  55: 55, // 7
  56: 56, // 8
  57: 57, // 9
  59: 59, // ;
  61: 61, // =
  65: 97, // a
  66: 98, // b
  67: 99, // c
  68: 100, // d
  69: 101, // e
  70: 102, // f
  71: 103, // g
  72: 104, // h
  73: 105, // i
  74: 106, // j
  75: 107, // k
  76: 108, // l
  77: 109, // m
  78: 110, // n
  79: 111, // o
  80: 112, // p
  81: 113, // q
  82: 114, // r
  83: 115, // s
  84: 116, // t
  85: 117, // u
  86: 118, // v
  87: 119, // w
  88: 120, // x
  89: 121, // y
  90: 122, // z
  173: 45, // -
  188: 44, // ,
  190: 46, // .
  191: 47, // /
  192: 96, // `
  219: 91, // [
  220: 92, // \
  221: 93, // ]
  222: 39, // '
};

var property = 'keyCode'; 

var a = 65;
var e = 69;
var h = 72;
var l = 76;
var u = 85;
var w = 87;

var backspace =   8;
var _delete   =  46;
var down      =  40;
var enter     =  13;
var left      =  37;
var right     =  39;
var space     =  32;
var tab       =   9;
var up        =  38;

function interpretKeyCode(event) {
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
  return String.fromCharCode((shiftKey ? withShift : withoutShift)[value]);
}

function isCharacter(value) {
  return value in withShift;
}

function wrap(actionName) {
  return { name: actionName };
}

module.exports = interpretKeyCode;
