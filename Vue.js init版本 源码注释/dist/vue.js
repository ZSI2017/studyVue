(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Vue"] = factory();
	else
		root["Vue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1)['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _index2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(3);

	var _index2 = __webpack_require__(7);

	var _watcher = __webpack_require__(19);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _index3 = __webpack_require__(21);

	var _index4 = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Component = function () {
	  function Component(options) {
	    var _this = this;

	    _classCallCheck(this, Component);

	    this.$options = options;
	    this._data = options.data;
	    var el = this._el = document.querySelector(options.el);
	    // 真实dom转化为ast , 解析指令 ，返回 函数中 包裹 __h__的虚拟dom.

	    var render = (0, _index.compile)((0, _index4.getOuterHTML)(el));
	    this._el.innerHTML = '';

	    // 代理 this._data 上的所有属性 到 this 上
	    // this.xxx === this._data.xxx;
	    Object.keys(options.data).forEach(function (key) {
	      return _this._proxy(key);
	    });

	    //vue 实例中对应 methods ，存放各种函数方法，
	    //利用bind 创建一个新函数，改变里面的this到当前的vue 实例上。
	    if (options.methods) {
	      Object.keys(options.methods).forEach(function (key) {
	        _this[key] = options.methods[key].bind(_this);
	        console.log(_this[key]);
	      });
	    }
	    // 对data对象中所有属性都设置 setter/getter 监听器，
	    // 或者对里面出现的数组，改写其原型方法，手动触发监听。
	    this._ob = (0, _index2.observe)(options.data);
	    // 初始化一个 watchers 数组
	    this._watchers = [];
	    // 利用暴露出来的watch ,监听 虚拟dom 中的变化，触发回调 this._update。
	    this._watcher = new _watcher2.default(this, render, this._update);
	    // this._watcher.value； 保存着 执行完 render 函数后的 虚拟dom 树。
	    this._update(this._watcher.value);
	  }

	  _createClass(Component, [{
	    key: '_update',
	    value: function _update(vtree) {
	      //1. 初始化 真实的DOM 树
	      // DOM 树 ---》  AST 抽象语法树 ----》编译 指令(v-on/@ v-bind/:  v-if  v-for class props style )，生成 VNode 虚拟DOM ----》 检查到对应的更新————》更新　真实的DOM 树
	      //2. 更新 真实的DOM 树。
	      // VNOde ----》 检查到对应的更新————》　 反应到真实的DOM树上。
	      // 初始化  完成 dom 树的创建
	      //
	      // 更新  Watcher 监听到data 中数据发生任何变化 ，同样触发 patch ，
	      if (!this._tree) {
	        // 初始化 渲染时, 还没有 虚拟DOM 树。
	        (0, _index3.patch)(this._el, vtree);
	      } else {
	        (0, _index3.patch)(this._tree, vtree);
	      }
	      // 缓存就的 vnode 对象，
	      // 便于下次dom 节点发生改变的时候，进行新旧节点的比较。
	      this._tree = vtree;
	    }
	  }, {
	    key: '_renderClass',
	    value: function _renderClass(dynamic, cls) {
	      dynamic = dynamic ? typeof dynamic === 'string' ? dynamic // 只渲染 class 的属性值，对应为true 的class
	      : Object.keys(dynamic).filter(function (key) {
	        return dynamic[key];
	      }).join(' ') : '';
	      // 将动态绑定的class  和 固定存在的 class拼接到一起。
	      return cls ? cls + (dynamic ? ' ' + dynamic : '') : dynamic;
	    }

	    // 扁平化方法，减少数组的嵌套层级。

	  }, {
	    key: '__flatten__',
	    value: function __flatten__(arr) {
	      var res = [];
	      for (var i = 0, l = arr.length; i < l; i++) {
	        var e = arr[i];
	        // 如果里面一层还是数组，就需要遍历里面数组，
	        // 减少数组的嵌套层级。
	        if (Array.isArray(e)) {
	          for (var j = 0, k = e.length; j < k; j++) {
	            if (e[j]) {
	              res.push(e[j]);
	            }
	          }
	        } else if (e) {
	          res.push(e);
	        }
	      }
	      return res;
	    }
	  }, {
	    key: '_proxy',
	    value: function _proxy(key) {
	      // 判断key 值，是否为 vue 内部变量。
	      if (!(0, _index4.isReserved)(key)) {
	        // need to store ref to self here
	        // because these getter/setters might
	        // be called by child scopes via
	        // prototype inheritance.
	        // 利用 self 存储 this 引用，可能会在 子作用域内被调用。
	        var self = this;
	        Object.defineProperty(self, key, {
	          configurable: true,
	          enumerable: true,
	          get: function proxyGetter() {
	            return self._data[key];
	          },
	          set: function proxySetter(val) {
	            self._data[key] = val;
	          }
	        });
	      }
	    }
	  }]);

	  return Component;
	}();

	exports.default = Component;


	Component.prototype.__h__ = _index3.h;
	Component.nextTick = _index4.nextTick;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compile = compile;

	var _htmlParser = __webpack_require__(4);

	var _codegen = __webpack_require__(5);

	//  https://segmentfault.com/q/1010000009976954
	//  Object.create(null) 没有继承任何原型方法，
	var cache = Object.create(null);

	function compile(html) {
	  html = html.trim();
	  var hit = cache[html];
	  // generate(parse(html)))
	  // 先将dom 树 转化为抽象语法树，利用一个对象，存放dom 树中的所有的节点信息：
	  // let element = {
	  //    tag,
	  //    attrs,
	  //    attrsMap: makeAttrsMap(attrs),
	  //    parent: currentParent,
	  //    children: []
	  //  }
	  //  然后，再解析 里面的指令，生成
	  //  generate - 利用 new Function() ,传入的字符串，解析成 js 语句，放在 compil 中进行编译。
	  return hit || (cache[html] = (0, _codegen.generate)((0, _htmlParser.parse)(html)));
	}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parse = parse;
	exports.default = HTMLParser;
	/**
	 * Convert HTML string to AST
	 * 将传入的 HTML 转化成 抽象语法树，与DOM 结构对应。
	 * @param {String} html
	 * @return {Object}
	 */

	function parse(html) {
	  var root = void 0;
	  var currentParent = void 0;
	  var stack = [];
	  HTMLParser(html, {
	    html5: true,
	    start: function start(tag, attrs, unary) {
	      // 这里封装了抽象语法树的 所有结构。
	      var element = {
	        tag: tag,
	        attrs: attrs,
	        attrsMap: makeAttrsMap(attrs),
	        parent: currentParent,
	        children: []
	      };
	      if (!root) {
	        // 将第一个开始标签 作为根节点。
	        root = element;
	      }
	      if (currentParent) {
	        // 第一个元素节点，作为父节点。
	        currentParent.children.push(element);
	      }
	      if (!unary) {
	        currentParent = element;
	        // 压入到节点栈中。
	        stack.push(element);
	      }
	    },
	    end: function end() {
	      stack.length -= 1;
	      currentParent = stack[stack.length - 1];
	    },
	    chars: function chars(text) {
	      text = currentParent.tag === 'pre' ? text : text.trim() ? text : ' ';
	      currentParent.children.push(text);
	    },
	    comment: function comment() {
	      // noop
	    }
	  });
	  return root;
	}

	function makeAttrsMap(attrs) {
	  // 对象数组，转化为 对象。
	  var map = {};
	  for (var i = 0, l = attrs.length; i < l; i++) {
	    map[attrs[i].name] = attrs[i].value;
	  }
	  return map;
	}

	/*!
	 * HTML Parser By John Resig (ejohn.org)
	 * Modified by Juriy "kangax" Zaytsev
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 */

	/*
	 * // Use like so:
	 * HTMLParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 */

	/* global ActiveXObject, DOMDocument */

	function makeMap(values) {
	  values = values.split(/,/);
	  var map = {};
	  values.forEach(function (value) {
	    map[value] = 1;
	  });
	  return function (value) {
	    // 利用闭包，保存不同类型的元素数组对应的 map值。
	    // 进行判断时，就可以直接使用。
	    return map[value.toLowerCase()] === 1;
	  };
	}

	// Regular Expressions for parsing tags and attributes
	var singleAttrIdentifier = /([^\s"'<>\/=]+)/,
	    singleAttrAssign = /=/,
	    singleAttrAssigns = [singleAttrAssign],
	    singleAttrValues = [
	// attr value double quotes
	/"([^"]*)"+/.source,
	// attr value, single quotes
	/'([^']*)'+/.source,
	// attr value, no quotes
	/([^\s"'=<>`]+)/.source],
	    qnameCapture = function () {
	  // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
	  // but for Vue templates we can enforce a simple charset
	  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
	  return '((?:' + ncname + '\\:)?' + ncname + ')';
	}(),
	    startTagOpen = new RegExp('^<' + qnameCapture),
	    startTagClose = /^\s*(\/?)>/,
	    endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>'),
	    doctype = /^<!DOCTYPE [^>]+>/i;

	var IS_REGEX_CAPTURING_BROKEN = false;
	'x'.replace(/x(.)?/g, function (m, g) {
	  IS_REGEX_CAPTURING_BROKEN = g === '';
	});

	// Empty Elements
	// 不包裹任何内容的空元素。
	var empty = makeMap('area,base,basefont,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr');

	// Inline Elements
	//  内联元素
	var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var');

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	// 自关闭的 元素
	var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

	// Attributes that have their values filled in disabled='disabled'
	// 能够使用 disabled = "disabled"属性。 直接简写为 disabled;
	var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

	// Special Elements (can contain anything)
	// 包裹任何元素的 特殊元素。
	var special = makeMap('script,style');

	// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
	// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
	var nonPhrasing = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track');

	var reCache = {};

	function attrForHandler(handler) {
	  var pattern = singleAttrIdentifier.source + '(?:\\s*(' + joinSingleAttrAssigns(handler) + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?';
	  return new RegExp('^\\s*' + pattern);
	}

	/(?:=)/;
	// "(?:=)" 正则匹配 赋值语句
	//
	function joinSingleAttrAssigns(handler) {
	  return singleAttrAssigns.map(function (assign) {
	    return '(?:' + assign.source + ')';
	  }).join('|');
	}

	function HTMLParser(html, handler) {
	  var stack = [],
	      lastTag;
	  var attribute = attrForHandler(handler);
	  var last, prevTag, nextTag;
	  while (html) {
	    last = html;
	    // Make sure we're not in a script or style element
	    // 非特殊符号
	    if (!lastTag || !special(lastTag)) {
	      // 文本内容 结束的位置。
	      var textEnd = html.indexOf('<');
	      if (textEnd === 0) {
	        // Comment: 是否为 注释节点。
	        if (/^<!--/.test(html)) {
	          var commentEnd = html.indexOf('-->');

	          if (commentEnd >= 0) {
	            if (handler.comment) {
	              // 传入的 handler中，如果有对注释的出来，就传入回调中去。
	              handler.comment(html.substring(4, commentEnd));
	            }
	            html = html.substring(commentEnd + 3);
	            prevTag = '';
	            continue;
	          }
	        }

	        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
	        // 关于IE条件注释
	        // <![if !IE]>
	        //<link href="non-ie.css" rel="stylesheet">
	        // <![endif]>
	        if (/^<!\[/.test(html)) {
	          var conditionalEnd = html.indexOf(']>');

	          if (conditionalEnd >= 0) {
	            if (handler.comment) {
	              handler.comment(html.substring(2, conditionalEnd + 1), true /* non-standard */);
	            }
	            html = html.substring(conditionalEnd + 2);
	            prevTag = '';
	            continue;
	          }
	        }

	        // Doctype:
	        // 对于文档类型 的 节点处理
	        var doctypeMatch = html.match(doctype);
	        if (doctypeMatch) {
	          if (handler.doctype) {
	            handler.doctype(doctypeMatch[0]);
	          }
	          html = html.substring(doctypeMatch[0].length);
	          prevTag = '';
	          continue;
	        }

	        // End tag:
	        var endTagMatch = html.match(endTag);
	        if (endTagMatch) {
	          html = html.substring(endTagMatch[0].length);
	          endTagMatch[0].replace(endTag, parseEndTag);
	          prevTag = '/' + endTagMatch[1].toLowerCase();
	          continue;
	        }

	        // Start tag:
	        var startTagMatch = parseStartTag(html);
	        if (startTagMatch) {
	          html = startTagMatch.rest;
	          // 抽离出开始标签中的 tagName ,attrs，等关键字段，交给 handleStartTag 处理
	          handleStartTag(startTagMatch);
	          prevTag = startTagMatch.tagName.toLowerCase();
	          continue;
	        }
	      }

	      var text;
	      if (textEnd >= 0) {
	        text = html.substring(0, textEnd);
	        html = html.substring(textEnd);
	      } else {
	        text = html;
	        html = '';
	      }

	      // next tag
	      var nextTagMatch = parseStartTag(html);
	      if (nextTagMatch) {
	        nextTag = nextTagMatch.tagName;
	      } else {
	        nextTagMatch = html.match(endTag);
	        if (nextTagMatch) {
	          nextTag = '/' + nextTagMatch[1];
	        } else {
	          nextTag = '';
	        }
	      }

	      if (handler.chars) {
	        handler.chars(text, prevTag, nextTag);
	      }
	      prevTag = '';
	    } else {
	      var stackedTag = lastTag.toLowerCase();
	      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)</' + stackedTag + '[^>]*>', 'i'));

	      html = html.replace(reStackedTag, function (all, text) {
	        if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
	          text = text.replace(/<!--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
	        }

	        if (handler.chars) {
	          handler.chars(text);
	        }

	        return '';
	      });

	      parseEndTag('</' + stackedTag + '>', stackedTag);
	    }

	    if (html === last) {
	      throw new Error('Parse Error: ' + html);
	    }
	  }

	  if (!handler.partialMarkup) {
	    // Clean up any remaining tags
	    parseEndTag();
	  }

	  function parseStartTag(input) {
	    var start = input.match(startTagOpen);
	    if (start) {
	      var match = {
	        tagName: start[1],
	        attrs: []
	        // 开始查找 元素 节点上的相关属性。
	      };input = input.slice(start[0].length);
	      //
	      var end, attr;
	      // 截止到 开始的闭合标签，查找所有的 属性。
	      while (!(end = input.match(startTagClose)) && (attr = input.match(attribute))) {
	        input = input.slice(attr[0].length);
	        // 将所有的属性都push到数组中去。
	        match.attrs.push(attr);
	      }
	      // 捕获到了 开始标签中的 闭合 >
	      if (end) {
	        match.unarySlash = end[1];
	        match.rest = input.slice(end[0].length);
	        return match;
	      }
	    }
	  }

	  function handleStartTag(match) {
	    var tagName = match.tagName;
	    var unarySlash = match.unarySlash;

	    if (handler.html5 && lastTag === 'p' && nonPhrasing(tagName)) {
	      parseEndTag('', lastTag);
	    }

	    if (!handler.html5) {
	      while (lastTag && inline(lastTag)) {
	        parseEndTag('', lastTag);
	      }
	    }

	    // 如果是 自闭合的标签。
	    if (closeSelf(tagName) && lastTag === tagName) {
	      parseEndTag('', tagName);
	    }

	    // 一元标签： 中间没有内容 ，  或者是html根标签，    没有闭合标签，
	    var unary = empty(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

	    var attrs = match.attrs.map(function (args) {

	      // 针对 ff 中的 bug  hack
	      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
	      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
	        if (args[3] === '') {
	          delete args[3];
	        }
	        if (args[4] === '') {
	          delete args[4];
	        }
	        if (args[5] === '') {
	          delete args[5];
	        }
	      }
	      // 把相应的属性，转化为 键值对的形式，存在新的数组中 attrs；
	      return {
	        name: args[1],
	        value: args[3] || args[4] || (args[5] && fillAttrs(args[5]) ? name : '')
	      };
	    });

	    if (!unary) {
	      stack.push({ tag: tagName, attrs: attrs });
	      lastTag = tagName;
	      unarySlash = '';
	    }
	    // 最后交给 初始化时，传入的 处理start 的回调函数。
	    if (handler.start) {
	      handler.start(tagName, attrs, unary, unarySlash);
	    }
	  }

	  function parseEndTag(tag, tagName) {
	    var pos;

	    // Find the closest opened tag of the same type
	    // 查找最接近的 开始标签
	    if (tagName) {
	      var needle = tagName.toLowerCase();
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos].tag.toLowerCase() === needle) {
	          break;
	        }
	      }
	    }
	    // If no tag name is provided, clean shop
	    else {
	        pos = 0;
	      }

	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (var i = stack.length - 1; i >= pos; i--) {
	        if (handler.end) {
	          handler.end(stack[i].tag, stack[i].attrs, i > pos || !tag);
	        }
	      }

	      // Remove the open elements from the stack
	      stack.length = pos;
	      lastTag = pos && stack[pos - 1].tag;
	    } else if (tagName.toLowerCase() === 'br') {
	      if (handler.start) {
	        handler.start(tagName, [], true, '');
	      }
	    } else if (tagName.toLowerCase() === 'p') {
	      if (handler.start) {
	        handler.start(tagName, [], false, '', true);
	      }
	      if (handler.end) {
	        handler.end(tagName, []);
	      }
	    }
	  }
	}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generate = generate;

	var _textParser = __webpack_require__(6);

	var bindRE = /^:|^v-bind:/;
	var onRE = /^@|^v-on:/;
	var mustUsePropsRE = /^(value|selected|checked|muted)$/;

	function generate(ast) {
	  var code = genElement(ast);
	  return new Function('with (this) { return ' + code + '}');
	}

	function genElement(el, key) {
	  var exp = void 0;
	  if (exp = getAttr(el, 'v-for')) {
	    // 对应的找到了 'v-for'指令。
	    return genFor(el, exp);
	  } else if (exp = getAttr(el, 'v-if')) {
	    return genIf(el, exp);
	  } else if (el.tag === 'template') {
	    return genChildren(el);
	  } else {
	    return '__h__(\'' + el.tag + '\', ' + genData(el, key) + ', ' + genChildren(el) + ')';
	  }
	}

	function genIf(el, exp) {
	  return '(' + exp + ') ? ' + genElement(el) + ' : \'\'';
	}

	function genFor(el, exp) {
	  // v-for = "item in lists"
	  var inMatch = exp.match(/([a-zA-Z_][\w]*)\s+(?:in|of)\s+(.*)/);
	  // 如果在 v-for  中 不匹配 上面正则，则抛出异常
	  if (!inMatch) {
	    throw new Error('Invalid v-for expression: ' + exp);
	  }
	  // 获取到 遍历 的数组中每一项的 别称。
	  var alias = inMatch[1].trim();
	  // 获取到即将遍历的数组。
	  exp = inMatch[2].trim();
	  // track-by 为即将渲染出的每一项 定义一个 key 值。
	  var key = el.attrsMap['track-by'] || 'undefined';
	  // 对 数组中的每一项 遍历 查找里面的 "v-" 指令。
	  return '(' + exp + ').map(function (' + alias + ', $index) {return ' + genElement(el, key) + '})';
	}

	function genData(el, key) {
	  if (!el.attrs.length) {
	    return '{}';
	  }
	  var data = key ? '{key:' + key + ',' : '{';
	  if (el.attrsMap[':class'] || el.attrsMap['class']) {
	    data += 'class: _renderClass(' + el.attrsMap[':class'] + ', "' + (el.attrsMap['class'] || '') + '"),';
	  }
	  var attrs = 'attrs:{';
	  var props = 'props:{';
	  var hasAttrs = false;
	  var hasProps = false;
	  // 遍历 元素节点上的attr 属性 数组， 正则匹配里面的 指令。
	  for (var i = 0, l = el.attrs.length; i < l; i++) {
	    var attr = el.attrs[i];
	    var name = attr.name;
	    // 通过 “v-bind” 或者 ":"绑定的属性。
	    if (bindRE.test(name)) {
	      // 替换掉 v-bind 或者 “:”等 绑定 指令。
	      name = name.replace(bindRE, '');
	      if (name === 'class') {
	        continue;
	      } else if (name === 'style') {
	        data += 'style: ' + attr.value + ',';
	      } else if (mustUsePropsRE.test(name)) {
	        // 是否为表单的 prop 属性  eg: value|selected|checked|muted
	        hasProps = true;
	        props += '"' + name + '": (' + attr.value + '),';
	      } else {
	        // 元素节点上的属性。
	        hasAttrs = true;
	        attrs += '"' + name + '": (' + attr.value + '),';
	      }
	    } else if (onRE.test(name)) {
	      // 通过 ^@|^v-on:  绑定的事件。
	      name = name.replace(onRE, '');
	      // TODO
	    } else if (name !== 'class') {
	      // 或者是一些 自定义 的属性，绑定到元素上面。
	      hasAttrs = true;
	      attrs += '"' + name + '": (' + JSON.stringify(attr.value) + '),';
	    }
	  }

	  if (hasAttrs) {
	    // 含有属性情况下， 去除最后的 “，”,所有属性合成一个对象。
	    data += attrs.slice(0, -1) + '},';
	  }
	  if (hasProps) {
	    // 同样在含有表单属性情况下， 去除最后的 “，”,所有属性合成一个对象。
	    data += props.slice(0, -1) + '},';
	  }
	  // 把所有 的 attrs props class 合成一个更大的对象。
	  return data.replace(/,$/, '') + '}';
	}

	function genChildren(el) {
	  if (!el.children.length) {
	    return 'undefined';
	  }
	  // genNode 递归遍历里面的子对象，即子节点。
	  // __flatten__() 扁平化方法，减少数组的嵌套层级。
	  // 不管嵌套多深的 数组，都解析出来，通过 join(",")放在一个数组里面。
	  //
	  return '__flatten__([' + el.children.map(genNode).join(',') + '])';
	}

	function genNode(node) {
	  if (node.tag) {
	    //
	    return genElement(node);
	  } else {
	    return genText(node);
	  }
	}

	function genText(text) {
	  if (text === ' ') {
	    return '" "';
	  } else {
	    var exp = (0, _textParser.parseText)(text);
	    if (exp) {
	      return 'String(' + escapeNewlines(exp) + ')';
	    } else {
	      return escapeNewlines(JSON.stringify(text));
	    }
	  }
	}

	function escapeNewlines(str) {
	  return str.replace(/\n/g, '\\n');
	}

	function getAttr(el, attr) {
	  var val = void 0;
	  // 在 AST 的 attrsMap 对象 和 attrs 数组中，找到对应是属性，并移除对应的属性。
	  if (val = el.attrsMap[attr]) {
	    el.attrsMap[attr] = null;
	    for (var i = 0, l = el.attrs.length; i < l; i++) {
	      if (el.attrs[i].name === attr) {
	        el.attrs.splice(i, 1);
	        break;
	      }
	    }
	  }
	  return val;
	}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parseText = parseText;
	var tagRE = /\{\{((?:.|\\n)+?)\}\}/g;

	function parseText(text) {
	  if (!tagRE.test(text)) {
	    return null;
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, value;
	  /* eslint-disable no-cond-assign */
	  while (match = tagRE.exec(text)) {
	    /* eslint-enable no-cond-assign */
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
	    }
	    // tag token
	    value = match[1];
	    tokens.push('(' + match[1].trim() + ')');
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push(JSON.stringify(text.slice(lastIndex)));
	  }
	  return tokens.join('+');
	}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.withoutConversion = withoutConversion;
	exports.Observer = Observer;
	exports.observe = observe;
	exports.defineReactive = defineReactive;

	var _dep = __webpack_require__(8);

	var _dep2 = _interopRequireDefault(_dep);

	var _array = __webpack_require__(9);

	var _index = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// getOwnPropertyNames() 方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
	// 不包括原型链上的属性，如果你只要获取到可枚举属性，查看Object.keys或用for...in循环（还会获取到原型链上的可枚举属性
	var arrayKeys = Object.getOwnPropertyNames(_array.arrayMethods);

	/**
	 * By default, when a reactive property is set, the new value is
	 * also converted to become reactive. However in certain cases, e.g.
	 * v-for scope alias and props, we don't want to force conversion
	 * because the value may be a nested value under a frozen data structure.
	 *
	 * So whenever we want to set a reactive property without forcing
	 * conversion on the new value, we wrap that call inside this function.
	 */

	var shouldConvert = true;
	function withoutConversion(fn) {
	  shouldConvert = false;
	  fn();
	  shouldConvert = true;
	}

	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @constructor
	 */

	// hasProto  can we use __proto__?
	function Observer(value) {
	  this.value = value;
	  this.dep = new _dep2.default();
	  (0, _index.def)(value, '__ob__', this);
	  if ((0, _index.isArray)(value)) {
	    var augment = _index.hasProto ? protoAugment : copyAugment;
	    augment(value, _array.arrayMethods, arrayKeys);
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	}

	// Instance methods

	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 *
	 *  如果传入的参数是对象，则遍历对象上的每个属性，把他们转换成 getter/setter 构造器的形式。方便监听到每个属性的改变。
	 * @param {Object} obj
	 */

	Observer.prototype.walk = function (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    this.convert(keys[i], obj[keys[i]]);
	  }
	};

	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */

	Observer.prototype.observeArray = function (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};

	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	Observer.prototype.convert = function (key, val) {
	  defineReactive(this.value, key, val);
	};

	/**
	 * Add an owner vm, so that when $set/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */

	Observer.prototype.addVm = function (vm) {
	  (this.vms || (this.vms = [])).push(vm);
	};

	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */

	Observer.prototype.removeVm = function (vm) {
	  this.vms.$remove(vm);
	};

	// helpers

	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 * 改变 对应的 隐式原型的指向，改变相应的原型链，主要为Array加上自定义的push.shift 等方法。
	 * @param {Object|Array} target
	 * @param {Object} src
	 */

	function protoAugment(target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}

	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function copyAugment(target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    (0, _index.def)(target, key, src[key]);
	  }
	}

	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @param {Vue} [vm]
	 * @return {Observer|undefined}
	 * @static
	 */

	function observe(value, vm) {
	  // 在 options.data 对象上 添加 监听器。
	  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
	    return;
	  }
	  var ob;
	  if ((0, _index.hasOwn)(value, '__ob__') && value.__ob__ instanceof Observer) {
	    // 如果 observer 已经存在的话，就直接获取。
	    // Object.isExtensible 判断一个对象是否是可扩展（是否可以在它上面添加新的属性。）
	    ob = value.__ob__;
	  } else if (shouldConvert && ((0, _index.isArray)(value) || (0, _index.isPlainObject)(value)) && Object.isExtensible(value) && !value._isVue) {
	    ob = new Observer(value);
	  }
	  if (ob && vm) {
	    ob.addVm(vm);
	  }
	  return ob;
	}

	/**
	 * Define a reactive property on an Object.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 */

	function defineReactive(obj, key, val) {

	  // 转换为活性
	  // 重新定义当前`this.value`对象上的所有属性以及属性值。
	  // 创建一个观察者数组，
	  var dep = new _dep2.default();
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
	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  //当且仅当对象的属性描述可以被改变或者属性可被删除时
	  if (property && property.configurable === false) {
	    return;
	  }
	  // 提供提前设定好的 getter(访问器函数)  和 setter (设置器函数）；
	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;

	  var childOb = observe(val);
	  // 重新定义对象的属性类型
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter() {
	      var value = getter ? getter.call(obj) : val;
	      if (_dep2.default.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	        }
	        if ((0, _index.isArray)(value)) {
	          for (var e, i = 0, l = value.length; i < l; i++) {
	            e = value[i];
	            e && e.__ob__ && e.__ob__.dep.depend();
	          }
	        }
	      }
	      return value;
	    },
	    set: function reactiveSetter(newVal) {
	      var value = getter ? getter.call(obj) : val;
	      if (newVal === value) {
	        // value 值没发生改变，则直接返回
	        return;
	      }
	      // 通过 setter 设置器或者直接赋值
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      // 为 newValue 上的所有属性都加上监听器
	      childOb = observe(newVal);
	      // 通知观察者队列中所有项
	      dep.notify();
	    }
	  });
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Dep;
	var uid = 0;

	// 定义一个观察者队列, 里面 暂存 watcher 数组。

	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */

	function Dep() {
	  // 使用 uid 来对 大量的 dep 实例进行区分。
	  this.id = uid++;
	  this.subs = [];
	}

	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null;

	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	Dep.prototype.addSub = function (sub) {
	  // 添加监听者
	  this.subs.push(sub);
	};

	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	Dep.prototype.removeSub = function (sub) {
	  // 移除监听者。
	  // vue 内部重写了 Array.prototype 原型方法。
	  // 添加了 $remove , 删除数组中的 指定项。
	  this.subs.$remove(sub);
	};

	/**
	 * Add self as a dependency to the target watcher.
	 */

	Dep.prototype.depend = function () {
	  Dep.target.addDep(this);
	};

	/**
	 * Notify all subscribers of a new value.
	 */

	Dep.prototype.notify = function () {
	  // stablize the subscriber list first
	  var subs = this.subs.slice();
	  for (var i = 0, l = subs.length; i < l; i++) {
	    // 触发所有监听者watcher 实例上的 更新方法。
	    subs[i].update();
	  }
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.arrayMethods = undefined;

	var _index = __webpack_require__(10);

	// 创建一个没有 length 属性的 数组对象。
	var arrayProto = Array.prototype;
	var arrayMethods = exports.arrayMethods = Object.create(arrayProto)

	/**
	 * Intercept mutating methods and emit events
	 */

	// 重写 7个数组常用方法。

	;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	  // cache original method
	  // 缓存数组的原型方法。
	  var original = arrayProto[method];
	  // 在数组对象的上定义属性方法。
	  (0, _index.def)(arrayMethods, method, function mutator() {
	    // avoid leaking arguments:
	    // 避免漏掉 传入的参数。
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length;
	    var args = new Array(i);
	    // 把类数组 arguments 遍历出来，转换成数组。
	    while (i--) {
	      args[i] = arguments[i];
	    }
	    // 利用 数组的原型上的方法，来出来数据。
	    var result = original.apply(this, args);
	    // 得到 对应data 里面的监听器对象实例
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	        inserted = args;
	        break;
	      case 'unshift':
	        inserted = args;
	        break;
	      case 'splice':
	        inserted = args.slice(2);
	        break;
	    }
	    // 检查到有即将插入的数组项，如果数组项是一个可扩展的对象，同样在上面加上对应的监听器
	    if (inserted) ob.observeArray(inserted);
	    // notify change
	    //  遍历 this.subs 监听器队列，也就是hi观察者队列，触发所有的监听器上的更新事件。
	    ob.dep.notify();
	    return result;
	  });
	});

	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */

	(0, _index.def)(arrayProto, '$set', function $set(index, val) {
	  if (index >= this.length) {
	    this.length = Number(index) + 1;
	  }
	  return this.splice(index, 1, val)[0];
	});

	/**
	 * Convenience method to remove the element at given index or target element reference.
	 *
	 * @param {*} item
	 */

	(0, _index.def)(arrayProto, '$remove', function $remove(item) {
	  /* istanbul ignore if */
	  if (!this.length) return;
	  var index = this.indexOf(item);
	  if (index > -1) {
	    return this.splice(index, 1);
	  }
	});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _lang = __webpack_require__(11);

	Object.keys(_lang).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _lang[key];
	    }
	  });
	});

	var _env = __webpack_require__(12);

	Object.keys(_env).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _env[key];
	    }
	  });
	});

	var _dom = __webpack_require__(13);

	Object.keys(_dom).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _dom[key];
	    }
	  });
	});

	var _options = __webpack_require__(17);

	Object.keys(_options).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _options[key];
	    }
	  });
	});

	var _component = __webpack_require__(18);

	Object.keys(_component).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _component[key];
	    }
	  });
	});

	var _debug = __webpack_require__(16);

	Object.keys(_debug).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _debug[key];
	    }
	  });
	});

	var _index = __webpack_require__(7);

	Object.defineProperty(exports, 'defineReactive', {
	  enumerable: true,
	  get: function get() {
	    return _index.defineReactive;
	  }
	});

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.isPrimitive = isPrimitive;
	exports.set = set;
	exports.del = del;
	exports.hasOwn = hasOwn;
	exports.isLiteral = isLiteral;
	exports.isReserved = isReserved;
	exports._toString = _toString;
	exports.toNumber = toNumber;
	exports.toBoolean = toBoolean;
	exports.stripQuotes = stripQuotes;
	exports.camelize = camelize;
	exports.hyphenate = hyphenate;
	exports.classify = classify;
	exports.bind = bind;
	exports.toArray = toArray;
	exports.extend = extend;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.def = def;
	exports.debounce = debounce;
	exports.indexOf = indexOf;
	exports.cancellable = cancellable;
	exports.looseEqual = looseEqual;
	function isPrimitive(s) {
	  // 判断是否为原始数据类型，
	  return typeof s === 'string' || typeof s === 'number';
	}

	/**
	 * Set a property on an object. Adds the new property and
	 * triggers change notification if the property doesn't
	 * already exist.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	function set(obj, key, val) {
	  if (hasOwn(obj, key)) {
	    obj[key] = val;
	    return;
	  }
	  if (obj._isVue) {
	    set(obj._data, key, val);
	    return;
	  }
	  var ob = obj.__ob__;
	  if (!ob) {
	    obj[key] = val;
	    return;
	  }
	  ob.convert(key, val);
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._proxy(key);
	      vm._digest();
	    }
	  }
	  return val;
	}

	/**
	 * Delete a property and trigger change if necessary.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 */

	function del(obj, key) {
	  if (!hasOwn(obj, key)) {
	    return;
	  }
	  delete obj[key];
	  var ob = obj.__ob__;
	  if (!ob) {
	    return;
	  }
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._unproxy(key);
	      vm._digest();
	    }
	  }
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	 * Check whether the object has the property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Boolean}
	 */
	function hasOwn(obj, key) {
	  return hasOwnProperty.call(obj, key);
	}

	/**
	 * Check if an expression is a literal value.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */

	var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
	function isLiteral(exp) {
	  return literalValueRE.test(exp);
	}

	/**
	 * Check if a string starts with $ or _
	 * 检查一个 字符串是否 以 $ 或者 _ 开头，规定 $ ,_ 开头的为vue 内部变量或方法。不会进行属性监听
	 * @param {String} str
	 * @return {Boolean}
	 */

	function isReserved(str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F;
	}

	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */

	function _toString(value) {
	  return value == null ? '' : value.toString();
	}

	/**
	 * Check and convert possible numeric strings to numbers
	 * before setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */

	function toNumber(value) {
	  if (typeof value !== 'string') {
	    return value;
	  } else {
	    var parsed = Number(value);
	    return isNaN(parsed) ? value : parsed;
	  }
	}

	/**
	 * Convert string boolean literals into real booleans.
	 *
	 * @param {*} value
	 * @return {*|Boolean}
	 */

	function toBoolean(value) {
	  return value === 'true' ? true : value === 'false' ? false : value;
	}

	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */

	function stripQuotes(str) {
	  var a = str.charCodeAt(0);
	  var b = str.charCodeAt(str.length - 1);
	  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}

	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var camelizeRE = /-(\w)/g;
	function camelize(str) {
	  return str.replace(camelizeRE, toUpper);
	}

	function toUpper(_, c) {
	  return c ? c.toUpperCase() : '';
	}

	/**
	 * Hyphenate a camelCase string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var hyphenateRE = /([a-z\d])([A-Z])/g;
	function hyphenate(str) {
	  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}

	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var classifyRE = /(?:^|[-_\/])(\w)/g;
	function classify(str) {
	  return str.replace(classifyRE, toUpper);
	}

	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */

	function bind(fn, ctx) {
	  return function (a) {
	    var l = arguments.length;
	    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
	  };
	}

	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */

	function toArray(list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret;
	}

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	function extend(to, from) {
	  var keys = Object.keys(from);
	  var i = keys.length;
	  while (i--) {
	    to[keys[i]] = from[keys[i]];
	  }
	  return to;
	}

	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	function isObject(obj) {
	  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	function isPlainObject(obj) {
	  return toString.call(obj) === OBJECT_STRING;
	}

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var isArray = exports.isArray = Array.isArray;

	/**
	 * Define a property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */

	function def(obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}

	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */

	function debounce(func, wait) {
	  var timeout, args, context, timestamp, result;
	  var later = function later() {
	    var last = Date.now() - timestamp;
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    }
	  };
	  return function () {
	    context = this;
	    args = arguments;
	    timestamp = Date.now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	    return result;
	  };
	}

	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */

	function indexOf(arr, obj) {
	  var i = arr.length;
	  while (i--) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	}

	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */

	function cancellable(fn) {
	  var cb = function cb() {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments);
	    }
	  };
	  cb.cancel = function () {
	    cb.cancelled = true;
	  };
	  return cb;
	}

	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 *
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 */

	function looseEqual(a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
	  /* eslint-enable eqeqeq */
	}

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* global MutationObserver */

	// can we use __proto__?
	var hasProto = exports.hasProto = '__proto__' in {};

	// Browser environment sniffing
	var inBrowser = exports.inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

	// detect devtools
	var devtools = exports.devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	// UA sniffing for working around browser-specific quirks
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE9 = exports.isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isAndroid = exports.isAndroid = UA && UA.indexOf('android') > 0;

	var transitionProp = void 0;
	var transitionEndEvent = void 0;
	var animationProp = void 0;
	var animationEndEvent = void 0;

	// Transition property/event sniffing
	if (inBrowser && !isIE9) {
	  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
	  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
	  exports.transitionProp = transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	  exports.transitionEndEvent = transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
	  exports.animationProp = animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
	  exports.animationEndEvent = animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
	}

	exports.transitionProp = transitionProp;
	exports.transitionEndEvent = transitionEndEvent;
	exports.animationProp = animationProp;
	exports.animationEndEvent = animationEndEvent;

	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *利用 nextTick 定义一个异步执行的任务。理论上，作为一个 microtask 任务执行，类似es6 中的 promise
	 *如果 MutationObserver 支持的情况下，就使用它
	 *否则就使用 setTimeout(0) 构造异步任务队列。
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */

	var nextTick = exports.nextTick = function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	  function nextTickHandler() {
	    pending = false;
	    // 复制任务 队列中的回调函数
	    var copies = callbacks.slice(0);
	    // 同时将任务队列中的 回调清空。
	    callbacks = [];
	    for (var i = 0; i < copies.length; i++) {
	      // 遍历任务队列中的回调，并执行它。
	      copies[i]();
	    }
	  }

	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined') {
	    var counter = 1;
	    //  创建一个 MutationObserver 对象
	    var observer = new MutationObserver(nextTickHandler);
	    // 创建一个 文本节点
	    var textNode = document.createTextNode(counter);
	    // 监听这个文本节点。
	    observer.observe(textNode, {
	      characterData: true
	    });

	    timerFunc = function timerFunc() {
	      // 保证0,1 循环变化 赋值
	      counter = (counter + 1) % 2;
	      //  从而改变 textNode 文本节点里面的内容。每次调用 timeFunc 函数，都会主动触发 observer 监听。
	      textNode.data = counter;
	    };
	  } else {
	    // webpack attempts to inject a shim for setImmediate
	    // if it is used as a global, so we have to work around that to
	    // avoid bundling unnecessary code.
	    // webpack 会试图为一个全局使用的 setImmediate方法，提供一个 shim 兼容代码
	    // 为了绕过它提供不必要的 代码，用到全局的window
	    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
	    // 如果 从 setImmediate 到 setTimeout优雅降级，提供一个公用的回调函数。
	    timerFunc = context.setImmediate || setTimeout;
	  }
	  return function (cb, ctx) {
	    var func = ctx ? function () {
	      cb.call(ctx);
	    } : cb;
	    // 将传入的回调  push到内部维护的 callbacks 回调队列中
	    // 方便后面遍历触发。
	    callbacks.push(func);
	    // pending 作为 开关，保证每次只会存入一组待执行的异步任务。
	    if (pending) return;
	    pending = true;
	    // 将即将执行的异步任务，添加到回调队列中去。
	    timerFunc(nextTickHandler, 0);
	  };
	}();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.query = query;
	exports.inDoc = inDoc;
	exports.getAttr = getAttr;
	exports.getBindAttr = getBindAttr;
	exports.hasBindAttr = hasBindAttr;
	exports.before = before;
	exports.after = after;
	exports.remove = remove;
	exports.prepend = prepend;
	exports.replace = replace;
	exports.on = on;
	exports.off = off;
	exports.setClass = setClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.extractContent = extractContent;
	exports.trimNode = trimNode;
	exports.isTemplate = isTemplate;
	exports.createAnchor = createAnchor;
	exports.findRef = findRef;
	exports.getOuterHTML = getOuterHTML;

	var _config = __webpack_require__(15);

	var _config2 = _interopRequireDefault(_config);

	var _env = __webpack_require__(12);

	var _debug = __webpack_require__(16);

	var _lang = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Query an element selector if it's not an element already.
	 *
	 * @param {String|Element} el
	 * @return {Element}
	 */

	function query(el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && (0, _debug.warn)('Cannot find element: ' + selector);
	    }
	  }
	  return el;
	}

	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed by doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */

	function inDoc(node) {
	  var doc = document.documentElement;
	  var parent = node && node.parentNode;
	  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
	}

	/**
	 * Get and remove an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} _attr
	 */

	function getAttr(node, _attr) {
	  var val = node.getAttribute(_attr);
	  if (val !== null) {
	    node.removeAttribute(_attr);
	  }
	  return val;
	}

	/**
	 * Get an attribute with colon or v-bind: prefix.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {String|null}
	 */

	function getBindAttr(node, name) {
	  var val = getAttr(node, ':' + name);
	  if (val === null) {
	    val = getAttr(node, 'v-bind:' + name);
	  }
	  return val;
	}

	/**
	 * Check the presence of a bind attribute.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {Boolean}
	 */

	function hasBindAttr(node, name) {
	  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
	}

	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	function before(el, target) {
	  target.parentNode.insertBefore(el, target);
	}

	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	function after(el, target) {
	  if (target.nextSibling) {
	    before(el, target.nextSibling);
	  } else {
	    target.parentNode.appendChild(el);
	  }
	}

	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */

	function remove(el) {
	  el.parentNode.removeChild(el);
	}

	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	function prepend(el, target) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    target.appendChild(el);
	  }
	}

	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */

	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}

	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 * @param {Boolean} [useCapture]
	 */

	function on(el, event, cb, useCapture) {
	  el.addEventListener(event, cb, useCapture);
	}

	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */

	function off(el, event, cb) {
	  el.removeEventListener(event, cb);
	}

	/**
	 * For IE9 compat: when both class and :class are present
	 * getAttribute('class') returns wrong value...
	 *
	 * @param {Element} el
	 * @return {String}
	 */

	function getClass(el) {
	  var classname = el.className;
	  if ((typeof classname === 'undefined' ? 'undefined' : _typeof(classname)) === 'object') {
	    classname = classname.baseVal || '';
	  }
	  return classname;
	}

	/**
	 * In IE9, setAttribute('class') will result in empty class
	 * if the element also has the :class attribute; However in
	 * PhantomJS, setting `className` does not work on SVG elements...
	 * So we have to do a conditional check here.
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */

	function setClass(el, cls) {
	  /* istanbul ignore if */
	  if (_env.isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}

	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */

	function addClass(el, cls) {
	  if (el.classList) {
	    el.classList.add(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      setClass(el, (cur + cls).trim());
	    }
	  }
	}

	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */

	function removeClass(el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    setClass(el, cur.trim());
	  }
	  if (!el.className) {
	    el.removeAttribute('class');
	  }
	}

	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element|DocumentFragment}
	 */

	function extractContent(el, asFragment) {
	  var child;
	  var rawContent;
	  /* istanbul ignore if */
	  if (isTemplate(el) && isFragment(el.content)) {
	    el = el.content;
	  }
	  if (el.hasChildNodes()) {
	    trimNode(el);
	    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
	    /* eslint-disable no-cond-assign */
	    while (child = el.firstChild) {
	      /* eslint-enable no-cond-assign */
	      rawContent.appendChild(child);
	    }
	  }
	  return rawContent;
	}

	/**
	 * Trim possible empty head/tail text and comment
	 * nodes inside a parent.
	 *
	 * @param {Node} node
	 */

	function trimNode(node) {
	  var child;
	  /* eslint-disable no-sequences */
	  while (child = node.firstChild, isTrimmable(child)) {
	    node.removeChild(child);
	  }
	  while (child = node.lastChild, isTrimmable(child)) {
	    node.removeChild(child);
	  }
	  /* eslint-enable no-sequences */
	}

	function isTrimmable(node) {
	  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
	}

	/**
	 * Check if an element is a template tag.
	 * Note if the template appears inside an SVG its tagName
	 * will be in lowercase.
	 *
	 * @param {Element} el
	 */

	function isTemplate(el) {
	  return el.tagName && el.tagName.toLowerCase() === 'template';
	}

	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - fragment instance
	 * - v-html
	 * - v-if
	 * - v-for
	 * - component
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */

	function createAnchor(content, persist) {
	  var anchor = _config2.default.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
	  anchor.__v_anchor = true;
	  return anchor;
	}

	/**
	 * Find a component ref attribute that starts with $.
	 *
	 * @param {Element} node
	 * @return {String|undefined}
	 */

	var refRE = /^v-ref:/;
	function findRef(node) {
	  if (node.hasAttributes()) {
	    var attrs = node.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var name = attrs[i].name;
	      if (refRE.test(name)) {
	        return (0, _lang.camelize)(name.replace(refRE, ''));
	      }
	    }
	  }
	}

	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 * outerHTML 返回时，内容包含描述元素及其后代的序列化HTML片段
	 *
	 * @param {Element} el
	 * @return {String}
	 */

	function getOuterHTML(el) {
	  if (el.outerHTML) {
	    return el.outerHTML;
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {

	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */

	  debug: false,

	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */

	  silent: false,

	  /**
	   * Whether to use async rendering.
	   */

	  async: true,

	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */

	  warnExpressionErrors: true,

	  /**
	   * Whether to allow devtools inspection.
	   * Disabled by default in production builds.
	   */

	  devtools: process.env.NODE_ENV !== 'production',

	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */

	  _delimitersChanged: true,

	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */

	  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],

	  /**
	   * prop binding modes
	   */

	  _propBindingModes: {
	    ONE_WAY: 0,
	    TWO_WAY: 1,
	    ONE_TIME: 2
	  },

	  /**
	   * Max circular updates allowed in a batcher flush cycle.
	   */

	  _maxUpdateCount: 100
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.warn = undefined;

	var _config = __webpack_require__(15);

	var _config2 = _interopRequireDefault(_config);

	var _lang = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var warn = void 0;
	var formatComponentName = void 0;

	if (process.env.NODE_ENV !== 'production') {
	  var hasConsole = typeof console !== 'undefined';

	  exports.warn = warn = function warn(msg, vm) {
	    if (hasConsole && !_config2.default.silent) {
	      console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
	    }
	  };

	  formatComponentName = function formatComponentName(vm) {
	    var name = vm._isVue ? vm.$options.name : vm.name;
	    return name ? ' (found in component: <' + (0, _lang.hyphenate)(name) + '>)' : '';
	  };
	}

	exports.warn = warn;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mergeOptions = mergeOptions;
	exports.resolveAsset = resolveAsset;

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	var _config = __webpack_require__(15);

	var _config2 = _interopRequireDefault(_config);

	var _lang = __webpack_require__(11);

	var _debug = __webpack_require__(16);

	var _component = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */

	var strats = _config2.default.optionMergeStrategies = Object.create(null);

	/**
	 * Helper that recursively merges two data objects together.
	 */

	function mergeData(to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!(0, _lang.hasOwn)(to, key)) {
	      (0, _lang.set)(to, key, fromVal);
	    } else if ((0, _lang.isObject)(toVal) && (0, _lang.isObject)(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to;
	}

	/**
	 * Data
	 */

	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal;
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && (0, _debug.warn)('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	      return parentVal;
	    }
	    if (!parentVal) {
	      return childVal;
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn() {
	      return mergeData(childVal.call(this), parentVal.call(this));
	    };
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn() {
	      // instance merge
	      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
	      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData);
	      } else {
	        return defaultData;
	      }
	    };
	  }
	};

	/**
	 * El
	 */

	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && (0, _debug.warn)('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	    return;
	  }
	  var ret = childVal || parentVal;
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
	};

	/**
	 * Hooks and param attributes are merged as arrays.
	 */

	strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
	  return childVal ? parentVal ? parentVal.concat(childVal) : (0, _lang.isArray)(childVal) ? childVal : [childVal] : parentVal;
	};

	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */

	function mergeAssets(parentVal, childVal) {
	  var res = Object.create(parentVal);
	  return childVal ? (0, _lang.extend)(res, guardArrayAssets(childVal)) : res;
	}

	_config2.default._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});

	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */

	strats.watch = strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = {};
	  (0, _lang.extend)(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !(0, _lang.isArray)(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent ? parent.concat(child) : [child];
	  }
	  return ret;
	};

	/**
	 * Other object hashes.
	 */

	strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = Object.create(null);
	  (0, _lang.extend)(ret, parentVal);
	  (0, _lang.extend)(ret, childVal);
	  return ret;
	};

	/**
	 * Default strategy.
	 */

	var defaultStrat = function defaultStrat(parentVal, childVal) {
	  return childVal === undefined ? parentVal : childVal;
	};

	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} options
	 */

	function guardComponents(options) {
	  if (options.components) {
	    var components = options.components = guardArrayAssets(options.components);
	    var ids = Object.keys(components);
	    var def;
	    if (process.env.NODE_ENV !== 'production') {
	      var map = options._componentNameMap = {};
	    }
	    for (var i = 0, l = ids.length; i < l; i++) {
	      var key = ids[i];
	      if (_component.commonTagRE.test(key) || _component.reservedTagRE.test(key)) {
	        process.env.NODE_ENV !== 'production' && (0, _debug.warn)('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
	        continue;
	      }
	      // record a all lowercase <-> kebab-case mapping for
	      // possible custom element case error warning
	      if (process.env.NODE_ENV !== 'production') {
	        map[key.replace(/-/g, '').toLowerCase()] = (0, _lang.hyphenate)(key);
	      }
	      def = components[key];
	      if ((0, _lang.isPlainObject)(def)) {
	        components[key] = _index2.default.extend(def);
	      }
	    }
	  }
	}

	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 *
	 * @param {Object} options
	 */

	function guardProps(options) {
	  var props = options.props;
	  var i, val;
	  if ((0, _lang.isArray)(props)) {
	    options.props = {};
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        options.props[val] = null;
	      } else if (val.name) {
	        options.props[val.name] = val;
	      }
	    }
	  } else if ((0, _lang.isPlainObject)(props)) {
	    var keys = Object.keys(props);
	    i = keys.length;
	    while (i--) {
	      val = props[keys[i]];
	      if (typeof val === 'function') {
	        props[keys[i]] = { type: val };
	      }
	    }
	  }
	}

	/**
	 * Guard an Array-format assets option and converted it
	 * into the key-value Object format.
	 *
	 * @param {Object|Array} assets
	 * @return {Object}
	 */

	function guardArrayAssets(assets) {
	  if ((0, _lang.isArray)(assets)) {
	    var res = {};
	    var i = assets.length;
	    var asset;
	    while (i--) {
	      asset = assets[i];
	      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && (0, _debug.warn)('Array-syntax assets must provide a "name" or "id" field.');
	      } else {
	        res[id] = asset;
	      }
	    }
	    return res;
	  }
	  return assets;
	}

	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */

	function mergeOptions(parent, child, vm) {
	  guardComponents(child);
	  guardProps(child);
	  var options = {};
	  var key;
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      parent = mergeOptions(parent, child.mixins[i], vm);
	    }
	  }
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!(0, _lang.hasOwn)(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField(key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options;
	}

	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @param {Boolean} warnMissing
	 * @return {Object|Function}
	 */

	function resolveAsset(options, type, id, warnMissing) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return;
	  }
	  var assets = options[type];
	  var camelizedId;
	  var res = assets[id] ||
	  // camelCase ID
	  assets[camelizedId = (0, _lang.camelize)(id)] ||
	  // Pascal Case ID
	  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
	  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
	    (0, _debug.warn)('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
	  }
	  return res;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.reservedTagRE = exports.commonTagRE = undefined;
	exports.checkComponentAttr = checkComponentAttr;

	var _debug = __webpack_require__(16);

	var _options = __webpack_require__(17);

	var _dom = __webpack_require__(13);

	var commonTagRE = exports.commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
	var reservedTagRE = exports.reservedTagRE = /^(slot|partial|component)$/i;

	var isUnknownElement = void 0;
	if (process.env.NODE_ENV !== 'production') {
	  isUnknownElement = function isUnknownElement(el, tag) {
	    if (tag.indexOf('-') > -1) {
	      // http://stackoverflow.com/a/28210364/1070244
	      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
	    } else {
	      return (/HTMLUnknownElement/.test(el.toString()) &&
	        // Chrome returns unknown for several HTML5 elements.
	        // https://code.google.com/p/chromium/issues/detail?id=540526
	        !/^(data|time|rtc|rb)$/.test(tag)
	      );
	    }
	  };
	}

	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Object|undefined}
	 */

	function checkComponentAttr(el, options) {
	  var tag = el.tagName.toLowerCase();
	  var hasAttrs = el.hasAttributes();
	  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
	    if ((0, _options.resolveAsset)(options, 'components', tag)) {
	      return { id: tag };
	    } else {
	      var is = hasAttrs && getIsBinding(el);
	      if (is) {
	        return is;
	      } else if (process.env.NODE_ENV !== 'production') {
	        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
	        if (expectedTag) {
	          (0, _debug.warn)('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
	        } else if (isUnknownElement(el, tag)) {
	          (0, _debug.warn)('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
	        }
	      }
	    }
	  } else if (hasAttrs) {
	    return getIsBinding(el);
	  }
	}

	/**
	 * Get "is" binding from an element.
	 *
	 * @param {Element} el
	 * @return {Object|undefined}
	 */

	function getIsBinding(el) {
	  // dynamic syntax
	  var exp = (0, _dom.getAttr)(el, 'is');
	  if (exp != null) {
	    return { id: exp };
	  } else {
	    exp = (0, _dom.getBindAttr)(el, 'is');
	    if (exp != null) {
	      return { id: exp, dynamic: true };
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Watcher;

	var _config = __webpack_require__(15);

	var _config2 = _interopRequireDefault(_config);

	var _dep = __webpack_require__(8);

	var _dep2 = _interopRequireDefault(_dep);

	var _batcher = __webpack_require__(20);

	var _index = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var uid = 0;

	/**
	 *  用来解析表达式，收集依赖，在表达式的值改变时，触发回调函数。
	 *  主要作用于 $watch 接口 和指令。
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm   // vm 指代 一个Vue 实例。
	 * @param {String|Function} expOrFn // 对应一个 字符串，或者是一个计算属性的函数
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep   // watch 的对象 内部属性发生变化时，是否也要触发cb
	 *                 - {Boolean} user
	 *                 - {Boolean} sync
	 *                 - {Boolean} lazy
	 *                 - {Function} [preProcess]
	 *                 - {Function} [postProcess]
	 * @constructor
	 */

	/**
	 *  vm.$watch('a.b.c', function (newVal, oldVal) {
	 *        // do something
	 *   })
	 */

	function Watcher(vm, expOrFn, cb, options) {
	  // mix in options
	  if (options) {
	    (0, _index.extend)(this, options);
	  }
	  var isFn = typeof expOrFn === 'function';
	  this.vm = vm;
	  // 保存 watchers 实例到 vm._watchers 数组里面
	  vm._watchers.push(this);

	  this.expression = expOrFn;
	  this.cb = cb;
	  this.id = ++uid; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = [];
	  this.newDeps = [];
	  // 创造一个没有原型方法的空对象。
	  this.depIds = Object.create(null);
	  this.newDepIds = null;
	  this.prevError = null; // for async error stacks
	  // parse expression for getter/setter
	  if (isFn) {
	    // 如果是一个计算属性的函数，则通过 getter 取值器，获取。
	    this.getter = expOrFn;
	    this.setter = undefined;
	  } else {
	    // 目前轻量级的vue
	    (0, _index.warn)('vue-lite only supports watching functions.');
	  }
	  this.value = this.lazy ? undefined : this.get();
	  // state for avoiding false triggers for deep and Array
	  // watchers during vm._digest()
	  this.queued = this.shallow = false;
	}

	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */

	Watcher.prototype.get = function () {
	  this.beforeGet();
	  var scope = this.scope || this.vm;
	  var value;
	  try {
	    // 如果传入的是 解析指令后的 虚拟dom ,则 触发里面 __h__ 方法。
	    // __h__,将编译了指令后的 虚拟dom 对象，转化为 vNode 类型的对象。
	    // { sel, data, children, text, elm, key }
	    value = this.getter.call(scope, scope);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && _config2.default.warnExpressionErrors) {
	      (0, _index.warn)('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  // deep 配置项，表明捕获对象内的所有内部属性。
	  if (this.deep) {
	    traverse(value);
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value);
	  }
	  if (this.filters) {
	    value = scope._applyFilters(value, null, this.filters, false);
	  }
	  if (this.postProcess) {
	    value = this.postProcess(value);
	  }
	  this.afterGet();
	  return value;
	};

	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */

	Watcher.prototype.set = function (value) {
	  var scope = this.scope || this.vm;
	  if (this.filters) {
	    value = scope._applyFilters(value, this.value, this.filters, true);
	  }
	  try {
	    this.setter.call(scope, scope, value);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && _config2.default.warnExpressionErrors) {
	      (0, _index.warn)('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	    }
	  }
	};

	/**
	 * 为依赖收集做准备。
	 * Prepare for dependency collection.
	 */

	Watcher.prototype.beforeGet = function () {
	  // 当前 watcher 实例 赋值给 target
	  _dep2.default.target = this;
	  this.newDepIds = Object.create(null);
	  // 清空 newDeps 数组。
	  this.newDeps.length = 0;
	};

	/**
	 * Add a dependency to this directive.
	 *  添加一个新的依赖，
	 * @param {Dep} dep
	 */

	Watcher.prototype.addDep = function (dep) {
	  var id = dep.id;
	  // 不同的监听器，维护不同的唯一 监听器数组。通过 id 来标识。
	  // 避免为同一属性，添加多个队列。
	  if (!this.newDepIds[id]) {
	    this.newDepIds[id] = true;
	    // 将新的 dep 实例放在 newDeps 数组中。
	    this.newDeps.push(dep);
	    if (!this.depIds[id]) {
	      // 将当前的 watcher实例，放入到dep 内部维护的 this.subs;
	      // .
	      dep.addSub(this);
	    }
	  }
	};

	/**
	 * Clean up for dependency collection.
	 *  清除所有收集到的依赖。
	 */

	Watcher.prototype.afterGet = function () {
	  _dep2.default.target = null;
	  var i = this.deps.length;
	  while (i--) {
	    var dep = this.deps[i];
	    // 通过 this.newDepIds   删除对应 的新的依赖。
	    if (!this.newDepIds[dep.id]) {
	      //
	      dep.removeSub(this);
	    }
	  }
	  this.depIds = this.newDepIds;
	  var tmp = this.deps;
	  this.deps = this.newDeps;
	  this.newDeps = tmp;
	};

	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 *
	 * 订阅者 接口，当收集到依赖属性值发生改变时，触发update 事件。
	 *
	 *
	 * @param {Boolean} shallow
	 */

	Watcher.prototype.update = function (shallow) {
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync || !_config2.default.async) {
	    this.run();
	  } else {
	    // if queued, only overwrite shallow with non-shallow,
	    // but not the other way around.
	    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
	    this.queued = true;
	    // record before-push error stack in debug mode
	    /* istanbul ignore if */
	    if (process.env.NODE_ENV !== 'production' && _config2.default.debug) {
	      this.prevError = new Error('[vue] async stack trace');
	    }
	    (0, _batcher.pushWatcher)(this);
	  }
	};

	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */

	Watcher.prototype.run = function () {
	  if (this.active) {
	    // 触发get 函数，其中   this.getter.call(scope, scope)
	    // 如果传入的  exporFun 是 初始化时的 render 函数，
	    // 则这里就重新触发render 函数，重新由虚拟vnode 渲染到 真实DOM,
	    var value = this.get();
	    if (value !== this.value ||
	    // Deep watchers and watchers on Object/Arrays should fire even
	    // when the value is the same, because the value may
	    // have mutated; but only do so if this is a
	    // non-shallow update (caused by a vm digest).
	    ((0, _index.isObject)(value) || this.deep) && !this.shallow) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      // in debug + async mode, when a watcher callbacks
	      // throws, we also throw the saved before-push error
	      // so the full cross-tick stack trace is available.
	      var prevError = this.prevError;
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && _config2.default.debug && prevError) {
	        this.prevError = null;
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          (0, _index.nextTick)(function () {
	            throw prevError;
	          }, 0);
	          throw e;
	        }
	      } else {
	        // 然后调用传入 watcher的回调函数。
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	    this.queued = this.shallow = false;
	  }
	};

	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */

	Watcher.prototype.evaluate = function () {
	  // avoid overwriting another watcher that is being
	  // collected.
	  var current = _dep2.default.target;
	  this.value = this.get();
	  this.dirty = false;
	  _dep2.default.target = current;
	};

	/**
	 * Depend on all deps collected by this watcher.
	 */

	Watcher.prototype.depend = function () {
	  var i = this.deps.length;
	  while (i--) {
	    this.deps[i].depend();
	  }
	};

	/**
	 * Remove self from all dependencies' subcriber list.
	 */

	Watcher.prototype.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed or is performing a v-for
	    // re-render (the watcher list is then filtered by v-for).
	    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
	      this.vm._watchers.$remove(this);
	    }
	    var i = this.deps.length;
	    while (i--) {
	      this.deps[i].removeSub(this);
	    }
	    this.active = false;
	    this.vm = this.cb = this.value = null;
	  }
	};

	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * 递归地 遍历一个对象，触发所有getters 取值器的修改，为了让所有内部嵌套属性 都能被作为依赖收集到。
	 * @param {*} val
	 */

	function traverse(val) {
	  var i, keys;
	  if ((0, _index.isArray)(val)) {
	    i = val.length;
	    while (i--) {
	      traverse(val[i]);
	    }
	  } else if ((0, _index.isObject)(val)) {
	    keys = Object.keys(val);
	    i = keys.length;
	    while (i--) {
	      traverse(val[keys[i]]);
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pushWatcher = pushWatcher;

	var _config = __webpack_require__(15);

	var _config2 = _interopRequireDefault(_config);

	var _index = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.

	var queueIndex;
	var queue = [];
	var userQueue = [];
	var has = {};
	var circular = {};
	var waiting = false;
	var internalQueueDepleted = false;

	/**
	 * Reset the batcher's state.
	 */

	function resetBatcherState() {
	  queue = [];
	  userQueue = [];
	  has = {};
	  circular = {};
	  waiting = internalQueueDepleted = false;
	}

	/**
	 * Flush both queues and run the watchers.
	 */

	function flushBatcherQueue() {
	  runBatcherQueue(queue);
	  internalQueueDepleted = true;
	  runBatcherQueue(userQueue);
	  resetBatcherState();
	}

	/**
	 * Run the watchers in a single queue.
	 *
	 * @param {Array} queue
	 */

	function runBatcherQueue(queue) {
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
	    var watcher = queue[queueIndex];
	    var id = watcher.id;
	    has[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    // 阻止死循环 更新。
	    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
	      // circular 记录每个watcher 循环更新的次数。
	      // 最大次数为 100;
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > _config2.default._maxUpdateCount) {
	        (0, _index.warn)('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
	        break;
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

	function pushWatcher(watcher) {
	  var id = watcher.id;
	  if (has[id] == null) {
	    if (internalQueueDepleted && !watcher.user) {
	      // an internal watcher triggered by a user watcher...
	      // let's run it immediately after current user watcher is done.
	      userQueue.splice(queueIndex + 1, 0, watcher);
	    } else {
	      // push watcher into appropriate queue
	      // 区分 用户监听watch 和 定义的指令 更新，两个不同的队列。
	      var q = watcher.user ? userQueue : queue;
	      // 存放 队列长度。
	      has[id] = q.length;
	      // 需要更新的 watcher 放入到指定的队列中。
	      q.push(watcher);
	      // queue the flush
	      //
	      if (!waiting) {
	        waiting = true;
	        //通过 nextTick 异步触发 flushBatcherQueue 刷新队列。
	        (0, _index.nextTick)(flushBatcherQueue);
	      }
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.h = exports.patch = undefined;

	var _patch = __webpack_require__(22);

	var _patch2 = _interopRequireDefault(_patch);

	var _h = __webpack_require__(25);

	var _h2 = _interopRequireDefault(_h);

	var _class2 = __webpack_require__(26);

	var _class3 = _interopRequireDefault(_class2);

	var _style = __webpack_require__(27);

	var _style2 = _interopRequireDefault(_style);

	var _props = __webpack_require__(28);

	var _props2 = _interopRequireDefault(_props);

	var _attrs = __webpack_require__(29);

	var _attrs2 = _interopRequireDefault(_attrs);

	var _events = __webpack_require__(30);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 传入一个对象数组作为参数。
	var patch = (0, _patch2.default)([_class3.default, // makes it easy to toggle classes
	_props2.default, _style2.default, _attrs2.default, _events2.default]);

	exports.patch = patch;
	exports.h = _h2.default;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createPatchFunction;

	var _vnode = __webpack_require__(23);

	var _vnode2 = _interopRequireDefault(_vnode);

	var _dom = __webpack_require__(24);

	var dom = _interopRequireWildcard(_dom);

	var _index = __webpack_require__(10);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 创建一个空的 vNode 对象，作为节点模板。
	var emptyNode = (0, _vnode2.default)('', {}, [], undefined, undefined);

	// 定义 一些基本的 钩子函数
	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

	function isUndef(s) {
	  return s === undefined;
	}

	function isDef(s) {
	  return s !== undefined;
	}

	/**
	 * 判断 vnode 对象上的 key  和 tagName（sel);
	 * @param  {[type]} vnode1 [description]
	 * @param  {[type]} vnode2 [description]
	 * @return {[type]}        [description]
	 */
	function sameVnode(vnode1, vnode2) {
	  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}

	function createKeyToOldIdx(children, beginIdx, endIdx) {
	  var i,
	      map = {},
	      key;
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) map[key] = i;
	  }
	  return map;
	}

	function createPatchFunction(modules, api) {
	  var i,
	      j,
	      cbs = {};
	  // 设置对 dom 操作的API
	  if (isUndef(api)) api = dom;
	  //
	  for (i = 0; i < hooks.length; ++i) {
	    // 定义不同时期的钩子函数。
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      // cbs 对象中， 保存着不同时期 的 回调数组。
	      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	    }
	  }

	  function emptyNodeAt(elm) {
	    return (0, _vnode2.default)(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
	  }

	  function createRmCb(childElm, listeners) {
	    return function () {
	      if (--listeners === 0) {
	        var parent = api.parentNode(childElm);
	        api.removeChild(parent, childElm);
	      }
	    };
	  }

	  function createElm(vnode, insertedVnodeQueue) {
	    var i,
	        thunk,
	        data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
	      if (isDef(i = data.vnode)) {
	        thunk = vnode;
	        vnode = i;
	      }
	    }
	    var elm,
	        children = vnode.children,
	        tag = vnode.sel;
	    if (isDef(tag)) {
	      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) //只有使用命名空间的 XML 文档才会使用该方法。 传入规定的命名空间的名称 和 元素节点名称
	      : api.createElement(tag); // 使用createElement 传入节点名，创造对应节点。
	      // 检查元素的子节点是否为数组，
	      if (Array.isArray(children)) {
	        // 如果是数组，则递归创造子节点。
	        for (i = 0; i < children.length; ++i) {
	          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	        }
	      } else if ((0, _index.isPrimitive)(vnode.text)) {
	        // 如果是内容 且仅为文本节点，则直接创造文本节点，插入到当前元素中
	        api.appendChild(elm, api.createTextNode(vnode.text));
	      }
	      // 利用 开始存放的 钩 子函数， 遍历触发里面所有的 create 回调函数。
	      //  updateStyle  updateProps updateEventListeners updateAttrs
	      //  缺少 { init: updateClass },
	      //  在创建的节点上 添加 style props eventListener  attrs 等等。
	      //  完善新创建的 节点。 同样真实的节点引用保存在 vnode.elm 中。
	      for (i = 0; i < cbs.create.length; ++i) {
	        cbs.create[i](emptyNode, vnode);
	      }i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (i.create) i.create(emptyNode, vnode);
	        if (i.insert) insertedVnodeQueue.push(vnode);
	      }
	    } else {
	      elm = vnode.elm = api.createTextNode(vnode.text);
	    }
	    if (isDef(thunk)) thunk.elm = vnode.elm;
	    // 最后返回 vnode 对象 对应的真实节点的引用。
	    return vnode.elm;
	  }

	  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }

	  function invokeDestroyHook(vnode) {
	    var i,
	        j,
	        data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	      for (i = 0; i < cbs.destroy.length; ++i) {
	        cbs.destroy[i](vnode);
	      }if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	      if (isDef(i = data.vnode)) invokeDestroyHook(i);
	    }
	  }

	  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var i,
	          listeners,
	          rm,
	          ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.sel)) {
	          invokeDestroyHook(ch);
	          listeners = cbs.remove.length + 1;
	          rm = createRmCb(ch.elm, listeners);
	          for (i = 0; i < cbs.remove.length; ++i) {
	            cbs.remove[i](ch, rm);
	          }if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	            i(ch, rm);
	          } else {
	            rm();
	          }
	        } else {
	          // Text node
	          api.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }

	  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	    var oldStartIdx = 0,
	        newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;

	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) {
	        // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) {
	        // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	        idxInOld = oldKeyToIdx[newStartVnode.key];
	        if (isUndef(idxInOld)) {
	          // New element
	          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	          oldCh[idxInOld] = undefined;
	          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }

	  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    var i, hook;
	    // 初始化过程中 vnode.data.hook 为 “undefined”
	    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    //初始化 ，emptyNodeAt oldVnode.data是一个 {} 空对象。所以 oldVnode.data.vnode 为 “undefined”
	    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;

	    // 。。。。 ????
	    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
	      patchVnode(oldVnode, i, insertedVnodeQueue);
	      vnode.elm = i.elm;
	      return;
	    }
	    // 将 oldVnode 的 真实 dom 引用，
	    // 覆盖 新 vnode的真实dom 引用。
	    var elm = vnode.elm = oldVnode.elm,
	        oldCh = oldVnode.children,
	        ch = vnode.children;
	    // 进行对象比较。如果相等就直接返回
	    if (oldVnode === vnode) return;

	    //  比较 新旧 节点都不同，则 插入新节点，删除旧节点。
	    if (!sameVnode(oldVnode, vnode)) {
	      // 获取到真实的 父节点的 dom 节点
	      var parentElm = api.parentNode(oldVnode.elm);
	      //  insertedVnodeQueue 空数组
	      //  通过 createElm 函数，拿到了创建真实的dom 节点后的 引用。
	      //  赋值给 elm
	      elm = createElm(vnode, insertedVnodeQueue);

	      // 在老节点前 插入新节点，
	      api.insertBefore(parentElm, elm, oldVnode.elm);
	      // 然后删除 老节点。整个 真实的dom 树的更新，也同样完成了。
	      removeVnodes(parentElm, [oldVnode], 0, 0);
	      return;
	    }

	    // 新 vnode 对象中，存在 data属性
	    if (isDef(vnode.data)) {
	      // 然后就把他们放入到update 更新 钩子函数里面。
	      // 分别更新节点里面 attrs,class events,props styles 等数据。
	      for (i = 0; i < cbs.update.length; ++i) {
	        cbs.update[i](oldVnode, vnode);
	      }i = vnode.data.hook;

	      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	    }

	    // c = ${ genChildren(el) }
	    // if (isPrimitive(c)) { text = c }
	    //  如果 genChildren(el) 返回的值不是 "string" 或者 “number” 等基本类型。
	    //  则 vnode.text  就为 "undefined"
	    if (isUndef(vnode.text)) {
	      // 新旧节点 都存在 子节点，则手动更新 子节点。
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	      } else if (isDef(ch)) {
	        // 新节点没有 文本属性 ，旧节点存在文本属性，则把文本设置为空。
	        if (isDef(oldVnode.text)) api.setTextContent(elm, '');

	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        // 旧节点存在子节点，新节点不存在子节点，则 删除子节点。
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        /// 同样只有 旧节点存在 文本内容，就置空文本内容。
	        api.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      // 更新 节点里面 的 文本内容。
	      api.setTextContent(elm, vnode.text);
	    }
	    if (isDef(hook) && isDef(i = hook.postpatch)) {
	      i(oldVnode, vnode);
	    }
	  }

	  // patch(this._le,vtree)
	  // patch(this._tree,vtree)
	  return function patch(oldVnode, vnode) {
	    var i, elm, parent;
	    var insertedVnodeQueue = [];
	    // 首先触发 pre 钩子 上的回调。
	    for (i = 0; i < cbs.pre.length; ++i) {
	      cbs.pre[i]();
	    }if (isUndef(oldVnode.sel)) {
	      // 第一次初始化的时候，不是 vNode 对象。
	      // 对应的实例化一个节点对象。
	      // VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	      // 初始化时 elm === oldVnode === this._el === document.querySelector(options.el),
	      // 也就是获取到的真实dom 引用。
	      oldVnode = emptyNodeAt(oldVnode);
	    }
	    // 通过节点名（sel） 和 dom 上对应的 keys 值（key），来判断 父节点是否没有发生改变。
	    if (sameVnode(oldVnode, vnode)) {
	      // 父节点没有发生改变，
	      //
	      patchVnode(oldVnode, vnode, insertedVnodeQueue);
	    } else {
	      // 父节点发生了改变。
	      // 获取到老 vNode 对象的 真实dom 引用。
	      elm = oldVnode.elm;
	      // node.parentElement
	      // 返回当前旧元素的父元素节点。
	      parent = api.parentNode(elm);

	      createElm(vnode, insertedVnodeQueue);

	      // 在拿到了当前需要更新的节点的父元素的真实dom 引用后，
	      if (parent !== null) {
	        // 在旧元素后面 插入 改变后的新元素
	        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	        // 然后 再移除旧元素，从而实现更新操作。
	        removeVnodes(parent, [oldVnode], 0, 0);
	      }
	    }

	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	    }
	    // 整个 新旧node 节点更新完成后，调用 post 钩子函数。
	    for (i = 0; i < cbs.post.length; ++i) {
	      cbs.post[i]();
	    }return vnode;
	  };
	}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = VNode;
	// emptyNodeAt  初始化一个 空的 vnode 对象。
	// VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	// 
	function VNode(sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return { sel: sel, data: data, children: children, text: text, elm: elm, key: key };
	}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createElement = createElement;
	exports.createElementNS = createElementNS;
	exports.createTextNode = createTextNode;
	exports.insertBefore = insertBefore;
	exports.removeChild = removeChild;
	exports.appendChild = appendChild;
	exports.parentNode = parentNode;
	exports.nextSibling = nextSibling;
	exports.tagName = tagName;
	exports.setTextContent = setTextContent;
	/**
	 *  封装了一些 dom 的基本操作。
	 */

	// createElement
	// 使用 createElement 创建新元素，传入要创建元素的标签名
	//
	function createElement(tagName) {
	  return document.createElement(tagName);
	}

	function createElementNS(namespaceURI, qualifiedName) {
	  return document.createElementNS(namespaceURI, qualifiedName);
	}

	// 创建新的文本节点。
	function createTextNode(text) {
	  return document.createTextNode(text);
	}

	// 插入dom 节点。
	function insertBefore(parentNode, newNode, referenceNode) {
	  parentNode.insertBefore(newNode, referenceNode);
	}

	// 移除
	function removeChild(node, child) {
	  node.removeChild(child);
	}

	// 添加dom 节点。
	function appendChild(node, child) {
	  node.appendChild(child);
	}

	//返回当前元素的父元素节点，如果该元素没有父节点，或者父节点不是一个元素节点(nodeType的值不为一)。返回null.
	function parentNode(node) {
	  return node.parentElement;
	}

	//下一个兄弟节点
	function nextSibling(node) {
	  return node.nextSibling;
	}

	// 属性返回元素的标签名。 始终是大写。
	function tagName(node) {
	  return node.tagName;
	}

	//设置 文本内容。
	function setTextContent(node, text) {
	  node.textContent = text;
	}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = h;

	var _vnode = __webpack_require__(23);

	var _vnode2 = _interopRequireDefault(_vnode);

	var _index = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (children !== undefined) {
	    for (var i = 0; i < children.length; ++i) {
	      addNS(children[i].data, children[i].children);
	    }
	  }
	}
	//`__h__('${ el.tag }', ${ genData(el, key) }, ${ genChildren(el) })`
	// 编译指令后，转换为  vNode 类型的对象。
	function h(tag, b, c) {
	  var data = {},
	      children,
	      text,
	      i;
	  // 存在 三个参数 的情况。
	  if (arguments.length === 3) {
	    // 保存着 attr,props class,style 的data 属性。
	    data = b;
	    // 如果 c 为数组，则表示保存着子节点
	    if ((0, _index.isArray)(c)) {
	      children = c;
	    } else if ((0, _index.isPrimitive)(c)) {
	      text = c;
	    }
	  } else if (arguments.length === 2) {
	    if ((0, _index.isArray)(b)) {
	      children = b;
	    } else if ((0, _index.isPrimitive)(b)) {
	      text = b;
	    } else {
	      data = b;
	    }
	  }
	  // 存在子节点的 情况下。
	  if ((0, _index.isArray)(children)) {
	    for (i = 0; i < children.length; ++i) {
	      // 如果 子元素数组项中，有通过 genText 生成的字符串。
	      // 同样转换为 vNode 对象类型。
	      if ((0, _index.isPrimitive)(children[i])) children[i] = (0, _vnode2.default)(undefined, undefined, undefined, children[i]);
	    }
	  }
	  if (tag === 'svg') {
	    addNS(data, children);
	  }
	  //        { sel, data, children, text, elm, key }
	  return (0, _vnode2.default)(tag, data, children, text, undefined);
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(10);

	function updateClass(oldVnode, vnode) {
	  if (vnode.data.class !== undefined) {
	    // el.setAttribute('class', cls)
	    // 封装在 节点上 设置 class 属性的方法。
	    (0, _index.setClass)(vnode.elm, vnode.data.class || '');
	  }
	}

	exports.default = {
	  init: updateClass,
	  update: updateClass
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// TODO:
	// - remove animation related bits
	// - include prefix sniffing of v-bind:style

	var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
	var nextFrame = function nextFrame(fn) {
	  raf(function () {
	    raf(fn);
	  });
	};

	function setNextFrame(obj, prop, val) {
	  nextFrame(function () {
	    obj[prop] = val;
	  });
	}

	function updateStyle(oldVnode, vnode) {
	  var cur,
	      name,
	      elm = vnode.elm,
	      oldStyle = oldVnode.data.style || {},
	      style = vnode.data.style || {},
	      oldHasDel = 'delayed' in oldStyle;
	  for (name in oldStyle) {
	    if (!style[name]) {
	      elm.style[name] = '';
	    }
	  }
	  for (name in style) {
	    cur = style[name];
	    if (name === 'delayed') {
	      for (name in style.delayed) {
	        cur = style.delayed[name];
	        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
	          setNextFrame(elm.style, name, cur);
	        }
	      }
	    } else if (name !== 'remove' && cur !== oldStyle[name]) {
	      elm.style[name] = cur;
	    }
	  }
	}

	function applyDestroyStyle(vnode) {
	  var style,
	      name,
	      elm = vnode.elm,
	      s = vnode.data.style;
	  if (!s || !(style = s.destroy)) return;
	  for (name in style) {
	    elm.style[name] = style[name];
	  }
	}

	function applyRemoveStyle(vnode, rm) {
	  var s = vnode.data.style;
	  if (!s || !s.remove) {
	    rm();
	    return;
	  }
	  var name,
	      elm = vnode.elm,
	      idx,
	      i = 0,
	      maxDur = 0,
	      compStyle,
	      style = s.remove,
	      amount = 0,
	      applied = [];
	  for (name in style) {
	    applied.push(name);
	    elm.style[name] = style[name];
	  }
	  compStyle = getComputedStyle(elm);
	  var props = compStyle['transition-property'].split(', ');
	  for (; i < props.length; ++i) {
	    if (applied.indexOf(props[i]) !== -1) amount++;
	  }
	  elm.addEventListener('transitionend', function (ev) {
	    if (ev.target === elm) --amount;
	    if (amount === 0) rm();
	  });
	}

	exports.default = {
	  create: updateStyle,
	  update: updateStyle,
	  destroy: applyDestroyStyle,
	  remove: applyRemoveStyle
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function updateProps(oldVnode, vnode) {
	  // attribute（特性），是我们赋予某个事物的特质或对象。
	  // property（属性），是早已存在的不需要外界赋予的特质。
	  var key,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldProps = oldVnode.data.props || {},
	      props = vnode.data.props || {};
	  for (key in oldProps) {
	    // 新属性 中 不包含 旧的属性，就删除
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    // 新旧属性值不同，且不是 value 值。或者 属性值已经改变了
	    // 则 ，重新赋值。
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}

	exports.default = {
	  create: updateProps,
	  update: updateProps
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// attribute（特性），是我们赋予某个事物的特质或对象。
	// property（属性），是早已存在的不需要外界赋予的特质。
	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];

	var booleanAttrsDict = {};
	for (var i = 0, len = booleanAttrs.length; i < len; i++) {
	  booleanAttrsDict[booleanAttrs[i]] = true;
	}

	function updateAttrs(oldVnode, vnode) {
	  var key,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldAttrs = oldVnode.data.attrs || {},
	      attrs = vnode.data.attrs || {};

	  // update modified attributes, add new attributes
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      // TODO: add support to namespaced attributes (setAttributeNS)
	      if (!cur && booleanAttrsDict[key])
	        // 删除不存在的 html 中的属性
	        elm.removeAttribute(key);else
	        // 添加新的属性。
	        elm.setAttribute(key, cur);
	    }
	  }
	  //remove removed attributes
	  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	  // the other option is to remove all attributes with value == undefined
	  for (key in oldAttrs) {
	    // 删除 已经删除的属性。
	    if (!(key in attrs)) {
	      elm.removeAttribute(key);
	    }
	  }
	}

	exports.default = {
	  create: updateAttrs,
	  update: updateAttrs
	};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// 数组 函数调用器。
	function arrInvoker(arr) {
	  return function () {
	    // Special case when length is two, for performance
	    // 特殊处理 两个参数的数组， 利用 apply 传入数组参数，处理多个参数的情况。
	    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
	  };
	}

	// 函数 调用器。ev 为 事件对象， 里面的为函数主体
	function fnInvoker(o) {

	  return function (ev) {
	    o.fn(ev);
	  };
	}

	function updateEventListeners(oldVnode, vnode) {
	  var name,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldOn = oldVnode.data.on || {},
	      on = vnode.data.on;
	  if (!on) return;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    if (old === undefined) {
	      if (Array.isArray(cur)) {
	        // 新增事件。 传入数组，
	        elm.addEventListener(name, arrInvoker(cur));
	      } else {
	        cur = { fn: cur };
	        on[name] = cur;
	        // 封装成对象的形式，传入。
	        elm.addEventListener(name, fnInvoker(cur));
	      }
	    } else if (Array.isArray(old)) {
	      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
	      // 修改老数组，会影响在arrInvoker 中的闭包 引用的 arr 数组。
	      old.length = cur.length;
	      for (var i = 0; i < old.length; ++i) {
	        old[i] = cur[i];
	      }on[name] = old;
	    } else {
	      // 同样 封装成对象 传入 fnInvoker ,这里改变，就会影响 函数内部的改变。
	      old.fn = cur;
	      on[name] = old;
	    }
	  }
	}

	exports.default = {
	  create: updateEventListeners,
	  update: updateEventListeners
	};

/***/ })
/******/ ])
});
;