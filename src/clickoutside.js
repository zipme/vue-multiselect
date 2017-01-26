const nodeList = []
const ctx = '@@clickoutsideContext'

function bodyClicked (e) {
  nodeList.forEach(node => node[ctx].documentHandler(e))
}

document.querySelector('body').addEventListener('click', bodyClicked)
document.querySelector('body').addEventListener('touchstart', bodyClicked)

/**
 Base on elementUI: https://github.com/ElemeFE/element
 */
export default {
  bind (el, binding, vnode) {
    const id = nodeList.push(el) - 1
    const documentHandler = function (e) {
      if (!vnode.context ||
        el.contains(e.target) ||
        (vnode.context.popperElm &&
        vnode.context.popperElm.contains(e.target))) return

      if (binding.expression) {
        el[ctx].methodName &&
          vnode.context[el[ctx].methodName] &&
          vnode.context[el[ctx].methodName]()
      } else {
        el[ctx].bindingFn && el[ctx].bindingFn()
      }
    }
    el[ctx] = {
      id,
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },

  update (el, binding) {
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },

  unbind (el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
  }
}
