import Watcher from '../../watcher'
import { compileAndLinkProps } from '../../compiler/index'
import Dep from '../../observer/dep'
import {
  observe,
  defineReactive
} from '../../observer/index'

import {
  warn,
  query,
  hasOwn,
  isReserved,
  isPlainObject,
  bind
} from '../../util/index'

export default function (Vue) {
  /**
   * Accessor for `$data` property, since setting $data
   * requires observing the new object and updating
   * proxied properties.
   * 设置 $data 设置，存取的时候，触发对应的 getter/setter 回调。
   */

  Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    },
    set (newData) {
      if (newData !== this._data) {
        this._setData(newData)
      }
    }
  })

  /**
   * Setup the scope of an instance, which contains:
   * - observed data
   * - computed properties
   * - user methods
   * - meta properties
   */

  Vue.prototype._initState = function () {
    this._initProps()
    this._initMeta()
    this._initMethods()
    this._initData()
    this._initComputed()
  }

  /**
   * Initialize props.
   */

  Vue.prototype._initProps = function () {
    var options = this.$options
    var el = options.el
    var props = options.props
    if (props && !el) {

      process.env.NODE_ENV !== 'production' && warn(
        'Props will not be compiled if no `el` option is ' +
        'provided at instantiation.',
        this
      )
    }
    // make sure to convert string selectors into element now
    // 查询到 dom 节点的引用。
    el = options.el = query(el)
    // nodeType === 1  表示为一个元素节点
    this._propsUnlinkFn = el && el.nodeType === 1 && props
      // props must be linked in proper scope if inside v-for
      ? compileAndLinkProps(this, el, props, this._scope)
      : null
  }

  /**
   * Initialize the data.
   */

  Vue.prototype._initData = function () {
    // 这里dataFn 对应 mergedInstanceDataFn 函数
    var dataFn = this.$options.data
    // 调用dataFn，获取到 data 对象。
    var data = this._data = dataFn ? dataFn() : {}

    if (!isPlainObject(data)) {
      // data 必须为 对象类型。
      data = {}
      process.env.NODE_ENV !== 'production' && warn(
        'data functions should return an object.',
        this
      )
    }
    var props = this._props
    // proxy data on instance
    var keys = Object.keys(data)
    var i, key
    i = keys.length
    while (i--) {
      key = keys[i]
      // there are two scenarios where we can proxy a data key:
      // 1. it's not already defined as a prop
      // 2. it's provided via a instantiation option AND there are no
      //    template prop present
      //    props 中没有这个 key 值，或者 不存在props.
      if (!props || !hasOwn(props, key)) {
        // 转换为 setter/getter 形式。
        this._proxy(key)
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'Data field "' + key + '" is already defined ' +
          'as a prop. To provide default value for a prop, use the "default" ' +
          'prop option; if you want to pass prop values to an instantiation ' +
          'call, use the "propsData" option.',
          this
        )
      }
    }
    // observe data
    //  对 data中的所有属性，进行监听。
    observe(data, this)
  }

  /**
   * Swap the instance's $data. Called in $data's setter.
   *
   * @param {Object} newData
   */

  Vue.prototype._setData = function (newData) {
    newData = newData || {}
    var oldData = this._data
    // 为 this._data 设置新值。
    this._data = newData
    var keys, key, i
    // unproxy keys not present in new data
    keys = Object.keys(oldData)
    i = keys.length
    while (i--) {
      key = keys[i]
      if (!(key in newData)) {
        // 新data 对象中没有该属性，
        // 则可以解除 proxy .
        this._unproxy(key)
      }
    }
    // proxy keys not already proxied,
    // and trigger change for changed values
    keys = Object.keys(newData)
    i = keys.length
    while (i--) {
      key = keys[i]
      // 新 data 中 加入的属性，
      // this Vue 实例上 代理了 this._data 上的属性
      //
      if (!hasOwn(this, key)) {
        // new property
        // 新属性，转换为 setter/getter形式。
        this._proxy(key)
      }
    }
    oldData.__ob__.removeVm(this)
    observe(newData, this)
    this._digest()
  }

  /**
   * Proxy a property, so that
   * vm.prop === vm._data.prop
   * 利用 Object.defineProperty 属性，代理 data 中的 属性，
   * 相应的可以得到 this.prop === this._data.prop 属性。
   * @param {String} key
   */

  Vue.prototype._proxy = function (key) {
    // 对象上当的属性 通过 setter/getter 进行代理，
    // 直接代理到this上，作为实例属性。
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      var self = this
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return self._data[key]
        },
        set: function proxySetter (val) {
          // 触发setter 设置器时，就可以直接为 _data 赋值。
          self._data[key] = val
        }
      })
    }
  }

  /**
   * Unproxy a property.
   *
   * @param {String} key
   */

  Vue.prototype._unproxy = function (key) {
    if (!isReserved(key)) {
      //非 $ 或者 _ 开头的属性，使用 delete 直接删除。
      delete this[key]
    }
  }

  /**
   * Force update on every watcher in scope.
   */

  Vue.prototype._digest = function () {
    for (var i = 0, l = this._watchers.length; i < l; i++) {
      this._watchers[i].update(true) // shallow updates
    }
  }

  /**
   * Setup computed properties. They are essentially
   * special getter/setters
   */

  function noop () {}   // 空函数，方便后面赋值。
  Vue.prototype._initComputed = function () {
    var computed = this.$options.computed
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key]
        var def = {
          enumerable: true,
          configurable: true
        }
        if (typeof userDef === 'function') {
          // 只传入一个 函数，默认为 getter
          def.get = makeComputedGetter(userDef, this)
          def.set = noop
        } else {
          def.get = userDef.get
            ? userDef.cache !== false
              ? makeComputedGetter(userDef.get, this)  // 构建 getter 回调。
              : bind(userDef.get, this)  // 这是使用 非原生的bind ,使得setter/getter 的函数上下文指向vue实例。
            : noop
          def.set = userDef.set
            ? bind(userDef.set, this)
            : noop
        }
        // 将 computed 对象中的属性，定义到 this vue实例上面
        Object.defineProperty(this, key, def)
      }
    }
  }

  function makeComputedGetter (getter, owner) {
    // 实例化一个 Watcher 对象。
    // 传入 lazy:true 参数，表示 computed 计算属性，会利用缓存数据。
    var watcher = new Watcher(owner, getter, null, {
      lazy: true
    })

    return function computedGetter () {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      // 收集依赖。添加到依赖数组里面。
      if (Dep.target) {
        watcher.depend()
      }
      // 返回 getter函数执行后的 结果
      return watcher.value
    }
  }

  /**
   * Setup instance methods. Methods must be bound to the
   * instance since they might be passed down as a prop to
   * child components.
   */

  Vue.prototype._initMethods = function () {
    var methods = this.$options.methods
    if (methods) {
      for (var key in methods) {
        // 绑定 methods 方法中的 作用域 到当前的实例中
        this[key] = bind(methods[key], this)
      }
    }
  }

  /**
   * Initialize meta information like $index, $key & $value.
   */

  Vue.prototype._initMeta = function () {
    var metas = this.$options._meta
    if (metas) {
      for (var key in metas) {
        defineReactive(this, key, metas[key])
      }
    }
  }
}
