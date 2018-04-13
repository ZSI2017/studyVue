/* global MutationObserver */

// can we use __proto__?
export const hasProto = '__proto__' in {}

// Browser environment sniffing
export const inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]'

// detect devtools
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

// UA sniffing for working around browser-specific quirks
const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isAndroid = UA && UA.indexOf('android') > 0

let transitionProp
let transitionEndEvent
let animationProp
let animationEndEvent

// Transition property/event sniffing
if (inBrowser && !isIE9) {
  const isWebkitTrans =
    window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  const isWebkitAnim =
    window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  transitionProp = isWebkitTrans
    ? 'WebkitTransition'
    : 'transition'
  transitionEndEvent = isWebkitTrans
    ? 'webkitTransitionEnd'
    : 'transitionend'
  animationProp = isWebkitAnim
    ? 'WebkitAnimation'
    : 'animation'
  animationEndEvent = isWebkitAnim
    ? 'webkitAnimationEnd'
    : 'animationend'
}

export {
  transitionProp,
  transitionEndEvent,
  animationProp,
  animationEndEvent
}

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *利用 nextTick 定义一个异步执行的任务。理论上，作为一个 microtask 任务执行，类似es6 中的 promise
 *如果 MutationObserver 支持的情况下，就使用它
 *否则就使用 setTimeout(0) 构造异步任务队列。
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

export const nextTick = (function () {
  var callbacks = []
  var pending = false
  var timerFunc
  function nextTickHandler () {
    pending = false
    // 复制任务 队列中的回调函数
    var copies = callbacks.slice(0)
    // 同时将任务队列中的 回调清空。
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      // 遍历任务队列中的回调，并执行它。
      copies[i]()
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1
    //  创建一个 MutationObserver 对象
    var observer = new MutationObserver(nextTickHandler)
    // 创建一个 文本节点
    var textNode = document.createTextNode(counter)
    // 监听这个文本节点。
    observer.observe(textNode, {
      characterData: true
    })

    timerFunc = function () {
      // 保证0,1 循环变化 赋值
      counter = (counter + 1) % 2
      //  从而改变 textNode 文本节点里面的内容。每次调用 timeFunc 函数，都会主动触发 observer 监听。
      textNode.data = counter
    }
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    // webpack 会试图为一个全局使用的 setImmediate方法，提供一个 shim 兼容代码
    // 为了绕过它提供不必要的 代码，用到全局的window
    const context = inBrowser
      ? window
      : typeof global !== 'undefined' ? global : {}
    // 如果 从 setImmediate 到 setTimeout优雅降级，提供一个公用的回调函数。
    timerFunc = context.setImmediate || setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    // 将传入的回调  push到内部维护的 callbacks 回调队列中
    // 方便后面遍历触发。
    callbacks.push(func)
     // pending 作为 开关，保证每次只会存入一组待执行的异步任务。
    if (pending) return
    pending = true
    // 将即将执行的异步任务，添加到回调队列中去。
    timerFunc(nextTickHandler, 0)
  }
})()
