import { parseText } from './text-parser'

const bindRE = /^:|^v-bind:/
const onRE = /^@|^v-on:/
const mustUsePropsRE = /^(value|selected|checked|muted)$/

export function generate (ast) {
  const code = genElement(ast)
  return new Function (`with (this) { return ${code}}`)
}

function genElement (el, key) {
  let exp
  if (exp = getAttr(el, 'v-for')) {
     // 对应的找到了 'v-for'指令。
    return genFor(el, exp)
  } else if (exp = getAttr(el, 'v-if')) {
    return genIf(el, exp)
  } else if (el.tag === 'template') {
    return genChildren(el)
  } else {
    return `__h__('${ el.tag }', ${ genData(el, key) }, ${ genChildren(el) })`
  }
}

function genIf (el, exp) {
  return `(${ exp }) ? ${ genElement(el) } : ''`
}

function genFor (el, exp) {
  // v-for = "item in lists"
  const inMatch = exp.match(/([a-zA-Z_][\w]*)\s+(?:in|of)\s+(.*)/)
  // 如果在 v-for  中 不匹配 上面正则，则抛出异常
  if (!inMatch) {
    throw new Error('Invalid v-for expression: '+ exp)
  }
  // 获取到 遍历 的数组中每一项的 别称。
  const alias = inMatch[1].trim()
  // 获取到即将遍历的数组。
  exp = inMatch[2].trim()
  // track-by 为即将渲染出的每一项 定义一个 key 值。
  const key = el.attrsMap['track-by'] || 'undefined'
  // 对 数组中的每一项 遍历 查找里面的 "v-" 指令。
  return `(${ exp }).map(function (${ alias }, $index) {return ${ genElement(el, key) }})`
}

function genData (el, key) {
  if (!el.attrs.length) {
    return '{}'
  }
  let data = key ? `{key:${ key },` : `{`
  if (el.attrsMap[':class'] || el.attrsMap['class']) {
    data += `class: _renderClass(${ el.attrsMap[':class'] }, "${ el.attrsMap['class'] || '' }"),`
  }
  let attrs = `attrs:{`
  let props = `props:{`
  let hasAttrs = false
  let hasProps = false
  // 遍历 元素节点上的attr 属性 数组， 正则匹配里面的 指令。
  for (let i = 0, l = el.attrs.length; i < l; i++) {
    let attr = el.attrs[i]
    let name = attr.name
    // 通过 “v-bind” 或者 ":"绑定的属性。
    if (bindRE.test(name)) {
      // 替换掉 v-bind 或者 “:”等 绑定 指令。
      name = name.replace(bindRE, '')
      if (name === 'class') {
        continue
      } else if (name === 'style') {
        data += `style: ${ attr.value },`
      } else if (mustUsePropsRE.test(name)) {
        // 是否为表单的 prop 属性  eg: value|selected|checked|muted
        hasProps = true
        props += `"${ name }": (${ attr.value }),`
      } else {
        // 元素节点上的属性。
        hasAttrs = true
        attrs += `"${ name }": (${ attr.value }),`
      }
    } else if (onRE.test(name)) {
      // 通过 ^@|^v-on:  绑定的事件。
      name = name.replace(onRE, '')
      // TODO
    } else if (name !== 'class') {
      // 或者是一些 自定义 的属性，绑定到元素上面。
      hasAttrs = true
      attrs += `"${ name }": (${ JSON.stringify(attr.value) }),`
    }
  }

  if (hasAttrs) {
    // 含有属性情况下， 去除最后的 “，”,所有属性合成一个对象。
    data += attrs.slice(0, -1) + '},'
  }
  if (hasProps) {
    // 同样在含有表单属性情况下， 去除最后的 “，”,所有属性合成一个对象。
    data += props.slice(0, -1) + '},'
  }
  // 把所有 的 attrs props class 合成一个更大的对象。
  return data.replace(/,$/, '') + '}'
}

function genChildren (el) {
  if (!el.children.length) {
    return 'undefined'
  }
 // genNode 递归遍历里面的子对象，即子节点。
 // __flatten__() 扁平化方法，减少数组的嵌套层级。
 // 不管嵌套多深的 数组，都解析出来，通过 join(",")放在一个数组里面。
 //
  return '__flatten__([' + el.children.map(genNode).join(',') + '])'
}

function genNode (node) {
  if (node.tag) {
    //
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  if (text === ' ') {
    return '" "'
  } else {
    const exp = parseText(text)
    if (exp) {
      return 'String(' + escapeNewlines(exp) + ')'
    } else {
      return escapeNewlines(JSON.stringify(text))
    }
  }
}

function escapeNewlines (str) {
  return str.replace(/\n/g, '\\n')
}

function getAttr (el, attr) {
  let val
  // 在 AST 的 attrsMap 对象 和 attrs 数组中，找到对应是属性，并移除对应的属性。
  if (val = el.attrsMap[attr]) {
    el.attrsMap[attr] = null
    for (let i = 0, l = el.attrs.length; i < l; i++) {
      if (el.attrs[i].name === attr) {
        el.attrs.splice(i, 1)
        break
      }
    }
  }
  return val
}
