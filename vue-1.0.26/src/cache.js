/**
 * A doubly linked list-based Least Recently Used (LRU)
 * cache. Will keep most recently used items while
 * discarding least recently used items when its limit is
 * reached. This is a bare-bone version of
 * Rasmus Andersson's js-lru:
<<<<<<< HEAD
 *
 *   https://github.com/rsms/js-lru
 *
=======
 * 
 *   https://github.com/rsms/js-lru
 * 
>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
 * 内存管理中的一种页面置换算法
 * LRU(Least Recently Used)，最近最少使用，
 * 通常为虚拟也页式存储管理服务的。
 *
 * @param {Number} limit
 * @constructor
 */

export default function Cache (limit) {
  this.size = 0
  this.limit = limit
  this.head = this.tail = undefined
  this._keymap = Object.create(null)
}

var p = Cache.prototype

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var removed

  var entry = this.get(key, true)
  if (!entry) {
    if (this.size === this.limit) {
      removed = this.shift()
    }
    entry = {
      key: key
    }
    this._keymap[key] = entry
    if (this.tail) {
<<<<<<< HEAD
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
  }
  // 将相应的值 存入进去。
  entry.value = value
  // 在空间不足的情况下，removed 会返回被删除的元素，为新元素腾出空间。
=======
      this.tail.newer = entry
      entry.older = this.tail
    } else {
      this.head = entry
    }
    this.tail = entry
    this.size++
  }
  entry.value = value

>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
  return removed
}

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
<<<<<<< HEAD
  //  head 保存着 最老 没有使用的 元素。
  var entry = this.head
  // 如果存在最老的 没有使用的 元素。
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
  // 返回被溢出的 元素。
=======
  var entry = this.head
  if (entry) {
    this.head = this.head.newer
    this.head.older = undefined
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
    this.size--
  }
>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
  return entry
}

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
<<<<<<< HEAD
  var entry = this._keymap[key]  // 通过 key 值 或者到入口。
  if (entry === undefined) return
   // 如果get 对应的值，已经是最新的值，则不用调整对应的链表结构。
=======
  var entry = this._keymap[key]
  if (entry === undefined) return
>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
  if (entry === this.tail) {
    return returnEntry
      ? entry
      : entry.value
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
<<<<<<< HEAD
  if (entry.newer) { //存在 最新的 值。
=======
  if (entry.newer) {
>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
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
<<<<<<< HEAD
  // 最新一次使用的值，会被放在 tail 尾部。
  this.tail = entry
  // 放回 对象，或者 值。
=======
  this.tail = entry
>>>>>>> b7be9ff6ae8808874306d20e2f5fa16ec181b528
  return returnEntry
    ? entry
    : entry.value
}
