(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var promptLabelMessage = 'Lisp'
var promptLabelText = promptLabelMessage + '> '

function createPrompt() {
  var cursor = {
    tag: 'span',
    classes: { 'jsconsole-cursor': true },
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    },
    children: [' ']
  };
  var emptySpan = { tag: 'span', children: [''] };
  var promptLabel = {
    tag: 'span',
    children: [promptLabelText]
  };
  var promptText = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text': true },
  };
  var relativeSpan = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text-post-cursor': true },
    style: {
      'position': 'relative'
    }
  };
  return {
    tag: 'span',
    classes: { 'jsconsole-prompt': true },
    style: { 'color': '#0d0' },
    children: [
      emptySpan,
      {
        tag: 'span',
        children: [
          promptLabel,
          promptText,
          cursor,
          relativeSpan
        ]
      },
      emptySpan
    ]
  };
}

function createOldPrompt(text) {
  return {
    tag: 'span',
    classes: { 'jsconsole-old-prompt': true },
    style: {
      'font-weight': 'normal'
    },
    children: [
      {
        tag: 'span',
        children: [promptLabelText + text + '\n']
      }
    ]
  };
}

function createOldPromptReply(text) {
  return {
    tag: 'span',
    children: [
      {
        tag: 'span',
        children: ['==> ' + text + '\n']
      }
    ]
  };
}

