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
  - 可以使用， 后面通过修改`target.__proto__`的值，改变原型链，重写`target`指向的原型

  ```
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src
    /* eslint-enable no-proto */
  }
  ```

  - 不能使用，同样利用`Object.defineProperty`添加访问器属性，没有使用到`getter/setter`属性，这里添加的是实例属性，会覆盖Array实例上的同名原型属性，达到了重写数组方法的目的
  ```
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      def(target, key, src[key])
    }
  }

  ```

  接着调用这个方法
  ```
  augment(value, arrayMethods, arrayKeys)
  ```

**重点是`arrayMethods`这个对象**，这里重写了数组的方法，包括`'push','pop','shift','unshift','splice','sort','reverse'`等常用的数组方法。
  重写的`arrayMethods`对象，不是一个Array对象，可以看成是通过`Object.create`创建的没有length 属性的Array对象，因为这个对象可以访问Array.prototype。
  ```
  const arrayProto = Array.prototype
  export const arrayMethods = Object.create(arrayProto)

  ```
  `arrayProto`指向了Array对象的原型，方便后面利用原型方法，操作数组，得到结果。

  ```
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
      // 把类数组 arguments 遍历出来，转换成数组。便于后面的apply 传递参数。
      while (i--) {
        args[i] = arguments[i]
      }
      // 利用 数组的原型上的方法，计算出结果。
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

  ```

  上面代码，通过遍历预设的方法数组，重写数组方法。
  `original`得到Array原本的数组方法。然后在`arrayMethods`对象的基础上，定义对应的数组方法，也就是`def`函数里面的内容。

  拿到传入的参数`arguments`，循环遍历参数，转为真实的数组，
  `original.apply(this,args)`触发Array上对应的原型方法，返回结果。后面的`switch`，为了检测如果是`push`,`unshift`,`splice`这些能够向数组插入数据的方法，则同样监听插入的参数。

  `ob.dep.notify()`，拿到Observer对象的实例后，`notify()`函数触发subs数组中所有`watcher`实例的update()方法，更新相关依赖。

  回到`Observer`构造函数里面，刚才是为数组本身添加变异的数组方法，现在`this.observerArray()`方法，遍历数组中每一项，并对每一项进行转换，使用的转换方法，也是`observer`函数。


### 对象类型的转换  ###

 对象类型的转换`this.walk()`,利用`Object.keys`遍历对象中的属性。
 ```
   Observer.prototype.walk = function (obj) {
     var keys = Object.keys(obj)
     for (var i = 0, l = keys.length; i < l; i++) {
       this.convert(keys[i], obj[keys[i]])
     }
   }
 ```

 **将每个属性转化为setter/getter的形式，从而转换对象。** 在`defineReactive`函数中，就是最关键的实现部分。
```
 export function defineReactive (obj, key, val) {

   // 转换为活性
   // 重新定义当前`this.value`对象上的所有属性以及属性值。
   // 创建一个观察者数组，
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
    //当且仅当对象的属性描述可以被改变或者属性可被删除时
   if (property && property.configurable === false) {
     return
   }
   // 提供提前设定好的 getter(访问器函数)  和 setter (设置器函数）；
   // cater for pre-defined getter/setters
   var getter = property && property.get
   var setter = property && property.set

   var childOb = observe(val)
   // 重新定义对象的属性类型
   Object.defineProperty(obj, key, {
     enumerable: true,
     configurable: true,
     get: function reactiveGetter () {
       var value = getter ? getter.call(obj) : val
       // Watcher构造函数中
       // 获取 watch 监听的表达式的值时，
       //首先会把watcher 实例 赋值给 Dep.target
       // 执行表达式，获取被observer 监听的值时，会触发这里的get函数，
       // 将dep 实例自身，传入到Dep.target 对应的watch的addDep 方法中，从而添加到Subs 数组中，完成依赖收集。
       // 表达式执行完成后，Dep.target = null ,清除 watch 实例。
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
       // 通过get 回调收集依赖后，set 方法触发setter 方法或者直接赋值，改变属性值
       同时，为新添加的值，进行数据转换，传入到`observe`中监听
       // 最后，通过 `notify()`通知所有订阅者。
       var value = getter ? getter.call(obj) : val
       if (newVal === value) {
         // value 值没发生改变，则直接返回
         return
       }
       // 通过 setter 设置器或者直接赋值
       if (setter) {
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
 ```
