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

    case 'fastForwardHistory':
      return function (appState) {
        console.log('FASTFORWARD');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);

        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var length = appState.history.future.length;
        var entry = appState.history.future[length - 1];
        var futureCopy = appState.history.future.slice(0, length - 1);
        var pastCopy = appState.history.past.slice();

        pastCopy.push(cursorText);

        var result = {
          cursor: { pre: entry, post: '' },
          history: { past: pastCopy, future: futureCopy }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        return result;
      };

    case 'rewindHistory':
      return function (appState) {
        console.log('REWIND');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);

        var preCursorText = appState.cursor.pre;
        var postCursorText = appState.cursor.post;
        var cursorText = (preCursorText + postCursorText).trim();

        var length = appState.history.past.length;
        var entry = appState.history.past[length - 1];
        var pastCopy = appState.history.past.slice(0, length - 1);
        var futureCopy = appState.history.future.slice();

        futureCopy.push(cursorText);

        var result = {
          cursor: { pre: entry, post: '' },
          history: { past: pastCopy, future: futureCopy }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        return result;
      };

    case 'submit':
      return function (appState) {
        console.log('SUBMIT');
        console.log('orig appstate.cursor.pre: ', appState.cursor.pre);
        console.log('orig appstate.cursor.post: ', appState.cursor.post);
        console.log('orig appstate.history.past: ', appState.history.past);
        console.log('orig appstate.history.future: ', appState.history.future);
        var pastCopy = appState.history.past.slice();
        pastCopy.push(command.__text.trim());
        var result = {
          cursor: { pre: '', post: '' },
          history: { past: pastCopy, future: appState.history.future }
        };
        console.log('new appstate.cursor.pre: ', result.cursor.pre);
        console.log('new appstate.cursor.post: ', result.cursor.post);
        console.log('new appstate.history.past: ', result.history.past);
        console.log('new appstate.history.future: ', result.history.future);
        return result;
      };

    case 'noOp':
      return function (appState) {
        return appState;
      };

  }
}

module.exports = interpretAppState;
