function addChar(appState, char) {
  return { commandType: 'addChar', char: char };
}

function clearConsole(appState) {
  return { commandType: 'clearConsole' };
}

function deleteLeftChar(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return innerText.length === 0
    ? noOp(appState)
    : { commandType: 'deleteLeftChar', end: end, innerText: innerText };
}

function deleteRightChar(appState) {
  var innerText = appState.cursor.post;
  return innerText.length == 0
    ? noOp(appState)
    : { commandType: 'deleteRightChar' };
}

function display(appState, text) {
  return { commandType: 'display', text: text };
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
      return noOp(appState);
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

function moveCursorLeft(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  var command = __promptText.length === 0
    ? noOp(appState)
    : {
        commandType: 'moveCursorLeft',
        index: index,
        __promptText: __promptText
      };
  return command;
}

function moveCursorRight(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var length = __promptTextPost.length;
  return length === 0
    ? noOp(appState)
    : {
        commandType: 'moveCursorRight',
        length: length,
        __promptTextPost: __promptTextPost
      };
}

function moveCursorToEnd(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  return {
      commandType: 'moveCursorToEnd',
      __promptText: __promptText,
      __promptTextPost: __promptTextPost
    };
}

function moveCursorToStart(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  return {
      commandType: 'moveCursorToStart',
      __promptText: __promptText,
      __promptTextPost: __promptTextPost
    };
}

function noOp(appState) {
  return { commandType: 'noOp' };
}

function rewindHistory(appState) {
  if (appState.history.past.length <= 0) {
    return noOp(appState);
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
  var lastIndex = results.length - 1;

  var wrappedResponse = results[lastIndex];

  var responseCount = wrappedResponse.effect ? 0 : 2;

  var displayEffects = results
    .slice(0, lastIndex)
    .filter(function (value) { return value.effect.type === 'display'; });

  var newEntryCount = displayEffects.length + responseCount;

  return {
    commandType: 'submit',
    oldPrompt: text,
    response: wrappedResponse,
    display: displayEffects,
    entryCount: appState.history.entryCount + newEntryCount,
    newEntryCount: newEntryCount
  };
}

var interpreter = {
  addChar: addChar,
  clearConsole: clearConsole,
  deleteLeftChar: deleteLeftChar,
  deleteRightChar: deleteRightChar,
  display: display,
  fastForwardHistory: fastForwardHistory,
  moveCursorLeft: moveCursorLeft,
  moveCursorRight: moveCursorRight,
  moveCursorToEnd: moveCursorToEnd,
  moveCursorToStart: moveCursorToStart,
  noOp: noOp,
  rewindHistory: rewindHistory,
  submit: submit,
};

module.exports = interpreter;
