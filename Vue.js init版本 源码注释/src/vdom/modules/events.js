 // 数组 函数调用器。
function arrInvoker(arr) {
  return function() {
    // Special case when length is two, for performance
    // 特殊处理 两个参数的数组， 利用 apply 传入数组参数，处理多个参数的情况。
    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1))
  }
}

// 函数 调用器。ev 为 事件对象， 里面的为函数主体
function fnInvoker(o) {

  return function(ev) { o.fn(ev) }
}

function updateEventListeners(oldVnode, vnode) {
  var name, cur, old, elm = vnode.elm,
      oldOn = oldVnode.data.on || {}, on = vnode.data.on
  if (!on) return
  for (name in on) {
    cur = on[name]
    old = oldOn[name]
    if (old === undefined) {
      if (Array.isArray(cur)) {
        // 新增事件。 传入数组，
        elm.addEventListener(name, arrInvoker(cur))
      } else {
        cur = {fn: cur}
        on[name] = cur
        // 封装成对象的形式，传入。
        elm.addEventListener(name, fnInvoker(cur))
      }
    } else if (Array.isArray(old)) {
      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
      // 修改老数组，会影响在arrInvoker 中的闭包 引用的 arr 数组。
      old.length = cur.length
      for (var i = 0; i < old.length; ++i) old[i] = cur[i]
      on[name]  = old
    } else {
      // 同样 封装成对象 传入 fnInvoker ,这里改变，就会影响 函数内部的改变。
      old.fn = cur
      on[name] = old
    }
  }
}

export default {
  create: updateEventListeners,
  update: updateEventListeners
}
