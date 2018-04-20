## 代理 ##
vue 内部,首先把用户输入的 `data`数据，赋值给内部的`_data`属性上（规定以 $ 或者 _ 开头的变量为内部变量或方法）
`this._data = options.data`

再利用[_proxy](https://github.com/vuejs/vue/blob/a879ec06ef9504db8df2a19aac0d07609fe36131/src/instance/index.js#L63)函数，实现代理。

```
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
```
这里的`Object.defineProperty`,是Vue实现响应式的主要方法，利用getter 进行依赖收集，setter方法则可以 通知每一个订阅者更新视图。

将vue 实例上 添加了`options.data`中对应的属性。就可以通过 `this.xxx`直接获取数据，触发`get` 取值器方法，`return self._data[key]`，返回了`options.data`中相关方法。

`this._ob = observe(options.data)`，这里监听`options.data`,也利用了`Object.defineProperty`，
