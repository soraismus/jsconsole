function interpretUi(command) {
  switch (command.commandType) {
    case 'addChar':
      return {
        cursor: {
          pre: { append: command.char }
        }
      };

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

      case 'fastForwardHistory':
        return {
          cursor: {
            pre: { replace: command.content },
            post: { erase: true }},
          history: {
            fastForward: command.__text
          }
        };

    case 'rewindHistory':
      return {
        cursor: {
          pre: { replace: command.content },
          post: { erase: true }},
        history: {
          rewind: command.__text
        }
      };

    case 'submit':
      return {
        cursor: {
          pre: { erase: true },
          post: { erase: true }},
        history: {
          submit: command.__text
        }
      };

    case 'noOp':
      return {};

  }
}

module.exports = interpretUi;
