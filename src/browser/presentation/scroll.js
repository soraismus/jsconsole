var margin = 5;

function getCursorOffset(cursor, viewport) {
  return cursor.offsetLeft + cursor.offsetWidth + margin - viewport.offsetWidth;
}

function scroll(rootChild, cursor) {
  rootChild.scrollTop = rootChild.scrollHeight - rootChild.clientHeight;
  rootChild.scrollLeft = getCursorOffset(cursor, rootChild);
}

module.exports = scroll;
