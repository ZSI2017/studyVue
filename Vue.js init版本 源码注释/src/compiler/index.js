import { parse } from './html-parser'
import { generate } from './codegen'

//  https://segmentfault.com/q/1010000009976954
//  Object.create(null) 没有继承任何原型方法，
const cache = Object.create(null)

export function compile (html) {
  html = html.trim()
  const hit = cache[html]
  // generate(parse(html)))
  // 先将dom 树 转化为抽象语法树，利用一个对象，存放dom 树中的所有的节点信息：
  // let element = {
  //    tag,
  //    attrs,
  //    attrsMap: makeAttrsMap(attrs),
  //    parent: currentParent,
  //    children: []
  //  }
  //  然后，再解析 里面的指令，生成
  //  generate - 利用 new Function() ,传入的字符串，解析成 js 语句，放在 compil 中进行编译。
  return hit || (cache[html] = generate(parse(html)))
}
