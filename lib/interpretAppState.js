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
        var content = appState.history.future.pop();
        var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
        var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
        var __text = (__promptText + __promptTextPost).trim();
        var pastCopy = appState.history.past.slice();
        pastCopy.push(__text.trim());
        return {
          cursor: appState.cursor,
          history: { past: pastCopy, future: appState.history.future }
        };
      };

    /*
      return function (appState) {
        var pastCopy = appState.history.past.slice();
        var entry = command.__text.trim();
        pastCopy.push(entry);
        return {
          //cursor: appState.cursor,
          cursor: { pre: entry, post: '' },
          history: { past: pastCopy, future: appState.history.future }
        };
      };
    */

    case 'rewindHistory':
      return function (appState) {
        var content = appState.history.past.pop();
        var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
        var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
        var __text = (__promptText + __promptTextPost).trim();

        var futureCopy = appState.history.future.slice();
        futureCopy.push(__text.trim());
        return {
          cursor: appState.cursor,
          history: { past: appState.history.past, future: futureCopy }
        };
      };

    case 'submit':
      return function (appState) {
        var pastCopy = appState.history.past.slice();
        pastCopy.push(command.__text.trim());
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
