var modifyElement = require('../domUtility/interpret').modifyElement;
var components    = require('./components');

var createOldPrompt      = components.createOldPrompt;
var createOldPromptReply = components.createOldPromptReply;
var createPrompt         = components.createPrompt;

var magicNumber = 11;

// ------------------------------------------------------------------------
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
// ------------------------------------------------------------------------

var oldPromptClass = 'jsconsole-old-prompt';
var oldPromptResponseClass = 'jsconsole-old-prompt-response';
var promptClass = 'jsconsole-prompt';
var promptTextClass = 'jsconsole-prompt-text';
var promptTextPostCursorClass = 'jsconsole-prompt-text-post-cursor';

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


function translate (promptLabel, command) {
  var cursorChanges;
  var historyChanges;
  for (var outerKey in command) {
    switch (outerKey) {
      case 'cursor':
        cursorChanges =
          translateCursor(promptLabel, command, outerKey);
      case 'history':
        historyChanges =
          translateHistory(promptLabel, command, outerKey);
    }
  }
  return cursorChanges.concat(historyChanges);
};

function translateCursor(promptLabel, command, outerKey) {
  for (var innerKey in command[outerKey]) {
    switch (innerKey) {
      case 'pre':
        return [{
          children: {
            modify: [{
              child: childByClass(promptTextClass, 0),
              changes: { text: command[outerKey][innerKey] }
            }]
          }
        }];
      case 'post':
        return [{
          children: {
            modify: [{
              child: childByClass(promptTextPostCursorClass, 0),
              changes: { text: command[outerKey][innerKey] }
            }]
          }
        }];
    }
  }
}

function translateHistory(promptLabel, command, outerKey) {
  for (var innerKey in command[outerKey]) {
    switch (innerKey) {
      case 'fastForward':
        break;
      case 'rewind':
        break;
      case 'submit':
        return translateSubmittal(promptLabel, command, outerKey, innerKey);
    }
  }
  return [];
}

function translateSubmittal(promptLabel, command, outerKey, innerKey) {
  var removals = [childByClass(promptClass, 0)];
  var additions = [
    createOldPrompt(promptLabel + command[outerKey][innerKey].oldPrompt),
    createOldPromptReply(command[outerKey][innerKey].response),
    createPrompt(promptLabel)
  ];
  if (command[outerKey][innerKey].display.length >= magicNumber) {
    removals.push(
      childByClass(oldPromptClass, 0),
      childByClass(oldPromptResponseClass, 0));
  }
  return [{
    children: {
      remove: removals,
      modify: [{
        child: childByQuery('div pre', 0),
        changes: { children: { add: additions }}
      }]
    }
  }];
}

module.exports = {
  interpret: interpret,
  translate: translate
};
