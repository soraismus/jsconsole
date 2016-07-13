function copy(object) {
  var result = {};
  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;
    result[key] = object[key];
  }
  return result;
}

function _diff(value1, value0, index) {
  if (value1 === value0) {
    return { tree: [], commands: [], index: index };
  }

  var _patch;
  var tree = [];
  var commands = [];

  if (Array.isArray(value1)) {
    if (!Array.isArray(value0)) {
      return {
        tree: index,
        commands: [['replace', value1]],
        index: index + 1
      };
    }

    var i = 0;

    for (; i < value1.length && i < value0.length; i++) {
      if (value1[i] !== value0[i]) {
        _patch = _diff(value1[i], value0[i], index);
        if (_patch.commands.length > 0) {
          tree.push({ index: i, value: _patch.tree });
          commands = commands.concat(_patch.commands);
          index = index + _patch.commands.length;
        }
      }
    }

    for (; i < value1.length; i++) {
      tree.push({ index: i, value: index });
      commands.push(['insertAtEnd', value1[i]]);
      index++;
    }

    var removals = [];
    for (; i < value0.length; i++) {
      removals.unshift({ index: i, value: index });
      commands.push(['remove']);
      index++;
    }
    tree = tree.concat(removals);

    return { tree: tree, commands: commands, index: index + 1};
  }

  if (isObject(value1)) {
    if (!isObject(value0)) {
      return {
        tree: index,
        commands: [['replace', value1]],
        index: index + 1
      };
    }

    for (var key in value1) {
      if (!value1.hasOwnProperty(key)) continue;
      if (value0.hasOwnProperty(key)) {
        if (value1[key] !== value0[key]) {
          _patch = _diff(value1[key], value0[key], index);
          if (_patch.commands.length > 0) {
            tree.push({ index: key, value: _patch.tree });
            commands = commands.concat(_patch.commands);
            index = index + _patch.commands.length;
          }
        }
      } else {
        tree.push({ index: key, value: index });
        commands.push(['setAtKey', value1[key]]);
        index++;
      }
    }

    for (var key in value0) {
      if (!value1.hasOwnProperty(key)) {
        tree.push({ index: key, value: index });
        commands.push(['delete']);
        index++;
      }
    }

    return { tree: tree, commands: commands, index: index + 1};
  }

  return { tree: index, commands: [['replace', value1]], index: index + 1 };
}

function isObject(value) {
  return {}.toString.call(value) === '[object Object]';
}

var diff = function(value1, value0) {
  var patch = _diff(value1, value0, 0);
  return { value: patch.tree, commands: patch.commands };
};

module.exports = diff;
