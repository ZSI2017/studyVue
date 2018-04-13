import createPatchFunction from './patch'
import h from './h'
import _class from './modules/class'
import style from './modules/style'
import props from './modules/props'
import attrs from './modules/attrs'
import events from './modules/events'

// 传入一个对象数组作为参数。
const patch = createPatchFunction([
  _class, // makes it easy to toggle classes
  props,
  style,
  attrs,
  events
])

export { patch, h }
