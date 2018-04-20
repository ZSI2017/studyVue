## 数据响应式 ##

传入 Vue 实例中的data选项，是一个对象，Vue会遍历这个对象中所有的属性。利用Object.defineProperty把这些属性全部转换为`getter/setter`。

具体转换的过程中，会通过`isArray`判断[区分出数组和对象](https://github.com/vuejs/vue/blob/a879ec06ef9504db8df2a19aac0d07609fe36131/src/observer/index.js#L44)，进行不同类型的属性转换。


首先，在constructor 构造函数中[调用`observe`方法](https://github.com/vuejs/vue/blob/a879ec06ef9504db8df2a19aac0d07609fe36131/src/instance/index.js#L20)。

```
     this._ob = observe(options.data)
```

然后，找到`observe`函数体，
```
export function observe (value, vm) {
  // 在 options.data 对象上 添加 监听器。
  if (!value || typeof value !== 'object') {
    return
  }
  var ob
  if (
    hasOwn(value, '__ob__') &&
    value.__ob__ instanceof Observer
  ) {
    // 如果 observer 已经存在的话，就直接获取。
    // Object.isExtensible 判断一个对象是否是可扩展（是否可以在它上面添加新的属性。）
    ob = value.__ob__
  } else if (
    shouldConvert &&
    (isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (ob && vm) {
    ob.addVm(vm)
  }
  return ob
}
```

`observe`中的`value`对应外部的`options.data`。确保`value`是一个对象，再通过`__ob__`判断value上是否已经被转换了，`__ob__`指向 Observe 实例。

接着判断，`shouldConvert`是否要被转换，`isArray`和`isPlainObject`是否为数组或纯对象，`Object.isExtensible`对象是否可添加新的属性，`value._isVue`是否为内部变量。通过这些判断后，再调用`Observer`构造函数。

```
export function Observer (value) {
  this.value = value
  this.dep = new Dep()
  def(value, '__ob__', this)
  if (isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else {
    this.walk(value)
  }
}
```
`Observer`中，调用一个Dep 构造函数，主要方便后面的依赖收集和触发所有的订阅者。
在 Observer 实例上添加`__ob__`属性，属性值就是`this`，也就是当前的实例，便于转换时判断是否已经被转换了。
重点就是后面的`isArray`区分数组和对象，使用不同的方法进行响应式转换。

### 数组类型的转换  ###

 进入到数组类型的属性转换，首先判断通过[`hasProto`判断](https://github.com/vuejs/vue/blob/a879ec06ef9504db8df2a19aac0d07609fe36131/src/util/env.js#L4)
 ```
 // can we use __proto__?
 export const hasProto = '__proto__' in {}

 ```
 是否能够使用数组上的隐式原型：
  - 可以使用， 后面通过修改`target.__proto__`的值，改变原型链，一次性重写Array上的原型方法

  ```
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src
    /* eslint-enable no-proto */
  }
  ```

  接着调用这个方法
  ```
  augment(value, arrayMethods, arrayKeys)
  ```

  重点，这里重写了数组的方法，包括`'push','pop','shift','unshift','splice','sort','reverse'`等常用的数组方法。
  重写的对象，不是一个Array对象，而是通过`Object.create`创建的没有length 属性的Array对象
  ```
  const arrayProto = Array.prototype
  export const arrayMethods = Object.create(arrayProto)

  ```
  `arrayProto`



  - 不能使用，同样利用`Object.defineProperty`添加访问器属性，没有使用到`getter/setter`属性，这里添加的是实例属性，会覆盖Array 上的同名原型属性，达到了重写数组方法的目的
  ```
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      def(target, key, src[key])
    }
  }

  ```
