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

    case 'clearConsole':
      return function (appState) {
        return {
          cursor : appState.cursor,
          history: {
            past: appState.history.past,
            future: appState.history.future,
            cache: appState.history.cache,
            entryCount: 0,
            display: []
          }
        };
      };

    case 'deleteLeftChar':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: command.innerText.slice(0, command.end),
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

    case 'display':
      return function (appState) {
        return appState;
      };

    case 'fastForwardHistory':
      return function (appState) {
        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var length = appState.history.future.length;
        var entry = appState.history.future[length - 1];
        var futureCopy = appState.history.future.slice(0, length - 1);
        var pastCopy = appState.history.past.slice();
        var cacheCopy = appState.history.cache.slice();

        if (cacheCopy.length == 0) {
          cacheCopy.push(cursorText);
        } else {
          pastCopy.push(cursorText);
        }

        var result = {
          cursor: {
            pre: entry,
            post: ''
          },
          history: {
            past: pastCopy,
            future: futureCopy,
            cache: cacheCopy,
            entryCount: appState.history.entryCount,
            display: appState.history.display
          }
        };
        return result;
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
            post: command.__promptTextPost.slice(1)
          }
        };
      };

    case 'moveCursorToEnd':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: command.__promptText + command.__promptTextPost,
            post: ''
          }
        };
      };

    case 'moveCursorToStart':
      return function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: '',
            post: command.__promptText + command.__promptTextPost
          }
        };
      };

    case 'noOp':
      return function (appState) {
        return appState;
      };

    case 'restoreCache':
      return function (appState) {
        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var entry = appState.history.cache[0];
        var pastCopy = appState.history.past.slice();

        pastCopy.push(cursorText);

        var result = {
          cursor: {
            pre: entry,
            post: ''
          },
          history: {
            past: pastCopy,
            future: appState.history.future,
            cache: [],
            entryCount: appState.history.entryCount,
            display: appState.history.display
          }
        };
        return result;
      };

    case 'rewindHistory':
      return function (appState) {
        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var length = appState.history.past.length;
        var entry = appState.history.past[length - 1];
        var pastCopy = appState.history.past.slice(0, length - 1);
        var futureCopy = appState.history.future.slice();
        var cacheCopy = appState.history.cache.slice();

        if (cacheCopy.length == 0) {
          cacheCopy.push(cursorText);
        } else {
          futureCopy.push(cursorText);
        }

        var result = {
          cursor: {
            pre: entry,
            post: ''
          },
          history: {
            past: pastCopy,
            future: futureCopy,
            cache: cacheCopy,
            entryCount: appState.history.entryCount,
            display: appState.history.display
          }
        };
        return result;
      };

    case 'submit':
      return function (appState) {
        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var pastCopy = appState.history.past.slice();
        var futureCopy = appState.history.future.slice();
        var displayCopy = appState.history.display.slice();

        for (var index = futureCopy.length - 1; index >= 0; index--) {
          pastCopy.push(futureCopy[index]);
        }

        if (cursorText != '') {
          pastCopy.push(cursorText);
        }

        // Length of displayCopy should perhaps not be accessible here.
        if (displayCopy.length >= 11) {
          displayCopy.shift();
        }

        displayCopy.push([command.oldPrompt, command.response]);

        var result = {
          cursor: {
            pre: '',
            post: ''
          },
          history: {
            past: pastCopy,
            future: [],
            cache: [],
            entryCount: command.entryCount,
            display: displayCopy
          }
        };
        return result;
      };

  }
}

module.exports = interpretAppState;
