import { def, indexOf } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// 创建一个没有 length 属性的 数组对象。
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
    // 避免直接使用 arguments 传递函数
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    // 把类数组 arguments 遍历出来，转换成数组。便于后面的apply 传递参数。
    // 避免使用arguments 直接传递给函数
    while (i--) {
      args[i] = arguments[i]
    }
    // 利用 数组的原型上的方法，计算出结果。
    var result = original.apply(this, args)
    // 得到 对应data 里面（调用数组方法的data）的监听器对象实例
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
    // 检查到有即将插入的数组项，如果数组项是一个可扩展的对象，同样在利用拿到的__ob__属性，对应的
    // Observer 实例上的 observerArray方法，加上对应的监听器
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 遍历 this.subs 监听器队列，也就是观察者队列，触发所有的监听器上的更新事件。
    ob.dep.notify()
    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 * 替换元素，
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

def(
  arrayProto,
  '$set',
  function $set (index, val) {
    if (index >= this.length) {
      // 传入数值较大，则扩大数组的长度。
      this.length = Number(index) + 1
    }
    // 替换数组index 序号对应的数组项，
    // 返回被删除的 数组项
    return this.splice(index, 1, val)[0]
  }
)

/**
 * Convenience method to remove the element at given index or target element reference.
 * 删除数组中传入的 item 项。
 * @param {*} item
 */

def(
  arrayProto,
  '$remove',
  function $remove (item) {
    /* istanbul ignore if */
    if (!this.length) return
    var index = indexOf(this, item)
    if (index > -1) {
      // 同样使用 splice 方法 删除对应的数组项
      return this.splice(index, 1)
    }
  }
)
