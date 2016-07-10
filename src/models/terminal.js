var create         = require('./createTerminal');
var createPrompt   = require('./createPrompt');
var createTimeline = require('./createTimeline');
var isNothing      = require('../option').isNothing;
var nothing        = require('../option').nothing;
var something      = require('../option').something;

function addChar(terminal, char) {
  return create(
    terminal.entries,
    terminal.timeline,
    createPrompt(
      terminal.prompt.preCursor + char,
      terminal.prompt.postCursor));
}

function completeWord(terminal, getCandidates) {
  if (getCandidates == null) {
    getCandidates = function (value) {
      var results;
      return (results = [{ effect: false, value: value }]); // coupling to lisp implementation
    };
  }

  var commandText = terminal.prompt.preCursor;
  var splitCommand = getPrefix(commandText);
  var candidates = getCandidates(splitCommand[1]);
  var length = candidates.length;

  if (length === 0) {
    return terminal;
  }

  var entries, timeline, prompt;

  if (length === 1) {
    entries = terminal.entries;
    timeline = terminal.timeline;
    prompt = createPrompt(
      splitCommand[0] + candidates[0] + ' ' + terminal.prompt.postCursor,
      terminal.prompt.postCursor);
  } else {
    entries = terminal.entries.concat(
      [{ type: 'command', value: extractCommand(terminal.prompt) }],
      [{ type: 'completion', value: candidates.join(' ') }]);
    timeline = createTimeline(
      terminal.timeline.cachedPromptMaybe,
      terminal.timeline.prompts.future.reverse().concat(
          terminal.timeline.prompts.past),
      []);
    prompt = terminal.prompt;
  }

  return create(entries, timeline, prompt);
}

function deleteLeftChar(terminal) {
  return create(
    terminal.entries, 
    terminal.timeline, 
    createPrompt(
      terminal.prompt.preCursor.slice(0, -1),
      terminal.prompt.postCursor));
}

function deletePreCursor(terminal) {
  return create(
    terminal.entries, 
    terminal.timeline, 
    createPrompt('', terminal.prompt.postCursor));
}

function deleteRightChar(terminal) {
  return create(
    terminal.entries, 
    terminal.timeline, 
    createPrompt(
      terminal.prompt.preCursor,
      terminal.prompt.postCursor.slice(1)));
}

function deleteWord(terminal) {
  var preCursor = terminal.prompt.preCursor;
  return create(
    terminal.entries, 
    terminal.timeline, 
    createPrompt(
      preCursor.slice(0, preCursor.slice(0, -1).lastIndexOf(' ') + 1),
      terminal.prompt.postCursor));
}

function extractCommand(prompt) {
  return (prompt.preCursor + prompt.postCursor).trim();
}

function fastForwardHistory(terminal) {
  var newCachedPromptMaybe, newPrompt;

  var timeline = terminal.timeline;
  var cachedPromptMaybe = timeline.cachedPromptMaybe;
  var promptTimeline = timeline.prompts;
  var future = promptTimeline.future;

  if (future.length <= 0 && isNothing(cachedPromptMaybe)) {
    return terminal;
  }

  if (future.length <= 0) {
    newPrompt = cachedPromptMaybe.value;
    newCachedPromptMaybe = nothing();
  } else {
    newPrompt = future[0];
    newCachedPromptMaybe = cachedPromptMaybe;
  }

  return create(
    terminal.entries,
    createTimeline(
      newCachedPromptMaybe,
      [normalizePrompt(terminal.prompt)].concat(promptTimeline.past),
      future.slice(1)),
    newPrompt);
}

function getPrefix(command) {
  var regex = /^(.*[\s\(\)\[\]])([^\(\)\[\]]*)/;
  var match = regex.exec(command);
  return match == null
    ? ['', command]
    : [match[1], match[2]];
}

function moveCursorLeft(terminal) {
  var preCursor = terminal.prompt.preCursor;
  var preCursorLength = preCursor.length;
  if (preCursorLength === 0) {
    return terminal;
  } else {
    var postCursor = terminal.prompt.postCursor;
    return create(
      terminal.entries,
      terminal.timeline,
      createPrompt(
        preCursor.slice(0, -1),
        preCursor[preCursorLength - 1] + postCursor));
  }
}

function moveCursorRight(terminal) {
  var postCursor = terminal.prompt.postCursor;
  if (postCursor.length === 0) {
    return terminal;
  } else {
    var preCursor = terminal.prompt.preCursor;
    return create(
      terminal.entries,
      terminal.timeline,
      createPrompt(
        preCursor + postCursor[0],
        postCursor.slice(1)));
  }
}

function moveCursorToEnd(terminal) {
  var prompt = terminal.prompt;
  return create(
    terminal.entries,
    terminal.timeline,
    createPrompt(prompt.preCursor + prompt.postCursor, ''));
}

function moveCursorToStart(terminal) {
  var prompt = terminal.prompt;
  return create(
    terminal.entries,
    terminal.timeline,
    createPrompt('', prompt.preCursor + prompt.postCursor));
}

function normalizePrompt(prompt) {
  return createPrompt(extractCommand(prompt), '');
}

function rewindHistory(terminal) {
  var newCachedPromptMaybe, newFuture;

  var timeline = terminal.timeline;
  var cachedPromptMaybe = timeline.cachedPromptMaybe;
  var promptTimeline = timeline.prompts;
  var past = promptTimeline.past;
  var future = promptTimeline.future;

  if (past.length <= 0) {
    return terminal;
  }

  if (isNothing(cachedPromptMaybe)) {
    newCachedPromptMaybe = something(terminal.prompt);
    newFuture = future;
  } else {
    newCachedPromptMaybe = cachedPromptMaybe;
    newFuture = [normalizePrompt(terminal.prompt)].concat(future);
  }

  return create(
    terminal.entries,
    createTimeline(
      newCachedPromptMaybe,
      past.slice(1),
      newFuture),
    past[0]);
}

function submit(terminal, transform) {
  var newCachedPromptMaybe, newFuture;

  if (transform == null) {
    transform = function (value) {
      var results;
      return (results = [{ effect: false, value: value }]); // coupling to lisp implementation
    };
  }

  var commandText = extractCommand(terminal.prompt);
  var results = transform(commandText);
  var displayEntries = results
    .slice(0, -1)
    .filter(function (result) { return result.effect.type === 'display'; })
    .map(function (display) { return { type: 'display', value: display.value }});
  var response = { type: 'response', value: results[results.length - 1].value };
  var command = { type: 'command', value: commandText };
  var future = terminal.timeline.prompts.future.reverse();
  var prompt = normalizePrompt(terminal.prompt);

  return create(
    terminal.entries.concat([command], displayEntries, [response]),
    createTimeline(
      nothing(),
      [normalizePrompt(terminal.prompt)].concat(
        future,
        future.length > 0 ?  [prompt] : [],
        terminal.timeline.prompts.past),
      []),
    createPrompt('', ''));
}

module.exports = {
  addChar: addChar,
  completeWord: completeWord,
  deleteLeftChar, deleteLeftChar,
  deletePreCursor: deletePreCursor,
  deleteRightChar: deleteRightChar,
  deleteWord: deleteWord,
  fastForwardHistory: fastForwardHistory,
  moveCursorLeft: moveCursorLeft,
  moveCursorRight: moveCursorRight,
  moveCursorToEnd: moveCursorToEnd,
  moveCursorToStart: moveCursorToStart,
  rewindHistory: rewindHistory,
  submit: submit
};
