import Cache from '../cache'
import config from '../config'
import { parseDirective } from '../parsers/directive'

const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
let cache, tagRE, htmlRE

/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex (str) {
  return str.replace(regexEscapeRE, '\\$&')
}

export function compileRegex () {
  var open = escapeRegex(config.delimiters[0])  // 转义{{}} 大括号语法。"\{\{"
  var close = escapeRegex(config.delimiters[1]) //  输出 "\}\}"
  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0])  // "\{\{\{"
  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]) // "\}\}\}"
  tagRE = new RegExp(
    unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' +
    open + '((?:.|\\n)+?)' + close,
    'g'
  )
  // tagRE = /\{\{\{((?:.|\n)+?)\}\}\}|\{\{((?:.|\n)+?)\}\}/g
  htmlRE = new RegExp(
    '^' + unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '$'
  )
  // htmlRE = /^\{\{\{((?:.|\n)+?)\}\}\}$/g 匹配 HTML 编码
  // reset cache
  cache = new Cache(1000)
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

export function parseText (text) {
  if (!cache) {
    // 如果没有 Cache， 则 new Cache();
    // 同时 新生成 tagRE  HTMLRE ，正则表达式。
    compileRegex()
  }
  // 缓存中取text,
  var hit = cache.get(text)
  if (hit) {   // 如果缓存中存在对应的 text,则直接返回。
    return hit
  }
  if (!tagRE.test(text)) {
    // tagRE 匹配失败，返回null;
    return null
  }
  var tokens = []
  // RegExp.lastIndex 该属性存放一个整数， 声明的是上一次匹配文本之后的第一个字符的位置。
  // reset 到 0；
  var lastIndex = tagRE.lastIndex = 0
  var match, index, html, value, first, oneTime
  /* eslint-disable no-cond-assign */
  while (match = tagRE.exec(text)) {
  /* eslint-enable no-cond-assign */
    index = match.index
    // push text token
    if (index > lastIndex) {
      // 获取到 中间 未匹配的 tokens
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    // tag token
    html = htmlRE.test(match[0])
    value = html ? match[1] : match[2]
    first = value.charCodeAt(0)  // '*' 对应的UTF-16 代码单元值的数字。code
    oneTime = first === 42 // *
    // 去除 * 字符。
    value = oneTime
      ? value.slice(1)
      : value
    // 属性中 使用了 {{ }} 包裹的内容，保存到数组tokens中，tag: true；
    tokens.push({
      tag: true,
      value: value.trim(),
      html: html,
      oneTime: oneTime
    })
    // 手动设置 lastIndex 为当前匹配序号加上 匹配的字符串的长度。
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    // 把匹配完成后，剩余部分的text 内容保存到 tokens数组中。
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  // 缓存在cache, 键值为 text 当前
  cache.put(text, tokens)
  return tokens
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 * 将一系类的tokens序列化为 表达式
 * 'a{{b}}c' --> "a" + b + "c"
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

export function tokensToExp (tokens, vm) {
  if (tokens.length > 1) {
    return tokens.map(function (token) {
      return formatToken(token, vm)
    }).join('+')
  } else {
    return formatToken(tokens[0], vm, true)
  }
}

/**
 * Format a single token.
 * 将 token 数组中的每一项，转换为表达式。
 *    非tag: 直接进行字符串拼接
 *      tag:
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} [single]
 * @return {String}
 */

function formatToken (token, vm, single) {
  // oneTime = first === 42 *
  return token.tag
    ? token.oneTime && vm
      ? '"' + vm.$eval(token.value) + '"'
      : inlineFilters(token.value, single)
    : '"' + token.value + '"'
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @param {Boolean} single
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/
function inlineFilters (exp, single) {
  if (!filterRE.test(exp)) {
    return single
      ? exp
      : '(' + exp + ')'
  } else {
    var dir = parseDirective(exp)
    if (!dir.filters) {
      return '(' + exp + ')'
    } else {
      return 'this._applyFilters(' +
        dir.expression + // value
        ',null,' +       // oldValue (null for read)
        JSON.stringify(dir.filters) + // filter descriptors
        ',false)'        // write?
    }
  }
}
