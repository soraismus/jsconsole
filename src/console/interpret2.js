var modifyElement = require('../domUtility/interpret').modifyElement;
var components    = require('./components');

var createOldPrompt      = components.createOldPrompt;
var createOldPromptReply = components.createOldPromptReply;
var createPrompt         = components.createPrompt;

var _0to9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function identifyChild(mode) {
  return function(specifier, index) {
    var result = { mode: mode, key: { index: index }};
    result.key[mode] = specifier;
    return result;
  };
}

var childByClass = identifyChild('class');
var childByQuery = identifyChild('query');
var childByTag   = identifyChild('tag');

var oldPromptClass = 'jsconsole-old-prompt';
var oldPromptResponseClass = 'jsconsole-old-prompt-response';

var firstSpanChild = childByTag('span', 0);

function modifyOldPrompt(index, promptLabel, replacementText) {
  return {
    child: childByClass(oldPromptClass, index),
    changes: {
      children: {
        modify: [
          {
            child: firstSpanChild,
            changes: { text: { replace: promptLabel + replacementText + '\n' }}
          }
        ]
      }
    }
  };
};

function modifyOldPromptResponse(index, replacementText) {
  return {
    child: childByClass(oldPromptResponseClass, index),
    changes: {
      children: {
        modify: [
          {
            child: firstSpanChild,
            changes: { text: { replace: '==> ' + replacementText + '\n' }}
          }
        ]
      }
    }
  };
};

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
function translate (promptLabel, command) {
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
                    child: childByClass(prompt, 0),
                    changes: { text: command[outerKey][innerKey] }
                  }]
                }
              });
              break;
            case 'post':
              changes.push({
                children: {
                  modify: [{
                    child: childByClass(postPrompt, 0),
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
              if (command[outerKey][innerKey].display.length < 11) {
                changes.push({
                  children: {
                    remove: [
                      {
                        mode: 'class',
                        key: { class: 'jsconsole-prompt', index: 0 }
                      }
                    ],
                    modify: [
                      {
                        child: childByQuery('div pre', 0),
                        changes: {
                          children: {
                            add: [
                              createOldPrompt(promptLabel + command[outerKey][innerKey].oldPrompt),
                              createOldPromptReply(command[outerKey][innerKey].response),
                              createPrompt(promptLabel)
                            ]
                          }
                        }
                      }
                    ]
                  }
                });
              } else {
                var display = command[outerKey][innerKey].display;
                var oldPrompt = command[outerKey][innerKey].oldPrompt;
                var response = command[outerKey][innerKey].response;

                var promptModifications = _0to9.map(function (i) {
                  return modifyOldPrompt(i, promptLabel, display[i + 1][0]);
                });

                var promptResponseModifications = _0to9.map(function (i) {
                  return modifyOldPromptResponse(i, display[i + 1][1]);
                });

                var modifications = promptModifications
                  .concat(promptResponseModifications)
                  .concat([
                    modifyOldPrompt(10, promptLabel, oldPrompt),
                    modifyOldPromptResponse(10, response)
                  ]);

                changes.push({
                  children: { modify: modifications }
                });
              }
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
