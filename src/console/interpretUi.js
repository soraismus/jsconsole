function interpretUi(command) {
  switch (command.commandType) {
    case 'addChar':
      return {
        cursor: {
          pre: { append: command.char }
        }
      };

    case 'clearConsole':
      return { clearConsole: true };

    case 'deleteLeftChar':
      return {
        cursor: {
          pre: { slice: { start: 0, end: command.end }}
        }
      };

    case 'deleteRightChar':
      return {
        cursor: {
          post: { slice: { start: 1 }}
        }
      };

    case 'display':
      return {
        history: {
          display: { text: command.text }
        }
      };

    case 'fastForwardHistory':
      return {
        cursor: {
          pre: { replace: command.cursorText },
          post: { erase: true }},
        history: {
          fastForward: command.historyEntry
        }
      };

    case 'moveCursorLeft':
      return {
        cursor: {
          pre: { slice: { start: 0, end: command.index }},
          post: { prepend: command.__promptText[command.index] }
        }
      };

    case 'moveCursorRight':
      return {
        cursor: {
          pre: { append: command.__promptTextPost[0] },
          post: { slice: { start: 1, end: command.length }}
        }
      };

    case 'moveCursorToEnd':
      return {
        cursor: {
          pre: { append: command.__promptTextPost },
          post: { erase: true }
        }
      };

    case 'moveCursorToStart':
      return {
        cursor: {
          pre: { erase: true },
          post: { replace: command.__promptText + command.__promptTextPost }
        }
      };

    case 'noOp':
      return {};

    case 'restoreCache':
      return {
        cursor: {
          pre: { replace: command.cursorText },
          post: { erase: true }},
        history: {
          fastForward: command.historyEntry
        }
      };

    case 'rewindHistory':
      return {
        cursor: {
          pre: { replace: command.cursorText },
          post: { erase: true }},
        history: {
          rewind: command.historyEntry
        }
      };

    case 'submit':
      return {
        cursor: {
          pre: { erase: true },
          post: { erase: true }},
        history: {
          submit: {
            display: command.display,
            oldPrompt: command.oldPrompt,
            response: command.response
          }
        },
        display: command.display,
      };

  }
}

module.exports = interpretUi;
