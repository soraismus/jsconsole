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
            node.removeChild(findChild(node, config.children[op][index]));
          }
          break;
        case 'modify':
          for (var index in config.children[op]) {
            modifyElement(
              findChild(node, config.children[op][index].child),
              config.children[op][index].config);
          }
          break;
        default:
          throw new Error('invalid \"modifyElement.children\" mode');
      }
    }
  }
}

function findChild(parent, config) {
  switch (config.mode) {
    case 'id':
      var x =  document.getElementById(config.key);
      return x;
    case 'tag':
      return parent.getElementsByTagName(config.key.tag)[config.key.index];
    case 'class':
      return parent.getElementsByClassName(config.key.class)[config.key.index];
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
    children: ['JS> ']
  };

  var promptText = {
    tag: 'span',
    classes: { 'jsconsole-prompt-text': true },
  };

  var relativeSpan = {
    tag: 'span',
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

  var oldPrompt0 = {
    tag: 'span',
    classes: { 'jsconsole-old-prompt': true },
    style: {
      'font-weight': 'normal'
    },
    children: [
      {
        tag: 'span',
        children: ['JS> document\n']
      }
    ]
  };

  var oldPromptReply0 = {
    tag: 'span',
    children: [
      {
        tag: 'span',
        children: ['==> [object HTMLDocument]\n']
      }
    ]
  };

  var oldPrompt1 = {
    tag: 'span',
    classes: { 'jsconsole-old-prompt': true },
    children: [
      {
        tag: 'span',
        children: ['JS> 3 + 4;\n']
      }
    ]
  };

  var oldPromptReply1 = {
    tag: 'span',
    children: [
      {
        tag: 'span',
        children: ['==> 7\n']
      }
    ]
  };

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
          config: {
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
          //child: { mode: 'id', key: 'console-trial-div2-id' },
          child: { mode: 'tag', key: { tag: 'div', index: 2 }},
          config: {
            style: { unset: { 'color': true } }
          }
        }
      ]
    }
  });

}

initialize();
