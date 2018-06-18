import Cache from '../cache'
import {
  inBrowser,
  trimNode,
  isTemplate,
  isFragment
} from '../util/index'

const templateCache = new Cache(1000)
const idSelectorCache = new Cache(1000) //缓存 id

const map = {
  efault: [0, '', ''],
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [
    2,
    '<table><tbody></tbody><colgroup>',
    '</colgroup></table>'
  ]
}

map.td =
map.th = [
  3,
  '<table><tbody><tr>',
  '</tr></tbody></table>'
]

map.option =
map.optgroup = [
  1,
  '<select multiple="multiple">',
  '</select>'
]

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.g =
map.defs =
map.symbol =
map.use =
map.image =
map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [
  1,
  '<svg ' +
    'xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
    'version="1.1">',
  '</svg>'
]

/**
 * Check if a node is a supported template node with a
 * DocumentFragment content.
 * // <template> 元素，包含只读的 content 属性，
 * 这个属性保存的是 DocumentFragment。
 * var documentFragment = templateElement.content;
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isRealTemplate (node) {
  return isTemplate(node) && isFragment(node.content)
}
const tagRE = /<([\w:-]+)/
const entityRE = /&#?\w+?;/
const commentRE = /<!--/
/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @param {Boolean} raw
 * @return {DocumentFragment}
 */

function stringToFragment (templateString, raw) {
  // try a cache hit first
  var cacheKey = raw
    ? templateString
    : templateString.trim()
    // 从缓存队列中 获取缓存的 template 模板 对应的 DocumentFragment
  var hit = templateCache.get(cacheKey)
  if (hit) {
    return hit
  }
  // 手动创造一个空的 documnetfragment 对象。
  var frag = document.createDocumentFragment()
  var tagMatch = templateString.match(tagRE)
  var entityMatch = entityRE.test(templateString)
  var commentMatch = commentRE.test(templateString)

  if (!tagMatch && !entityMatch && !commentMatch) {
    // text only, return a single text node.
    // 创建 文本节点。
    frag.appendChild(
      document.createTextNode(templateString)
    )
  } else {
    var tag = tagMatch && tagMatch[1]
    var wrap = map[tag] || map.efault
    var depth = wrap[0]    // 节点嵌套 深度
    var prefix = wrap[1]   // 父节点  前缀（开始标签）
    var suffix = wrap[2]   // 父节点后缀(闭合标签)
    var node = document.createElement('div')
    // 为 templateString 添加必要的 父节点标签，符合 html 规范。
    node.innerHTML = prefix + templateString + suffix
    while (depth--) {
      // 获取 templateString 填充到 innerHTML 后，
      // 转变成的 html 节点。
      node = node.lastChild
    }

    var child
    /* eslint-disable no-cond-assign */
    while (child = node.firstChild) {
    /* eslint-enable no-cond-assign */
    // 逐层向内，找到嵌套的节点， 通过 appendChild 填充到 documentFragment 中去。
      frag.appendChild(child)
    }
  }
  if (!raw) {
    // 不要求保持原格式，
    // 则 遍历 删除里面的 空文本节点 和 注释
    trimNode(frag)
  }
  //  解析完成后，添加到缓存中。
  templateCache.put(cacheKey, frag)
  // 返回 documentFragment
  return frag
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment (node) {
  // if its a template tag and the browser supports it,
  // its content is already a document fragment. However, iOS Safari has
  // bug when using directly cloned template content with touch
  // events and can cause crashes when the nodes are removed from DOM, so we
  // have to treat template elements as string templates. (#2805)
  /* istanbul ignore if */
  if (isRealTemplate(node)) {
    // 传入 node.innerHTML
    return stringToFragment(node.innerHTML)
  }
  // script template
  if (node.tagName === 'SCRIPT') {
    // 表示一个节点及其后代的文本内容。
    return stringToFragment(node.textContent)
  }
  // normal node, clone it to avoid mutating the original
  var clonedNode = cloneNode(node)
  var frag = document.createDocumentFragment()
  var child
  /* eslint-disable no-cond-assign */
  while (child = clonedNode.firstChild) {
    // 遍历 cloneNode 中所有的 节点。
    // 通过 appendChild 添加到 documentfragment 片段中去。
  /* eslint-enable no-cond-assign */
    frag.appendChild(child)
  }
  // 去除空的文本节点 或者 注释。
  trimNode(frag)
  return frag
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/showug.cgi?id=137755
// 检查是否在 Safari 中存在 克隆 template 的bug
var hasBrokenTemplate = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var a = document.createElement('div')
    a.innerHTML = '<template>1</template>'
    return !a.cloneNode(true).firstChild.innerHTML
  } else {
    return false
  }
})()

