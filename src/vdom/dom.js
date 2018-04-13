/**
 *  封装了一些 dom 的基本操作。
 */

// createElement
// 使用 createElement 创建新元素，传入要创建元素的标签名
//
export function createElement(tagName){
  return document.createElement(tagName)
}

export function createElementNS(namespaceURI, qualifiedName){
  return document.createElementNS(namespaceURI, qualifiedName)
}

// 创建新的文本节点。
export function createTextNode(text){
  return document.createTextNode(text)
}

// 插入dom 节点。
export function insertBefore(parentNode, newNode, referenceNode){
  parentNode.insertBefore(newNode, referenceNode)
}

// 移除
export function removeChild(node, child){
  node.removeChild(child)
}

// 添加dom 节点。
export function appendChild(node, child){
  node.appendChild(child)
}

//返回当前元素的父元素节点，如果该元素没有父节点，或者父节点不是一个元素节点(nodeType的值不为一)。返回null.
export function parentNode(node){
  return node.parentElement
}

//下一个兄弟节点
export function nextSibling(node){
  return node.nextSibling
}


// 属性返回元素的标签名。 始终是大写。
export function tagName(node){
  return node.tagName
}

//设置 文本内容。
export function setTextContent(node, text){
  node.textContent = text
}