module.exports = {
  createPrompt: createPrompt,
  createOldPrompt: createOldPrompt,
  createOldPromptReply: createOldPromptReply,
};

},{}],2:[function(require,module,exports){
var initialize = require('./interpret').initialize;
//var interpret = require('./interpret2').interpret;
var translate = require('./interpret2').translate;
var interpreter = require('./interpreter');

var interpretAppState = require('./interpretAppState.js');
var interpretUi = require('./interpretUi.js');
var modifyElement = require('./interpret').modifyElement;

initialize();

var appState = {
  history: { past: [], future: [] },
  cursor: { pre: '', post: '' }
};

document.addEventListener(
  'keypress',
  function (event) {
    var command;
    switch (event.keyCode) {
      case 13: // enter
        command = interpreter.submit3(appState);
        break;
      case 8: // backspace
        event.preventDefault();
        command = interpreter.deleteLeftChar3(appState);
        break;
      case 37: // left;
        event.preventDefault();
        command = interpreter.moveCursorLeft3(appState);
        break;
      case 39: // right;
        event.preventDefault();
        command = interpreter.moveCursorRight3(appState);
        break;
      case 38: // up;
        event.preventDefault();
        command = interpreter.rewindHistory3(appState);
        break;
      case 40: // down;
        event.preventDefault();
        command = interpreter.fastForwardHistory3(appState);
        break;
      case 46: // delete
        event.preventDefault();
        command = interpreter.deleteRightChar3(appState);
        break;
      case 0:
        command = interpreter.addChar3(appState, String.fromCharCode(event.charCode));
        break;
      default:
        command = interpreter.addChar3(appState, String.fromCharCode(event.charCode));
        break;
    }
    var changes = translate(interpretUi(command));
    for (var index in changes) {
      modifyElement(
        document.getElementById('console'),
        changes[index]);
    }
    appState = interpretAppState(command)(appState);
  });

},{"./interpret":3,"./interpret2":4,"./interpretAppState.js":5,"./interpretUi.js":6,"./interpreter":7}],3:[function(require,module,exports){
var interpreter = require('./interpreter');
var elements = require('./elements');

function modifyElement(node, config) {
  if (config.classes != null) {
    for (var op in config.classes) {
      switch (op) {
        case 'add':
          for (var klass in config.classes[op]) {
            node.classList.add(klass);
          }
          break;
        case 'remove':
          for (var klass in config.classes[op]) {
            node.classList.remove(klass);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.classes\" mode');
      }
    }
  }

  if (config.attribs != null) {
    for (var op in config.attribs) {
      switch (op) {
        case 'set':
          for (var attribKey in config.attribs[op]) {
            node.setAttribute(attribKey, config.attribs[op][attribKey]);
          }
          break;
        case 'unset':
          for (var attribKey in config.attribs[op]) {
            node.attributes.removeNamedItem(attribKey);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.attribs\" mode');
      }
    }
  }

  if (config.style != null) {
    for (var op in config.style) {
      switch (op) {
        case 'set':
          for (var styleKey in config.style[op]) {
            node.style[styleKey] = config.style[op][styleKey];
          }
          break;
        case 'unset':
          for (var styleKey in config.style[op]) {
            node.style.removeProperty(styleKey);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.style\" mode');
      }
    }
  }

  if (config.children != null) {
    for (var op in config.children) {
      switch (op) {
        case 'add':
          for (var index in config.children[op]) {
            createAndAttachElement(node, config.children[op][index]);
          }
          break;
        case 'remove':
          for (var index in config.children[op]) {
            var child = findChild(node, config.children[op][index]);
            child.parentNode.removeChild(child);
          }
          break;
        case 'modify':
          for (var index in config.children[op]) {
            modifyElement(
              findChild(node, config.children[op][index].child),
              config.children[op][index].changes);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.children\" mode');
      }
    }
  }

  if (config.text != null) {
    for (var op in config.text) {
      switch (op) {
        case 'append':
          node.innerText += config.text[op];
          break;
        case 'erase':
          node.innerText = '';
          break;
        case 'prepend':
          node.innerText = config.text[op] + node.innerText;
          break;
        case 'replace':
          node.innerText = config.text[op];
          break;
        case 'slice':
          if (config.text[op].end == null) {
            node.innerText = node.innerText.slice(config.text[op].start);
          } else {
            node.innerText = node.innerText.slice(config.text[op].start, config.text[op].end);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.text\" mode');
      }
    }
  }
}

function findChild(parent, config) {
  switch (config.mode) {
    case 'id':
      return document.getElementById(config.key);
    case 'tag':
      return parent.getElementsByTagName(config.key.tag)[config.key.index];
    case 'class':
      return parent.getElementsByClassName(config.key.class)[config.key.index];
    case 'query':
      return parent.querySelectorAll(config.key.query)[config.key.index];
    case 'index':
      return parent.childNodes[config.key];
    default:
      throw new Error('Invalid \"findChild\" mode');
  }
}

function createAndAttachElement(parent, config) {
  if (Object.prototype.toString.call(config) === '[object String]') {
    parent.innerText = config;
  } else {
    var node = document.createElement(config.tag);

    if (config.id != null) {
      node.id = config.id;
    }

    if (config.classes != null) {
      for (var klass in config.classes) {
        node.classList.add(klass);
      }
    }

    if (config.attribs != null) {
      for (var attribKey in config.attribs) {
        if (attribKey !== 'style') {
          node.setAttribute(attribKey, config.attribs[attribKey]);
        }
      }
    }

    if (config.style != null) {
      for (var styleKey in config.style) {
        node.style[styleKey] = config.style[styleKey];
      }
    }

    if (config.children != null) {
      config.children.forEach(function (newConfig, index) { 
        createAndAttachElement(node, newConfig);
      });
    }

    parent.appendChild(node);
  }
}

var promptLabelMessage = 'Lisp'
var promptLabelText = promptLabelMessage + '> '

function initialize() {
  var console = document.getElementById('console');

  var cursor = {
    tag: 'span',
    classes: { 'jsconsole-cursor': true },
    style: {
      'background-color': '#999',
      'color': 'transparent',
      'display': 'inline',
      'z-index': 0,
      'position': 'absolute'
    },
    children: [' ']
  };

  var promptLabel = {
    tag: 'span',
    children: [promptLabelText]
  };

  var promptText = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text': true },
  };

  var relativeSpan = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text-post-cursor': true },
    style: {
      'position': 'relative'
    }
  };

  var emptySpan = { tag: 'span', children: [''] };

  var header = {
    tag: 'span',
    classes: { 'jsconsole-header': true },
    children: [
      {
        tag: 'span',
        style: { 'color': '#0ff' },
        children: ['Welcome to JQConsole!\nUse jqconsole.Write() to write and jqconsole.Input() to read.\n']
      }
    ]
  };

  var oldPrompt0 = elements.createOldPrompt('document');
  var oldPromptReply0 = elements.createOldPromptReply('[object HTMLDocument]');
  var oldPrompt1 = elements.createOldPrompt('3 + 4;');
  var oldPromptReply1 = elements.createOldPromptReply('7');

  var prompt = {
    tag: 'span',
    classes: { 'jsconsole-prompt': true },
    style: { 'color': '#0d0' },
    children: [
      emptySpan,
      {
        tag: 'span',
        children: [
          promptLabel,
          promptText,
          cursor,
          relativeSpan
        ]
      },
      emptySpan
    ]
  };

  var textArea = {
    tag: 'div',
    style: {
      'position': 'absolute',
      'width': '1px',
      'height': '0px',
      'overflow': 'hidden',
      'left': '30px',
      'top': '40px'
    },
    children: [
      {
        tag: 'textarea',
        attribs: {
          'wrap': 'off',
          'autocapitalize': 'off',
          'autocorrect': 'off',
          'spellcheck': false
        },
        style: {
          'position': 'absolute',
          'width': '2px'
        }
      }
    ]
  };

  var consoleState = {
    tag: 'div',
    style: {
      'top': '0px',
      'left': '0px',
      'right': '0px',
      'bottom': '0px',
      'position': 'absolute',
      'overflow': 'auto'
    },
    children: [
      {
        tag: 'pre',
        classes: { 'jsconsole': true },
        style: {
          'margin': '0px',
          'position': 'relative',
          'min-height': '100%',
          'box-sizing': 'border-box',
          'padding': '10px',
          'padding-bottom': '10px'
        },
        children: [
          header,
          oldPrompt0,
          oldPromptReply0,
          oldPrompt1,
          oldPromptReply1,
          prompt
        ]
      }
    ]
  };

  createAndAttachElement(console, consoleState);

  /*
  modifyElement(
    console,
    {
      children: {
        remove: [{ mode: 'query', key: { query: 'div .jsconsole span span', index: 1 }}]
      }
    }
  );
  */

  var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;

  modifyElement(
    console,
    {
      children: {
        remove: [{ mode: 'class', key: { class: 'jsconsole-prompt', index: 0 }}],
        modify: [
          {
            child: { mode: 'query', key: { query: 'div pre', index: 0 }},
            changes: {
              children: {
                add: [
                  oldPrompt1,
                  oldPromptReply1,
                  oldPrompt0,
                  oldPromptReply0,
                  elements.createOldPrompt(__promptText),
                  elements.createOldPromptReply(__promptText),
                  prompt
                ]
              }
            }
          }
        ]
      }
    }
  );

  /*
  modifyElement(
    console,
    {
      children: {
        modify: [
          {
            child: { mode: 'tag', key: { tag: 'div', index: 0 } },
            changes: {
              children: {
                modify: [
                  {
                    child: { mode: 'tag', key: { tag: 'pre', index: 0 }},
                    changes: {
                      children: {
                        modify: [
                          {
                            child: { mode: 'class', key: { class: 'jsconsole-old-prompt', index: 0 }},
                            changes: {
                              remove: { mode: 'index', key: 0 } 
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  );
  */
  /*
  modifyElement(console, {
    classes: {
      add: { 'console-trial-class': true }
    },
    children: {
      add: [
        { tag: 'div', id: 'console-trial-div0-id', classes: { 'console-trial-div0-class0': true, 'console-trial-div0-class1': true }},
        { tag: 'div', id: 'console-trial-div1-id', classes: { 'console-trial-div1-class0': true, 'console-trial-div1-class1': true }},
        { tag: 'div', id: 'console-trial-div2-id', classes: { 'console-trial-div2-class0': true, 'console-trial-div2-class1': true }}
      ]
    }
  });

  modifyElement(console, {
    children: {
      remove: [{ mode: 'id', key: 'console-trial-div0-id' }],
      modify: [
        {
          child: { mode: 'id', key: 'console-trial-div2-id' },
          changes: {
            classes: { remove: { 'console-trial-div2-class0': true } },
            style: { set: { 'color': '#fff', 'position': 'relative' } }
          }
        }
      ]
    }
  });

  modifyElement(console, {
    children: {
      modify: [
        {
          child: { mode: 'tag', key: { tag: 'div', index: 2 }},
          changes: {
            style: { unset: { 'color': true } }
          }
        }
      ]
    }
  });
  */

}

module.exports = {
  initialize: initialize,
  modifyElement: modifyElement,
};

},{"./elements":1,"./interpreter":7}],4:[function(require,module,exports){
var modifyElement = require('./interpret').modifyElement;
var elements = require('./elements');

function interpret(appState, command) {
  if (command.ui != null) {
    modifyElement(
      document.getElementById('console'),
      command.ui);
  }
  if (command.appState != null && typeof(command.appState) === 'function') {
    return command.appState(appState);
  } else {
    return appState;
  }
};

// TODO: Refactor.
function translate (command) {
  var changes = [];
  var prompt = 'jsconsole-prompt-text';
  var postPrompt = 'jsconsole-prompt-text-post-cursor';
  for (var outerKey in command) {
    switch (outerKey) {
      case 'cursor':
        for (var innerKey in command[outerKey]) {
          switch (innerKey) {
            case 'pre':
              changes.push({
                children: {
                  modify: [{
                    child: { mode: 'class', key: { class: prompt, index: 0 }},
                    changes: { text: command[outerKey][innerKey] }
                  }]
                }
              });
              break;
            case 'post':
              changes.push({
                children: {
                  modify: [{
                    child: { mode: 'class', key: { class: postPrompt, index: 0 }},
                    changes: { text: command[outerKey][innerKey] }
                  }]
                }
              });
              break;
          }
        }
      case 'history':
        for (var innerKey in command[outerKey]) {
          switch (innerKey) {
            case 'fastForward':
              break;
            case 'rewind':
              break;
            case 'submit':
              changes.push({
                children: {
                  remove: [{ mode: 'class', key: { class: 'jsconsole-prompt', index: 0 }}],
                  modify: [{
                    child: { mode: 'query', key: { query: 'div pre', index: 0 }},
                    changes: {
                      children: {
                        add: [
                          elements.createOldPrompt(command[outerKey][innerKey]),
                          elements.createOldPromptReply(command[outerKey][innerKey]),
                          elements.createPrompt()
                        ]
                      }
                    }

                  }]
                }
              });
              break;
          }
        }
    }
  }
  return changes;
};

module.exports = {
  interpret: interpret,
  translate: translate
};

},{"./elements":1,"./interpret":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
          submit: command.__text
        }
      };

    case 'noOp':
      return {};

  }
}

module.exports = interpretUi;

},{}],7:[function(require,module,exports){
elements = require('./elements.js');
var createPrompt = elements.createPrompt;
var createOldPrompt = elements.createOldPrompt;
var createOldPromptReply = elements.createOldPromptReply;

// Because the model is so simple, perhaps
// no diffs/commands are necessary. Give the full, current appState
// to the DOM interpreter.
// What about paging/scrolling, however?

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
  if (appState.history.future.length <= 0) {
    return { commandType: 'noOp' };
  }

  var preCursorText = appState.cursor.pre;
  var postCursorText = appState.cursor.post;
  var cursorText = (preCursorText + postCursorText).trim();

  var length = appState.history.future.length;
  var entry = appState.history.future[length - 1];
  var futureCopy = appState.history.future.slice(0, length - 1);
  var pastCopy = appState.history.past.slice();

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
  var pastCopy = appState.history.past.slice(0, length - 1);
  var futureCopy = appState.history.future.slice();

  return {
    commandType: 'rewindHistory',
    cursorText: entry,
    historyEntry: cursorText
  };
}

function submit3(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  return { commandType: 'submit', __text: __text };
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

},{"./elements.js":1}]},{},[2]);
