function createElement(tag) {
  return function (config) {
    if (config == null) {
      config = {};
    }

    var element = { tag: tag };

    for (var key in config) {
      if (key === 'classes') {
        element.classes = config.classes;
      }
      if (key === 'style') {
        element.style = config.style;
      }
      if (key === 'attribs') {
        element.attribs = config.attribs;
      }
    }

    if (arguments.length > 1) {
      element.children = Array.prototype.slice.call(arguments, 1);
    }

    return element;
  };
}

var tags = { 'SPAN': true };

var elementFactories = {};

for (var tagName in tags) {
  elementFactories[tagName] = createElement(tagName);
}

module.exports = elementFactories;
