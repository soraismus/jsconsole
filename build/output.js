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
var interpret = require('./interpret2').interpret;
var interpreter = require('./interpreter');

// function (interpret) {}

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
        command = interpreter.submit(appState);
        break;
      case 8: // backspace
        command = interpreter.deleteLeftChar(appState);
        break;
      case 37: // left;
        event.preventDefault();
        command = interpreter.moveCursorLeft(appState);
        break;
      case 39: // right;
        event.preventDefault();
        command = interpreter.moveCursorRight(appState);
        break;
      case 38: // up;
        command = interpreter.rewindHistory(appState);
        break;
      case 40: // down;
        command = interpreter.fastForwardHistory(appState);
        break;
      case 46: // delete
        command = interpreter.deleteRightChar(appState);
        break;
      case 0:
        command = interpreter.addChar(
          appState,
          String.fromCharCode(event.charCode));
        break;
    }
    appState = interpret(appState, command);
  });

},{"./interpret":3,"./interpret2":4,"./interpreter":5}],3:[function(require,module,exports){
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

},{"./elements":1,"./interpreter":5}],4:[function(require,module,exports){
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
function translate (appState, command) {
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
                child: { mode: 'class', key: { class: prompt, index: 0 }},
                changes: { text: command[outerKey][innerKey] }
              });
              break;
            case 'post':
              changes.push({
                child: { mode: 'class', key: { class: postPrompt, index: 0 }},
                changes: { text: command[outerKey][innerKey] }
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
              });
              break;
          }
        }

    }
  }
};

module.exports = {
  interpret: interpret,
  translate: translate
};

},{"./elements":1,"./interpret":3}],5:[function(require,module,exports){
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

function addChar3(appState, char) {
  return { commandType: 'addChar', char: char };
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

function deleteLeftChar3(appState) {
  var innerText = appState.cursor.pre;
  var end = innerText.length - 1;
  return innerText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteLeftChar', end: end };
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

function deleteRightChar3() {
  var innerText = appState.cursor.post;
  return innerText.length == 0
    ? { commandType: 'noOp' }
    : { commandType: 'deleteRightChar' };
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

function moveCursorLeft3() {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var index = __promptText.length - 1;
  return __promptText.length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorLeft', index: index, __promptText: __promptText };
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

function moveCursorRight2(appState) {
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

function moveCursorRight3() {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var length = __promptTextPost.length;
  return length === 0
    ? { commandType: 'noOp' }
    : { commandType: 'moveCursorRight', length: length, __promptTextPost: __promptTextPost };
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

// SIDE-EFFECT!
function fastForwardHistory3() {
  var content = appState.history.future.pop();
  if (content == null) {
    return { commandType: 'noOp' };
  }
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = String.trim(__promptText + __promptTextPost);
  return { commandType: 'fastForwardHistory', content: content, __text: __text };
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

// SIDE-EFFECT!
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

// SIDE-EFFECT!
function rewindHistory3(appState) {
  var content = appState.history.past.pop();
  if (content == null) {
    return { commandType: 'noOp' };
  }
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = String.trim(__promptText + __promptTextPost);
  return { commandType: 'rewindHistory', content: content, __text: __text };
}

function submit(appState) {
  var __promptText = appState.cursor.pre;
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
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  return {
    cursor: { pre: { erase: true }, post: { erase: true }},
    //history: { past: { push: __text }}
    history: { submit: __text }
  };
}

function submit3(appState) {
  var __promptText = appState.cursor.pre;
  var __promptTextPost = appState.cursor.post;
  var __text = __promptText + __promptTextPost;
  return { commandType: 'submit', __text: __text };
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

  addChar2: addChar2,
  deleteLeftChar2: deleteLeftChar2,
  deleteRightChar2: deleteRightChar2,
  fastForwardHistory2: fastForwardHistory2,
  moveCursorLeft2: moveCursorLeft2,
  moveCursorRight2: moveCursorRight2,
  rewindHistory2: rewindHistory2,
  submit2: submit2,

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
