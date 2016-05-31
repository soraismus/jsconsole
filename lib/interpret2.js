var modifyElement = require('./interpret').modifyElement;

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

module.exports = interpret;

// TODO: Refactor.
/*
function translate (appState, command) {
  var changes = [];
  for (var outerKey in command) {
    switch (outerKey) {
      case 'cursor':
        for (var innerKey in command[outerKey]) {
          switch (innerKey) {
            case 'pre':
              changes.push({
                child: { mode: 'class', key: { class: 'jsconsole-prompt-text', index: 0 }},
                changes: { command[outerKey][innerKey] }
              });
              break;
            case 'post':
              changes.push({
                child: { mode: 'class', key: { class: 'jsconsole-prompt-text-post-cursor', index: 0 }},
                changes: { command[outerKey][innerKey] }
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
              break;
          }
        }

    }
  }
};
*/
