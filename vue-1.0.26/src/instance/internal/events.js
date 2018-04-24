import { isSimplePath } from '../../parsers/expression'
import {
  inDoc,
  isArray,
  warn
} from '../../util/index'

// 正则验证 事件绑定。
const eventRE = /^v-on:|^@/

export default function (Vue) {
  /**
   * Setup the instance's option events & watchers.
   * If the value is a string, we pull it from the
   * instance's methods by name.
   *
   * 初始化 options 里面的  events watchers。
   */

  Vue.prototype._initEvents = function () {
    var options = this.$options
    if (options._asComponent) {
      registerComponentEvents(this, options.el)
    }
    registerCallbacks(this, '$on', options.events)
    // 利用 api/data.js 里面注册的 $watch 接口，监听data事件。
    registerCallbacks(this, '$watch', options.watch)
  }

  /**
   * Register v-on events on a child component
   *
   * @param {Vue} vm
   * @param {Element} el
   */

  function registerComponentEvents (vm, el) {
    var attrs = el.attributes
    var name, value, handler
    for (var i = 0, l = attrs.length; i < l; i++) {
      name = attrs[i].name
      if (eventRE.test(name)) {
        name = name.replace(eventRE, '')
        // force the expression into a statement so that
        // it always dynamically resolves the method to call (#2670)
        // kinda ugly hack, but does the job.
        value = attrs[i].value
        if (isSimplePath(value)) {
          value += '.apply(this, $arguments)'
        }
        handler = (vm._scope || vm._context).$eval(value, true)
        handler._fromParent = true
        vm.$on(name.replace(eventRE), handler)
      }
    }
  }

  /**
   * Register callbacks for option events and watchers.
   *
   * @param {Vue} vm        当前vue 实例
   * @param {String} action   $on ， $watch，
   * @param {Object} hash     options.events or options.watch  对象。
   *
   *     registerCallbacks(this, '$on', options.events)
   */

  function registerCallbacks (vm, action, hash) {
    if (!hash) return
    var handlers, key, i, j
    for (key in hash) {
      handlers = hash[key]
      if (isArray(handlers)) {
        // 事件句柄为数组，可以在同一events 上注册多个事件。
        for (i = 0, j = handlers.length; i < j; i++) {
          register(vm, action, key, handlers[i])
        }
      } else {
        // register(this,'$on',key,value)
        // 通过 $on() ,为 events 中每个属性，注册事件回调，
        register(vm, action, key, handlers)
      }
    }
  }

  /**
   * Helper to register an event/watch callback.
   * 注册一个 event/watch  回调。
   * @param {Vue} vm
   * @param {String} action
   * @param {String} key
   * @param {Function|String|Object} handler
   * @param {Object} [options]
   *
   *     registerCallbacks(this, '$on', options.events)
   *       // register(this,'$on',key,value)
   */

  function register (vm, action, key, handler, options) {
    var type = typeof handler
    if (type === 'function') {
      // events 事件对象中 回调。
      // eg ：  vm[$on](events,handler,options)；
      vm[action](key, handler, options)
    } else if (type === 'string') {
      // can also use a string for methods
      // 利用methods 里面的方法。
      var methods = vm.$options.methods
      var method = methods && methods[handler]
      if (method) {
        // 同样找到对应的 方法，利用 $on ，或者 $watch 注册/监听 对应的方法。
        vm[action](key, method, options)
      } else {
        // 否则，抛出异常，不合法的 handler 方法。
        process.env.NODE_ENV !== 'production' && warn(
          'Unknown method: "' + handler + '" when ' +
          'registering callback for ' + action +
          ': "' + key + '".',
          vm
        )
      }
    } else if (handler && type === 'object') {
      // 或者以 对象的形式，涵盖了 options 相关信息，
      // 拆分出对应的 events 事件名。
      register(vm, action, key, handler.handler, handler)
    }
  }

  /**
   * Setup recursive attached/detached calls
   */

  Vue.prototype._initDOMHooks = function () {
    this.$on('hook:attached', onAttached)
    this.$on('hook:detached', onDetached)
  }

  /**
   * Callback to recursively call attached hook on children
   */

  function onAttached () {
    if (!this._isAttached) {
      this._isAttached = true
      this.$children.forEach(callAttach)
    }
  }

  /**
   * Iterator to call attached hook
   *
   * @param {Vue} child
   */

  function callAttach (child) {
    if (!child._isAttached && inDoc(child.$el)) {
      child._callHook('attached')
    }
  }

  /**
   * Callback to recursively call detached hook on children
   */

  function onDetached () {
    if (this._isAttached) {
      this._isAttached = false
      this.$children.forEach(callDetach)
    }
  }

  /**
   * Iterator to call detached hook
   *
   * @param {Vue} child
   */

  function callDetach (child) {
    if (child._isAttached && !inDoc(child.$el)) {
      child._callHook('detached')
    }
  }

  /**
   * Trigger all handlers for a hook
   *  触发钩子函数。
   * @param {String} hook
   */

  Vue.prototype._callHook = function (hook) {
    //触发之前，调用 pre--hook钩子函数。
    this.$emit('pre-hook:' + hook)
    // 拿到触发 对应钩子函数的 回调。
    var handlers = this.$options[hook]
    // 遍历 触发 handlers 中的 回调函数。
    if (handlers) {
      // 触发 用户注册的钩子函数
      for (var i = 0, j = handlers.length; i < j; i++) {
        // 利用 call，传入当前vue 实例， 修改上下文，
        handlers[i].call(this)
      }
    }
    //  触发 在events 选型里面，以 hook: 开头的注册的钩子函数。
    this.$emit('hook:' + hook)
  }
}
