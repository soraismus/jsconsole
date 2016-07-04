var browserViewPort = {
  displayItems: [],
  prompt: {
    preCursor: '',
    postCursor: ''
  },
  maximumSize: 21;
};

module.exports = browserViewPort;




function createBrowserViwePort(
    browserViewPort,
    newAbstractViewPort,
    origAbstractViewPort,
    clearViewPort) {

  if (!!clearViewPort) {
    return {
      displayItems: [],
      prompt: newAbstractViewPort.prompt
    };
  }

  var newEntries = newAbstractViewPort.timeline.entries;
  var origEntries = origAbstractViewPort.timeline.entries;
  var diffCount = newEntries.length - origEntries.length;
  var newDisplayItems = diffCount === 0
    ?  displayItems: browserViewPort
        .displayItems
        .slice(0, browserViewPort.maximumSize)
    : displayItems: browserViewPort
        .displayItems
        .concat(newEntries.slice(0, diffCount).reverse())
        .slice(0, browserViewPort.maximumSize);
  return {
    displayItems: newDisplayItems,
    prompt: newAbstractViewPort.prompt
  };
}
