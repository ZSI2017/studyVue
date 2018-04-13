function updateProps(oldVnode, vnode) {
  // attribute（特性），是我们赋予某个事物的特质或对象。
  // property（属性），是早已存在的不需要外界赋予的特质。
  var key, cur, old, elm = vnode.elm,
      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {}
  for (key in oldProps) {
    // 新属性 中 不包含 旧的属性，就删除
    if (!props[key]) {
      delete elm[key]
    }
  }
  for (key in props) {
    cur = props[key]
    old = oldProps[key]
    // 新旧属性值不同，且不是 value 值。或者 属性值已经改变了
    // 则 ，重新赋值。
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur
    }
  }
}

export default {
  create: updateProps,
  update: updateProps
}
