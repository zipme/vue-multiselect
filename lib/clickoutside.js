'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var nodeList = [];
var ctx = '@@clickoutsideContext';

function bodyClicked(e) {
  nodeList.forEach(function (node) {
    return node[ctx].documentHandler(e);
  });
}

document.querySelector('body').addEventListener('click', bodyClicked);
document.querySelector('body').addEventListener('touchstart', bodyClicked);

exports.default = {
  bind: function bind(el, binding, vnode) {
    var id = nodeList.push(el) - 1;
    var documentHandler = function documentHandler(e) {
      if (!vnode.context || el.contains(e.target) || vnode.context.popperElm && vnode.context.popperElm.contains(e.target)) return;

      if (binding.expression) {
        el[ctx].methodName && vnode.context[el[ctx].methodName] && vnode.context[el[ctx].methodName]();
      } else {
        el[ctx].bindingFn && el[ctx].bindingFn();
      }
    };
    el[ctx] = {
      id: id,
      documentHandler: documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },
  update: function update(el, binding) {
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  unbind: function unbind(el) {
    var len = nodeList.length;

    for (var i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
  }
};