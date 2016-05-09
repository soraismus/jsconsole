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
          node.innerText = node.innerText.slice(config.text[op].start, config.text[op].end);
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
    },
    children: [' ']
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
    },
    children: [' ']
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

  var oldPrompt0 = createOldPrompt('document');
  var oldPromptReply0 = createOldPromptReply('[object HTMLDocument]');
  var oldPrompt1 = createOldPrompt('3 + 4;');
  var oldPromptReply1 = createOldPromptReply('7');

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
                  createOldPrompt(__promptText),
                  createOldPromptReply(__promptText),
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

initialize();

function deleteChar() {
  return { op: 'deleteChar' };
}

function addChar(char) {
  return { op: 'addChar', data: char };
}

function submit() {
  return { op: 'submit' };
}

function moveCursorLeft() {
  return { op: 'moveCursorLeft' };
}

function moveCursorRight() {
  return { op: 'moveCursorRight' };
}

function interpret(appState, command) {
  switch (command.op) {
    case 'addChar':
      document.getElementsByClassName('jsconsole-prompt-text')[0].innerText += command.data
      break;
    case 'deleteChar':
      var innerText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
      document.getElementsByClassName('jsconsole-prompt-text')[0].innerText = innerText.slice(0, innerText.length - 1);
      break;
    case 'submit':
      var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
      var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
      var __text = __promptText + __promptTextPost;
      modifyElement(
        document.getElementById('console'),
        {
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
      );
      break;

    case 'moveCursorLeft':
      var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
      var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
      modifyElement(
        document.getElementById('console'),
        {
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
      );
      break;

    case 'moveCursorRight':
      var __promptText = document.getElementsByClassName('jsconsole-prompt-text')[0].innerText;
      var __promptTextPost = document.getElementsByClassName('jsconsole-prompt-text-post-cursor')[0].innerText;
      modifyElement(
        document.getElementById('console'),
        {
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
      );
      break;

  }
}

document.addEventListener(
  'keypress',
  function (event) {
    var appState = null;
    var command;

    switch (event.keyCode) {
      case 13:
        command = submit();
        break;
      case 8:
        command = deleteChar();
        break;
      case 37: // left;
        event.preventDefault();
        command = moveCursorLeft();
        break;
      case 39: // right;
        event.preventDefault();
        command = moveCursorRight();
        break;
      case 38: // up;
      case 40: // down;
        break;
      case 0:
        var command = addChar(String.fromCharCode(event.charCode));
        break;
    }

    interpret(appState, command);
  });

