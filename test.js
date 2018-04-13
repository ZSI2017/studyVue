var generate = function() {
   const code = `__h__()`;
   return new Function(`with(this){return ${code}}`)
}

var complie = function() {
  return generate();
}
var render = complie();

function Vue(){
   this.data = {"my":123}
}
Vue.prototype.__h__ = function(){
    console.log("_______hhhhh________")
}

var newVue = new Vue()
