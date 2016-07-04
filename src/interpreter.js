var isNothing = require('./option').isNothing;
var nothing = require('./option').nothing;
var something = require('./option').something;
function extractCommand(prompt) {
  return (prompt.preCursor + prompt.postCursor).trim();
}
function normalizePrompt(prompt) {
  return {
    preCursor: extractCommand(prompt),
    postCursor: ''
  };
}

function addChar(abstractViewPort, char) {
  return {
    timeline: abstractViewPort.timeline, 
    cursor: {
      preCursor: abstractViewPort.cursor.preCursor + char,
      postCursor: abstractViewPort.cursor.postCursor
    }
  };
}

function clearConsole(abstractViewPort) {
  return abstractViewPort;
}

function deleteLeftChar(abstractViewPort) {
  return {
    timeline: abstractViewPort.timeline, 
    cursor: {
      preCursor: abstractViewPort.cursor.preCursor.slice(0, -1),
      postCursor: abstractViewPort.cursor.postCursor
    }
  };
}

function deletePreCursor(abstractViewPort) {
  return {
    timeline: abstractViewPort.timeline, 
    cursor: {
      preCursor: '',
      postCursor: abstractViewPort.cursor.postCursor
    }
  };
}

function deleteRightChar(abstractViewPort) {
  return {
    timeline: abstractViewPort.timeline, 
    cursor: {
      preCursor: abstractViewPort.cursor.preCursor,
      postCursor: abstractViewPort.cursor.postCursor.slice(1)
    }
  };
}

function deleteWord(abstractViewPort) {
  var preCursor = abstractViewPort.cursor.preCursor;
  return {
    timeline: abstractViewPort.timeline, 
    cursor: {
      preCursor: preCursor.slice(
        0,
        preCursor.slice(0, -1).lastIndexOf(' ') + 1),
      postCursor: abstractViewPort.cursor.postCursor
    }
  };
}

// fastForwardCommandHistory
function fastForwardHistory(abstractViewPort) {
  var newCachedPromptMaybe, newPast, newPrompt;

  var timeline = abstractViewPort.timeline;
  var promptTimeline = timeline.prompts;
  var future = promptTimeline.future;

  if (future.length <= 0 && isNothing(cachedPromptMaybe)) {
    return abstractViewPort;
  }

  var past = promptTimeline.past;
  var newFuture = future.slice(1);

  if (future.length <= 0) {
    newPrompt = newCachedPromptMaybe.value;
    newCachedPromptMaybe = nothing();
    newPast = past;
  } else {
    newPrompt = future[0];
    newCachedPromptMaybe = timeline.cachedPromptMaybe;
    newPast = [normalizePrompt(abstractViewPort.prompt)].concat(past);
  }

  return {
    prompt: newPrompt,
    timeline: {
      cachedPromptMaybe: newCachedPromptMaybe,
      entries: abstractViewPort.timeline.entries,
      prompts: {
        past: newPast,
        future: newFuture
      }
    }
  };
}

function moveCursorLeft(abstractViewPort) {
  var preCursor = abstractViewPort.prompt.preCursor;
  var preCursorLength = preCursor.length;
  if (preCursorLength === 0) {
    return abstractViewPort;
  } else {
    var postCursor = abstractViewPort.prompt.postCursor;
    return {
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

// rewindCommandHistory
function rewindHistory(abstractViewPort) {
  var newCachedPromptMaybe, newFuture;

  var timeline = abstractViewPort.timeline;
  var promptTimeline = timeline.prompts;
  var past = promptTimeline.past;

  if (past.length <= 0) {
    return abstractViewPort;
  }

  var future = promptTimeline.future;
  var newPrompt = past[0];
  var newPast = past.slice(1);

  if (isNothing(newCachedPromptMaybe)) {
    newCachedPromptMaybe = something(abstractViewPort.prompt);
    newFuture = future;
  } else {
    newCachedPromptMaybe = timeline.cachedPromptMaybe;
    newFuture = [normalizePrompt(abstractViewPort.prompt)].concat(future);
  }

  return {
    prompt: newPrompt,
    timeline: {
      cachedPromptMaybe: newCachedPromptMaybe,
      entries: abstractViewPort.timeline.entries,
      prompts: {
        past: newPast,
        future: newFuture
      }
    }
  };
}

// NOTE: `submit` will be more comman than `rewind` or `fastforward`,
// so perhaps past prompts and entries shouldn't be reversed.
function submit(abstractViewPort, transform) {
  var newCachedPromptMaybe, newFuture;

  if (transform == null) {
    transform = function (value) {
      var results;
      // TODO: [{ type: 'display'/'pure',etc., value: value }]
      return (results = [{ effect: false, value: value }]);
    };
  }

  // enum Entry { command, completion, display, error, response }

  var commandText = extractCommand(abstractViewPort.prompt);
  var results = transform(commandText);
  var displayEntries = results
    .slice(0, -1)
    .filter(function (result) { return result.effect.type === 'display'; })
    .map(function (display) { return { type: 'display', value: display.value }});
  var response = { type: 'response', value: results[results.length - 1].value };
  var command = { type: 'command', value: commandText };

  return {
    timeline: {
      cachedPromptMaybe: nothing(),
      entries: {
        past: [response].concat(
          displayEntries.reverse(),
          [command],
          abstractViewPort.timeline.entries.future.reverse(),
          abstractViewPort.timeline.entries.past),
        future: []
      },
      prompts: {
        past: [normalizePrompt(abstractViewPort.prompt)].concat(
          abstractViewPort.timeline.prompts.future.reverse(),
          abstractViewPort.timeline.prompts.past);
        future: []
      }
    },
    prompt: {
      preCursor: '',
      postCursor: ''
    }
  };
}

var interpreter = {
  addChar: addChar,
  clearConsole: clearConsole,
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

module.exports = interpreter;
