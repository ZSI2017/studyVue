import { toArray } from '../../util/index'

export default function (Vue) {
  /**
   * Listen on the given `event` with `fn`.
   *
   * 在 给定的 ‘event’ 上绑定 ‘fn’ 回调。
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$on = function (event, fn) {
    (this._events[event] || (this._events[event] = []))
      .push(fn)   // 添加到自己维护的 事件 回调队列中去
    // 同时 在父组件中添加 相应事件的 个数。
    modifyListenerCount(this, event, 1)
    return this
  }

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   *  注册一个事件，仅仅被调用一次
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$once = function (event, fn) {
    var self = this
    // 改造 fn 回调。
    // 在回调触发之前，先删除 事件注册，再触发回调函数。
    function on () {
      self.$off(event, on)
      fn.apply(this, arguments)
    }
    // 保留原始的 回调函数。方便后面 删除 指点回调时比较使用 cb === fn || cb.fn === fn
    on.fn = fn
    this.$on(event, on)
    return this
  }

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$off = function (event, fn) {
    var cbs
    // all 没有传入然后参数，就移除所有的事件回到
    if (!arguments.length) {
      if (this.$parent) {
        for (event in this._events) {
          cbs = this._events[event]
          if (cbs) {
            // 修改所有父类中的 事件回调的 个数，
            modifyListenerCount(this, event, -cbs.length)
          }
        }
      }
      // 清空
      this._events = {}
      return this
    }
    // specific event
    // 传入了参数，就移除指定的回调。
    cbs = this._events[event]
    if (!cbs) {
      // 本身不存在事件 队列中。
      return this
    }
    // 指定了 事件名
    if (arguments.length === 1) {
    // 清空事件名对应的 数组。
      modifyListenerCount(this, event, -cbs.length)
      this._events[event] = null
      return this
    }
    // specific handler
    var cb
    var i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        // 循环遍历 事件名对应的 数组， 删除数组中的指定项。
        modifyListenerCount(this, event, -1)
        cbs.splice(i, 1)
        break
      }
    }
    return this
  }

  /**
   * Trigger an event on self.
   *
   * @param {String|Object} event
   * @return {Boolean} shouldPropagate
   */

  Vue.prototype.$emit = function (event) {
    var isSource = typeof event === 'string'
    // 直接对应字符串类型的事件名，
    // 或者是 不是在当前组件上触发的。可能是经过 包裹后 传播过来的事件 { name: event, source: this }
    event = isSource
      ? event
      : event.name
    var cbs = this._events[event]
    var shouldPropagate = isSource || !cbs
    if (cbs) {
      cbs = cbs.length > 1
        ? toArray(cbs)    // 转化为真正的数组。
        : cbs             //
      // this is a somewhat hacky solution to the question raised
      // in #2102: for an inline component listener like <comp @test="doThis">,
      // the propagation handling is somewhat broken. Therefore we
      // need to treat these inline callbacks differently.
      var hasParentCbs = isSource && cbs.some(function (cb) {
        return cb._fromParent
      })
      // 判断是否为 有 内联的回调，绑定在 子组件上面的事件。。
      if (hasParentCbs) {
        shouldPropagate = false
      }
      var args = toArray(arguments, 1)
      for (var i = 0, l = cbs.length; i < l; i++) {
        var cb = cbs[i]
        // 遍历cbs 触发对应的
        var res = cb.apply(this, args) // return false  会阻止事件冒泡。
        if (res === true && (!hasParentCbs || cb._fromParent)) {
          shouldPropagate = true
        }
      }
    }
    return shouldPropagate
  }

  /**
   * Recursively broadcast an event to all children instances.
   * 递归广播 事件，保证遍历所有的子实例。
   * @param {String|Object} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$broadcast = function (event) {
    var isSource = typeof event === 'string'
    event = isSource
      ? event
      : event.name
    // if no child has registered for this event,
    // then there's no need to broadcast.
    // 通过事件对应的个数，来判断是否有子组件 注册了对应的事件，可以提前结束
    if (!this._eventsCount[event]) return
    var children = this.$children
    // arguments 转换为真实的数组。
    var args = toArray(arguments)
    // 转换为对象的形式，注明事件来源。
    if (isSource) {
      // use object event to indicate non-source emit
      // on children
      // 将事件封装在对象里面，标识是否为本源对象。
      args[0] = { name: event, source: this }
    }
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i]
      // 在 子组件上 传入 event 对象， 利用$emit 触发事件。
      var shouldPropagate = child.$emit.apply(child, args)
      // 如果放回 true ，支持冒泡，则继续使用 $broadcast 向下广播。
      if (shouldPropagate) {
        child.$broadcast.apply(child, args)
      }
    }
    return this
  }

  /**
   * Recursively propagate an event up the parent chain.
   * 递归在其父组件中触发 事件。
   * @param {String} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$dispatch = function (event) {
    // 最先在 当前组件中触发事件。
    // 获取到事件触发后 的返回值，true 表示支持冒泡，false 表示停止向上冒泡。
    var shouldPropagate = this.$emit.apply(this, arguments)
    if (!shouldPropagate) return
    var parent = this.$parent
    var args = toArray(arguments)
    // use object event to indicate non-source emit
    // on parents
    // 通过将event 转换为 对象，来表示是否 非源触发。
    args[0] = { name: event, source: this }
    // 通过 $parent 向上遍历 嵌套的组件。
    // 同样利用事件触发后的返回值，来判断是否继续向上遍历传播事件。
    while (parent) {
      shouldPropagate = parent.$emit.apply(parent, args)
      parent = shouldPropagate
        ? parent.$parent
        : null
    }
    return this
  }

  /**
   * Modify the listener counts on all parents.
   * This bookkeeping allows $broadcast to return early when
   * no child has listened to a certain event.
   * 在当前 组件上，修改所有父组件的 监听器的个数。便于后面父组件向下广播的时候，触发当前组件上的监听回调事件。
   *
   *
   * @param {Vue} vm
   * @param {String} event
   * @param {Number} count
   */

  var hookRE = /^hook:/
  function modifyListenerCount (vm, event, count) {
    var parent = vm.$parent
    // hooks do not get broadcasted so no need
    // to do bookkeeping for them
    // 当前组件触发的钩子函数，不需要广播，所以不需要修改次数。
    if (!parent || !count || hookRE.test(event)) return
    while (parent) {
      // 增加当前事件的 在父组件中 的计数。
      parent._eventsCount[event] =
        (parent._eventsCount[event] || 0) + count
      // 继续向上遍历组件。
      parent = parent.$parent
    }
  }
}
