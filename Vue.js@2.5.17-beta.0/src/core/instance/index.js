import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 暴露出 声明的 Vue构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    // 如果没有使用 new 方式，调用 Vue 构造函数，里面的this 就会指向 全局（winodw) 或者 undefined(严格模式下)
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化 
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
