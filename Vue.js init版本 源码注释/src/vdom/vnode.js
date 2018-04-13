// emptyNodeAt  初始化一个 空的 vnode 对象。
// VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm)
// 
export default function VNode (sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}
