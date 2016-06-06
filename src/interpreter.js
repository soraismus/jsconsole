function addChar3(appState, char) {
  return { commandType: 'addChar', char: char };
}

function deleteLeftChar3(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return innerText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteLeftChar', end: end, innerText: innerText };
}

function deleteRightChar3(appState) {
  var innerText = appState.cursor.post;
  return innerText.length == 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteRightChar' };
}

function moveCursorLeft3(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  return __promptText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorLeft', index: index, __promptText: __promptText };
}

function moveCursorRight3(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var length = __promptTextPost.length;
  return length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorRight', length: length, __promptTextPost: __promptTextPost };
}

function fastForwardHistory3(appState) {
  console.log('fastForwardHistory');
  if (appState.history.future.length <= 0 ) {
    console.log('future is empty');
    console.log('cache: ', appState.history.cache);
    if (appState.history.cache.length > 0) {
      console.log('cache is occupied');
      var preCursorText = appState.cursor.pre;
      var postCursorText = appState.cursor.post;
      var cursorText = (preCursorText + postCursorText).trim();
      return {
        commandType: 'restoreCache',
        cursorText: appState.history.cache[0],
        historyEntry: cursorText
      };
    } else {
      console.log('cache is empty');
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

function rewindHistory3(appState) {
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

function submit3(appState, transform) {
  if (transform == null) {
    transform = function (value) {
      return value;
    };
  }

  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  var text = __text.trim();
  return {
    commandType: 'submit',
    oldPrompt: text,
    response: transform(text),
    display: appState.history.display
  };
}

var interpreter = {
  addChar3: addChar3,
  deleteLeftChar3: deleteLeftChar3,
  deleteRightChar3: deleteRightChar3,
  fastForwardHistory3: fastForwardHistory3,
  moveCursorLeft3: moveCursorLeft3,
  moveCursorRight3: moveCursorRight3,
  rewindHistory3: rewindHistory3,
  submit3: submit3,
};

module.exports = interpreter;
