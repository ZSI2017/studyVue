/**
 * Convert HTML string to AST
 * 将传入的 HTML 转化成 抽象语法树，与DOM 结构对应。
 * @param {String} html
 * @return {Object}
 */

export function parse (html) {
  let root
  let currentParent
  let stack = []
  HTMLParser(html, {
    html5: true,
    start (tag, attrs, unary) {
      // 这里封装了抽象语法树的 所有结构。
      let element = {
        tag,
        attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      }
      if (!root) {
        // 将第一个开始标签 作为根节点。
        root = element
      }
      if (currentParent) {
        // 第一个元素节点，作为父节点。
        currentParent.children.push(element)
      }
      if (!unary) {
        currentParent = element
        // 压入到节点栈中。
        stack.push(element)
      }
    },
    end () {
      stack.length -= 1
      currentParent = stack[stack.length - 1]
    },
    chars (text) {
      text = currentParent.tag === 'pre'
        ? text
        : text.trim() ? text : ' '
      currentParent.children.push(text)
    },
    comment () {
      // noop
    }
  })
  return root
}

function makeAttrsMap (attrs) {
  // 对象数组，转化为 对象。
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

/*
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 */

/* global ActiveXObject, DOMDocument */

function makeMap(values) {
  values = values.split(/,/)
  var map = {}
  values.forEach(function(value) {
    map[value] = 1
  })
  return function(value) {
     // 利用闭包，保存不同类型的元素数组对应的 map值。
     // 进行判断时，就可以直接使用。
    return map[value.toLowerCase()] === 1
  }
}

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>\/=]+)/,
    singleAttrAssign = /=/,
    singleAttrAssigns = [singleAttrAssign],
    singleAttrValues = [
      // attr value double quotes
      /"([^"]*)"+/.source,
      // attr value, single quotes
      /'([^']*)'+/.source,
      // attr value, no quotes
      /([^\s"'=<>`]+)/.source
    ],
    qnameCapture = (function() {
      // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
      // but for Vue templates we can enforce a simple charset
      var ncname = '[a-zA-Z_][\\w\\-\\.]*'
      return '((?:' + ncname + '\\:)?' + ncname + ')'
    })(),
    startTagOpen = new RegExp('^<' + qnameCapture),
    startTagClose = /^\s*(\/?)>/,
    endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>'),
    doctype = /^<!DOCTYPE [^>]+>/i

var IS_REGEX_CAPTURING_BROKEN = false
'x'.replace(/x(.)?/g, function(m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === ''
})

// Empty Elements
// 不包裹任何内容的空元素。
var empty = makeMap('area,base,basefont,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr')

// Inline Elements
//  内联元素
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var')

// Elements that you can, intentionally, leave open
// (and which close themselves)
// 自关闭的 元素
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source')

// Attributes that have their values filled in disabled='disabled'
// 能够使用 disabled = "disabled"属性。 直接简写为 disabled;
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected')

// Special Elements (can contain anything)
// 包裹任何元素的 特殊元素。
var special = makeMap('script,style')

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var nonPhrasing = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track')

var reCache = {}

function attrForHandler(handler) {
  var pattern = singleAttrIdentifier.source +
                '(?:\\s*(' + joinSingleAttrAssigns(handler) + ')' +
                '\\s*(?:' + singleAttrValues.join('|') + '))?'
  return new RegExp('^\\s*' + pattern)
}

/(?:=)/
// "(?:=)" 正则匹配 赋值语句
//
function joinSingleAttrAssigns(handler) {
  return singleAttrAssigns.map(function(assign) {
    return '(?:' + assign.source + ')'
  }).join('|')
}

export default function HTMLParser(html, handler) {
  var stack = [], lastTag
  var attribute = attrForHandler(handler)
  var last, prevTag, nextTag
  while (html) {
    last = html
    // Make sure we're not in a script or style element
    // 非特殊符号
    if (!lastTag || !special(lastTag)) {
        // 文本内容 结束的位置。
      var textEnd = html.indexOf('<')
      if (textEnd === 0) {
        // Comment: 是否为 注释节点。
        if (/^<!--/.test(html)) {
          var commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            if (handler.comment) {
               // 传入的 handler中，如果有对注释的出来，就传入回调中去。
              handler.comment(html.substring(4, commentEnd))
            }
            html = html.substring(commentEnd + 3)
            prevTag = ''
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        // 关于IE条件注释
        // <![if !IE]>
        //<link href="non-ie.css" rel="stylesheet">
        // <![endif]>
        if (/^<!\[/.test(html)) {
          var conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) {
            if (handler.comment) {
              handler.comment(html.substring(2, conditionalEnd + 1), true /* non-standard */)
            }
            html = html.substring(conditionalEnd + 2)
            prevTag = ''
            continue
          }
        }

        // Doctype:
        // 对于文档类型 的 节点处理
        var doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          if (handler.doctype) {
            handler.doctype(doctypeMatch[0])
          }
          html = html.substring(doctypeMatch[0].length)
          prevTag = ''
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag)
        if (endTagMatch) {
          html = html.substring(endTagMatch[0].length)
          endTagMatch[0].replace(endTag, parseEndTag)
          prevTag = '/' + endTagMatch[1].toLowerCase()
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag(html)
        if (startTagMatch) {
          html = startTagMatch.rest
          // 抽离出开始标签中的 tagName ,attrs，等关键字段，交给 handleStartTag 处理
          handleStartTag(startTagMatch)
          prevTag = startTagMatch.tagName.toLowerCase()
          continue
        }
      }

      var text
      if (textEnd >= 0) {
        text = html.substring(0, textEnd)
        html = html.substring(textEnd)
      }
      else {
        text = html
        html = ''
      }

      // next tag
      var nextTagMatch = parseStartTag(html)
      if (nextTagMatch) {
        nextTag = nextTagMatch.tagName
      }
      else {
        nextTagMatch = html.match(endTag)
        if (nextTagMatch) {
          nextTag = '/' + nextTagMatch[1]
        }
        else {
          nextTag = ''
        }
      }

      if (handler.chars) {
        handler.chars(text, prevTag, nextTag)
      }
      prevTag = ''

    }
    else {
      var stackedTag = lastTag.toLowerCase()
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)</' + stackedTag + '[^>]*>', 'i'))

      html = html.replace(reStackedTag, function(all, text) {
        if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        }

        if (handler.chars) {
          handler.chars(text)
        }

        return ''
      })

      parseEndTag('</' + stackedTag + '>', stackedTag)
    }

    if (html === last) {
      throw new Error('Parse Error: ' + html)
    }
  }

  if (!handler.partialMarkup) {
    // Clean up any remaining tags
    parseEndTag()
  }

  function parseStartTag(input) {
    var start = input.match(startTagOpen)
    if (start) {
      var match = {
        tagName: start[1],
        attrs: []
      }
      // 开始查找 元素 节点上的相关属性。
      input = input.slice(start[0].length)
      //
      var end, attr
      // 截止到 开始的闭合标签，查找所有的 属性。
      while (!(end = input.match(startTagClose)) && (attr = input.match(attribute))) {
        input = input.slice(attr[0].length)
        // 将所有的属性都push到数组中去。
        match.attrs.push(attr)
      }
      // 捕获到了 开始标签中的 闭合 >
      if (end) {
        match.unarySlash = end[1]
        match.rest = input.slice(end[0].length)
        return match
      }
    }
  }

  function handleStartTag(match) {
    var tagName = match.tagName
    var unarySlash = match.unarySlash

    if (handler.html5 && lastTag === 'p' && nonPhrasing(tagName)) {
      parseEndTag('', lastTag)
    }

    if (!handler.html5) {
      while (lastTag && inline(lastTag)) {
        parseEndTag('', lastTag)
      }
    }

    // 如果是 自闭合的标签。
    if (closeSelf(tagName) && lastTag === tagName) {
      parseEndTag('', tagName)
    }

    // 一元标签： 中间没有内容 ，  或者是html根标签，    没有闭合标签，
    var unary = empty(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash

    var attrs = match.attrs.map(function(args) {

      // 针对 ff 中的 bug  hack
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3] }
        if (args[4] === '') { delete args[4] }
        if (args[5] === '') { delete args[5] }
      }
       // 把相应的属性，转化为 键值对的形式，存在新的数组中 attrs；
      return {
        name: args[1],
        value: args[3] || args[4] || (args[5] && fillAttrs(args[5]) ? name : '')
      }
    })

    if (!unary) {
      stack.push({ tag: tagName, attrs: attrs })
      lastTag = tagName
      unarySlash = ''
    }
     // 最后交给 初始化时，传入的 处理start 的回调函数。
    if (handler.start) {
      handler.start(tagName, attrs, unary, unarySlash)
    }
  }

  function parseEndTag(tag, tagName) {
    var pos

    // Find the closest opened tag of the same type
    // 查找最接近的 开始标签
    if (tagName) {
      var needle = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].tag.toLowerCase() === needle) {
          break
        }
      }
    }
    // If no tag name is provided, clean shop
    else {
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i].tag, stack[i].attrs, i > pos || !tag)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    }
    else if (tagName.toLowerCase() === 'br') {
      if (handler.start) {
        handler.start(tagName, [], true, '')
      }
    }
    else if (tagName.toLowerCase() === 'p') {
      if (handler.start) {
        handler.start(tagName, [], false, '', true)
      }
      if (handler.end) {
        handler.end(tagName, [])
      }
    }
  }
}
