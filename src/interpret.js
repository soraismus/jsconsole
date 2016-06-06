var interpreter = require('./interpreter');
var elements    = require('./elements');

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

function initialize(promptLabel) {
  createAndAttachElement(
    document.getElementById('console'),
   {
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
        classes: {
          'jsconsole': true
        },
        style: {
          'margin': '0px',
          'position': 'relative',
          'min-height': '100%',
          'box-sizing': 'border-box',
          'padding': '10px',
          'padding-bottom': '10px'
        },
        children: [
          elements.header,
          elements.createPrompt(promptLabel)
        ]
      }
    ]
  });
}

module.exports = {
  initialize: initialize,
  modifyElement: modifyElement,
};
