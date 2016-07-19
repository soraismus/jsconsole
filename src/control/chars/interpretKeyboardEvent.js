var getAction           = require('./interpretKey');
var keyCodeCharts       = require('./keyCodeCharts');
var keyIdentifierCharts = require('./keyIdentifierCharts');

function getEvent(kind, event) {
  return {
    value: event[kind],
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey
  };
};

function identity(event) {
  return event;
}

function interpretKeyboardEvent(event) {
  var _normalize;
  var property;

  if (event.key != null) {
    property = 'key';
    _normalize = identity;
  } else if (event.keyIdentifier != null) {
    property = 'keyIdentifier';
    _normalize = normalize(keyIdentifierCharts);
  } else {
    property = 'keyCode';
    _normalize = normalize(keyCodeCharts);
  }

  return getAction(_normalize(getEvent(property, event)));
}

function normalize(conversionCharts) {
  return function (event) {
    return {
      value: normalizeValue(conversionCharts, event.value, event.shiftKey),
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey
    };
  };
}

function normalizeValue(conversionCharts, value, shiftKey) {
  var key = shiftKey ? 'withShift' : 'withoutShift';
  return conversionCharts[key][value];
}

module.exports = interpretKeyboardEvent;
