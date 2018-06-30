import Dep from './dep'
import { arrayMethods } from './array'
import {
  def,
  isArray,
  isPlainObject,
  hasProto,
  hasOwn
} from '../util/index'

// getOwnPropertyNames 返回对象自身 拥有的枚举 和 不可枚举 属性
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However in certain cases, e.g.
 * v-for scope alias and props, we don't want to force conversion
 * because the value may be a nested value under a frozen data structure.
 *
 * So whenever we want to set a reactive property without forcing
 * conversion on the new value, we wrap that call inside this function.
 */

let shouldConvert = true
export function withoutConversion (fn) {
  shouldConvert = false
  fn()
  shouldConvert = true
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
   Observer 连接每个被监听的对象， 一旦建立连接，
   把对象的内部的每个属性转换为setter/getter，
   / 通过isArray 方式，区分将要被监听的value 是 数组 或者 对象。

 * @param {Array|Object} value
 * @constructor
 */

export function Observer (value) {
  this.value = value
  this.dep = new Dep()
  // 将新定义的 Observer 对象，绑定到value 的 '__ob__' 属性上。
  // 方便下次，在 observer 方法中获取，
  def(value, '__ob__', this)
  if (isArray(value)) {
    // 检查 是否可以使用 __proto__ 隐式原型属性，
    // 方便后面直接改写Array 的原型方法。
    // 使用 copyAugment 方法。 直接使用 for..in 遍历target 上所有的原型方法，
    // 利用 def 重写 value 原型上面的所有的 方法。
    var augment = hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
      // 监听数组上的每一项。
    this.observeArray(value)
  } else {
    // 对象。
    //    则遍历对象中的所有的属性，并转化为setter / getter 构造器 类型
    this.walk(value)
  }
}

// Instance methods

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *如果传入的参数是对象，则遍历对象上的每个属性，把他们转换成 getter/setter 构造器的形式。方便监听到每个属性的改变。
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj)
  for (var i = 0, l = keys.length; i < l; i++) {
    // 遍历对象中的所有属性
    this.convert(keys[i], obj[keys[i]])
  }
}

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    // 遍历数组上的每一项，并对items 进行监听。 利用 Observer 类进行实例化 之前的
    // 错误检查判断
    observe(items[i])
  }
}

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  //
  defineReactive(this.value, key, val)
}

/**
 * Add an owner vm, so that when $set/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

Observer.prototype.addVm = function (vm) {
  // 新的vm
  (this.vms || (this.vms = [])).push(vm)
}

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

Observer.prototype.removeVm = function (vm) {
  this.vms.$remove(vm)
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 * 改变 对应的 隐式原型的指向，改变相应的原型链，主要为Array加上自定义的push.shift 等方法。
 * @param {Object|Array} target
 * @param {Object} src
 */

function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @param {Vue} [vm]
 * @return {Observer|undefined}
 * @static
 */

export function observe (value, vm) {

  if (!value || typeof value !== 'object') {
  // 如果即将创建Observer 实例的value 不是对象，直接返回。
    return
  }
  var ob
  if (
    hasOwn(value, '__ob__') &&
    value.__ob__ instanceof Observer
  ) {
    // 如果对应的value 值上，已经挂载__ob__ 标识，
    //表示这个value 已经有一个对应的 observer 实例，
    ob = value.__ob__
  } else if (
    shouldConvert &&
    (isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 上面 else if 判断条件是
    // 1.考虑到 frozen data structure 类型的值，不需要进行强制装换成新值
    // 2.必须是 Array 或者 Object,
    // 3.Object.isExtensible 判断一个对象是否是可扩展（是否可以在它上面添加新的属性。）
    // 3. 非 Vue 构造函数内部值。
    ob = new Observer(value)
  }
  if (ob && vm) {
    // 如果存在vms 数组， vms 数组作用，有待后面确认。
    ob.addVm(vm)
  }
  return ob
}

/**
 * 在对象里面通过 setter getter 构造器定义一个活性属性
 * 每当属性改变时，都会通过对应的 监听数组。
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

export function defineReactive (obj, key, val) {
  var dep = new Dep()

  /**
   *  ES5 Object.getOwnPropertyDescriptor(),返回指定对象上一个自有属性对应的属性描述符。
   *  属性描述符是一个记录，组成：
   *   如果是 访问器属性，则 返回的对象的属性有
   *     configurable,
   *     enumerable（对象属性可以被枚举时，为true）,
   *     get（获取该属性的访问器函数） 和
   *     set（获取该属性的设置 器函数）
   *   如果是数据属性，则 有
   *     configurable(当且仅当对象的属性描述可以被改变或者属性可被删除时，为true),
   *      enumerable,
   *      writable(当且仅仅当属性的值可以改变时为true),
   *      value(该属性的值)
   */
  var property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  // 提供提前设定好的 getter(访问器函数)  和 setter (设置器函数）；
  // cater for pre-defined getter/setters
  var getter = property && property.get
  var setter = property && property.set
  // 如果即将被监听的val值， 也是一个对象，则对该val 继续进行监听。
  var childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
        if (isArray(value)) {
          for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i]
            e && e.__ob__ && e.__ob__.dep.depend()
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val
      if (newVal === value) {
        // value 值没有发生改变， 则直接放回。
        return
      }
      if (setter) {
        // 属性本身带有 setter 设置器，主动触发 setter
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
  // 为 newValue 上的所有属性都加上监听器
      childOb = observe(newVal)
      // 通知观察者队列中所有项
      dep.notify()
    }
  })
}