// Test for IE10/11 textarea placeholder clone bug
// 测试在 IE10/11 中 textarea placeholder 克隆后，
// 被处理成了 value 值。
var hasTextareaCloneBug = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var t = document.createElement('textarea')
    t.placeholder = 't'
    return t.cloneNode(true).value === 't'
  } else {
    return false
  }
})()

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

export function cloneNode (node) {
  /* istanbul ignore if */
  if (!node.querySelectorAll) {
    return node.cloneNode()
  }
  // true 表示深拷贝节点，包括递归遍历其子节点。
  // 如果是没有下面两种浏览器兼容的bug ,就可以直接返回克隆的结果。
  var res = node.cloneNode(true)
  var i, original, cloned
  /* istanbul ignore if */
  // 检查 safari 浏览器中 是否有 无法深拷贝 <template>模板的bug
  if (hasBrokenTemplate) {
    var tempClone = res
    // 判断是否为  真实的template
    // 1. node.tagName.toLowerCase() === "template",
    // 2. node.content.nodeType === 11 代表 DocumentFragment 文档对象。
    if (isRealTemplate(node)) {
      // node.content 获取到 template 里面的documentFragment 文档对象
      node = node.content
      tempClone = res.content
    }
    // 查到 内部的 template 元素
    original = node.querySelectorAll('template')
    if (original.length) {

      cloned = tempClone.querySelectorAll('template')
      i = cloned.length
      while (i--) {
      // syntax
      // replacedNode = parentNode.replaceChild(newChild,oldChild);
      // 遍历内部的template 同样利用 cloneNode，克隆节点，替换掉对应的template元素

        cloned[i].parentNode.replaceChild(
          cloneNode(original[i]),
          cloned[i]
        )
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      // 节点为 textarea  直接修改克隆厚点 value
      res.value = node.value
    } else {
      original = node.querySelectorAll('textarea')
      if (original.length) {
        // 遍历 内部所有的 textarea
        cloned = res.querySelectorAll('textarea')
        i = cloned.length
        while (i--) {
          // 手动修改里面的 value 值。
          cloned[i].value = original[i].value
        }
      }
    }
  }
  // 最后返回 完整的克隆节点。
  return res
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *        Possible values include:
 *        - DocumentFragment object
 *        - Node object of type Template
 *        - id selector: '#some-template-id'
 *        - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} shouldClone
 * @param {Boolean} raw
 *        inline HTML interpolation. Do not check for id
 *        selector and keep whitespace in the string.
 * @return {DocumentFragment|undefined}
 */

export function parseTemplate (template, shouldClone, raw) {
  var node, frag

  // if the template is already a document fragment,
  // do nothing
  // 通过 nodeType === 11 判断是否为 document fragment。
  if (isFragment(template)) {
    trimNode(template)
    return shouldClone
      ? cloneNode(template)
      : template
  }

  if (typeof template === 'string') {
    // id selector
    // options.template 中传入的是 #some-template-id
    if (!raw && template.charAt(0) === '#') {
      // id selector can be cached too
      // 获取 缓存的id 选择器。
      frag = idSelectorCache.get(template)
      if (!frag) {
        // 如果没有，则需要手动获取节点 引用。
        node = document.getElementById(template.slice(1))
        if (node) {
          //
          frag = nodeToFragment(node)
          // save selector to cache
          idSelectorCache.put(template, frag)
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template, raw)
    }
  } else if (template.nodeType) {
    // a direct node
    // 通过 nodeType 属性 判断是否为 node，
    frag = nodeToFragment(template)
  }

  return frag && shouldClone
  // 通过 shouldClone 来判断是否调用 cloneNode.
    ? cloneNode(frag)
    : frag
}
