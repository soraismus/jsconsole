function interpretAppState(command) {
  switch (command.commandType) {
    case 'addChar':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: appState.cursor.pre + command.char,
            post: appState.cursor.post
          }
        };
      };

    case 'deleteLeftChar':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: innerText.slice(0, command.end),
            post: appState.cursor.post
          }
        };
      };

    case 'deleteRightChar':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: appState.cursor.pre,
            post: appState.cursor.post.slice(1)
          }
        };
      };

    case 'moveCursorLeft':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: appState.cursor.pre.slice(0, command.index),
            post: command.__promptText[command.index] + appState.cursor.post
          }
        };
      };

    case 'moveCursorRight':
      return function (appState) {
        var __promptText = appState.cursor.pre;
        var index = __promptText.length - 1;
        return {
          history: appState.history, 
          cursor: {
            pre: __promptText + command.__promptTextPost[0],
            post: __promptTextPost.slice(1)
          }
        };
      };

    case 'fastForwardHistory':
      return function (appState) {
        var pastCopy = appState.history.past.slice();
        pastCopy.push(String.trim(command.__text));
        return {
          cursor: appState.cursor,
          history: { past: pastCopy, future: appState.history.future }
        };
      };

    case 'rewindHistory':
      return function (appState) {
        var futureCopy = appState.history.future.slice();
        futureCopy.push(String.trim(__text));
        return {
          cursor: appState.cursor,
          history: { past: appState.history.past, future: futureCopy }
        };
      };

    case 'submit':
      return function (appState) {
        var pastCopy = appState.history.past.slice();
        pastCopy.push(String.trim(comand.__text));
        return {
          cursor: { pre: '', post: '' },
          history: { past: pastCopy, future: appState.history.future }
        };
      };

    case 'noOp':
      return function (appState) {
        return appState;
      };

  }
}

module.exports = interpretAppState;
