var margin = 5;

function getCursorOffset(cursor, viewport) {
  return cursor.offsetLeft + cursor.offsetWidth + margin - viewport.offsetWidth;
}

function scroll(node, cursor) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
  node.scrollLeft = getCursorOffset(cursor, node);
}

module.exports = scroll;
