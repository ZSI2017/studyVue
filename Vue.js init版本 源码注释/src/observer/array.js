import { def } from '../util/index'

// 创建一个没有 length 属性的 数组对象。
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

// 重写 7个数组常用方法。

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  // 缓存数组的原型方法。
  var original = arrayProto[method]
  // 在数组对象的上定义属性方法。
  def(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // 避免漏掉 传入的参数。
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    // 把类数组 arguments 遍历出来，转换成数组。
    while (i--) {
      args[i] = arguments[i]
    }
    // 利用 数组的原型上的方法，来出来数据。
    var result = original.apply(this, args)
    // 得到 对应data 里面的监听器对象实例
    var ob = this.__ob__
    var inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 检查到有即将插入的数组项，如果数组项是一个可扩展的对象，同样在上面加上对应的监听器
    if (inserted) ob.observeArray(inserted)
    // notify change
    //  遍历 this.subs 监听器队列，也就是hi观察者队列，触发所有的监听器上的更新事件。
    ob.dep.notify()
    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

def(
  arrayProto,
  '$set',
  function $set (index, val) {
    if (index >= this.length) {
      this.length = Number(index) + 1
    }
    return this.splice(index, 1, val)[0]
  }
)

/**
 * Convenience method to remove the element at given index or target element reference.
 *
 * @param {*} item
 */

def(
  arrayProto,
  '$remove',
  function $remove (item) {
    /* istanbul ignore if */
    if (!this.length) return
    var index = this.indexOf(item)
    if (index > -1) {
      return this.splice(index, 1)
    }
  }
)
