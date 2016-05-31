elements = require('./elements.js');
var createPrompt = elements.createPrompt;
var createOldPrompt = elements.createOldPrompt;
var createOldPromptReply = elements.createOldPromptReply;

// Because the model is so simple, perhaps
// no diffs/commands are necessary. Give the full, current appState
// to the DOM interpreter.
// What about paging/scrolling, however?
function addChar(appState, char) {
  return {
    appState: function (appState) {
      return {
        history: appState.history, 
        cursor: {
          pre: appState.cursor.pre + char,
          post: appState.cursor.post
        }
      };
    },
    ui: {
      children: {
        modify: [
          {
            child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
            changes: { text: { append: char }}
          }
        ]
      }
    }
  };
}

function addChar2(appState, char) {
  return { cursor: { pre: { append: char }} };
}

function deleteLeftChar(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return innerText.length === 0 ? {} :
    {
      appState: function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: innerText.slice(0, end),
            post: appState.cursor.post
          }
        };
      },
      ui: {
        children: {
          modify: [
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
              changes: {
                text: { slice: { start: 0, end: end }}
              }
            }
          ]
        }
      }
    };
}

function deleteLeftChar2(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return { cursor: { pre: { slice: { start: 0, end: end }}}};
}

function deleteRightChar(appState) {
  var innerText = appState.cursor.post;
  return innerText.length === 0 ? {} :
    {
      appState: function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: appState.cursor.pre,
            post: innerText.slice(1)
          }
        };
      },
      ui: {
        children: {
          modify: [
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
              changes: {
                text: { slice: { start: 1 }}
              }
            }
          ]
        }
      }
    };
}

function deleteRightChar2(appState) {
  var innerText = appState.cursor.post;
  return innerText.length === 0
    ? {} 
    : { cursor: { post: { slice: { start: 0 }}}};
}

function moveCursorLeft(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  return __promptText.length === 0 ?  {} :
    {
      appState: function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: appState.cursor.pre.slice(0, index),
            post: __promptText[index] + __promptTextPost
          }
        };
      },
      ui: {
        children: {
          modify: [
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
              changes: {
                text: { slice : { start: 0, end: __promptText.length - 1 }}
              }
            },
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
              changes: {
                text: { prepend : __promptText[__promptText.length - 1] }
              }
            }
          ]
        }
      }
    };
}

function moveCursorLeft2(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  return __promptText.length === 0
    ? {}
    : {
        cursor: {
          pre: { slice: { start: 0, end: index }},
          post: { prepend: __promptText[index] }
        }
      };
}

function moveCursorRight(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  return __promptTextPost.length === 0 ?  {} :
    {
      appState: function (appState) {
        return {
          history: appState.history, 
          cursor: {
            pre: __promptText + __promptTextPost[0],
            post: __promptTextPost.slice(1)
          }
        };
      },
      ui: {
        children: {
          modify: [
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
              changes: {
                text: { append : __promptTextPost[0] }
              }
            },
            {
              child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
              changes: {
                text: { slice : { start: 1, end: __promptTextPost.length }}
              }
            }
          ]
        }
      }
    };
}

function moveCursorLeft2(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var length = __promptTextPost.length;
  return __promptTextLength === 0
    ? {}
    : {
        cursor: {
          pre: { append: __promptTextPost[0] },
          post: { slice: { start: 1, end: length }}
        }
      };
}

function fastForwardHistory(appState) {
  var content = appState.history.future.pop();
  if (content == null) {
    return {
      appState: function (appState) { return appState; },
      ui: {}
    };
  }
  var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
  var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
  var __text = String.trim(__promptText + __promptTextPost);
  return {
    appState: function (appState) {
      var pastCopy = appState.history.past.slice();
      pastCopy.push(String.trim(__text));
      return {
        cursor: appState.cursor,
        history: { past: pastCopy, future: appState.history.future }
      };
    },
    ui: {
      children: {
        modify: [
          {
            child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
            changes: {
              text: { replace: content }
            }
          },
          {
            child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
            changes: {
              text: { erase: true }
            }
          }
        ]
      }
    }
  };
}

function fastForwardHistory2(appState) {
  var content = appState.history.future.pop();
  if (content == null) { return {}; }
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = String.trim(__promptText + __promptTextPost);
  return {
    cursor: { pre: { replace: content }, post: { erase: true }},
    //history: { past: { push: __text }}
    history: { fastForward: __text }
  };
}

function rewindHistory(appState) {
  var content = appState.history.past.pop();
  if (content == null) {
    return {
      appState: function (appState) { return appState; },
      ui: {}
    };
  }
  var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
  var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
  var __text = String.trim(__promptText + __promptTextPost);
  return {
    appState: function (appState) {
      var futureCopy = appState.history.future.slice();
      futureCopy.push(String.trim(__text));
      return {
        cursor: appState.cursor,
        history: { past: appState.history.past, future: futureCopy }
      };
    },
    ui: {
      children: {
        modify: [
          {
            child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
            changes: {
              text: { replace: content }
            }
          },
          {
            child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
            changes: {
              text: { erase: true }
            }
          }
        ]
      }
    }
  };
}

function rewindHistory2(appState) {
  var content = appState.history.past.pop();
  if (content == null) { return {}; }
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = String.trim(__promptText + __promptTextPost);
  return {
    cursor: { pre: { replace: content }, post: { erase: true }},
    //history: { future: { push: __text }}
    history: { rewind: __text }
  };
}

function submit(appState) {
  __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  return {
    appState: function (appState) {
      var pastCopy = appState.history.past.slice();
      pastCopy.push(String.trim(__text));
      return {
        cursor: { pre: '', post: '' },
        history: { past: pastCopy, future: appState.history.future }
      };
    },
    ui: {
      children: {
        remove: [{ mode: 'class', key: { class: 'jsconsole-prompt', index: 0 }}],
        modify: [
          {
            child: { mode: 'query', key: { query: 'div pre', index: 0 }},
            changes: {
              children: {
                add: [
                  createOldPrompt(__text),
                  createOldPromptReply(__text),
                  createPrompt()
                ]
              }
            }
          }
        ]
      }
    }
  };
}

// The UI interpreter also has a display history for prompts and responses.
function submit2(appState) {
  __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  return {
    cursor: { pre: { erase: true }, post: { erase: true }},
    //history: { past: { push: __text }}
    history: { submit: __text }
  };
}

var interpreter = {
  addChar: addChar,
  deleteLeftChar: deleteLeftChar,
  deleteRightChar: deleteRightChar,
  fastForwardHistory: fastForwardHistory,
  moveCursorLeft: moveCursorLeft,
  moveCursorRight: moveCursorRight,
  rewindHistory: rewindHistory,
  submit: submit,

  addChar2: addChar,
  deleteLeftChar2: deleteLeftChar,
  deleteRightChar2: deleteRightChar,
  fastForwardHistory2: fastForwardHistory,
  moveCursorLeft2: moveCursorLeft,
  moveCursorRight2: moveCursorRight,
  rewindHistory2: rewindHistory,
  submit2: submit
};

module.exports = interpreter;
