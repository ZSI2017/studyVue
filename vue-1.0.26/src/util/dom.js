import config from '../config'
import { isIE9 } from './env'
import { warn } from './debug'
import { camelize } from './lang'
import { removeWithTransition } from '../transition/index'

/**
 * Query an element selector if it's not an element already.
 *
 * @param {String|Element} el
 * @return {Element}
 *
 * 通过 document.queyrSelector() 获取dom 节点引用。
 */

export function query (el) {
  if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + selector
      )
    }
  }
  return el
}

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed by doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 * Node.contains()返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点。
 * document.documentElement.contains 则表示可以检查一个节点是否存在文档流中。
 * 通过检查元素的父节点来判断 当前元素是否在文档流中。
 * @param {Node} node
 * @return {Boolean}
 */

export function inDoc (node) {
  if (!node) return false
  var doc = node.ownerDocument.documentElement  //node.ownerDocument 只读属性，会返回当前节点的顶层document 对象。
  var parent = node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent))) // node.nodeType === 1 为一个元素节点。
}

/**
 * Get and remove an attribute from a node.
 * 获取并 删除 元素属性。
 * @param {Node} node
 * @param {String} _attr
 */

export function getAttr (node, _attr) {
  var val = node.getAttribute(_attr)
  if (val !== null) {
    node.removeAttribute(_attr)
  }
  return val
}

/**
 * Get an attribute with colon or v-bind: prefix.
 *  获取 一个 v-bind 或者 ：开头的属性。
 * @param {Node} node
 * @param {String} name
 * @return {String|null}
 */

export function getBindAttr (node, name) {
  var val = getAttr(node, ':' + name)
  if (val === null) {
    val = getAttr(node, 'v-bind:' + name)
  }
  return val
}

/**
 * Check the presence of a bind attribute.
 *
 * @param {Node} node
 * @param {String} name
 * @return {Boolean}
 */

export function hasBindAttr (node, name) {
  return node.hasAttribute(name) ||
    node.hasAttribute(':' + name) ||
    node.hasAttribute('v-bind:' + name)
}

/**
 * Insert el before target
 * 在元素前面插入。
 *
 * @param {Element} el
 * @param {Element} target
 */

