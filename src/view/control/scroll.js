var margin = 5;

function getCursorOffset(cursor, node) {
  return cursor.offsetLeft + cursor.offsetWidth + margin - node.offsetWidth;
}

function scroll(node, cursor) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
  node.scrollLeft = getCursorOffset(cursor, node);
}

module.exports = scroll;
