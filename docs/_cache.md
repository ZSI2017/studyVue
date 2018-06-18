## LRU 缓存策略

在看[vue@1.0.26](../vue-1.0.26/src/cache.js)的版本源码中，发现vue使用了LRU的策略作为缓存，也就我是我们在内存管理中的一种页面置换算法，可以看作最近最少使用算法。

从算法名就可以推测出，每当缓存空间满了以后，都会选择出最近最少使用的那一项删除，为后面缓存项提供空间。

参考的库就是[js-lru](https://github.com/rsms/js-lru),利用双向链表作为基本的数据结构,借用里面的一张图，就看得非常明显了

```txt
           entry             entry             entry             entry        
           ______            ______            ______            ______       
          | head |.newer => |      |.newer => |      |.newer => | tail |      
.oldest = |  A   |          |  B   |          |  C   |          |  D   | = .newest
          |______| <= older.|______| <= older.|______| <= older.|______|      

       removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
```

**上面画出的结构中，每个节点可以当做一个`entry`，当然在cacahe.js 文件里面。每个节点都是一个对象：**
```
  {
    key:
    value:
    older: (head 中值为undefined 或者 无此属性)
    newer: (tail 中值为undefined 或者 无此属性)
  }
```

里面的key 值，作为每个节点的标识， 存在 对象 `this._keymap`中，当使用暴露出的`get`方法时，就可以非常快速的找到对应的`entry`对象。


主要提供了三个接口方法（最好对照[cache.js](../vue-1.0.26/src/cache.js)查看）：
- put:

  存入缓存中，如果存在tail,则放在tail.newser的位置，即为最近访问的一项，然后就把这一项作为双向链表的tail,

  如果没有tail,则表示初始化链表，赋值给head;
  ```
      if (this.tail) {
        // 尾部保存最新 放入的数据。
        this.tail.newer = entry
        entry.older = this.tail
      } else {
        // 如果不存在尾部，则表示链表初始为空，则初始化头部。
        this.head = entry
      }
      // 链表的尾部 则相应的向后移动 一位。
      this.tail = entry
      // 同时 整个链表的总长度 加一；
      this.size++
  ```

- shift：

  删除双向链表中 head 指向的头部，  首先将 `this.head.newer` 作为新的 `head`， 并切断新`head`与老`head`的older 连接， 就可以把老`head`从双向链表中移除；

  ```
  if (entry) {
    // 移除 this.head ，
    this.head = this.head.newer
    this.head.older = undefined
    // 同时 将移除元素的 newer 和 older 都设置为 undefined。
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
    // 整个链表的长度减一。
    this.size--
  }
  ```

- get：

  访问链表中key值对应的`entry`对象，如果访问成功，则除了返回对应的值，还需要将对应的节点挪到 `tail`位置，
  先删除选中节点在原位置上的连接，然后把该节点放在 `tail.newer`的位置，作为新的tail ,因为它是最近被访问的那一项。

  最复杂的就是如何删除选中节点在原位置上的连接。

  如果选中节点是`head`，则 `this.head = entry.newer`,选出新的head,
  并删除在链表中的指向`  entry.newer = undefined // D --x`

  不是`head`，则将选中节点的 entry.old.newer 指向 entry.newer。节点之间的指向就越过了entry ,也就是选中节点。
   ```
   // HEAD--------------TAIL
   //   <.older   .newer>
   //  <--- add direction --
   //   A  B  C  <D>  E
   if (entry.newer) { //存在 最新的 值。
     if (entry === this.head) {
       this.head = entry.newer
     }
     entry.newer.older = entry.older // C <-- E.
   }
   if (entry.older) {
     entry.older.newer = entry.newer // C. --> E
   }
   entry.newer = undefined // D --x
   entry.older = this.tail // D. --> E
   if (this.tail) {
     this.tail.newer = entry // E. <-- D
   }
   ```
