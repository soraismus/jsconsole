var isNothing = require('./option').isNothing;
var nothing = require('./option').nothing;
var something = require('./option').something;

function addChar(abstractViewPort, char) {
  return {
    entries: abstractViewPort.entries, 
    timeline: abstractViewPort.timeline, 
    prompt: {
      preCursor: abstractViewPort.prompt.preCursor + char,
      postCursor: abstractViewPort.prompt.postCursor
    }
  };
}

function clearConsole(abstractViewPort) {
  return abstractViewPort;
}

function completeWord(abstractViewPort, getCandidates) {
  var newCachedPromptMaybe, newFuture;

  if (getCandidates == null) {
    getCandidates = function (value) {
      var results;
      return (results = [{ effect: false, value: value }]);
    };
  }

  var commandText = abstractViewPort.prompt.preCursor;
  var splitCommand = getPrefix(commandText);
  var candidates = getCandidates(splitCommand[1]);

  if (candidates.length === 0) {
    return abstractViewPort;
  } else if (candidates.length === 1) {
    return {
      entries: abstractViewPort.entries,
      timeline: abstractViewPort.timeline,
      prompt: {
        preCursor: splitCommand[0] + candidates[0] + ' ' + abstractViewPort.prompt.postCursor,
        postCursor: abstractViewPort.prompt.postCursor
      }
    };
  } else {
    return {
      entries: abstractViewPort.entries.concat(
          [{ type: 'command', value: extractCommand(abstractViewPort.prompt) }],
          [{ type: 'completion', value: candidates.join(' ') }]),
      timeline: {
        cachedPromptMaybe: abstractViewPort.timeline.cachedPromptMaybe,
        prompts: {
          past: abstractViewPort.timeline.prompts.future.reverse().concat(
            abstractViewPort.timeline.prompts.past),
          future: []
        }
      },
      prompt: abstractViewPort.prompt
    };
  }
}

function deleteLeftChar(abstractViewPort) {
  return {
    entries: abstractViewPort.entries, 
    timeline: abstractViewPort.timeline, 
    prompt: {
      preCursor: abstractViewPort.prompt.preCursor.slice(0, -1),
      postCursor: abstractViewPort.prompt.postCursor
    }
  };
}

function deletePreCursor(abstractViewPort) {
  return {
    entries: abstractViewPort.entries, 
    timeline: abstractViewPort.timeline, 
    prompt: {
      preCursor: '',
      postCursor: abstractViewPort.prompt.postCursor
    }
  };
}

function deleteRightChar(abstractViewPort) {
  return {
    entries: abstractViewPort.entries, 
    timeline: abstractViewPort.timeline, 
    prompt: {
      preCursor: abstractViewPort.prompt.preCursor,
      postCursor: abstractViewPort.prompt.postCursor.slice(1)
    }
  };
}

function deleteWord(abstractViewPort) {
  var preCursor = abstractViewPort.prompt.preCursor;
  return {
    entries: abstractViewPort.entries, 
    timeline: abstractViewPort.timeline, 
    prompt: {
      preCursor: preCursor.slice(
        0,
        preCursor.slice(0, -1).lastIndexOf(' ') + 1),
      postCursor: abstractViewPort.prompt.postCursor
    }
  };
}

function extractCommand(prompt) {
  return (prompt.preCursor + prompt.postCursor).trim();
}

// fastForwardCommandHistory
function fastForwardHistory(abstractViewPort) {
  var newCachedPromptMaybe, newPast, newPrompt;

  var timeline = abstractViewPort.timeline;
  var cachedPromptMaybe = timeline.cachedPromptMaybe;
  var promptTimeline = timeline.prompts;
  var future = promptTimeline.future;

  if (future.length <= 0 && isNothing(cachedPromptMaybe)) {
    return abstractViewPort;
  }

  var newFuture = future.slice(1);
  var newPast = [normalizePrompt(abstractViewPort.prompt)].concat(
    promptTimeline.past);

  if (future.length <= 0) {
    newPrompt = cachedPromptMaybe.value;
    newCachedPromptMaybe = nothing();
  } else {
    newPrompt = future[0];
    newCachedPromptMaybe = cachedPromptMaybe;
  }

  return {
    prompt: newPrompt,
    entries: abstractViewPort.entries,
    timeline: {
      cachedPromptMaybe: newCachedPromptMaybe,
      prompts: {
        past: newPast,
        future: newFuture
      }
    }
  };
}

function getPrefix(command) {
  var regex = /^(.*[\s\(\)\[\]])([^\(\)\[\]]*)/;
  var match = regex.exec(command);
  return match == null
    ? ['', command]
    : [match[1], match[2]];
}

