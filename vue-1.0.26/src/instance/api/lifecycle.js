import { warn, query, inDoc } from '../../util/index'
import { compile } from '../../compiler/index'

export default function (Vue) {
  /**
   * Set instance target element and kick off the compilation
   * process. The passed in `el` can be a selector string, an
   * existing Element, or a DocumentFragment (for block
   * instances).
   *   如果传入的选项中 存在 el ,就立刻进入编译，
   *   否则就会通过 $mount  实现html 的编译。
   *  设置 实例 对象的元素，开始编译html 模板，
   * @param {Element|DocumentFragment|string} el
   * @public
   */

  Vue.prototype.$mount = function (el) {
    if (this._isCompiled) {
      // 标识，只能被编译 一次。
      process.env.NODE_ENV !== 'production' && warn(
        '$mount() should be called only once.',
        this
      )
      return
    }
    // 利用 querySelector 找到对应 dom 节点的引用。
    el = query(el)
    // 如果不存在，就创建一个 
    if (!el) {
      el = document.createElement('div')
    }
    this._compile(el)
    this._initDOMHooks()
    if (inDoc(this.$el)) {
      this._callHook('attached')
      ready.call(this)
    } else {
      this.$once('hook:attached', ready)
    }
    return this
  }

  /**
   * Mark an instance as ready.
   */

  function ready () {
    this._isAttached = true
    this._isReady = true
    this._callHook('ready')
  }

  /**
   * Teardown the instance, simply delegate to the internal
   * _destroy.
   *
   * @param {Boolean} remove
   * @param {Boolean} deferCleanup
   */

  Vue.prototype.$destroy = function (remove, deferCleanup) {
    this._destroy(remove, deferCleanup)
  }

  /**
   * Partially compile a piece of DOM and return a
   * decompile function.
   *
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host]
   * @param {Object} [scope]
   * @param {Fragment} [frag]
   * @return {Function}
   */

  Vue.prototype.$compile = function (el, host, scope, frag) {
    return compile(el, this.$options, true)(
      this, el, host, scope, frag
    )
  }
}
