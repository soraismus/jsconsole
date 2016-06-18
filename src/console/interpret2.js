var modifyElement        = require('../domUtility/interpret').modifyElement;
var components           = require('./components');
var createDisplay        = components.createDisplay;
var createOldPrompt      = components.createOldPrompt;
var createOldPromptReply = components.createOldPromptReply;
var createPrompt         = components.createPrompt;
var childrenUtility      = require('../domUtility/children');
var childByClass         = childrenUtility.childByClass;
var childByTag           = childrenUtility.childByTag;
var childrenByClass      = childrenUtility.childrenByClass;

var magicNumber = 11;

var consoleClass              = 'jsconsole';
var lineItemClass             = 'jsconsole-line-item';
var oldPromptClass            = 'jsconsole-old-prompt';
var oldPromptResponseClass    = 'jsconsole-old-prompt-response';
var promptClass               = 'jsconsole-prompt';
var promptTextClass           = 'jsconsole-prompt-text';
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

function translate(promptLabel, command) {
  var cursorChanges = [];
  var displayChanges = [];
  var historyChanges = [{}, {}];
  for (var outerKey in command) {
    switch (outerKey) {
      case 'clearConsole':
        return translateClearConsole();
      case 'cursor':
        cursorChanges =
          translateCursor(promptLabel, command.cursor);
        break;
      case 'display':
        displayChanges =
          command.display.length > 0
            ? translateDisplay(promptLabel, command.display)
            : [];
        break;
      case 'history':
        historyChanges =
          translateHistory(promptLabel, command.history);
        break;
    }
  }
  return cursorChanges
    .concat(
      [historyChanges[0]],
      displayChanges,
      [historyChanges[1]]);
};

function translateCursor(promptLabel, command) {
  var changes = [];
  for (var innerKey in command) {
    switch (innerKey) {
      case 'pre':
        changes.push({
          children: {
            modify: [{
              child: childByClass(promptTextClass, 0),
              changes: { text: command[innerKey] }
            }]
          }
        });
        break;
      case 'post':
        changes.push({
          children: {
            modify: [{
              child: childByClass(promptTextPostCursorClass, 0),
              changes: { text: command[innerKey] }
            }]
          }
        });
        break;
      default:
        break;
    }
  }
  return changes;
}

function translateHistory(promptLabel, command) {
  for (var innerKey in command) {
    switch (innerKey) {
      case 'clearConsole':
        return translateClearConsole();
      case 'submit':
        return translateSubmit(promptLabel, command.submit);
    }
  }
  return [];
}

function translateClearConsole() {
  return [{ children: { removeAll: childrenByClass(lineItemClass) }}, {}];
}

function translateDisplay(promptLabel, displayEffects) {
  return [{
    children: {
      modify: [
        {
          child: childByClass(consoleClass, 0),
          changes: { children: { add:
            displayEffects.map(function (displayEffect) {
              return createDisplay(displayEffect.value);
            })
          }}
        }
      ]
    }
  }];
}

function translateSubmit(promptLabel, command) {
  var removals = [childByClass(promptClass, 0)];
  if (command.display.length >= magicNumber) {
    removals.push(
      childByClass(lineItemClass, 0),
      childByClass(lineItemClass, 0));
  }
  return [
    {
      children: {
        remove: removals,
        modify: [
          {
            child: childByClass(consoleClass, 0),
            changes: { children: { add: [
                createOldPrompt(promptLabel + command.oldPrompt)
              ]
            }}
          }
        ]
      }
    },
    {
      children: {
        modify: [
          {
            child: childByClass(consoleClass, 0),
            changes: { children: { add: [
                createOldPromptReply(command.response),
                createPrompt(promptLabel)
              ]
            }}
          }
        ]
      }
    }
  ];
}

module.exports = {
  interpret: interpret,
  translate: translate,
  translateDisplay: translateDisplay
};