function moveCursorLeft(abstractViewPort) {
  var preCursor = abstractViewPort.prompt.preCursor;
  var preCursorLength = preCursor.length;
  if (preCursorLength === 0) {
    return abstractViewPort;
  } else {
    var postCursor = abstractViewPort.prompt.postCursor;
    return {
      entries: abstractViewPort.entries,
      timeline: abstractViewPort.timeline,
      prompt: {
        preCursor: preCursor.slice(0, -1),
        postCursor: preCursor[preCursorLength - 1] + postCursor
      }
    };
  }
}

function moveCursorRight(abstractViewPort) {
  var postCursor = abstractViewPort.prompt.postCursor;
  if (postCursor.length === 0) {
    return abstractViewPort;
  } else {
    var preCursor = abstractViewPort.prompt.preCursor;
    return {
      entries: abstractViewPort.entries,
      timeline: abstractViewPort.timeline,
      prompt: {
        preCursor: preCursor + postCursor[0],
        postCursor: postCursor.slice(1)
      }
    };
  }
}

function moveCursorToEnd(abstractViewPort) {
  var prompt = abstractViewPort.prompt;
  return {
    entries: abstractViewPort.entries,
    timeline: abstractViewPort.timeline,
    prompt: {
      preCursor: prompt.preCursor + prompt.postCursor,
      postCursor: ''
    }
  };
}

function moveCursorToStart(abstractViewPort) {
  var prompt = abstractViewPort.prompt;
  return {
    entries: abstractViewPort.entries,
    timeline: abstractViewPort.timeline,
    prompt: {
      preCursor: '',
      postCursor: prompt.preCursor + prompt.postCursor,
    }
  };
}

// Necessary?
function noOp(abstractViewPort) {
  return abstractViewPort;
}

function normalizePrompt(prompt) {
  return {
    preCursor: extractCommand(prompt),
    postCursor: ''
  };
}

// rewindCommandHistory
function rewindHistory(abstractViewPort) {
  var newCachedPromptMaybe, newFuture;

  var timeline = abstractViewPort.timeline;
  var cachedPromptMaybe = timeline.cachedPromptMaybe;
  var promptTimeline = timeline.prompts;
  var past = promptTimeline.past;

  if (past.length <= 0) {
    return abstractViewPort;
  }

  var future = promptTimeline.future;
  var newPrompt = past[0];
  var newPast = past.slice(1);

  if (isNothing(cachedPromptMaybe)) {
    newCachedPromptMaybe = something(abstractViewPort.prompt);
    newFuture = future;
  } else {
    newCachedPromptMaybe = cachedPromptMaybe;
    newFuture = [normalizePrompt(abstractViewPort.prompt)].concat(future);
  }

  return {
    prompt: newPrompt,
    entries: abstractViewPort.entries,
    timeline: {
      cachedPromptMaybe: newCachedPromptMaybe,
      prompts: {
        past: newPast,
        future: newFuture
      }
    }
  };
}

function submit(abstractViewPort, transform) {
  var newCachedPromptMaybe, newFuture;

  if (transform == null) {
    transform = function (value) {
      var results;
      return (results = [{ effect: false, value: value }]);
    };
  }

  var commandText = extractCommand(abstractViewPort.prompt);
  var results = transform(commandText);
  var displayEntries = results
    .slice(0, -1)
    .filter(function (result) { return result.effect.type === 'display'; })
    .map(function (display) { return { type: 'display', value: display.value }});
  var response = { type: 'response', value: results[results.length - 1].value };
  var command = { type: 'command', value: commandText };
  var future = abstractViewPort.timeline.prompts.future.reverse();
  var prompt = normalizePrompt(abstractViewPort.prompt);

  return {
    entries: abstractViewPort.entries.concat(
        [command],
        displayEntries,
        [response]),
    timeline: {
      cachedPromptMaybe: nothing(),
      prompts: {
        past: [normalizePrompt(abstractViewPort.prompt)].concat(
          future,
          future.length > 0 ?  [prompt] : [],
          abstractViewPort.timeline.prompts.past),
        future: []
      }
    },
    prompt: {
      preCursor: '',
      postCursor: ''
    }
  };
}

module.exports = {
  addChar: addChar,
  clearConsole: clearConsole,
  completeWord: completeWord,
  deleteLeftChar: deleteLeftChar,
  deletePreCursor: deletePreCursor,
  deleteRightChar: deleteRightChar,
  deleteWord: deleteWord,
  fastForwardHistory: fastForwardHistory,
  moveCursorLeft: moveCursorLeft,
  moveCursorRight: moveCursorRight,
  moveCursorToEnd: moveCursorToEnd,
  moveCursorToStart: moveCursorToStart,
  noOp: noOp,
  rewindHistory: rewindHistory,
  submit: submit,
};