export function before (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Insert el after target
 * 元素后面插入节点。
 *
 * @param {Element} el
 * @param {Element} target
 */

export function after (el, target) {
  if (target.nextSibling) {
    before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}

/**
 * Remove el from DOM
 * 移除某个元素
 * @param {Element} el
 */

export function remove (el) {
  el.parentNode.removeChild(el)
}

/**
 * Prepend el to target
 * 元素子节点前面
 * @param {Element} el
 * @param {Element} target
 */

export function prepend (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

export function replace (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 * @param {Boolean} [useCapture]
 */

export function on (el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture)
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

export function off (el, event, cb) {
  el.removeEventListener(event, cb)
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */

function getClass (el) {
  var classname = el.className
  if (typeof classname === 'object') {
    classname = classname.baseVal || ''
  }
  return classname
}

/**
 * In IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; However in
 * PhantomJS, setting `className` does not work on SVG elements...
 * So we have to do a conditional check here.
 *
 * @param {Element} el
 * @param {String} cls
 */

export function setClass (el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

export function addClass (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + getClass(el) + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

export function removeClass (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + getClass(el) + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 * 提取出一个元素的原始内容，
 * 并放在 一个div 块，或者是一个documentFragment 节点里面，返回
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element|DocumentFragment}
 */
export function extractContent (el, asFragment) {
  var child
  var rawContent
  /* istanbul ignore if */
  if (isTemplate(el) && isFragment(el.content)) {
    el = el.content
  }
  // el.hasChildNodes 判断是否存在子节点。
  if (el.hasChildNodes()) {
    trimNode(el)   // 删除元素中的 空的文本内容，或者注释节点。
    rawContent = asFragment               // 是否创建 documentFragment节点
      ? document.createDocumentFragment()
      : document.createElement('div')
    /* eslint-disable no-cond-assign */
    // 深拷贝 el 中的所有的子节点，
    // 保存到 rawContent 中。
    while (child = el.firstChild) {
    /* eslint-enable no-cond-assign */
      rawContent.appendChild(child)
    }
  }
  return rawContent
}

/**
 * Trim possible empty head/tail text and comment
 * nodes inside a parent.
 *
 * 修整可能出现空的 head/tail 文本，或者嵌套在 documentFrament 中的注释。
 * 如果是，则删除
 * @param {Node} node
 */

export function trimNode (node) {
  var child
  /* eslint-disable no-sequences */
  while (child = node.firstChild, isTrimmable(child)) {
    // 满足以上 istrimmable的无实际意义的node ,则可以直接删除。
    node.removeChild(child)
  }
  while (child = node.lastChild, isTrimmable(child)) {
    node.removeChild(child)
  }
  /* eslint-enable no-sequences */
}

/**
 *  nodeType === 3 ,代表元素或属性中的文本内容。     Text
 *  nodeType === 8 , 代表注释                      Comment
 * @param {} node
 */
function isTrimmable (node) {
  return node && (
    //为文本内容，且里面的内容为空，
    //为注释的节点,
    (node.nodeType === 3 && !node.data.trim()) ||
    node.nodeType === 8   // nodeType === 8 注释
  )
}

/**
 * Check if an element is a template tag.
 * Note if the template appears inside an SVG its tagName
 * will be in lowercase.
 * 判断 el 选项对应的 属性值，是否为 <template></template>
 * @param {Element} el
 */

export function isTemplate (el) {
  return el.tagName &&
    el.tagName.toLowerCase() === 'template'
}

/**
 * Create an "anchor" for performing dom insertion/removals.
 * This is used in a number of scenarios:
 * - fragment instance
 * - v-html
 * - v-if
 * - v-for
 * - component
 *
 * @param {String} content
 * @param {Boolean} persist - IE trashes empty textNodes on
 *                            cloneNode(true), so in certain
 *                            cases the anchor needs to be
 *                            non-empty to be persisted in
 *                            templates.
 * @return {Comment|Text}
 */

export function createAnchor (content, persist) {
  var anchor = config.debug
    ? document.createComment(content)
    : document.createTextNode(persist ? ' ' : '')
  anchor.__v_anchor = true
  return anchor
}

/**
 * Find a component ref attribute that starts with $.
 * 在组件中发现一个 ref 属性。
 * @param {Element} node
 * @return {String|undefined}
 */

var refRE = /^v-ref:/
export function findRef (node) {
  if (node.hasAttributes()) {
    var attrs = node.attributes
    for (var i = 0, l = attrs.length; i < l; i++) {
      var name = attrs[i].name
      if (refRE.test(name)) {
        return camelize(name.replace(refRE, ''))
      }
    }
  }
}

/**
 * Map a function to a range of nodes .
 *
 * 对 一系类元素做 同样的 函数操作。
 * @param {Node} node
 * @param {Node} end
 * @param {Function} op
 */

export function mapNodeRange (node, end, op) {
  var next
  while (node !== end) {
    next = node.nextSibling
    op(node)
    node = next
  }
  op(end)
}

/**
 * Remove a range of nodes with transition, store
 * the nodes in a fragment with correct ordering,
 * and call callback when done.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 * @param {DocumentFragment} frag
 * @param {Function} cb
 */

export function removeNodeRange (start, end, vm, frag, cb) {
  var done = false
  var removed = 0
  var nodes = []
  mapNodeRange(start, end, function (node) {
    if (node === end) done = true
    nodes.push(node)
    removeWithTransition(node, vm, onRemoved)
  })
  // 移除成功的回调函数。
  function onRemoved () {
    removed++
    if (done && removed >= nodes.length) {
      for (var i = 0; i < nodes.length; i++) {
        frag.appendChild(nodes[i])
      }
      cb && cb()
    }
  }
}

/**
 * Check if a node is a DocumentFragment.
 *　nodeType 11 代表的是DocumentFragment，文档片段节点
 *　没有父节点的最小的文档对象.
 * @param {Node} node
 * @return {Boolean}
 */

export function isFragment (node) {
  return node && node.nodeType === 11
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 * 获取包括其后代的元素的序列化HTML片段。
 * @param {Element} el
 * @return {String}
 */

export function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    // 不存在对应的属性，则克隆一份
    var container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
