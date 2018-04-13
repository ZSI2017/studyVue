import VNode from './vnode'
import { isPrimitive, isArray } from '../util/index'

function addNS(data, children) {
  data.ns = 'http://www.w3.org/2000/svg'
  if (children !== undefined) {
    for (var i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children)
    }
  }
}
//`__h__('${ el.tag }', ${ genData(el, key) }, ${ genChildren(el) })`
// 编译指令后，转换为  vNode 类型的对象。
export default function h (tag, b, c) {
  var data = {}, children, text, i
  // 存在 三个参数 的情况。
  if (arguments.length === 3) {
  // 保存着 attr,props class,style 的data 属性。
    data = b
  // 如果 c 为数组，则表示保存着子节点
    if (isArray(c)) { children = c }
    else if (isPrimitive(c)) { text = c }
  } else if (arguments.length === 2) {
    if (isArray(b)) { children = b }
    else if (isPrimitive(b)) { text = b }
    else { data = b }
  }
  // 存在子节点的 情况下。
  if (isArray(children)) {
    for (i = 0; i < children.length; ++i) {
    // 如果 子元素数组项中，有通过 genText 生成的字符串。
    // 同样转换为 vNode 对象类型。
      if (isPrimitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i])
    }
  }
  if (tag === 'svg') {
    addNS(data, children)
  }
  //        { sel, data, children, text, elm, key }
  return VNode(tag, data, children, text, undefined)
}
