function scroll(node, modelState, viewState, targets) {
  if (modelState.horizontal) {
    var horizontal = modelState.horizontal;
    var _scroll = horizontal.origin ? scrollLeft : scrollRight;
    _scroll(node, !!horizontal.compel, viewState.horizontal, targets.horizontal);
  }
  if (modelState.vertical) {
    var vertical = modelState.vertical;
    var _scroll = vertical.origin ? scrollUp : scrollDown;
    _scroll(node, !!vertical.compel, viewState.vertical, targets.vertical);
  }
}

function scrollDown(node, compel, atEdge, target) {
  if (compel || (atEdge && !atEdge.origin)) {
    _scrollDown(node, target);
  }
}
function scrollLeft(node, compel, atEdge, target) {
  if (compel || (atEdge && atEdge.origin)) {
    _scrollLeft(node, target);
  }
}
function scrollRight(node, compel, atEdge, target) {
  if (compel || (atEdge && !atEdge.origin)) {
    _scrollRight(node, target);
  }
}
function scrollUp(node, compel, atEdge, target) {
  if (compel || (atEdge && atEdge.origin)) {
    _scrollUp(node, target);
  }
}

function _scrollDown(node, target) {
  target = target == null ? node.scrollHeight - node.clientHeight : target;
  node.scrollTop = target;
}
function _scrollLeft(node, target) {
  node.scrollLeft = 0;
}
function _scrollRight(node, target) {
  target = target == null ? node.scrollWidth - node.clientWidth : target;
  node.scrollLeft = target;
}
function _scrollUp(node, target) {
  node.scrollTop = 0;
}

module.exports = scroll;
