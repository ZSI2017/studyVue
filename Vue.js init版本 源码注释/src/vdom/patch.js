import VNode from './vnode'
import * as dom from './dom'
import { isPrimitive } from '../util/index'

// 创建一个空的 vNode 对象，作为节点模板。
const emptyNode = VNode('', {}, [], undefined, undefined)

// 定义 一些基本的 钩子函数
const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post']

function isUndef (s) {
  return s === undefined
}

function isDef (s) {
  return s !== undefined
}

/**
 * 判断 vnode 对象上的 key  和 tagName（sel);
 * @param  {[type]} vnode1 [description]
 * @param  {[type]} vnode2 [description]
 * @return {[type]}        [description]
 */
function sameVnode (vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  // 将节点是key 值 ，跟 子节点数组的下标 进行映射。 最后 返回 映射的对象。
  var i, map = {}, key
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

export default function createPatchFunction (modules, api) {
  var i, j, cbs = {}
  // 设置对 dom 操作的API
  if (isUndef(api)) api = dom
  //
  for (i = 0; i < hooks.length; ++i) {
    // 定义不同时期的钩子函数。
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      // cbs 对象中， 保存着不同时期 的 回调数组。
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }

  function emptyNodeAt (elm) {
    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    // 返回函数 作为remove vnode 时所有 remove 钩子函数全都触发后的回调函数,
    // 将对应的节点从父节点中删除，
    return function() {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm)
        api.removeChild(parent, childElm)
      }
    }
  }

  function createElm (vnode, insertedVnodeQueue) {
    var i, thunk, data = vnode.data
    if (isDef(data)) {
      // 如果 存在 data.hook.init 钩子函数，在创建真实的dom节点之前，先调用init 回调
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode)
      if (isDef(i = data.vnode)) {
          // 保存 init 函数，修改后的 vnode 对象
          thunk = vnode

          vnode = i
      }
    }
    var elm, children = vnode.children, tag = vnode.sel
    if (isDef(tag)) {
      elm = vnode.elm = isDef(data) && isDef(i = data.ns)
        ? api.createElementNS(i, tag)   //只有使用命名空间的 XML 文档才会使用该方法。 传入规定的命名空间的名称 和 元素节点名称
        : api.createElement(tag)       // 使用createElement 传入节点名，创造对应节点。
      // 检查元素的子节点是否为数组，
      if (Array.isArray(children)) {
        // 如果是数组，则递归创造子节点。
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue))
        }
      } else if (isPrimitive(vnode.text)) {
        // 如果是内容 且仅为文本节点，则直接创造文本节点，插入到当前元素中
        api.appendChild(elm, api.createTextNode(vnode.text))
      }
      // 利用 开始存放的 钩 子函数， 遍历触发里面所有的 create 回调函数。
      //  updateStyle  updateProps updateEventListeners updateAttrs
      //  缺少 { init: updateClass },
      //  在创建的节点上 添加 style props eventListener  attrs 等等。
      //  完善新创建的 节点。 同样真实的节点引用保存在 vnode.elm 中。
      //   触发 全局的 create 函数。
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)
      i = vnode.data.hook // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode)
        // 如果存在 insert钩子函数，则保存在批量删除的 数组中的。
        if (i.insert) insertedVnodeQueue.push(vnode)
      }
    } else {
      // 文本节点，直接创建。
      elm = vnode.elm = api.createTextNode(vnode.text)
    }
    if (isDef(thunk)) thunk.elm = vnode.elm
    // 最后返回 vnode 对象 对应的真实节点的引用。
    return vnode.elm
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      //遍历 vnodes 数组中 从 startIdx 到 endIdx 的节点， 将 vnode创建成 真实的dom节点，并插入到父节点当中。
      //遍历
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before)
    }
  }


  function invokeDestroyHook (vnode) {
   // 手动触发 destory 钩子回调.
    var i, j, data = vnode.data
    if (isDef(data)) {
      // 先触发 当前 vnode 上挂载的 destory 回调
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
      // 然后，再触发全局的destory 钩子回调函数
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
      // 存在 子节点的话，递归触发 子节点中的 invokeDestoryHook
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j])
        }
      }
      if (isDef(i = data.vnode)) invokeDestroyHook(i)
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          // 先调用 destory 钩子函数
          invokeDestroyHook(ch)
          listeners = cbs.remove.length + 1
          // 利用 createRmCb 函数，生成remove的钩子函数的回调函数，操作真实的dom ,删除dom。
          rm = createRmCb(ch.elm, listeners)
          //触发全局的 remove  回调函数
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
          //
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            // 调用内部的 ch.data.hook.remove 钩子函数
            i(ch, rm)
          } else {
            // 没有内部钩子，直接触发rm() ，删除节点。
            rm()
          }
        } else { // Text node
          // 没有节点名，文本节点，直接删除
          api.removeChild(parentElm, ch.elm)
        }
      }
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue) {
    // 对于同级节点之间的新旧 更新，利用 不同方式的比较，达到复用节点的目的。
    //
    // 保存 新 、旧 节点 开始,结束下标 和 开始,结束的元素。
    var oldStartIdx = 0, newStartIdx = 0
    var oldEndIdx = oldCh.length - 1        // 保存旧节点的尾部下标
    var oldStartVnode = oldCh[0]           // 旧节点 的头部下标
    var oldEndVnode = oldCh[oldEndIdx]     // 旧节点 头部
    var newEndIdx = newCh.length - 1       // 新节点 尾部 下标
    var newStartVnode = newCh[0]           // 新节点 头部
    var newEndVnode = newCh[newEndIdx]     // 新节点 尾部
    var oldKeyToIdx, idxInOld, elmToMove, before

    // 新旧子节点数组， 任何一方遍历完成，则循环结束
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 如果旧数组开头节点不存在，则后移
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left  导致第一个 old 的 startVnode 不存在了。
      } else if (isUndef(oldEndVnode)) {     //  Vnode has been moved right
        oldEndVnode = oldCh[--oldEndIdx]     // 旧数组 的结束节点不存在，向左移动
      } else if (sameVnode(oldStartVnode, newStartVnode)) {  // old 开始节点   --  new 开始节点
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {      // old 结束节点   -- new 结束节点
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)     // 复用oldStartVnode 节点，将其右移，插入到旧节点的尾部。
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)  // 复用 oldEndVnode 节点， 将其左移， 插入到旧节点的头部。
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 如果没哟可以 复用的 节点。
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // key  ---> idx
        idxInOld = oldKeyToIdx[newStartVnode.key]
        // 如果数组中 并不存在对应的key值。
        // 可以认为 是新添加的节点
        if (isUndef(idxInOld)) { // New element
          //  对应把 newStartVnode 转化为 真实的dom 节点。
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          elmToMove = oldCh[idxInOld]
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue) {
    var i, hook
    // 初始化过程中 vnode.data.hook 为 “undefined”
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode)
    }
    //初始化 ，emptyNodeAt oldVnode.data是一个 {} 空对象。所以 oldVnode.data.vnode 为 “undefined”
    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i

    // 。。。。 ????
    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
      patchVnode(oldVnode, i, insertedVnodeQueue)
      vnode.elm = i.elm
      return
    }
    // 将 oldVnode 的 真实 dom 引用，
    // 覆盖 新 vnode的真实dom 引用。
    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children
    // 进行对象比较。如果相等就直接返回
    // debugger
    if (oldVnode === vnode) return

    //  比较 新旧 节点都不同，则 插入新节点，删除旧节点。
    if (!sameVnode(oldVnode, vnode)) {
      // 获取到真实的 父节点的 dom 节点
      var parentElm = api.parentNode(oldVnode.elm)
      //  insertedVnodeQueue 空数组
      //  通过 createElm 函数，拿到了创建真实的dom 节点后的 引用。
      //  赋值给 elm
      elm = createElm(vnode, insertedVnodeQueue)

      // 在老节点前 插入新节点，
      api.insertBefore(parentElm, elm, oldVnode.elm)
      // 然后删除 老节点。整个 真实的dom 树的更新，也同样完成了。
      removeVnodes(parentElm, [oldVnode], 0, 0)
      return
    }

     // 新 vnode 对象中，存在 data属性
    if (isDef(vnode.data)) {
    // 然后就把他们放入到update 更新 钩子函数里面。
    // 分别更新节点里面 attrs,class events,props styles 等数据。
     for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)

        i = vnode.data.hook

        if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode)
    }

    // c = ${ genChildren(el) }
    // if (isPrimitive(c)) { text = c }
    //  如果 genChildren(el) 返回的值不是 "string" 或者 “number” 等基本类型。
    //  则 vnode.text  就为 "undefined"
    if (isUndef(vnode.text)) {
        // 新旧节点 都存在 子节点，则手动更新 子节点。
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
      } else if (isDef(ch)) {
        // 新节点没有 文本属性 ，旧节点存在文本属性，则把文本设置为空。
        if (isDef(oldVnode.text)) api.setTextContent(elm, '')

        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 旧节点存在子节点，新节点不存在子节点，则 删除子节点。
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        /// 同样只有 旧节点存在 文本内容，就置空文本内容。
        api.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 更新 节点里面 的 文本内容。
      api.setTextContent(elm, vnode.text)
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode)
    }
  }

  // patch(this._le,vtree)
  // patch(this._tree,vtree)
  return function patch (oldVnode, vnode) {
    var i, elm, parent
    var insertedVnodeQueue = []
    // 首先触发 pre 钩子 上的回调。
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()


    if (isUndef(oldVnode.sel)) {
      // 第一次初始化的时候，不是 vNode 对象。
      // 对应的实例化一个节点对象。
      // VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm)
      // 初始化时 elm === oldVnode === this._el === document.querySelector(options.el),
      // 也就是获取到的真实dom 引用。
      oldVnode = emptyNodeAt(oldVnode)
    }
    // 通过节点名（sel） 和 dom 上对应的 keys 值（key），来判断 父节点是否没有发生改变。
    if (sameVnode(oldVnode, vnode)) {
      // 父节点没有发生改变，
      //
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      // 父节点发生了改变。
      // 获取到老 vNode 对象的 真实dom 引用。
      elm = oldVnode.elm
      // node.parentElement
      // 返回当前旧元素的父元素节点。
      parent = api.parentNode(elm)

      createElm(vnode, insertedVnodeQueue)

      // 在拿到了当前需要更新的节点的父元素的真实dom 引用后，
      if (parent !== null) {
        // 在旧元素后面 插入 改变后的新元素
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm))
        // 然后 再移除旧元素，从而实现更新操作。
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i])
    }
    // 整个 新旧node 节点更新完成后，调用 post 钩子函数。
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
    return vnode
  }
}
