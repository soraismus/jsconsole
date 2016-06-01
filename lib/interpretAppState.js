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

    case 'restoreCache':
      return function (appState) {
        console.log('RESTORE-CACHE');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);
        console.log('orig appstate.history.cache: ', appState.history.cache);
        console.log('orig appstate.history.display: ', appState.history.display);

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
            display: appState.history.display
          }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        console.log('new appstate.history.cache: ', result.history.cache);
        console.log('new appstate.history.display: ', result.history.display);
        return result;
      };

    case 'fastForwardHistory':
      return function (appState) {
        console.log('FASTFORWARD');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);
        console.log('orig appstate.history.cache: ', appState.history.cache);
        console.log('orig appstate.history.display: ', appState.history.display);

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
            display: appState.history.display
          }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        console.log('new appstate.history.cache: ', result.history.cache);
        console.log('new appstate.history.display: ', result.history.display);
        return result;
      };

    case 'rewindHistory':
      return function (appState) {
        console.log('REWIND');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);
        console.log('orig appstate.history.cache: ', appState.history.cache);
        console.log('orig appstate.history.display: ', appState.history.display);

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
            display: appState.history.display
          }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        console.log('new appstate.history.cache: ', result.history.cache);
        console.log('new appstate.history.display: ', result.history.display);
        return result;
      };

    case 'submit':
      return function (appState) {
        console.log('SUBMIT');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);
        console.log('orig appstate.history.cache: ', appState.history.cache);
        console.log('orig appstate.history.display: ', appState.history.display);

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

        displayCopy.push([cursorText, cursorText]);

        var result = {
          cursor: {
            pre: '',
            post: ''
          },
          history: {
            past: pastCopy,
            future: [],
            cache: [],
            display: displayCopy
          }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        console.log('new appstate.history.cache: ', result.history.cache);
        console.log('new appstate.history.display: ', result.history.display);
        return result;
      };

    case 'noOp':
      return function (appState) {
        return appState;
      };

  }
}

module.exports = interpretAppState;
