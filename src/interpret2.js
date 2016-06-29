var interpreter          = require('../lib/interpreter');
var modifyElement        = interpreter.modifyElement;
var components           = require('./components');
var createDisplay        = components.createDisplay;
var createOldPrompt      = components.createOldPrompt;
var createOldPromptReply = components.createOldPromptReply;
var createPrompt         = components.createPrompt;
var children             = require('../lib/children');
var childByClass         = children.childByClass;
var childByTag           = children.childByTag;
var childrenByClass      = children.childrenByClass;

var magicNumber = 23;

var consoleClass              = 'jsconsole';
var lineItemClass             = 'jsconsole-line-item';
var oldPromptClass            = 'jsconsole-old-prompt';
var oldPromptResponseClass    = 'jsconsole-old-prompt-response';
var promptClass               = 'jsconsole-prompt';
var promptTextClass           = 'jsconsole-prompt-text';
var promptTextPostCursorClass = 'jsconsole-prompt-text-post-cursor';

var firstSpanChild = childByTag('span');

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
              child: childByClass(promptTextClass),
              changes: { text: command[innerKey] }
            }]
          }
        });
        break;
      case 'post':
        changes.push({
          children: {
            modify: [{
              child: childByClass(promptTextPostCursorClass),
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
  return command.submit
    ? translateSubmit(promptLabel, command.submit)
    : [{}, {}];
}

function translateClearConsole() {
  return [{ children: { removeAll: childrenByClass(lineItemClass) }}, {}];
}

function translateDisplay(promptLabel, displayEffects) {
  return [{
    children: {
      modify: [
        {
          child: childByClass(consoleClass),
          changes: {
            children: {
              add: procrustate(displayEffects).map(function (displayEffect) {
                return createDisplay(displayEffect.value);
              })
            }
          }
        }
      ]
    }
  }];
}

function procrustate(displayEffects) {
  return displayEffects.length >= magicNumber - 1
    ? displayEffects.slice(
        displayEffects.length - magicNumber + 2,
        displayEffects.length)
    : displayEffects;
}

function translateSubmit(promptLabel, command) {
  var removals = [childByClass(promptClass)];
  if (command.entryCount >= magicNumber) {
    var count = Math.min(
      command.entryCount,
      //magicNumber - 1,
      magicNumber,
      command.entryCount - command.newEntryCount > magicNumber
        ? command.newEntryCount
        //: command.entryCount - magicNumber);
        : command.entryCount - command.newEntryCount);
    for (var i = 0; i < count; i++) {
      removals.push(
        childByClass(lineItemClass));
    }
  }
  var additions = [createPrompt(promptLabel)];
  if (!command.response.effect) {
    additions.unshift(createOldPromptReply(command.response.value));
  }
  return [
    {
      children: {
        remove: removals,
        modify: [
          {
            child: childByClass(consoleClass),
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
            child: childByClass(consoleClass),
            changes: { children: { add: additions }}
          }
        ]
      }
    }
  ];
}

module.exports = {
  translate: translate,
  translateDisplay: translateDisplay
};
