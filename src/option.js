function bind(option, fn) {
  return option === _nothing
    ? _nothing
    : fn(option.value);
}

function _case(option, fn0, fn1) {
  return option === _nothing
    ? fn1()
    : fn0(option.value)
}

function isNothing(option) {
  return option === _nothing;
}

function map(option, fn) {
  return option === _nothing
    ? _nothing
    : something(fn(option.value));
}

function nothing() {
  return _nothing;
}

function Option(value) {
  Object.defineProperty(
    this,
    'value',
    {
      get: function () {
        if (value === guard) {
          throw new Error(
            'The value `nothing` does not encapsulate or represent any inner value.');
        } else {
          return value;
        }
    }});
  }

function something(value) {
  return new Option(value);
}

var guard = {};
var _nothing = new Option(guard);

Option.prototype.bind = function (fn) {
  return bind(this, fn);
};

Option.prototype.case = function (fn0, fn1) {
  return _case(this, fn0, fn1);
};

Option.prototype.isNothing = function () {
  return _case(this);
};

Option.prototype.map = function (fn) {
  return map(this, fn);
};

Option.nothing = nothing;
Option.something = something;

module.exports = {
  bind: bind,
  case: _case,
  isNothing: isNothing,
  map: map,
  nothing: nothing,
  something: something
};
