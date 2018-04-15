import config from '../config'
import {
  warn,
  nextTick,
  devtools
} from '../util/index'

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.

var queueIndex
var queue = []
var userQueue = []
var has = {}
var circular = {}
var waiting = false
var internalQueueDepleted = false

/**
 * Reset the batcher's state.
 */

function resetBatcherState () {
  queue = []
  userQueue = []
  has = {}
  circular = {}
  waiting = internalQueueDepleted = false
}

/**
 * Flush both queues and run the watchers.
 */

function flushBatcherQueue () {
  runBatcherQueue(queue)
  internalQueueDepleted = true
  runBatcherQueue(userQueue)
  resetBatcherState()
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue (queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
    var watcher = queue[queueIndex]
    var id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    // 阻止死循环 更新。
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      // circular 记录每个watcher 循环更新的次数。
      // 最大次数为 100;
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop for watcher ' +
          'with expression "' + watcher.expression + '"',
          watcher.vm
        )
        break
      }
    }
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

export function pushWatcher (watcher) {
  var id = watcher.id
  if (has[id] == null) {
    if (internalQueueDepleted && !watcher.user) {
      // an internal watcher triggered by a user watcher...
      // let's run it immediately after current user watcher is done.
      userQueue.splice(queueIndex + 1, 0, watcher)
    } else {
      // push watcher into appropriate queue
      // 区分 用户监听watch 和 定义的指令 更新，两个不同的队列。
      var q = watcher.user
        ? userQueue
        : queue
      // 存放 队列长度。
      has[id] = q.length
      // 需要更新的 watcher 放入到指定的队列中。
      q.push(watcher)
      // queue the flush
      //
      if (!waiting) {
        waiting = true
        //通过 nextTick 异步触发 flushBatcherQueue 刷新队列。
        nextTick(flushBatcherQueue)
      }
    }
  }
}
