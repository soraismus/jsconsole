module.exports = function (cachedPromptMaybe, past, future) {
  return {
    cachedPromptMaybe: cachedPromptMaybe,
    prompts: {
      past: past,
      future: future
    }
  };
};
