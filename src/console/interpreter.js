function addChar(appState, char) {
  return { commandType: 'addChar', char: char };
}

function deleteLeftChar(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return innerText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteLeftChar', end: end, innerText: innerText };
}

function deleteRightChar(appState) {
  var innerText = appState.cursor.post;
  return innerText.length == 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteRightChar' };
}

function display(appState, text) {
  console.log("DISPLAY");
  return { commandType: 'display', text: text };
}

function moveCursorLeft(appState) {
  console.log('moveCursorLeft');
  console.log('appState.cursor.pre', appState.cursor.pre);
  console.log('appState.cursor.post', appState.cursor.post);
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  var command = __promptText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorLeft', index: index, __promptText: __promptText };
  console.log('command.index', command.index);
  console.log('command.__promptText', command.__promptText);
  return command;
}

function moveCursorRight(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var length = __promptTextPost.length;
  return length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorRight', length: length, __promptTextPost: __promptTextPost };
}

function fastForwardHistory(appState) {
  if (appState.history.future.length <= 0 ) {
    if (appState.history.cache.length > 0) {
      var preCursorText = appState.cursor.pre;
      var postCursorText = appState.cursor.post;
      var cursorText = (preCursorText + postCursorText).trim();
      return {
        commandType: 'restoreCache',
        cursorText: appState.history.cache[0],
        historyEntry: cursorText
      };
    } else {
      return { commandType: 'noOp' };
    }
  }

  var preCursorText = appState.cursor.pre;
  var postCursorText = appState.cursor.post;
  var cursorText = (preCursorText + postCursorText).trim();

  var length = appState.history.future.length;
  var entry = appState.history.future[length - 1];

  return {
    commandType: 'fastForwardHistory',
    cursorText: entry,
    historyEntry: cursorText
  };
}

function rewindHistory(appState) {
  if (appState.history.past.length <= 0) {
    return { commandType: 'noOp' };
  }

  var preCursorText = appState.cursor.pre;
  var postCursorText = appState.cursor.post;
  var cursorText = (preCursorText + postCursorText).trim();

  var length = appState.history.past.length;
  var entry = appState.history.past[length - 1];

  return {
    commandType: 'rewindHistory',
    cursorText: entry,
    historyEntry: cursorText
  };
}

function submit(appState, transform) {
  if (transform == null) {
    transform = function (value) {
      return value;
    };
  }

  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  var text = __text.trim();

  var results = transform(text);
  var length = results.length;
  var pureResult = results[length - 1].value;
  var displayEffects = results
    .slice(0, length - 1)
    .filter(function (value) { return value.effect.type === 'display'; });

  return {
    commandType: 'submit',
    oldPrompt: text,
    response: pureResult,
    display: displayEffects
  };
}

function getLast(array) {
  return array[array.length - 1];
}

var interpreter = {
  addChar: addChar,
  deleteLeftChar: deleteLeftChar,
  deleteRightChar: deleteRightChar,
  display: display,
  fastForwardHistory: fastForwardHistory,
  moveCursorLeft: moveCursorLeft,
  moveCursorRight: moveCursorRight,
  rewindHistory: rewindHistory,
  submit: submit,
};

module.exports = interpreter;
