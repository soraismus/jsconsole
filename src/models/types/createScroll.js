function createSetting(value) {
  if (!value) {
    return false
  }

  return {
    compel: !value.compel ? false : true,
    origin: !value.origin ? false : true
  };
}

module.exports = function (config) {
  return {
    horizontal: createSetting(config.horizontal),
    vertical: createSetting(config.vertical)
  };
};
