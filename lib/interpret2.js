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
