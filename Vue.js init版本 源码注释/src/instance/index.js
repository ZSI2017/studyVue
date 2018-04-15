import { compile } from '../compiler/index'
import { observe } from '../observer/index'
import Watcher from '../observer/watcher'
import { h, patch } from '../vdom/index'
import { nextTick, isReserved, getOuterHTML } from '../util/index'

export default class Component {
  constructor (options) {
    this.$options = options
    this._data = options.data
    const el = this._el = document.querySelector(options.el)
    // 真实dom转化为ast , 解析指令 ，返回 函数中 包裹 __h__的虚拟dom.

    const render = compile(getOuterHTML(el))
    this._el.innerHTML = ''

    // 代理 this._data 上的所有属性 到 this 上
    // this.xxx === this._data.xxx;
    Object.keys(options.data).forEach(key => this._proxy(key))

    //vue 实例中对应 methods ，存放各种函数方法，
    //利用bind 创建一个新函数，改变里面的this到当前的vue 实例上。
    if (options.methods) {
      Object.keys(options.methods).forEach(key => {
        this[key] = options.methods[key].bind(this)
        console.log(this[key])
      })
    }
    // 对data对象中所有属性都设置 setter/getter 监听器，
    // 或者对里面出现的数组，改写其原型方法，手动触发监听。
    this._ob = observe(options.data)
    // 初始化一个 watchers 数组
    this._watchers = []
    // 利用暴露出来的watch ,监听 虚拟dom 中的变化，触发回调 this._update。
    this._watcher = new Watcher(this, render, this._update)
    // this._watcher.value； 保存着 执行完 render 函数后的 虚拟dom 树。
    this._update(this._watcher.value)
  }

  _update (vtree) {
    //1. 初始化 真实的DOM 树
    // DOM 树 ---》  AST 抽象语法树 ----》编译 指令(v-on/@ v-bind/:  v-if  v-for class props style )，生成 VNode 虚拟DOM ----》 检查到对应的更新————》更新　真实的DOM 树
    //2. 更新 真实的DOM 树。
    // VNOde ----》 检查到对应的更新————》　 反应到真实的DOM树上。
    // 初始化  完成 dom 树的创建
    //
    // 更新  Watcher 监听到data 中数据发生任何变化 ，同样触发 patch ，
    if (!this._tree) {
      // 初始化 渲染时, 还没有 虚拟DOM 树。
      patch(this._el, vtree)
    } else {
      patch(this._tree, vtree)
    }
    // 缓存就的 vnode 对象，
    // 便于下次dom 节点发生改变的时候，进行新旧节点的比较。
    this._tree = vtree
  }

  _renderClass (dynamic, cls) {
    dynamic = dynamic
      ? typeof dynamic === 'string'
        ? dynamic // 只渲染 class 的属性值，对应为true 的class
        : Object.keys(dynamic).filter(key => dynamic[key]).join(' ')
      : ''
      // 将动态绑定的class  和 固定存在的 class拼接到一起。
    return cls
      ? cls + (dynamic ? ' ' + dynamic : '')
      : dynamic
  }

// 扁平化方法，减少数组的嵌套层级。
  __flatten__ (arr) {
    var res = []
    for (var i = 0, l = arr.length; i < l; i++) {
      var e = arr[i]
      // 如果里面一层还是数组，就需要遍历里面数组，
      // 减少数组的嵌套层级。
      if (Array.isArray(e)) {
        for (var j = 0, k = e.length; j < k; j++) {
          if (e[j]) {
            res.push(e[j])
          }
        }
      } else if (e) {
        res.push(e)
      }
    }
    return res
  }

  _proxy (key) {
    // 判断key 值，是否为 vue 内部变量。
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      // 利用 self 存储 this 引用，可能会在 子作用域内被调用。
      var self = this
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return self._data[key]
        },
        set: function proxySetter (val) {
          self._data[key] = val
        }
      })
    }
  }
}

Component.prototype.__h__ = h
Component.nextTick = nextTick
