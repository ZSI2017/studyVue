import config from '../config'
import Dep from './dep'
import { pushWatcher } from './batcher'
import {
  extend,
  warn,
  isArray,
  isObject,
  nextTick
} from '../util/index'

let uid = 0

/**
 *  用来解析表达式，收集依赖，在表达式的值改变时，触发回调函数。
 *  主要作用于 $watch 接口 和指令。
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm   // vm 指代 一个Vue 实例。
 * @param {String|Function} expOrFn // 对应一个 字符串，或者是一个计算属性的函数
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep   // watch 的对象 内部属性发生变化时，是否也要触发cb
 *                 - {Boolean} user
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 *                 - {Function} [preProcess]
 *                 - {Function} [postProcess]
 * @constructor
 */

/**
 *  vm.$watch('a.b.c', function (newVal, oldVal) {
 *        // do something
 *   })
 */

export default function Watcher (vm, expOrFn, cb, options) {
  // mix in options
  if (options) {
    extend(this, options)
  }
  var isFn = typeof expOrFn === 'function'
  this.vm = vm
  // 保存 watchers 实例到 vm._watchers 数组里面
  vm._watchers.push(this)

  this.expression = expOrFn
  this.cb = cb
  this.id = ++uid // uid for batching
  this.active = true
  this.dirty = this.lazy // for lazy watchers
  this.deps = []
  this.newDeps = []
  // 创造一个没有原型方法的空对象。
  this.depIds = Object.create(null)
  this.newDepIds = null
  this.prevError = null // for async error stacks
  // parse expression for getter/setter
  if (isFn) {
    // 如果是一个计算属性的函数，则通过 getter 取值器，获取。
    this.getter = expOrFn
    this.setter = undefined
  } else {
    // 目前轻量级的vue
    warn('vue-lite only supports watching functions.')
  }
  this.value = this.lazy
    ? undefined
    : this.get()
  // state for avoiding false triggers for deep and Array
  // watchers during vm._digest()
  this.queued = this.shallow = false
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

Watcher.prototype.get = function () {
  this.beforeGet()
  var scope = this.scope || this.vm
  var value
  try {
  // 如果传入的是 解析指令后的 虚拟dom ,则 触发里面 __h__ 方法。
  // __h__,将编译了指令后的 虚拟dom 对象，转化为 vNode 类型的对象。
 // { sel, data, children, text, elm, key }
    value = this.getter.call(scope, scope)
  } catch (e) {
    if (
      process.env.NODE_ENV !== 'production' &&
      config.warnExpressionErrors
    ) {
      warn(
        'Error when evaluating expression ' +
        '"' + this.expression + '": ' + e.toString(),
        this.vm
      )
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  // deep 配置项，表明捕获对象内的所有内部属性。
  if (this.deep) {
    traverse(value)
  }
  if (this.preProcess) {
    value = this.preProcess(value)
  }
  if (this.filters) {
    value = scope._applyFilters(value, null, this.filters, false)
  }
  if (this.postProcess) {
    value = this.postProcess(value)
  }
  this.afterGet()
  return value
}

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

Watcher.prototype.set = function (value) {
  var scope = this.scope || this.vm
  if (this.filters) {
    value = scope._applyFilters(
      value, this.value, this.filters, true)
  }
  try {
    this.setter.call(scope, scope, value)
  } catch (e) {
    if (
      process.env.NODE_ENV !== 'production' &&
      config.warnExpressionErrors
    ) {
      warn(
        'Error when evaluating setter ' +
        '"' + this.expression + '": ' + e.toString(),
        this.vm
      )
    }
  }
}

/**
 * 为依赖收集做准备。
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
  // 当前 watcher 实例 赋值给 target
  Dep.target = this
  this.newDepIds = Object.create(null)
  // 清空 newDeps 数组。
  this.newDeps.length = 0
}

/**
 * Add a dependency to this directive.
 *  添加一个新的依赖，
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
  var id = dep.id
  // 不同的监听器，维护不同的唯一 监听器数组。通过 id 来标识。
  // 避免为同一属性，添加多个队列。
  if (!this.newDepIds[id]) {
    this.newDepIds[id] = true
    // 将新的 dep 实例放在 newDeps 数组中。
    this.newDeps.push(dep)
    if (!this.depIds[id]) {
      // 将当前的 watcher实例，放入到dep 内部维护的 this.subs;
      // .
      dep.addSub(this)
    }
  }
}

/**
 * Clean up for dependency collection.
 *  清除所有收集到的依赖。
 */

Watcher.prototype.afterGet = function () {
  Dep.target = null
  var i = this.deps.length
  while (i--) {
    var dep = this.deps[i]
    // 通过 this.newDepIds   删除对应 的新的依赖。
    if (!this.newDepIds[dep.id]) {
    //
      dep.removeSub(this)
    }
  }
  this.depIds = this.newDepIds
  var tmp = this.deps
  this.deps = this.newDeps
  this.newDeps = tmp
}

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 *
 * 订阅者 接口，当收集到依赖属性值发生改变时，触发update 事件。
 *
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function (shallow) {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync || !config.async) {
    this.run()
  } else {
    // if queued, only overwrite shallow with non-shallow,
    // but not the other way around.
    this.shallow = this.queued
      ? shallow
        ? this.shallow
        : false
      : !!shallow
    this.queued = true
    // record before-push error stack in debug mode
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.debug) {
      this.prevError = new Error('[vue] async stack trace')
    }
    pushWatcher(this)
  }
}

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

Watcher.prototype.run = function () {
  if (this.active) {
    // 触发get 函数，其中   this.getter.call(scope, scope)
    // 如果传入的  exporFun 是 初始化时的 render 函数，
    // 则这里就重新触发render 函数，重新由虚拟vnode 渲染到 真实DOM,
    var value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated; but only do so if this is a
      // non-shallow update (caused by a vm digest).
      ((isObject(value) || this.deep) && !this.shallow)
    ) {
      // set new value
      var oldValue = this.value
      this.value = value
      // in debug + async mode, when a watcher callbacks
      // throws, we also throw the saved before-push error
      // so the full cross-tick stack trace is available.
      var prevError = this.prevError
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' &&
          config.debug && prevError) {
        this.prevError = null
        try {
          this.cb.call(this.vm, value, oldValue)
        } catch (e) {
          nextTick(function () {
            throw prevError
          }, 0)
          throw e
        }
      } else {
        // 然后调用传入 watcher的回调函数。
        this.cb.call(this.vm, value, oldValue)
      }
    }
    this.queued = this.shallow = false
  }
}

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */

Watcher.prototype.evaluate = function () {
  // avoid overwriting another watcher that is being
  // collected.
  var current = Dep.target
  this.value = this.get()
  this.dirty = false
  Dep.target = current
}

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
  var i = this.deps.length
  while (i--) {
    this.deps[i].depend()
  }
}

/**
 * Remove self from all dependencies' subcriber list.
 */

Watcher.prototype.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      this.vm._watchers.$remove(this)
    }
    var i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }
    this.active = false
    this.vm = this.cb = this.value = null
  }
}

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * 递归地 遍历一个对象，触发所有getters 取值器的修改，为了让所有内部嵌套属性 都能被作为依赖收集到。
 * @param {*} val
 */

function traverse (val) {
  var i, keys
  if (isArray(val)) {
    i = val.length
    while (i--) traverse(val[i])
  } else if (isObject(val)) {
    keys = Object.keys(val)
    i = keys.length
    while (i--) traverse(val[keys[i]])
  }
}
