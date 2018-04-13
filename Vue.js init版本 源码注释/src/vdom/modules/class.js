import { setClass } from '../../util/index'

function updateClass (oldVnode, vnode) {
  if (vnode.data.class !== undefined) {
    // el.setAttribute('class', cls)
    // 封装在 节点上 设置 class 属性的方法。
    setClass(vnode.elm, vnode.data.class || '')
  }
}

export default {
  init: updateClass,
  update: updateClass
}
