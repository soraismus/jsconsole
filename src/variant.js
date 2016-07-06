function _case(variant, fns) {
  var fn = fns[variant.state];
  if (fn == null) {
    throw new TypeError(
      "No suitable function has been provided for the state '" +
      variant.state +
      "'.");
  } else {
    return fn(variant.value);
  }
}

function Variant(state, value) {
  Object.defineProperties(
    this,
    {
      'state': { value: state },
      'value': { value: value }
    });
}

function create(state, value) {
  return new Variant(state, value);
}

Variant.prototype.case = function (fns) {
  return _case(this, fns);
};

module.exports = {
  case: _case,
  create: create 
};
