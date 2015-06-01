var _e_prototype = function() {
  'use strict';
  var _qc_prototype = function() {;
    (function(_myTrait_) {
      _myTrait_.attr = function(n, v) {

        if (this._host._svgElem) {

          if (this._host.isObject(v)) {
            if (v.onValue) {
              // Assume it is a stream...
              var me = this;
              v.onValue(function(val) {
                if (typeof(val) != "undefined" && (val !== null)) {
                  if (n == "xlink:href") {
                    me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
                  } else {
                    me._dom.setAttributeNS(null, n, val);
                  }
                }
              });

              return this;
            }
          }

          if (this._host.isArray(v)) {

            // console.log("Taking array as ", v);

            var oo = v[0],
              fName = v[1],
              val = oo[fName](),
              me = this,
              domi = me._dom,
              host = this._host,
              list;

            if (n == "xlink:href") {
              list = host.uniqueListener("attr:" + n, function(o, newV) {
                if (typeof(newV) != "undefined" && (newV !== null)) {
                  domi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newV);
                }
              });
            } else {
              list = host.uniqueListener("attr:" + n, function(o, newV) {
                if (typeof(newV) != "undefined" && (newV !== null)) {
                  domi.setAttributeNS(null, n, newV);
                }
              });
            }
            oo.on(fName, list);
            if (typeof(val) != "undefined" && (val !== null)) {
              if (n == "xlink:href") {
                this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
              } else {
                this._dom.setAttributeNS(null, n, val);
              }
            } else {

            }
            return this;
          }

          if (this._host.isFunction(v)) {

            var val = v();
            var oo = v(null, true),
              me = this,
              domi = me._dom,
              host = this._host,
              list;
            //console.log("setting attr for ", oo.me._guid, "for ", oo.name);

            if (n == "xlink:href") {
              list = host.uniqueListener("attr:" + n, function(o, newV) {
                if (typeof(newV) != "undefined" && (newV !== null)) {
                  domi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newV);
                }
              });
            } else {
              list = host.uniqueListener("attr:" + n, function(o, newV) {
                if (typeof(newV) != "undefined" && (newV !== null)) {
                  domi.setAttributeNS(null, n, newV);
                }
              });
            }
            oo.me.on(oo.name, list);
            if (typeof(val) != "undefined" && (val !== null)) {
              if (n == "xlink:href") {
                this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
              } else {
                this._dom.setAttributeNS(null, n, val);
              }
            } else {

            }
            return this;
          }
          if (typeof(v) != "undefined") {
            if (n == "xlink:href") {
              this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', v);
            } else {
              this._dom.setAttributeNS(null, n, v);
            }
          }

          return this;
        }


        if (this._host.isObject(v)) {
          if (v.onValue) {
            // Assume it is a stream...
            var me = this;
            v.onValue(function(val) {
              if (typeof(val) != "undefined" && (val !== null)) {
                if (n == "xlink:href") {
                  me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
                } else {
                  me._dom.setAttributeNS(null, n, val);
                }
              }
            });

            return this;
          }
        }

        if (this._host.isFunction(v)) {

          var val = v();
          var oo = v(null, true),
            me = this,
            domi = me._dom,
            host = this._host;

          var list = host.uniqueListener("attr:" + n, function(o, newV) {
            if (typeof(newV) != "undefined")
              domi.setAttribute(n, newV);
          });
          oo.me.on(oo.name, list);
          if (typeof(val) != "undefined")
            this._dom.setAttribute(n, val);
          return this;
        }
        if (typeof(v) != "undefined")
          this._dom.setAttribute(n, v);
        return this;
      }
      _myTrait_.bindSysEvent = function(en, fn, stop) {
        en = en.toLowerCase();
        if (!this._sys) this._sys = {};
        if (this._sys[en]) return false;

        this._sys[en] = true;

        var me = this;

        if (this._dom.attachEvent) {
          this._dom.attachEvent("on" + en, function(e) {
            e = e || window.event;
            me._event = e;
            fn();
            if (stop) {
              e = window.event;
              if (e) e.cancelBubble = true;
            }
          });
        } else {
          this._dom.addEventListener(en, function(e) {
            e = e || window.event;
            me._event = e;
            if (stop) {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              } else {
                e = window.event;
                e.cancelBubble = true;
              }
            }
            fn();
          });
        }
        return true;
      }
      _myTrait_.blur = function(t) {
        if (this._dom.blur) this._dom.blur();
      }
      _myTrait_.css = function(n, v) {
        if (n == "background-color") n = "backgroundColor";
        if (n == "margin-left") n = "marginLeft";
        if (n == "font-size") {
          n = "fontSize";
          v = this.pxParam(v);
        }

        if (n == "left" || n == "top" || n == "bottom" || n == "right" || n == "width" || n == "height") {

          v = this.pxParam(v);
        }

        if (v.substring) {
          if (v.substring(0, 3) == "NaN") {
            return;
          }
        }
        this._dom.style[n] = v;
        return this;
      }
      _myTrait_.focus = function(t) {
        if (this._dom.focus) this._dom.focus();
      }
      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
        _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
      _myTrait_.__traitInit.push(function(myDom, host) {
        this._dom = myDom;
        this._host = host;
      });
      _myTrait_.pxParam = function(v) {

        if (v == "auto") return v;

        if (typeof(v.slice) != "undefined") {
          if (v.slice(-1) == "%") {
            return v;
          }
          if (v.slice(-2) == "em") {
            return v;
          }
          if (v.slice(-2) == "px") {
            return v;
          }
        }

        if (isNaN(parseInt(v))) {
          return "";
        }
        if (typeof(v) == "string") {
          return parseInt(v) + "px";
        } else {
          var i = parseInt(v);
          if (!isNaN(i)) {
            // this._dom.style.width = i+"px";
            return i + "px";
          }
        }
      }
    }(this));
  }
  var _qc = function(a, b, c, d, e, f, g, h) {
    if (this instanceof _qc) {
      var args = [a, b, c, d, e, f, g, h];
      if (this.__factoryClass) {
        var m = this;
        var res;
        this.__factoryClass.forEach(function(initF) {
          res = initF.apply(m, args);
        });
        if (Object.prototype.toString.call(res) == '[object Function]') {
          if (res._classInfo.name != _qc._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (this.__traitInit) {
        var m = this;
        this.__traitInit.forEach(function(initF) {
          initF.apply(m, args);
        })
      } else {
        if (typeof this.init == 'function')
          this.init.apply(this, args);
      }
    } else return new _qc(a, b, c, d, e, f, g, h);
  };
  _qc._classInfo = {
    name: '_qc'
  };
  _qc.prototype = new _qc_prototype();
  var later_prototype = function() {;
    (function(_myTrait_) {
      var _initDone;
      var _callers;
      var _oneTimers;
      var _everies;
      var _framers;
      _myTrait_.add = function(fn, thisObj, args) {
        if (thisObj || args) {
          var tArgs;
          if (Object.prototype.toString.call(args) === '[object Array]') {
            tArgs = args;
          } else {
            tArgs = Array.prototype.slice.call(arguments, 2);
            if (!tArgs) tArgs = [];
          }
          _callers.push([thisObj, fn, tArgs]);
        } else {
          _callers.push(fn);
        }
      }
      _myTrait_.after = function(seconds, fn, name) {

        if (!name) {
          name = "time" + (new Date()).getTime() + Math.random(10000000);
        }

        _everies[name] = {
          step: Math.floor(seconds * 1000),
          fn: fn,
          nextTime: 0,
          remove: true
        };
      }
      _myTrait_.asap = function(fn) {
        this.add(fn);

      }
      _myTrait_.every = function(seconds, fn, name) {

        if (!name) {
          name = "time" + (new Date()).getTime() + Math.random(10000000);
        }

        _everies[name] = {
          step: Math.floor(seconds * 1000),
          fn: fn,
          nextTime: 0
        };
      }
      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
        _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
      _myTrait_.__traitInit.push(function(interval, fn) {
        if (!_initDone) {

          this.polyfill();

          var frame, cancelFrame;
          if (typeof(window) != "undefined") {
            var frame = window['requestAnimationFrame'],
              cancelFrame = window['cancelRequestAnimationFrame'];
            ['', 'ms', 'moz', 'webkit', 'o'].forEach(function(x) {
              if (!frame) {
                frame = window[x + 'RequestAnimationFrame'];
                cancelFrame = window[x + 'CancelAnimationFrame'] || window[x + 'CancelRequestAnimationFrame'];
              }
            });
          }

          if (!frame)
            frame = function(cb) {
              return setTimeout(cb, 16);
            };

          if (!cancelFrame)
            cancelFrame = function(id) {
              clearTimeout(id);
            };

          _callers = [];
          _oneTimers = {};
          _everies = {};
          _framers = [];
          var lastMs = 0;

          var _callQueQue = function() {
            var ms = (new Date()).getTime();
            var fn;
            while (fn = _callers.shift()) {
              if (Object.prototype.toString.call(fn) === '[object Array]') {
                fn[1].apply(fn[0], fn[2]);
              } else {
                fn();
              }

            }

            for (var i = 0; i < _framers.length; i++) {
              var fFn = _framers[i];
              fFn();
            }

            for (var n in _oneTimers) {
              if (_oneTimers.hasOwnProperty(n)) {
                var v = _oneTimers[n];
                v[0](v[1]);
                delete _oneTimers[n];
              }
            }

            for (var n in _everies) {
              if (_everies.hasOwnProperty(n)) {
                var v = _everies[n];
                if (v.nextTime < ms) {
                  if (v.remove) {
                    if (v.nextTime > 0) {
                      v.fn();
                      delete _everies[n];
                    } else {
                      v.nextTime = ms + v.step;
                    }
                  } else {
                    v.fn();
                    v.nextTime = ms + v.step;
                  }
                }
                if (v.until) {
                  if (v.until < ms) {
                    delete _everies[n];
                  }
                }
              }
            }

            frame(_callQueQue);
            lastMs = ms;
          };
          _callQueQue();
          _initDone = true;
        }
      });
      _myTrait_.once = function(key, fn, value) {
        // _oneTimers

        _oneTimers[key] = [fn, value];
      }
      _myTrait_.onFrame = function(fn) {

        _framers.push(fn);
      }
      _myTrait_.polyfill = function(t) {
        // --- let's not ---
      }
      _myTrait_.removeFrameFn = function(fn) {

        var i = _framers.indexOf(fn);
        if (i >= 0) {
          if (fn._onRemove) {
            fn._onRemove();
          }
          _framers.splice(i, 1);
          return true;
        } else {
          return false;
        }
      }
    }(this));
  }
  var later = function(a, b, c, d, e, f, g, h) {
    if (this instanceof later) {
      var args = [a, b, c, d, e, f, g, h];
      if (this.__factoryClass) {
        var m = this;
        var res;
        this.__factoryClass.forEach(function(initF) {
          res = initF.apply(m, args);
        });
        if (Object.prototype.toString.call(res) == '[object Function]') {
          if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (this.__traitInit) {
        var m = this;
        this.__traitInit.forEach(function(initF) {
          initF.apply(m, args);
        })
      } else {
        if (typeof this.init == 'function')
          this.init.apply(this, args);
      }
    } else return new later(a, b, c, d, e, f, g, h);
  };
  later._classInfo = {
    name: 'later'
  };
  later.prototype = new later_prototype();
  if (typeof(window) != 'undefined') window['later'] = later;
  if (typeof(window) != 'undefined') window['later_prototype'] = later_prototype;
  var css_prototype = function() {
    'use strict';
    var later_prototype = function() {;
      (function(_myTrait_) {
        var _initDone;
        var _callers;
        var _oneTimers;
        var _everies;
        var _framers;
        _myTrait_.add = function(fn, thisObj, args) {
          if (thisObj || args) {
            var tArgs;
            if (Object.prototype.toString.call(args) === '[object Array]') {
              tArgs = args;
            } else {
              tArgs = Array.prototype.slice.call(arguments, 2);
              if (!tArgs) tArgs = [];
            }
            _callers.push([thisObj, fn, tArgs]);
          } else {
            _callers.push(fn);
          }
        }
        _myTrait_.after = function(seconds, fn, name) {

          if (!name) {
            name = "time" + (new Date()).getTime() + Math.random(10000000);
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0,
            remove: true
          };
        }
        _myTrait_.asap = function(fn) {
          this.add(fn);

        }
        _myTrait_.every = function(seconds, fn, name) {

          if (!name) {
            name = "time" + (new Date()).getTime() + Math.random(10000000);
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0
          };
        }
        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
          _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
        _myTrait_.__traitInit.push(function(interval, fn) {
          if (!_initDone) {

            this.polyfill();

            var frame, cancelFrame;
            if (typeof(window) != "undefined") {
              var frame = window['requestAnimationFrame'],
                cancelFrame = window['cancelRequestAnimationFrame'];
              ['', 'ms', 'moz', 'webkit', 'o'].forEach(function(x) {
                if (!frame) {
                  frame = window[x + 'RequestAnimationFrame'];
                  cancelFrame = window[x + 'CancelAnimationFrame'] || window[x + 'CancelRequestAnimationFrame'];
                }
              });
            }

            if (!frame)
              frame = function(cb) {
                return setTimeout(cb, 16);
              };

            if (!cancelFrame)
              cancelFrame = function(id) {
                clearTimeout(id);
              };

            _callers = [];
            _oneTimers = {};
            _everies = {};
            _framers = [];
            var lastMs = 0;

            var _callQueQue = function() {
              var ms = (new Date()).getTime();
              var fn;
              while (fn = _callers.shift()) {
                if (Object.prototype.toString.call(fn) === '[object Array]') {
                  fn[1].apply(fn[0], fn[2]);
                } else {
                  fn();
                }

              }

              for (var i = 0; i < _framers.length; i++) {
                var fFn = _framers[i];
                fFn();
              }

              for (var n in _oneTimers) {
                if (_oneTimers.hasOwnProperty(n)) {
                  var v = _oneTimers[n];
                  v[0](v[1]);
                  delete _oneTimers[n];
                }
              }

              for (var n in _everies) {
                if (_everies.hasOwnProperty(n)) {
                  var v = _everies[n];
                  if (v.nextTime < ms) {
                    if (v.remove) {
                      if (v.nextTime > 0) {
                        v.fn();
                        delete _everies[n];
                      } else {
                        v.nextTime = ms + v.step;
                      }
                    } else {
                      v.fn();
                      v.nextTime = ms + v.step;
                    }
                  }
                  if (v.until) {
                    if (v.until < ms) {
                      delete _everies[n];
                    }
                  }
                }
              }

              frame(_callQueQue);
              lastMs = ms;
            };
            _callQueQue();
            _initDone = true;
          }
        });
        _myTrait_.once = function(key, fn, value) {
          // _oneTimers

          _oneTimers[key] = [fn, value];
        }
        _myTrait_.onFrame = function(fn) {

          _framers.push(fn);
        }
        _myTrait_.polyfill = function(t) {
          // --- let's not ---
        }
        _myTrait_.removeFrameFn = function(fn) {

          var i = _framers.indexOf(fn);
          if (i >= 0) {
            if (fn._onRemove) {
              fn._onRemove();
            }
            _framers.splice(i, 1);
            return true;
          } else {
            return false;
          }
        }
      }(this));
    }
    var later = function(a, b, c, d, e, f, g, h) {
      if (this instanceof later) {
        var args = [a, b, c, d, e, f, g, h];
        if (this.__factoryClass) {
          var m = this;
          var res;
          this.__factoryClass.forEach(function(initF) {
            res = initF.apply(m, args);
          });
          if (Object.prototype.toString.call(res) == '[object Function]') {
            if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (this.__traitInit) {
          var m = this;
          this.__traitInit.forEach(function(initF) {
            initF.apply(m, args);
          })
        } else {
          if (typeof this.init == 'function')
            this.init.apply(this, args);
        }
      } else return new later(a, b, c, d, e, f, g, h);
    };
    later._classInfo = {
      name: 'later'
    };
    later.prototype = new later_prototype();
    if (typeof(window) != 'undefined') window['later'] = later;
    if (typeof(window) != 'undefined') window['later_prototype'] = later_prototype;;
    (function(_myTrait_) {
      _myTrait_.guid = function(t) {

        return Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

      }
      _myTrait_.isArray = function(t) {

        if (typeof(t) == "undefined") return this.__isA;

        return Object.prototype.toString.call(t) === '[object Array]';
      }
      _myTrait_.isFunction = function(fn) {
        return Object.prototype.toString.call(fn) == '[object Function]';
      }
      _myTrait_.isObject = function(t) {

        if (typeof(t) == "undefined") return this.__isO;

        return t === Object(t);
      }
    }(this));;
    (function(_myTrait_) {
      var head;
      var styleTag;
      var bexp;
      var bexp2;
      var _conversions;
      var _instances;
      var _insInit;
      if (!_myTrait_.hasOwnProperty('__factoryClass')) _myTrait_.__factoryClass = []
      _myTrait_.__factoryClass.push(function(id) {

        if (!id) id = "_global_";

        if (!_instances) {
          _instances = {};
          _instances[id] = this;
        } else {
          if (_instances[id]) return _instances[id];
          _instances[id] = this;
        }
      });
      _myTrait_.animation = function(animName, settings) {

        var args = Array.prototype.slice.call(arguments),
          animName = args.shift(),
          settings = args.shift(),
          animKeyName = animName + "-keyframes",
          parts = args,
          t = 0,
          me = this,
          animStr = "";

        args.forEach(function(cssRuleObj) {
          if (me.isObject(cssRuleObj)) {
            var pros = parseInt(t * 100.00);
            animStr += pros + "% " + me.ruleToCss(cssRuleObj) + " \n";
            t = 1;
          } else {
            t = cssRuleObj;
          }
        });
        var fullStr = "";
        var exp = ["", "-o-", "-moz-", "-webkit-"];
        exp.forEach(function(r) {
          fullStr += "@" + r + "keyframes " + animKeyName + " { " + animStr + " } \n";
        })
        this._animations[animKeyName] = fullStr;

        var animDef = {};
        if (this.isObject(settings)) {
          var so = this.animSettings(settings);
          so["animation-name"] = animKeyName;
          this.bind("." + animName, so);
        } else {
          this.bind("." + animName, {
            animation: animKeyName + " " + settings
          });
        }

      }
      _myTrait_.animSettings = function(obj) {

        if (this.isObject(obj)) {
          var res = {};
          for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
              res["animation-" + n] = obj[n];
            }
          }
          return res;
        } else {
          return {};
        }
      }
      _myTrait_.assign = function(objectList) {
        var o = {},
          args;
        if (this.isArray(objectList)) {
          args = objectList;
        } else {
          args = Array.prototype.slice.call(arguments);
        }
        args.forEach(function(rules) {
          for (var n in rules) {
            if (rules.hasOwnProperty(n)) {
              o[n] = rules[n];
            }
          }
        });
        return o;

      }
      _myTrait_.bind = function(t) {
        // my rulesets...
        var args = Array.prototype.slice.call(arguments),
          rule = args.shift();

        this._data[rule] = args;
        this._dirty = true;

        return this;

      }
      _myTrait_.buildCss = function(mediaRule) {

        if (this._data) {
          var o = {};
          for (var rule in this._data) {
            if (this._data.hasOwnProperty(rule)) {
              var ruleData = this._data[rule];
              if (this._composedData[rule]) {
                ruleData = [this._composedData[rule]].concat(ruleData);
              }
              o[rule] = this.assign(ruleData);
            }
          }
          this._composedData = o;
          this.updateStyleTag(this.makeCss(o, mediaRule));
        }

      }
      _myTrait_.collectAnimationCss = function(t) {

        var anims = this._animations,
          str = "";

        for (var n in anims) {
          if (anims.hasOwnProperty(n)) str += anims[n];
        }
        return str;
      }
      _myTrait_.convert = function(n, v) {
        var str = "",
          gPos;

        if (v && v.indexOf && (gPos = v.indexOf("-gradient")) >= 0) {

          var start = gPos - 1,
            end = gPos + 8,
            bError = false;
          var legals = "lineardg-wbktmozp"; // repeating
          while (legals.indexOf(v.charAt(start)) >= 0) {
            start--;
            if (start <= 0) {
              start = 0;
              break;
            }
          }

          var pCnt = 1;

          while (v.charAt(end++) != "(");

          while (pCnt > 0) {
            if (v.charAt(end) == "(") pCnt++;
            if (v.charAt(end) == ")") pCnt--;
            end++;
            if (v.length < end) {
              bError = true;
              break;
            }
          }
          if (!bError) {
            var gradString = v.substring(start, end),
              s = v.substring(0, start),
              e = v.substring(end);
            var str = "";
            ["-webkit-", "", "-moz-", "-o-"].forEach(function(p) {
              str += n + " : " + s + " " + p + gradString + e + ";\n";
            });
          }


        }

        if (_conversions[n]) {
          str = _conversions[n](n, v);
        } else {
          str += n + " : " + v + ";\n";
        }
        return str;
      }
      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
        _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
      _myTrait_.__traitInit.push(function(cssPostFix) {
        // my rulesets...
        this._data = this._data || {};
        this._animations = {};
        this._composedData = this._composedData || {};

        this._postFix = cssPostFix || "";

        if (!head) {
          var me = this;
          later().every(1 / 10, function() {
            for (var id in _instances) {
              if (_instances.hasOwnProperty(id)) {
                var ins = _instances[id];
                if (ins._dirty) {
                  ins.buildCss();
                  ins._dirty = false;
                }
              }

            }

          });
        }
        if (!_insInit) _insInit = {};
        var id = cssPostFix || "_global_";
        if (!_insInit[id]) {
          _insInit[id] = true;
          this.initConversions();
        }


      });
      _myTrait_.initConversions = function(t) {
        head = document.getElementsByTagName('head')[0];
        var styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        if (styleTag.styleSheet) { // IE
          styleTag.styleSheet.cssText = "";
        } else { // the world
          styleTag.appendChild(document.createTextNode(""));
        }
        head.appendChild(styleTag);
        this._styleTag = styleTag;

        bexp = function(p, v) {
          var str = "";
          str += "-o-" + p + ":" + v + ";\n";
          str += "-moz-" + p + ":" + v + ";\n";
          str += "-webkit-" + p + ":" + v + ";\n";
          str += p + ":" + v + ";\n";
          return str;
        }

        bexp2 = function(p, v) {
          var str = "";
          str += "-o-" + p + ":" + "-o-" + v + ";\n";
          str += "-moz-" + p + ":" + "-moz-" + v + ";\n";
          str += "-webkit-" + p + ":" + "-webkit-" + v + ";\n";
          str += p + ":" + v + ";\n";
          return str;
        }

        _conversions = {
          "border-radius": function(n, v) {
            return bexp(n, v);
          },
          "box-shadow": function(n, v) {
            return bexp(n, v);
          },
          "rotate": function(n, v) {
            n = "transform";
            v = "rotate(" + parseInt(v) + "deg)";
            return bexp(n, v);
          },
          "transition": function(n, v) {
            return bexp2(n, v);
          },
          "filter": function(n, v) {
            return bexp(n, v);
          },
          "animation": function(n, v) {
            return bexp(n, v);
          },
          "animation-iteration-count": function(n, v) {
            return bexp(n, v);
          },
          "animation-name": function(n, v) {
            return bexp(n, v);
          },
          "animation-timing-function": function(n, v) {
            return bexp(n, v);
          },
          "animation-duration": function(n, v) {
            return bexp(n, v);
          },
          "transform": function(n, v) {
            return bexp(n, v);
          },
          "transform-style": function(n, v) {
            return bexp(n, v);
          },
          "transform-origin": function(n, v) {
            return bexp(n, v);
          },
          "perspective": function(n, v) {
            return bexp(n, v);
          },
          "text-shadow": function(n, v) {
            return bexp(n, v);
          },
          "opacity": function(n, v) {
            v = parseFloat(v);
            var str = '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=' + parseInt(v * 100) + ')";';
            str += 'filter: alpha(opacity=' + parseInt(v * 100) + ');';
            str += bexp(n, v);
            return str;
          }
        };

      }
      _myTrait_.makeCss = function(o, mediaRule) {
        var str = mediaRule ? mediaRule + "{" : "";

        for (var rule in o) {
          if (o.hasOwnProperty(rule)) {
            var cssRules = o[rule];
            str += rule + this._postFix + this.ruleToCss(cssRules);
          }
        }

        // add the animation css also into this mediarule...
        str += this.collectAnimationCss();

        str += mediaRule ? "}\n" : "";
        return str;
      }
      _myTrait_.ruleToCss = function(cssRulesObj) {
        var str = "{";
        for (var n in cssRulesObj) {
          str += this.convert(n, cssRulesObj[n]);
        }
        str += "}\n";
        return str;
      }
      _myTrait_.updateStyleTag = function(cssText) {
        var styleTag = this._styleTag,
          old = styleTag.firstChild;

        // console.log(cssText);

        if (styleTag.styleSheet) { // IE
          styleTag.styleSheet.cssText = cssText;
        } else { // the world
          var old = styleTag.firstChild;
          styleTag.appendChild(document.createTextNode(cssText));
          if (typeof(old) != "undefined") {
            styleTag.removeChild(old);
          }
        }

      }
    }(this));
  }
  var css = function(a, b, c, d, e, f, g, h) {
    if (this instanceof css) {
      var args = [a, b, c, d, e, f, g, h];
      if (this.__factoryClass) {
        var m = this;
        var res;
        this.__factoryClass.forEach(function(initF) {
          res = initF.apply(m, args);
        });
        if (Object.prototype.toString.call(res) == '[object Function]') {
          if (res._classInfo.name != css._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (this.__traitInit) {
        var m = this;
        this.__traitInit.forEach(function(initF) {
          initF.apply(m, args);
        })
      } else {
        if (typeof this.init == 'function')
          this.init.apply(this, args);
      }
    } else return new css(a, b, c, d, e, f, g, h);
  };
  css._classInfo = {
    name: 'css'
  };
  css.prototype = new css_prototype();
  if (typeof(window) != 'undefined') window['css'] = css;
  if (typeof(window) != 'undefined') window['css_prototype'] = css_prototype;;
  (function(_myTrait_) {
    _myTrait_.add = function(items) {
      if (!(items instanceof Array)) {
        items = Array.prototype.slice.call(arguments, 0);
      }
      var me = this;
      items.forEach(function(e) {

        //
        if (me.isFunction(e)) {
          var creator = e;
          var newItem = _e();
          var res = e.apply(newItem, [me]);
          if (res) {
            e = res;
          } else {
            e = newItem;
          }
          // optionally could be used later, 
          // e._creatorFn = creator;
        }

        if (typeof(e) == "string") {
          var nd = _e("span");
          nd._dom.innerHTML = e;
          me.add(nd);
          return me;
        }

        if (me.isStream(e)) {
          e.onValue(function(t) {
            me.add(t);
          });
          return me;
        }

        if (typeof(e) == "undefined") return;

        if (typeof(e._dom) != "undefined") {

          if (e._parent) {
            e._parent.removeChild(e);
          }

          if (!me._children) {
            me._children = [];
          }
          var ii = me._children.length;
          e._index = ii;
          me._children.push(e);
          e._parent = me;
          e._svg = me._svg;
          me._dom.appendChild(e._dom);

          e.trigger("parent", me);
          me.trigger("child", e);
        }
      });

      return this;
    }
    _myTrait_.addItem = function(items) {

      var list = Array.prototype.slice.call(arguments, 0);
      return this.add.apply(this, list);
    }
    _myTrait_.clear = function(t) {
      this._children = [];
      while (this._dom.firstChild) {
        this._dom.removeChild(this._dom.firstChild);
      }
      return this;
    }
    _myTrait_.collectFromDOM = function(elem) {
      // collecting the nodes from DOM -tree...

      var e = _e(elem);
      var len = elem.childNodes.length;

      var alen = elem.attributes.length;
      for (var i = 0; i < alen; i++) {
        var a = elem.attributes[i];
        e.q.attr(a.name, a.value);
      }

      var str = elem.className;
      if (str) {
        str = str + " ";
        var classes = str.split(" ");
        var clen = classes.length;
        for (var i = 0; i < clen; i++) {
          var a = classes[i];
          if (a) {
            e.addClass(a);
          }
        }
      }

      if (elem.innerText || elem.textContent) {
        e.text(elem.innerText || elem.textContent);
      }

      for (var i = 0; i < len; i++) {
        var sub = elem.childNodes[i];
        e.add(this.collectFromDOM(sub));
      }

      return e;


    }
    _myTrait_.insertAfter = function(newItem) {

      // referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

      if (!this._parent) return;
      if (!this._parent._children) return;

      if (newItem == this) {
        console.log("The items were the same!!!");
        return;
      }
      console.log("--- insert after ----");

      // var newItem = _e(a,b,c,d,e,f);
      var myIndex = this._index;
      var chList = this._parent._children;
      if (newItem._parent && (newItem._parent != this._parent)) {
        newItem._parent.removeChild(newItem);
        var myIndex = chList.indexOf(this);
        chList.splice(myIndex + 1, 0, newItem);
        this._parent.reIndex();
      } else {

        if (!newItem._parent) {
          newItem._parent = this._parent;
          chList.splice(myIndex + 1, 0, newItem);
        } else {
          var oldIndex = chList.indexOf(newItem);
          chList.splice(oldIndex, 1);
          var myIndex = chList.indexOf(this);
          console.log("--- insert placing into ", myIndex + 1, " ----");
          chList.splice(myIndex + 1, 0, newItem);
        }
        this._parent.reIndex();
      }

      var pDOM = newItem._dom;
      var mDOM = this._dom;
      mDOM.parentNode.insertBefore(pDOM, mDOM.nextSibling);
    }
    _myTrait_.insertAt = function(i, obj) {

      if (i < this._children.length) {
        var ch = this.child(i);
        ch.insertBefore(obj);
      } else {
        this.add(obj);
      }

    }
    _myTrait_.insertBefore = function(newItem) {

      if (!this._parent) return;
      if (!this._parent._children) return;

      if (newItem == this) {
        return;
      }

      // var newItem = _e(a,b,c,d,e,f);
      var myIndex = this._index;
      var chList = this._parent._children;

      if (newItem._parent && (newItem._parent != this._parent)) {
        newItem._parent.removeChild(newItem);
        newItem._parent = this._parent;
        var myIndex = chList.indexOf(this);
        chList.splice(myIndex, 0, newItem);
        this._parent.reIndex();
      } else {
        if (!newItem._parent) {
          newItem._parent = this._parent;
          chList.splice(myIndex, 0, newItem);
        } else {
          var oldIndex = chList.indexOf(newItem);
          if (oldIndex >= 0) chList.splice(oldIndex, 1);
          var myIndex = chList.indexOf(this);
          chList.splice(myIndex, 0, newItem);
        }
        this._parent.reIndex();
      }

      var pDOM = newItem._dom;
      var mDOM = this._dom;
      mDOM.parentNode.insertBefore(pDOM, mDOM);

      return this;

    }
    _myTrait_.moveDown = function(t) {
      if (typeof(this._index) != "undefined" && this._parent) {
        var myIndex = this._index,
          nextIndex;
        if (!this._parent) return;
        if (!this._parent._children) return;
        if (myIndex >= (this._parent._children.length - 1)) return;

        if (this._parent._children) {

          var next = this._parent._children[myIndex + 1];

          next._index--;
          this._index++;
          var chList = this._parent._children;

          chList.splice(myIndex + 1, 0, chList.splice(myIndex, 1)[0]);

          var pDOM = next._dom;
          var mDOM = this._dom;
          mDOM.parentNode.insertBefore(mDOM, pDOM.nextSibling);


        }
      }
    }
    _myTrait_.moveUp = function(t) {
      if (this._index && this._parent) {

        var myIndex = this._index,
          nextIndex;
        if (!myIndex) return;
        if (myIndex <= 0) return;
        if (this._parent._children) {

          var prev = this._parent._children[myIndex - 1];
          prev._index++;
          this._index--;
          var chList = this._parent._children;

          chList.splice(myIndex - 1, 0, chList.splice(myIndex, 1)[0]);

          var pDOM = prev._dom;
          var mDOM = this._dom;
          pDOM.parentNode.insertBefore(mDOM, pDOM);

        }
      }
    }
    _myTrait_.parent = function(t) {
      return this._parent;
    }
    _myTrait_.prepend = function(items) {
      if (!(items instanceof Array)) {
        items = Array.prototype.slice.call(arguments, 0);
      }
      var me = this;
      items.forEach(function(e) {
        if (typeof(e) == "string") {
          me._dom.innerHTML = e;
          return me;
        }

        if (typeof(e) == "undefined") return;

        if (typeof(e._dom) != "undefined") {

          if (e._parent) {
            e._parent.removeChild(e);
          }

          if (!me._children) {
            me._children = [];
          }

          e._index = 0;
          me._children.unshift(e);
          e._parent = me;
          me._dom.insertBefore(e._dom, me._dom.firstChild);

          var len = me._children.length;
          for (var i = 0; i < len; i++) me._children[i]._index = i;

          e.trigger("parent", me);
          me.trigger("child", e);
        }
      });

      return this;
    }
    _myTrait_.reIndex = function(t) {
      var chList = this._children;
      var i = 0;
      chList.forEach(function(ch) {
        ch._index = i++;
      });
    }
    _myTrait_.remove = function(t) {

      this.removeChildEvents();

      if (this._parent) {
        this._parent.removeChild(this);
      } else {
        var p = this._dom.parentElement;
        if (p) p.removeChild(this._dom);
      }
      this._children = [];
      this.removeAllHandlers();
    }
    _myTrait_.removeChild = function(o) {
      if (this._children) {

        var me = this;
        var i = this._children.indexOf(o);
        if (i >= 0) {
          this._children.splice(i, 1);
          this._dom.removeChild(o._dom);

        }
        this.reIndex();
      }
    }
    _myTrait_.removeChildEvents = function(t) {
      this.forChildren(function(ch) {
        ch.removeAllHandlers();
        ch.removeChildEvents();
      });
    }
    _myTrait_.removeIndexedChild = function(o) {
      if (this._children) {
        var i = this._children.indexOf(o);
        if (i >= 0) {
          this._children.splice(i, 1);
        }
      }
    }
    _myTrait_.replaceWith = function(elem) {
      // var a = A.parentNode.replaceChild(document.createElement("span"), A);

      var p = this.parent();
      if (p) {
        var pi = p._children.indexOf(this);
        p._dom.replaceChild(elem._dom, this._dom);
        p._children.splice(pi, 1, elem);
        elem._parent = p;
        elem._svg = this._svg;
        // copy the event handlers of not????
        // this.remove();
      }

    }
  }(this));;
  (function(_myTrait_) {
    var _mousePoint;
    _myTrait_.baconDrag = function(opts) {
      var me = this;
      return Bacon.fromBinder(function(sink) {
        me.drag(function(dv) {
          sink(dv);
        });
      });
    }
    _myTrait_.drag = function(callBack) {
      var me = this,
        state = {};

      if (this.isObject(callBack) && !this.isFunction(callBack)) {

        var objToDrag = callBack;
        var sx, sy;
        callBack = function(dv) {
          if (dv.start) {
            sx = objToDrag.x();
            sy = objToDrag.y();
          }
          objToDrag.x(sx + dv.dx).y(sy + dv.dy);
        }
      }

      this.draggable(function(o, dv) {
        state.item = me;
        state.sx = dv.x;
        state.sy = dv.y;
        state.dx = 0;
        state.dy = 0;
        state.x = dv.x;
        state.y = dv.y;
        state.start = true;
        state.end = false;
        callBack(state);
      }, function(o, dv) {
        state.start = false;
        state.dx = dv.dx;
        state.dy = dv.dy;
        state.x = state.sx + state.dx;
        state.y = state.sy + state.dy;
        callBack(state);
      }, function(o, dv) {
        state.end = true;
        state.dx = dv.dx;
        state.dy = dv.dy;
        callBack(state);
      });
      return this;
    }
    _myTrait_.draggable = function(startFn, middleFn, endFn) {
      var _eg = this.__singleton();
      _eg.draggable(this);

      if (startFn) this.on("startdrag", startFn);
      if (middleFn) this.on("drag", middleFn);
      if (endFn) this.on("enddrag", endFn);

    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {
      this._touchItems = [];
    });
    _myTrait_.mousePos = function(t) {
      if (!_mousePoint) {
        _mousePoint = {};
      }
      var off = this.offset(),
        _eg = this.__singleton(),
        m = _eg.mouse();


      _mousePoint.sx = m.x;
      _mousePoint.sy = m.y;
      _mousePoint.x = m.x - off.left;
      _mousePoint.y = m.y - off.top;
      return _mousePoint;
    }
    _myTrait_.pauseEvents = function(e) {
      e = e || window.event;

      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false;

      return false;
    }
    _myTrait_.touch = function(i) {
      return this._touchItems[i];

    }
    _myTrait_.touchclick = function(t) {
      this.touchevents();
      var o = this;
      this.on("touchstart", function(o, dv) {
        o.trigger("click");
      });
    }
    _myTrait_.touchevents = function(t) {

      // NOTE
      // http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx
      // http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
      // https://coderwall.com/p/egbgdw
      // http://jessefreeman.com/articles/from-webkit-to-windows-8-touch-events/

      var elem = this._dom;

      // No hope...
      if (!elem.addEventListener) return;

      var o = this;
      this._touchItems = [];

      var touchStart = function(e) {
        // NOTE: Removed the windows lines below when looking for touch events
        // if (window.navigator.msPointerEnabled && !e.isPrimary) return;
        o._touchItems = [];

        // NOTE: Removed the windows lines below when looking for touch events
        /*
                                 if(window.navigator.msPointerEnabled && e.pageX) {
                                    var item = {};
                                   
                                   item.startX = e.pageX;
                                   item.startY = e.pageY;
                                   o.trigger("touchstart");
                                   o._touchItems.push(item);
                                   if(e.preventDefault) e.preventDefault();
                                   return;
                               }*/
        // o.debug("touchStart");
        var allTouches = e.touches;
        if (e.targetTouches) allTouches = e.targetTouches;
        o._touchCount = allTouches.length;
        for (var i = 0; i < allTouches.length; i++) {
          var item = {};

          item.startX = allTouches[0].pageX;
          item.startY = allTouches[0].pageY;
          o._touchItems[i] = item;
        }

        o.trigger("touchstart");
        if (e.preventDefault) e.preventDefault();

        if (e.stopPropagation) e.stopPropagation();

        e.returnValue = false;


      };

      var touchMove = function(e) {
        // NOTE: Removed the windows lines below when looking at touch events
        /*
                               if (window.navigator.msPointerEnabled && !e.isPrimary) return;
                               if(window.navigator.msPointerEnabled && e.pageX) {
                                   //if(!o._touchItems) o._touchItems = [];
                                   //if(!o._touchItems[0]) o._touchItems[0] = {};
                                   var item = o._touchItems[0];
                                   item.dx = e.pageX - item.startX;
                                   item.dy = e.pageY - item.startY;
                                   o.trigger("touchmove");
                                   if(e.preventDefault) e.preventDefault();
                                   return;
                               }*/

        // var off = o.q.offset();
        var allTouches = e.touches;
        if (e.targetTouches) allTouches = e.targetTouches; // [0].pageX;)
        o._touchCount = allTouches.length;
        for (var i = 0; i < allTouches.length; i++) {
          var item = o._touchItems[i];

          item.dx = e.touches[i].pageX - item.startX;
          item.dy = e.touches[i].pageY - item.startY;
          //item.x = e.touches[i].pageX - off.left;
          //item.y = e.touches[i].pageY - off.top;
        }

        o.trigger("touchmove");


        if (e.preventDefault) e.preventDefault();
      };

      var touchEnd = function(e) {
        // o.q.css("transform", "rotate(20deg)");
        o.trigger("touchend");
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      };

      /*elem.addEventListener("touchcancel", function(e) {
                                 o.trigger("touchcancel");
                                 e.preventDefault();
                                 }, false);*/


      var msHandler = function(event) {
        // o.trigger("mstouch",event);
        switch (event.type) {
          case "touchstart":
          case "MSPointerDown":
            touchStart(event);
            break;
          case "touchmove":
          case "MSPointerMove":
            touchMove(event);
            break;
          case "touchend":
          case "MSPointerUp":
            touchEnd(event);
            break;
        }
        // if(event.preventDefault) event.preventDefault();
        event.returnValue = false;
        //                     event.preventDefault();
      }


      elem.addEventListener("touchstart", touchStart, false);
      elem.addEventListener("touchmove", touchMove, false);
      elem.addEventListener("touchend", touchEnd, false);



    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.absolute = function(t) {
      this.q.css("position", "absolute");
      this.x(0).y(0).z(this.baseZ());
      return this;



    }
    _myTrait_.baseZ = function(v) {
      if (typeof(v) != "undefined") {
        this._baseZ = v;
        return this;
      }
      if (typeof(this._baseZ) == "undefined") this._baseZ = 0;
      return this._baseZ;
    }
    _myTrait_.box = function(t) {
      var box = {
        left: 0,
        top: 0,
        width: 800,
        height: 800
      };

      var elem = this._dom;
      try {
        // BlackBerry 5, iOS 3 (original iPhone)
        if (typeof elem.getBoundingClientRect !== "undefined") {
          box = elem.getBoundingClientRect();
        }
      } catch (e) {
        // for IE having this bg
        box = {
          left: 0,
          top: 0,
          width: 800,
          height: 800
        };
      }
      return box;
    }
    _myTrait_.height = function(v) {
      if (typeof(v) == "undefined") return this._h;

      if (this.isStream(v)) {
        var me = this;
        v.onValue(function(v) {
          me.height(v);
        });
        return this;
      }

      if (this.isFunction(v)) {
        var oo = v(false, true),
          me = this;
        oo.me.on(oo.name, function(o, v) {
          me.height(v);
        });
        this.height(v());
        return this;
      }

      if (v == "auto") {
        this._dom.style.height = v;
        this._h = v;
        return this;
      }
      if (v.slice) {
        if (v.slice(-1) == "%") {
          this._dom.style.height = v;
          return this;
        }
        if (v.slice(-2) == "em") {
          this._dom.style.height = v;
          return this;
        }
      }

      var p = this.pxParam(v);
      if (typeof(p) != "undefined") {
        this._dom.style.height = p;
      }
      return this;
    }
    _myTrait_.hoverLayer = function(preventAll, zIndex) {
      // creates a layer which does not let through any events...

      var o = _e().absolute();
      var _eg = this.__singleton();



      // the max z-index for this layer...
      o._dom.zIndex = zIndex || 100000;
      /*
           if(startFn) this.on("startdrag", startFn);
           if(middleFn) this.on("drag", middleFn);
           if(endFn) this.on("enddrag", endFn);
           
           */

      if (preventAll) {
        o.addClass("Hoverlayer");
        o.draggable(function(o, dv) {
          console.log("hover, start drag");
        }, function(o, dv) {
          console.log("dragging ");
        }, function(o, dv) {
          console.log("end drag");
        });

        o.bindSysEvent("mouseenter", function() {
          o.trigger("mouseenter");
        }, true);

        o.bindSysEvent("mouseleave", function() {
          o.trigger("mouseleave");
        }, true);

        o.bindSysEvent("click", function() {
          o.trigger("click");
        }, true);

        o.bindSysEvent("mousedown", function() {
          o.trigger("mousedown");
          _eg.dragMouseDown(o);
        }, true);

        o.bindSysEvent("mouseup", function() {
          o.trigger("mouseup");
          _eg.dragMouseUp();
        }, true);
      }

      var off = this.offset();

      o.width(off.width);
      o.height(off.height);

      var rel = _e().relative();
      this.insertBefore(rel);
      rel.add(o);

      return o;



    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {

    });
    _myTrait_.offset = function(t) {
      var doc = document.documentElement;
      var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

      var box = this.box();
      return {
        top: box.top + scrollTop, // + document.body.scrollTop, //  - docElem.clientTop,
        left: box.left + scrollLeft, // + document.body.scrollLeft // - docElem.clientLeft
        width: box.width,
        height: box.height
      };
    }
    _myTrait_.pxParam = function(v) {
      if (typeof(v) == "string") {
        return parseInt(v) + "px";
      } else {
        var i = parseInt(v);
        if (!isNaN(i)) {
          return i + "px";
        }
      }
    }
    _myTrait_.relative = function(t) {
      this.q.css("position", "relative");
      this.x(0).y(0).z(this.baseZ());
      return this;

    }
    _myTrait_.width = function(v) {
      if (typeof(v) == "undefined") return this._w;

      if (this.isStream(v)) {
        var me = this;
        v.onValue(function(v) {
          me.width(v);
        });
        return this;
      }


      //console.log("Width = > ", v);
      if (this.isFunction(v)) {
        //console.log("Function ",v());
        var oo = v(false, true),
          me = this;
        //console.log(oo);
        //console.log(oo.me.on);
        oo.me.on(oo.name, function(o, v) {
          me.width(v);
        });

        this.width(v());
        return this;
      }

      if (v == "auto") {
        this._dom.style.width = v;
        this._w = v;
        return this;
      }

      if (v.slice) {
        if (v.slice(-1) == "%") {
          this._dom.style.width = v;
          return this;
        }
        if (v.slice(-2) == "em") {
          this._dom.style.width = v;
          return this;
        }
      }

      var p = this.pxParam(v);
      if (typeof(p) != "undefined") {
        this._dom.style.width = p;
      }
      return this;
    }
    _myTrait_.x = function(v) {

      if (this.isStream(v)) {
        var me = this;
        v.onValue(function(v) {
          me.x(v);
        });
        return this;
      }


      if (typeof(v) != "undefined") {
        if (this._svgElem) {
          var t = this.getTransform();

          if (!this._y) this._y = 0;
          if (!this._x) this._x = 0;
          var dx = v - this._x;
          this._x = v;
          if (dx != 0) {
            t.translate(dx, 0);
            this.q.attr("transform", t.getSvgTransform());
            this.trigger("x");
          }
          return this;
        }
        this.q.css("left", v + "px");
        this._x = v;
        this.trigger("x");
        return this;
      }
      if (typeof(this._x) == "undefined") this._x = 0;
      return this._x;
    }
    _myTrait_.y = function(v) {

      if (this.isStream(v)) {
        var me = this;
        v.onValue(function(v) {
          me.y(v);
        });
        return this;
      }

      if (typeof(v) != "undefined") {
        if (this._svgElem) {
          var t = this.getTransform();

          if (!this._y) this._y = 0;
          if (!this._x) this._x = 0;
          var dy = v - this._y;
          this._y = v;
          if (dy != 0) {
            t.translate(0, dy);
            this.q.attr("transform", t.getSvgTransform());
            this.trigger("y");
          }
          return this;
        }
        this.q.css("top", v + "px");
        this._y = v;
        this.trigger("y");
        return this;
      }
      if (typeof(this._y) == "undefined") this._y = 0;
      return this._y;
    }
    _myTrait_.z = function(v) {

      if (this.isStream(v)) {
        var me = this;
        v.onValue(function(v) {
          me.z(v);
        });
        return this;
      }

      var base = this._baseZ || 0;
      if (typeof(v) != "undefined") {
        this.q.css("zIndex", v + base);
        this._z = v;
        this.trigger("z");
        return this;
      }
      if (typeof(this._z) == "undefined") this._z = 0;
      return this._z;
    }
  }(this));;
  (function(_myTrait_) {
    var _effects;
    _myTrait_.applyTransforms = function(tx) {
      var d = this._dom;
      d.style["transform"] = tx;
      d.style["-webkit-transform"] = tx;
      d.style["-moz-transform"] = tx;
      d.style["-ms-transform"] = tx;
      this.trigger("transform");
      return this;
    }
    _myTrait_.createEffect = function(name, inPosition, outPosition, options) {

      css().bind("." + name + "OutPosition", outPosition);
      css().bind("." + name + "InPosition", inPosition);

      options = options || {};
      options.duration = options.duration || 0.2;

      css().animation(name + "Out", {
        duration: (options.duration.toFixed(2) * 2) + "s",
        "iteration-count": 1,
      }, inPosition, 0.5, outPosition, outPosition);

      css().animation(name + "In", {
        duration: (options.duration.toFixed(2) * 2) + "s",
        "iteration-count": 1,
      }, outPosition, 0.5, inPosition, inPosition);

      _effects[name] = options;


    }
    _myTrait_.css = function(options) {

      if (!this._myClass) {
        this._myClass = this.guid();
        this._css = css(this._myClass);
      }

      return this._css;


    }
    _myTrait_.effectIn = function(name, fn) {

      if (!this._effectOn) this._effectOn = {};

      if (this._effectOn[name]) {
        return;
      }

      if (!this._effectState) {
        this._effectState = {};
        this._effectState[name] = 1;
        return;
      }

      if (this._effectState[name] == 1) return;

      this._effectOn[name] = (new Date()).getTime();

      var options = _effects[name];

      var eOut = name + "Out",
        eIn = name + "In",
        eInPos = name + "InPosition",
        eOutPos = name + "OutPosition";

      this.removeClass(eOut);
      this.removeClass(eIn);
      this.addClass(eIn);
      var me = this;
      later().after(options.duration, function() {
        me.removeClass(eOutPos);
        me.addClass(eInPos);
        me.removeClass(eIn);
        me._effectOn[name] = 0;
        me._effectState[name] = 1;
        if (fn) fn();
      });

    }
    _myTrait_.effectOut = function(name, fn) {
      if (!this._effectOn) this._effectOn = {};

      if (this._effectOn[name]) {
        return;
      }
      if (!this._effectState) {
        this._effectState = {};
        this._effectState[name] = 1;
      }
      if (this._effectState[name] == 2) return;

      this._effectOn[name] = (new Date()).getTime();

      var options = _effects[name];

      var eOut = name + "Out",
        eIn = name + "In",
        eInPos = name + "InPosition",
        eOutPos = name + "OutPosition";

      this.removeClass(eOut);
      this.removeClass(eIn);
      this.addClass(eOut);
      var me = this;
      later().after(options.duration, function() {
        me.removeClass(eInPos);
        me.addClass(eOutPos);
        me.removeClass(eOut);
        me._effectOn[name] = 0;
        me._effectState[name] = 2;
        if (fn) fn();
      });
    }
    _myTrait_.hide = function(t) {
      this._dom.style.display = "none";
      this.trigger("hide");


    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {
      if (!_effects) {
        _effects = {};
      }
    });
    _myTrait_.show = function(t) {
      this._dom.style.display = "";
      this.trigger("show");

    }
    _myTrait_.style = function(v) {
      if (typeof(v) != "undefined") {
        // should we have named styles... perhaps... TODO
      }
      if (!this._localStyle) {
        var createStyleGuid = "localstyle" + (new Date()).getTime() + "_" + guid();
        this._localStyle = css().css("width", "auto");
        this._localStyle.writeRule(createStyleGuid);
        this.addClass(createStyleGuid);
      }
      return this._localStyle;
    }
    _myTrait_.styleString = function(value) {
      // TODO: binding the style string???
      this._dom.style.cssText = value;
      return this;
    }
    _myTrait_.transform = function(name, value) {
      if (!this._transforms) this._transforms = [];
      if (typeof(value) == "undefined") {

        if (this._transforms.indexOf(name) >= 0) {
          var vi = this._transforms.indexOf(name);
          var val = this._transforms[vi + 1];
          var v = val.substr(1, val.length - 2);
          return v;
        }
        return;
      }
      if (this._transforms.indexOf(name) == -1) {
        this._transforms.push(name);
        this._transforms.push("(" + value + ")");
        this._transforms.push(" ");
      } else {
        var vi = this._transforms.indexOf(name);
        this._transforms[vi + 1] = "(" + value + ")";
      }

      var tx = this._transforms.join("");
      this.applyTransforms(tx);
      return this;
    }
    _myTrait_.transformOrigin = function(tx) {
      var d = this._dom;
      d.style["transform-origin"] = tx;
      d.style["-webkit-transform-origin"] = tx;
      d.style["-moz-transform-origin"] = tx;
      d.style["-ms-transform-origin"] = tx;
      this.trigger("transform-origin");
      return this;
    }
    _myTrait_.transformString = function(t) {
      if (!this._transforms) return "";
      return this._transforms.join("");
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.addRow = function(items) {
      var row = new _e("tr");
      this.addItem(row);

      row.addClass("row" + this._children.length);

      if (!(Object.prototype.toString.call(items) === '[object Array]')) {
        items = Array.prototype.slice.call(arguments, 0);
      }


      var colIndex = 0,
        me = this;
      items.forEach(function(ii) {
        var cell = new _e("td");
        cell._dom.setAttribute("valign", "top");
        if (me.isObject(ii)) {
          cell.add(ii);
        } else {
          cell.text(ii);
        }
        row.addItem(cell);
        cell.addClass("col" + colIndex);
        colIndex++;
      });
      return this;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.child = function(i) {
      if (this._children[i]) {
        return this._children[i];
      }
    }
    _myTrait_.domAttrIterator = function(elem, fn) {

      if (!elem) return;
      if (!elem.attributes) return;

      for (var i = 0; i < elem.attributes.length; i++) {
        var attrib = elem.attributes[i];
        if (attrib.specified) {
          fn(attrib.name, attrib.value);
        }
      }
    }
    _myTrait_.domIterator = function(elem, fn, nameSpace) {

      if (!elem) return;

      var noRecurse = {
        "textarea": true
      };


      var childNodes = elem.childNodes;
      if (childNodes) {
        var len = childNodes.length;
        for (var i = 0; i < len; i++) {
          var child = childNodes[i];
          if (child.tagName == "svg") nameSpace = "svg";
          if (child) {
            var bStop = fn(child, nameSpace);
            if (bStop) {
              // console.log("**** SHOULD NOT ITERATE CHILDREN *****");
            } else {
              var bFullElem = child instanceof HTMLElement;
              if (bFullElem) {
                var tN = child.tagName.toLowerCase();
                if (!noRecurse[tN])
                  this.domIterator(child, fn, nameSpace);
              }
            }

          }
        }
      }

    }
    _myTrait_.forChildren = function(fn) {
      if (this._children) {
        this._children.forEach(function(c) {
          fn(c);
          // c.forChildren(fn);
        });
      }
    }
    _myTrait_.forEach = function(fn) {
      if (this._children)
        this._children.forEach(function(c) {
          fn(c);
          // c.forChildren(fn);
        });
    }
    _myTrait_.searchTree = function(fn, list) {
      if (!list) list = [];
      var v;
      if (v = fn(this)) list.push(v)
      if (this._children)
        this._children.forEach(function(c) {
          // if(fn(c)) list.push(c);
          c.searchTree(fn, list);
        });
      return list;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.addClass = function(c) {
      // safari problem
      if (this._svg) return this;

      if (!this._classes) {
        this._classes = [];
      }

      if (this.isStream(c)) {

        var me = this,
          oldClass = "";
        c.onValue(function(c) {
          if (oldClass && (c != oldClass)) {
            me.removeClass(oldClass);
          }
          me.addClass(c);
          oldClass = c;
        });

        return this;
      }

      var pf = this.findPostFix();

      if (pf) {
        this._classes.push(c + pf);
        this._dom.className = this._classes.join(" ");
      }

      this._classes.push(c);
      this._dom.className = this._classes.join(" ");

      return this;
    }
    _myTrait_.findPostFix = function(str) {

      if (this._myClass) {
        return this._myClass;
      } else {
        var p = this.parent();
        if (p) return p.findPostFix();
      }
      return "";
    }
    _myTrait_.hasClass = function(c) {
      if (!this._classes) return false;
      if (this._classes.indexOf(c) >= 0) return true;
      return false;
    }
    _myTrait_.removeClass = function(c) {
      if (!this._classes) return this;
      var i;
      while ((i = this._classes.indexOf(c)) >= 0) {
        if (i >= 0) {
          this._classes.splice(i, 1);
          this._dom.className = this._classes.join(" ");
        }
      }

      var pf = this.findPostFix();

      if (pf) {
        while ((i = this._classes.indexOf(c + pf)) >= 0) {
          if (i >= 0) {
            this._classes.splice(i, 1);
            this._dom.className = this._classes.join(" ");
          }
        }
      }

      return this;
    }
  }(this));;
  (function(_myTrait_) {
    var _routes;
    _myTrait_.bacon = function(eventName, eventTransformer) {

      return Bacon.fromEvent(this._dom, eventName, eventTransformer); // (this._dom, eventName [, eventTransformer]) 

    }
    _myTrait_.bindSysEvent = function(en, fn, stop) {
      en = en.toLowerCase();
      if (!this._sys) this._sys = {};
      if (this._sys[en]) return false;

      this._sys[en] = true;

      var me = this;

      if (this._dom.attachEvent) {
        if (!stop) {
          this._dom.attachEvent("on" + en, fn);
        } else {
          this._dom.attachEvent("on" + en, function(e) {
            e = e || window.event;
            me._event = e;
            fn();
            if (stop) {
              e = window.event;
              if (e) e.cancelBubble = true;
            }
          });
        }

      } else {
        if (!stop) {
          this._dom.addEventListener(en, fn);
        } else {
          this._dom.addEventListener(en, function(e) {
            e = e || window.event;
            me._event = e;
            if (stop) {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              } else {
                e = window.event;
                e.cancelBubble = true;
              }
            }
            fn();
          });
        }
      }
      return true;
    }
    _myTrait_.delegate = function(myDelecate) {

      if (!this._delegates) this._delegates = [];
      this._delegates.push(myDelecate);

    }
    _myTrait_.emitValue = function(scope, data) {
      if (this._controller) {
        if (this._controller[scope]) {
          this._controller[scope](data);
          return;
        }
      }

      if (this._valueFn && this._valueFn[scope]) {
        this._valueFn[scope](data);
      } else {
        if (this._parent) this._parent.emitValue(scope, data);
      }
    }
    _myTrait_.eventBinder = function(dom, eventName, fn, stop) {
      var me = this;
      if (dom.attachEvent) {
        dom.attachEvent("on" + eventName, function(e) {
          e = e || window.event;
          me._event = e;
          fn();
          if (stop) {
            e = window.event;
            if (e) e.cancelBubble = true;
          }
        });
      } else {
        dom.addEventListener(eventName, function(e) {
          e = e || window.event;
          me._event = e;
          if (stop) {
            if (e && e.stopPropagation) {
              e.stopPropagation();
            } else {
              e = window.event;
              e.cancelBubble = true;
            }
          }
          fn();
        });
      }
    }
    _myTrait_.isHovering = function(t) {
      if (!this._hoverable) {
        this._hovering = false;
        var o = this;

        this.on("mouseenter", function() {
          // console.log("Entered...");
          o._hovering = true;
        });
        this.on("mouseleave", function() {
          o._hovering = false;
        });
        this._hoverable = true;
      }
      return this._hovering;
    }
    _myTrait_.namedListener = function(name, fn) {

      if (typeof(fn) != "undefined") {

        if (!this._namedListeners)
          this._namedListeners = {};
        this._namedListeners[name] = fn;
        fn._listenerName = name;
        return this;
      }
      if (!this._namedListeners) return;
      return this._namedListeners[name];
    }
    _myTrait_.on = function(en, ef) {
      if (!this._ev) this._ev = {};
      if (!this._ev[en]) this._ev[en] = [];

      this._ev[en].push(ef);
      var me = this;

      ef._unbindEvent = function() {
        me.removeListener(en, ef);
      }

      // To stop the prop...
      if (en == "click") this.bindSysEvent("click", function() {
        me.trigger("click");
      }, true);

      if (en == "dblclick") this.bindSysEvent("dblclick", function() {
        me.trigger("dblclick");
      }, true);

      if (en == "mousedown") this.bindSysEvent("mousedown", function() {
        me.trigger("mousedown");
      });

      if (en == "mouseup") this.bindSysEvent("mouseup", function() {
        me.trigger("mouseup");
      });

      if (en == "checked") {

        this.bindSysEvent("change", function() {
          if (me._type == "checkbox") {
            if (me._dom.checked) {
              me._checked = true;
            } else {
              me._checked = false;
            }
            me.trigger("checked");
          } else {
            me._value = me._dom.value;
          }
          me.trigger("value");
        });

      }

      if (en == "value") {
        this.bindSysEvent("change", function() {


          if (me._type == "checkbox") {
            if (me._dom.checked) {
              me._checked = true;
            } else {
              me._checked = false;
            }
            me.trigger("checked");
          } else {
            me._value = me._dom.value;
          }
          me.trigger("value");
        });

        if (this._type == "input" || this._type == "textarea") {
          var lastValue = "";
          this.bindSysEvent("keyup", function() {
            var bch = false;
            if (lastValue != me._dom.value) bch = true;
            me._value = me._dom.value;
            if (bch) me.trigger("value");
            lastValue = me._dom.value;
          });


        }
      }

      if (en == "focus") {
        this.bindSysEvent("focus", function() {
          me._value = me._dom.value;
          me.trigger("focus");
        });
      }

      if (en == "play") {
        this.bindSysEvent("play", function() {
          me.trigger("play");
        });
      }

      if (en == "mousemove") {
        this.bindSysEvent("mousemove", function() {
          me.trigger("mousemove");
        });
      }

      if (en == "blur") {
        this.bindSysEvent("blur", function() {
          me._value = me._dom.value;
          me.trigger("blur");
        });
      }

      if (en == "mouseenter") {
        if (this._dom.attachEvent) {
          this.bindSysEvent("mouseenter", function(e) {
            e = e || window.event;
            if (me._hover) return;
            me._event = e;
            me._hover = true;
            me.trigger("mouseenter");
          });
          this.bindSysEvent("mouseleave", function(e) {
            e = e || window.event;
            if (!me._hover) return;
            me._event = e;
            me._hover = false;
            me.trigger("mouseleave");
          });
        } else {

          this.bindSysEvent("mouseover", function(e) {
            e = e || window.event;
            if (me._hover) return;
            me._hover = true;
            me._event = e;
            if (me._parent) {
              if (!me._parent._hover) {
                me._parent.trigger("mouseenter");
              }
              // me._parent._childHover = true;
            }
            // console.log("Mouse over xxx");
            me.trigger("mouseenter");
          });
          this.bindSysEvent("mouseout", function(e) {
            if (!me._hover) return;

            var childHover = false;
            me.forChildren(function(c) {
              if (c._hover) childHover = true;
            });

            if (childHover) return;

            me._hover = false;

            me.trigger("mouseleave");
          });

        }


      }

      return this;
    }
    _myTrait_.onValue = function(scope, fn) {
      if (!this._valueFn) {
        this._valueFn = {};
      }
      this._valueFn[scope] = fn;
    }
    _myTrait_.removeAllHandlers = function(t) {

      if (this._ev) {
        // console.log("Removing handlers....");
        for (var n in this._ev) {
          if (this._ev.hasOwnProperty(n)) {
            var list = this._ev[n],
              me = this;
            //console.log("Removing list....", list);
            list.forEach(function(fn) {
              if (me._namedListeners) {
                var ln = fn._listenerName;
                if (me._namedListeners[ln]) {
                  delete me._namedListeners[ln];
                }
              }
              if (fn._unbindEvent) {
                //console.log("Calling unbind event... for ", fn);
                fn._unbindEvent();
              }
            });
          }
        }
        for (var n in this._namedListeners) {
          if (this._namedListeners.hasOwnProperty(n)) {
            var fn = this._namedListeners[n];
            if (fn._unbindEvent) {
              //console.log("Calling unbind event... for ", fn);
              fn._unbindEvent();
            }
            delete this._namedListeners[n];
          }
        }
      }
    }
    _myTrait_.removeListener = function(eventName, fn) {
      if (this._ev && this._ev[eventName]) {
        var i = this._ev[eventName].indexOf(fn);
        if (i >= 0) this._ev[eventName].splice(i, 1);

        if (this._ev[eventName].length == 0) {
          delete this._ev[eventName];
        }
      }
    }
    _myTrait_.router = function(eventName, fn) {

      var me = this;
      this._dom.addEventListener(eventName, function(event) {
        var elem = event.target;
        if (!elem) return;
        var routeId = elem.getAttribute("data-routeid");
        if (routeId) {
          var obj = _routes[routeId];
          if (obj) fn(obj);
        }
      });
    }
    _myTrait_.setRoute = function(obj, recursive) {

      var routeId = this.guid();
      this._dom.setAttribute("data-routeid", routeId);
      if (!_routes) _routes = {}
      if (recursive) {
        this.forChildren(function(ch) {
          ch.setRoute(obj, recursive);
        });
      }
      _routes[routeId] = obj;
    }
    _myTrait_.trigger = function(en, data, fn) {
      if (this._delegates) {
        this._delegates.forEach(function(d) {
          if (d && d.trigger) d.trigger(en, data, fn);
        });
        // return;
      }
      if (!this._ev) return;
      if (!this._ev[en]) return;
      var me = this;
      this._ev[en].forEach(function(cb) {
        cb(me, data, fn)
      });
      return this;
    }
    _myTrait_.uniqueListener = function(listenerName, fn) {
      var oldList = this.namedListener(listenerName);
      if (oldList) {
        if (oldList._unbindEvent) oldList._unbindEvent();
      }
      this.namedListener(listenerName, fn);
      return fn;

    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.bind = function(obj, varName) {
      var o = this;
      // The special case here...
      if (this.isFunction(obj[varName])) {


        var val = obj[varName](),
          o = this,
          fn = function(v) {
            obj[varName](v);
          },
          bSendingEvent = false,
          me = this;

        //
        //  var isNumber = !isNaN(val);

        var isNumber = false;

        var oo = obj;

        var valueInListener = this.uniqueListener("bind:valueIn", function(obj, newVal) {
          if (bSendingEvent) return;
          if (o._type == "checkbox") {
            o.checked(newVal);
          } else {
            o.val(newVal);
          }
          val = newVal;
        });
        var valueOutListener = this.uniqueListener("bind:valueOut", function(obj) {
          bSendingEvent = true;
          if (o._type == "checkbox") {
            fn(o.checked());
          } else {
            fn(isNumber ? parseFloat(o.val()) : o.val());
          }
          bSendingEvent = false;
        });

        //



        var invalidInputListener = this.uniqueListener("bind:invalidIn", function(obj, msg) {
          o.trigger("invalid", msg);
        });
        var validInputListener = this.uniqueListener("bind:validIn", function(obj, newVal) {
          o.trigger("valid", newVal);
        });

        obj.on(varName, valueInListener);
        this.on("value", valueOutListener);

        //oo.me.on(oo.name, valueInListener );
        //this.on("value", valueOutListener); 
        //oo.me.on("invalid-"+oo.name, invalidInputListener);    
        //oo.me.on("valid-"+oo.name, validInputListener);       


        var me = this;
        if (o._type == "checkbox") {
          o.checked(val);
        } else {
          o.val(val);
        }

        // and exit...
        return this;
      }

      var _ee_ = this.__singleton();
      _ee_.bind(obj, varName, this);
      var o = this;
      this.on("datachange", function() {
        if (o._type == "checkbox") {
          if (obj[varName]) {
            o.checked(true);
          } else {
            o.checked(false);
          }
        } else {

          if (typeof(obj[varName]) != "undefined") {
            o.val(obj[varName]);
          }

        }
      });
      this.on("value", function() {
        if (obj) {

          if (o._type == "checkbox") {

            if (o.checked()) {
              obj[varName] = true;
            } else {
              obj[varName] = false;
            }

          } else {
            obj[varName] = o.val();
          }

        }
        // Send the message to other listeners
        _ee_.send(obj, varName, "datachange", o);
      });

      if (obj) {
        if (o._type == "checkbox") {

          if (obj[varName]) {
            o.checked(true);
          } else {
            o.checked(false);
          }
        } else {

          if (obj[varName]) {
            o.val(obj[varName]);
          }

        }
      }
      return o;
    }
    _myTrait_.blur = function(t) {
      if (this._dom.blur) this._dom.blur();
    }
    _myTrait_.checked = function(v) {
      if (typeof(v) == "undefined") {

        // if(typeof( this._checked)=="undefined") {
        this._checked = this._dom.checked;
        // this.trigger("value");
        return this._checked;
      }

      var nowOn = this._dom.checked;
      this._dom.checked = v;

      if ((nowOn && !v) || (!nowOn && v)) {
        this.trigger("value");
      }

      return this;
    }
    _myTrait_.clearOptions = function(t) {
      if (this._dataList) {
        var node = this._dataList._dom;
        if (node.parentNode) node.parentNode.removeChild(node);
        this._options = {};
        this._dataList = null;
      }
    }
    _myTrait_.focus = function(t) {
      if (this._dom.focus) this._dom.focus();
    }
    _myTrait_.options = function(list) {
      // creates the input options for html5 usage...

      if (this._tag == "input") {
        if (this._dataList) {
          var node = this._dataList._dom;
          if (node.parentNode) node.parentNode.removeChild(node);
          this._options = {};
          this._dataList = null;
        }
        if (!this._dataList) {
          this._options = {};
          this._dataList = _e("datalist");
          this._dataListId = this.guid();
          this._dataList.q.attr("id", this._dataListId);
          // console.log("DATA", list);
          if (Object.prototype.toString.call(list) === '[object Array]') {
            var me = this;
            list.forEach(function(n) {
              var opt = _e("option");
              opt.q.attr("value", n);
              opt.text(n);
              me._options[n] = opt;
              me._dataList.add(opt);
            });
          } else {
            for (var n in list) {
              if (this._options[n]) continue;
              if (list.hasOwnProperty(n)) {
                var opt = _e("option");
                opt.q.attr("value", n);
                opt.text(list[n]);
                this._options[n] = opt;
                this._dataList.add(opt);
              }
            }
          }

          this.q.attr("list", this._dataListId);
          if (document.body) {
            document.body.appendChild(this._dataList._dom);
          }
        } else {

        }
        /*
               <label>Your favorite fruit:
           <datalist id="fruits">
           <option value="Blackberry">Blackberry</option>
           <option value="Blackcurrant">Blackcurrant</option>
           <option value="Blueberry">Blueberry</option>
           <!-- … -->
           </datalist>
           If other, please specify:
           <input type="text" name="fruit" list="fruits">
           </label>
               */
      }
      return this;
    }
    _myTrait_.toBacon = function(transformFn) {

      var me = this;
      later().asap(function() {
        if (typeof(me.val()) != "undefined") {
          me.trigger("value");
        }
      });

      return Bacon.fromBinder(function(sink) {
        me.on("value", function(o, v) {
          if (transformFn) {
            sink(transformFn(me.val()));
          } else {
            sink(me.val());
          }
        });
        return function() {

        }
      });
    }
    _myTrait_.val = function(v) {
      if (typeof(v) == "undefined") {
        if (this._type == "select" || this._type == "input" || this._type == "textarea") {
          this._value = this._dom.value;
        }
        return this._value;
      }

      /*
           if(this.isFunction(v)) {
               
               var myVal = v();
               this._dom.value = myVal;
               
               // re-bind the event listener to another if already is listening to a change...
               
               
               return this;
           }
           */


      if (typeof(this._dom.value) != "undefined" || this._type == "option") {
        this._dom.value = v;
      } else {
        this._dom.innerHTML = v;
      }
      this._value = v;
      this.trigger("value");
      return this;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.a = function(className, attrs) {
      var el = this.shortcutFor("a", className, attrs);
      return el;
    }
    _myTrait_.attr = function(v, v2) {

      if (this.isObject(v)) {
        for (var n in v) {
          if (v.hasOwnProperty(n)) {
            this.q.attr(n, v[n]);
          }
        }

      } else {
        this.q.attr(v, v2);
      }
      return this;
    }
    _myTrait_.b = function(className, attrs) {
      var el = this.shortcutFor("b", className, attrs);
      return el;
    }
    _myTrait_.button = function(className, attrs) {
      var el = this.shortcutFor("button", className, attrs);
      return el;
    }
    _myTrait_.canvas = function(className, attrs) {
      var el = this.shortcutFor("canvas", className, attrs);
      return el;
    }
    _myTrait_.checkbox = function(className, attrs) {
      var el = this.shortcutFor("checkbox", className, attrs);
      return el;
    }
    _myTrait_.ctx = function(t) {
      if (this._dom.getContext) {
        return this._dom.getContext("2d")
      }
    }
    _myTrait_.div = function(className, attrs) {
      var el = this.shortcutFor("div", className, attrs);
      return el;
    }
    _myTrait_.form = function(className, attrs) {
      var el = this.shortcutFor("form", className, attrs);
      return el;
    }
    _myTrait_.h1 = function(className, attrs) {
      var el = this.shortcutFor("h1", className, attrs);
      return el;
    }
    _myTrait_.h2 = function(className, attrs) {
      var el = this.shortcutFor("h2", className, attrs);
      return el;
    }
    _myTrait_.h3 = function(className, attrs) {
      var el = this.shortcutFor("h3", className, attrs);
      return el;
    }
    _myTrait_.h4 = function(className, attrs) {
      var el = this.shortcutFor("h4", className, attrs);
      return el;
    }
    _myTrait_.img = function(className, attrs) {
      var el = this.shortcutFor("img", className, attrs);
      return el;
    }
    _myTrait_.input = function(className, attrs) {
      var el = this.shortcutFor("input", className, attrs);
      return el;
    }
    _myTrait_.label = function(className, attrs) {
      var el = this.shortcutFor("label", className, attrs);
      return el;
    }
    _myTrait_.li = function(className, attrs) {
      var el = this.shortcutFor("li", className, attrs);
      return el;
    }
    _myTrait_.ol = function(className, attrs) {
      var el = this.shortcutFor("ol", className, attrs);
      return el;
    }
    _myTrait_.p = function(className, attrs) {
      var el = this.shortcutFor("p", className, attrs);
      return el;
    }
    _myTrait_.pre = function(className, attrs) {
      var el = this.shortcutFor("pre", className, attrs);
      return el;
    }
    _myTrait_.row = function(params) {
      var args = Array.prototype.slice.call(arguments);
      if (this._tag == "table") {
        this.addRow(args);
        return this;
      }

      var tbl = this.table();
      tbl.addRow(args);
      return tbl;
    }
    _myTrait_.shortcutFor = function(name, className, attrs) {
      var el = _e(name);
      this.add(el);


      var constr = [],
        classes = [],
        attrs = [];

      var args = Array.prototype.slice.call(arguments);
      args.shift();
      var me = this;

      args.forEach(function(a, i) {
        if (classes.length == 0 && (typeof a == "string")) {
          classes.push(a);
          return;
        }
        if (classes.length == 0 && me.isStream(a)) {
          classes.push(a);
          return;
        }
        if (attrs.length == 0 && me.isObject(a) && !me.isFunction(a)) {
          attrs.push(a);
          return;
        }
        if (constr.length == 0 && me.isFunction(a)) {
          constr.push(a);
          return;
        }
      });

      classes.forEach(function(c) {
        el.addClass(c)
      });
      attrs.forEach(function(attrs) {
        for (var n in attrs) {
          if (attrs.hasOwnProperty(n)) {
            el.q.attr(n, attrs[n]);
          }
        }
      });
      constr.forEach(function(c) {
        c.apply(el, [el]);
      });
      /*
           if(this.isFunction(className)) {
               _constr = className;
           } else {
               if(this.isStream(className)) {
                   el.addClass(className);
               } else {
                   if(this.isObject(className) && !this.isFunction(className)) {
                       attrs = className;
                   } else {
                       if(className) el.addClass(className || "");
                   }
               }
           }
           if(attrs) {
               for(var n in attrs) {
                   if(attrs.hasOwnProperty(n)) {
                       el.q.attr(n, attrs[n]);
                   }
               }
           }
           
           if(_constr) {
               _constr.apply(el, [el]);
           }
           */

      return el;
    }
    _myTrait_.span = function(className, attrs) {
      var el = this.shortcutFor("span", className, attrs);
      return el;
    }
    _myTrait_.src = function(src) {
      if (this._tag == "img") {
        if (!this._hasLoadL) {
          var me = this;
          this.__singleton().addEventListener(this._dom, "load", function() {
            me.trigger("load");
          });
          this._hasLoadL = true;
        }
      }
      this.q.attr("src", src);

      return this;
    }
    _myTrait_.strong = function(className, attrs) {
      var el = this.shortcutFor("strong", className, attrs);
      return el;
    }
    _myTrait_.table = function(className, attrs) {
      var el = this.shortcutFor("table", className, attrs);
      return el;
    }
    _myTrait_.textarea = function(className, attrs) {
      var el = this.shortcutFor("textarea", className, attrs);
      return el;
    }
    _myTrait_.ul = function(className, attrs) {
      var el = this.shortcutFor("ul", className, attrs);
      return el;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_._setDomText = function(elem, text) {
      if (typeof(elem.textContent) != "undefined") {
        elem.textContent = text;
      } else {
        var html = text;
        var div = document.createElement("div");
        div.innerHTML = html;
        var newText = div.innerText || "";
        elem.innerHTML = newText;
      }
    }
    _myTrait_.html = function(h) {

      // test if the value is a stream
      if (this.isStream(h)) {
        var me = this;
        // TODO: check if we are re-binding two streams on the same element, possible error
        h.onValue(function(t) {
          // 
          me.clear();
          me.add(t);
          //me._dom.innerHTML = t;
          //me._html = t;
        });
        return this;
      }

      if (this.isFunction(h)) {

        var val = h();
        var oo = h(null, true),
          me = this;
        oo.me.on(oo.name, me.uniqueListener("text:value", function(o, v) {
          me._dom.innerHTML = v;
        }));
        this._dom.innerHTML = val;
        return this;
      }

      if (typeof(h) == "undefined") return this._dom.innerHTML;
      this._dom.innerHTML = h;
      return this;
    }
    _myTrait_.text = function(t) {
      if (typeof(t) == "undefined") return this._html;

      var args = Array.prototype.slice.call(arguments);

      if (args.length > 1) {

        var bHadNonS = false,
          me = this;
        args.forEach(function(o) {
          if (me.isObject(o) && !me.isStream(o)) bHadNonS = true;
        });

        if (bHadNonS) {
          this.clear();
          this.add(args);
          return this;
        }
        t = this.str(args);
      }

      if (this.isObject(t)) {
        if (t.onValue) {
          var me = this;
          // TODO: check if we are re-binding two streams on the same element, possible error
          t.onValue(function(t) {
            if (me._svgElem || typeof(me._dom.textContent) != "undefined") {
              me._dom.textContent = t;
            } else {
              var html = t;
              var div = document.createElement("div");
              div.innerHTML = html;
              var newText = div.textContent || div.innerText || "";
              me._dom.innerHTML = newText;
            }
            me._html = t;
          });
          return this;
        }
      }

      if (this.isFunction(t)) {

        var val = t();
        var oo = t(null, true),
          me = this,
          soon = later(),
          bTSpan = false;

        if (me._tag == "tspan") bTSpan = true;

        if (this._svgElem || typeof(me._dom.textContent) != "undefined") {
          oo.me.on(oo.name, me.uniqueListener("text:value", function(o, v) {
            if (bTSpan) v = v.trim();
            // soon.add(me.text, me, v);
            if (bTSpan && (!v || v.length == 0)) {
              me._dom.textContent = '\u00A0';

            } else {
              me._dom.textContent = v;
            }
          }));
        } else {
          oo.me.on(oo.name, me.uniqueListener("text:value", function(o, v) {
            var html = v;
            var div = document.createElement("div");
            div.innerHTML = html;
            var newText = div.textContent || div.innerText || "";
            me._dom.innerHTML = newText;
          }));
        }

        if (this._svgElem || typeof(this._dom.textContent) != "undefined") {
          if (bTSpan) val = val.trim();
          if (bTSpan && (!val || val.length == 0)) {
            this._dom.textContent = "";
            me._dom.textContent = '\u00A0';
          } else {
            this._dom.textContent = val;
          }
        } else {

          var div = document.createElement("div");
          div.innerHTML = val;
          var newText = div.textContent || div.innerText || "";

          this._dom.innerHTML = newText;
        }
        return this;
      }

      if (this._svgElem || typeof(this._dom.textContent) != "undefined") {
        this._dom.textContent = t;
      } else {
        var html = t;
        var div = document.createElement("div");
        div.innerHTML = html;
        var newText = div.textContent || div.innerText || "";
        this._dom.innerHTML = newText;
      }

      this._html = t;
      return this;
    }
  }(this));;
  (function(_myTrait_) {
    var lastView;
    var bInited;
    var _settingView;
    var _eventState;
    var _windowSize;
    var _mediaListeners;
    var mql;
    var _transitionOn;
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {
      if (!_eventState) {
        this.eventBinder(window, "hashchange", function() {
          if (("#" + _eventState.lastSetValue) == document.location.hash) return;
          if (_eventState.pushing) return;
        });
        _eventState = {
          inited: true
        }
      }
    });
    _myTrait_.initScreenEvents = function(t) {
      // object.addEventListener("resize", myScript);
      // if(window.matchMedia) {
      _windowSize = {
        w: 0,
        h: 0
      };

      var _widthLimits = [700];

      var eventCnt = 0;

      _mediaListeners = [];
      if (window.matchMedia) {
        mql = window.matchMedia("(max-width:700px)");
        mql.addListener(function(q) {
          eventCnt++;
          if (q.matches) {
            _mediaListeners.forEach(function(fn) {
              fn({
                w: window.innerWidth || document.documentElement.clientWidth,
                h: window.innerHeight || document.documentElement.clientHeight,
                limit: 700,
                width_less: true,
                eCnt: eventCnt
              });
            });
          } else {
            _mediaListeners.forEach(function(fn) {
              fn({
                w: window.innerWidth || document.documentElement.clientWidth,
                h: window.innerHeight || document.documentElement.clientHeight,
                limit: 700,
                width_more: true,
                eCnt: eventCnt
              });
            });
          }
        });

      } else {
        // console.log("Bind resize");
        // eventBinder(dom, event, fun

        var isIE8 = !document.addEventListener ? true : false,
          bindTo = window;

        // if(isIE8) bindTo = document.body;

        this.eventBinder(bindTo, "resize", function() {
          // what is the screen size... 

          eventCnt++;

          var width = window.innerWidth || document.documentElement.clientWidth,
            doAlert = false,
            limit = 700;

          _widthLimits.forEach(function(w) {
            var ch = (w - width) * (w - _windowSize.w);
            if (ch < 0) {
              limit = w;
              doAlert = true;
            }
          });

          _windowSize.w = window.innerWidth || document.documentElement.clientWidth;
          _windowSize.h = window.innerHeight || document.documentElement.clientHeight;

          if (doAlert) {
            _mediaListeners.forEach(function(fn) {
              var data = {
                limit: limit,
                w: _windowSize.w,
                h: _windowSize.h,
                eCnt: eventCnt
              };
              if (_windowSize.w > limit) {
                data.width_more = true;
              } else {
                data.width_less = true;
              }
              fn(data);
            });
          }


        });
        /*
               object.addEventListener("resize", function() {
                   // _windowSize
               });
               */
      }
    }
    _myTrait_.onMediaChange = function(fn) {

      _mediaListeners.push(fn);
    }
    _myTrait_.popView = function(toView) {

      if (!this._views || this._views.length == 0) {
        if (this._parent) this._parent.popView();
        this._views = [];
        return this;
      }

      var ms = (new Date()).getTime();
      if (_transitionOn && (ms - _transitionOn < 1000)) return;
      _transitionOn = ms;

      var cont = this;
      var lastView = this;
      var view = this._views.pop();

      var showP = true;
      var me = this;



      cont.forChildren(function(ch) {

        ch.removeClass("viewOut");
        ch.removeClass("viewIn");
        ch.addClass("viewOut");

        if (showP) {
          later().after(0.2, function() {
            // console.log("Old view child count ", view.oldChildren._children.length);
            var addThese = [];
            view.oldChildren.forChildren(function(ch) {
              ch.show();
              addThese.push(ch);
            });
            addThese.forEach(function(c) {
              cont.add(c);
              c.removeClass("viewOut");
              c.removeClass("viewIn");
              c.addClass("viewIn");
            });
            if (addThese[0]) addThese[0].scrollTo();
            if (view.oldTitle && me.setTitle) me.setTitle(view.oldTitle);
            showP = false;
            later().after(0.2, function() {
              _transitionOn = 0;
            });
          });
        }
        later().after(0.2, function() {
          ch.remove();
        });

      });



    }
    _myTrait_.pushView = function(newView, params) {

      if (!this._views) {
        this._views = [];
      }

      var cont = this;
      if (cont._children && cont._children[0] == newView) {
        return;
      }

      if (this.isFunction(newView)) {
        newView = newView();
      }

      var ms = (new Date()).getTime();
      if (_transitionOn && (ms - _transitionOn < 1000)) return;
      _transitionOn = ms;

      if (!params) params = null;

      var oldChildren = _e();

      var viewData = {
        parentView: null,
        oldTitle: this.__currentTitle,
        oldChildren: oldChildren,
        params: params
      };

      var showP = true,
        hadChildren = false,
        me = this;

      this.onValue("pushView", function(v) {
        me.pushView(v);
      });

      this.onValue("popView", function(toView) {
        me.popView(toView);
      });

      lastView = this;

      // primitive and simple
      _eventState.lastSetValue = (new Date()).getTime();
      _eventState.pushing = true;
      document.location.hash = _eventState.lastSetValue;

      // console.log("PUSH, view child count ", cont._children.length);
      cont.forChildren(function(ch) {

        hadChildren = true;
        // fadeout, fadein, not used here...
        later().after(0.3, function() {

          newView.removeClass("viewOut");
          newView.removeClass("viewIn");

          newView.addClass("viewIn");
          cont.add(newView);

          newView.show();
          showP = false;

          later().after(0.2, function() {

            _transitionOn = 0;
            newView.scrollTo();
          });
        });
        ch.removeClass("viewIn");
        ch.removeClass("viewOut");
        ch.addClass("viewOut");
        later().after(0.2, function() {
          oldChildren.add(ch);
        });
      });
      this._views.push(viewData);
      if (!hadChildren) {

        later().after(0.3, function() {
          newView.removeClass("viewIn");
          newView.removeClass("viewOut");
          newView.addClass("viewIn");
          cont.add(newView);

          newView.show();


          later().after(0.2, function() {
            _transitionOn = 0;
            newView.scrollTo();
          });


        });
      }

      _eventState.pushing = false;

      return this;
    }
    _myTrait_.scrollTo = function(noThing) {
      if (window) {
        var box = this.offset();
        var currLeft = window.pageXOffset;

        var toY = box.top;
        if (toY < window.innerHeight / 2) return;
        if (box.top < window.innerHeight) {
          toY = toY / 2;
        } else {
          toY = toY - window.innerHeight * 0.2
        }
        window.scrollTo(currLeft || 0, parseInt(toY));
      }
    }
  }(this));;
  (function(_myTrait_) {
    var _modelTemplates;
    var _viewContent;
    var _viewTemplates;
    var _namedModels;
    var _namedViews;
    var _dataLink;
    var _customDirectives;
    _myTrait_.createItemView = function(item) {
      var vf = this.getViewFunction(item),
        me = this,
        newView;
      if (vf) {
        newView = vf(item);

        if (item.viewClass) {
          if (this.isFunction(item.viewClass)) {
            var oo = item.viewClass(null, true);
            var oldClass = item.viewClass();
            var myEventH = function(o, v) {
              if (oldClass != v) {
                var nv = me.createItemView(item);
                oldClass = v;
                newView.replaceWith(nv);
                newView = nv;
                oo.me.removeListener(oo.name, myEventH);
              }
            };
            oo.me.on(oo.name, myEventH);
          }
        }

      }
      return newView;
    }
    _myTrait_.fromStream = function(stream, viewFn) {

      var me = this;

      stream.onValue(function(data) {
        var newView = viewFn(data);
        later().add(function() {
          me.clear();
          me.add(newView);
        });
      });
    }
    _myTrait_.getViewFunction = function(item) {
      if (this.isFunction(this._view)) {
        return this._view;
      }
      if (item.viewClass) {
        var vf;
        if (vf = this._view[item.viewClass()])
          return vf;
      }
      // if no other options...
      for (var n in this._view) {
        if (this._view.hasOwnProperty(n)) {
          var vf = this._view[n];
          if (this.isFunction(vf)) {
            return vf;
          }
        }
      }
    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {

    });
    _myTrait_.mvc = function(model, view, controller) {

      var me = this;
      if (view) {
        this._view = view;
      }

      if (model) {
        // assume now that it is array 
        this._model = model;

        // TODO: sort, delete, move...
        if (this._model.on) {
          this._model.on("insert", function(o, i) {
            var item = me._model.item(i);
            var nv = me.createItemView(item);
            if (nv) {
              me.insertAt(i, nv);
            }
          });

          this._model.on("move", function(o, cmd) {

            var old = me.child(cmd.from),
              after = me.child(cmd.to);

            if (!after || !old) {
              return;
            }

            if (cmd.to < cmd.from) {
              after.insertBefore(old);
            } else {
              after.insertAfter(old);
            }
          });
          this._model.on("remove", function(o, i) {

            var ch = me.child(i);
            if (ch) {
              ch.remove();
            }
          });
          this._model.on("sort", function(o, ops) {

            if (ops.length == 0) return;

            if (me.isObject(ops[0][1])) return;

            var tmpOps = new Array();

            for (var i = 0; i < ops.length; i++) {
              if (ops[i][1] == ops[i][2]) {
                ops[i][0] = null;
                continue;
              }
              tmpOps[i] = new Array(3);
              tmpOps[i][1] = me.child(ops[i][1]);
              tmpOps[i][2] = me.child(ops[i][2]);
            }

            // console.log("Sort with", ops, JSON.stringify(ops));
            for (var i = 0; i < tmpOps.length; i++) {
              var c1 = tmpOps[i][1],
                c2 = tmpOps[i][2],
                cmd = ops[i][0];
              if (cmd == "a") {
                c2.insertBefore(c1);
              }
              if (cmd == "b") {
                c2.insertAfter(c1);
              }
            }

          });
        }

        if (this._model.forEach) {
          this._model.forEach(function(item) {
            var nv = me.createItemView(item);
            if (nv) {
              me.add(nv);
            }
          });
        }

      }

      if (controller) {
        this._controller = controller;
      }
      return this;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.circle = function(className, attrs) {
      var el = this.shortcutFor("circle", className, attrs);
      return el;
    }
    _myTrait_.defs = function(className, attrs) {
      var el = this.shortcutFor("defs", className, attrs);
      return el;
    }
    _myTrait_.feGaussianBlur = function(className, attrs) {
      var el = this.shortcutFor("feGaussianBlur", className, attrs);
      return el;
    }
    _myTrait_.feMerge = function(className, attrs) {
      var el = this.shortcutFor("feMerge", className, attrs);
      return el;
    }
    _myTrait_.feMergeNode = function(className, attrs) {
      var el = this.shortcutFor("feMergeNode", className, attrs);
      return el;
    }
    _myTrait_.feOffset = function(className, attrs) {
      var el = this.shortcutFor("feOffset", className, attrs);
      return el;
    }
    _myTrait_.filter = function(className, attrs) {
      var el = this.shortcutFor("filter", className, attrs);
      return el;
    }
    _myTrait_.g = function(className, attrs) {
      var el = this.shortcutFor("g", className, attrs);
      return el;
    }
    _myTrait_.image = function(className, attrs) {
      var el = this.shortcutFor("image", className, attrs);
      return el;
    }
    _myTrait_.line = function(className, attrs) {
      var el = this.shortcutFor("line", className, attrs);
      return el;
    }
    _myTrait_.path = function(className, attrs) {
      var el = this.shortcutFor("path", className, attrs);
      return el;
    }
    _myTrait_.rect = function(className, attrs) {
      var el = this.shortcutFor("rect", className, attrs);
      return el;
    }
    _myTrait_.svg = function(className, attrs, none) {
      var el = this.shortcutFor("svg", className, attrs);
      return el;
    }
    _myTrait_.svg_text = function(className, attrs) {
      var el = this.shortcutFor("text", className, attrs);
      return el;
    }
    _myTrait_.tspan = function(className, attrs) {
      var el = this.shortcutFor("tspan", className, attrs);
      return el;
    }
  }(this));;
  (function(_myTrait_) {
    _myTrait_.guid = function(t) {
      return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
    _myTrait_.isArray = function(someVar) {
      return Object.prototype.toString.call(someVar) === '[object Array]';
    }
    _myTrait_.isFunction = function(fn) {
      return Object.prototype.toString.call(fn) == '[object Function]';
    }
    _myTrait_.isObject = function(obj) {
      return obj === Object(obj);
    }
    _myTrait_.isStream = function(obj) {

      if (this.isObject(obj)) {
        if (obj.onValue && obj.bufferWithTime) return true;
      }
      /*
           if(typeof(RxJS) !="undefined") {
               if(obj instanceof RxJS) return true;
           }
           if(typeof(Bacon) !="undefined") {
               if(obj instanceof Bacon) return true;
           }
           */

      return false;
    }
    _myTrait_.str = function(params) {

      var args;
      if (this.isArray(params)) {
        args = params;
      } else {
        args = Array.prototype.slice.call(arguments);
      }

      // Supports Bacon.js streams at the moment...
      var bHadStream = false,
        me = this;
      var indexes = [],
        streams = [],
        all = [];
      args.forEach(function(item, i) {
        if (me.isStream(item)) {
          bHadStream = true;
          all.push("");
        } else {
          all.push(item);
        }
      });
      if (!bHadStream) return args.join("");

      return Bacon.fromBinder(function(sink) {

        args.forEach(function(item, i) {
          if (me.isStream(item)) {
            item.onValue(function(v) {
              all[i] = v;
              sink(all.join(""));
            })
          }
        });

        later().add(function() {
          sink(all.join(""));
        });

        return function() {

        };
      });



    }
  }(this));;
  (function(_myTrait_) {
    var colors;
    _myTrait_.colorMix = function(c1, c2, t) {

      var from = this.toRGB(c1),
        to = this.toRGB(c2);

      var res = this.yuvConversion2(from, to, function(y1, y2) {
        return {
          y: (1 - t) * y1.y + t * y2.y,
          u: (1 - t) * y1.u + t * y2.u,
          v: (1 - t) * y1.v + t * y2.v
        }
      });

      return res;
    }
    _myTrait_.colorToHex = function(color) {
      if (color.substr(0, 1) === '#') {
        return color;
      }
      var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

      var red = parseInt(digits[2]);
      var green = parseInt(digits[3]);
      var blue = parseInt(digits[4]);

      var rgb = blue | (green << 8) | (red << 16);
      return digits[1] + '#' + rgb.toString(16);
    }
    _myTrait_.colourNameToHex = function(colour) {

      if (typeof colors[colour.toLowerCase()] != 'undefined')
        return colors[colour.toLowerCase()];

      return false;
    }
    _myTrait_.componentToHex = function(c) {
      c = parseInt(c);
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    _myTrait_.dim = function(colorName, brightness) {
      return this.yuvConversion(colorName, function(yuv) {
        yuv.y = yuv.y - brightness;
        return yuv;
      });
    }
    _myTrait_.hexToRgb = function(hex) {
      if (hex[0] == "#") hex = hex.substr(1);
      if (hex.length == 3) {
        var temp = hex;
        hex = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
        for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
      }
      if (!hex) return null;
      if (hex == null) return;
      var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);

      return {
        r: parseInt(triplets[0], 16),
        g: parseInt(triplets[1], 16),
        b: parseInt(triplets[2], 16)
      }
    }
    _myTrait_.hexToYuv = function(hexVal) {
      var me = this;
      return me.rgbToYuv(me.toRGB(hexVal));
    }
    _myTrait_.hsvToRgb = function(c) {
      var r, g, b;
      var i;
      var f, p, q, t;

      // Make sure our arguments stay in-range
      var h = Math.max(0, Math.min(360, c.h));
      var s = Math.max(0, Math.min(100, c.s));
      var v = Math.max(0, Math.min(100, c.v));

      // We accept saturation and value arguments from 0 to 100 because that's
      // how Photoshop represents those values. Internally, however, the
      // saturation and value are calculated from a range of 0 to 1. We make
      // That conversion here.
      s /= 100;
      v /= 100;

      if (s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        };
      }

      h /= 60; // sector 0 to 5
      i = Math.floor(h);
      f = h - i; // factorial part of h
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));

      switch (i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;

        case 1:
          r = q;
          g = v;
          b = p;
          break;

        case 2:
          r = p;
          g = v;
          b = t;
          break;

        case 3:
          r = p;
          g = q;
          b = v;
          break;

        case 4:
          r = t;
          g = p;
          b = v;
          break;

        default: // case 5:
          r = v;
          g = p;
          b = q;
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(t) {

      if (!colors) {
        colors = {
          "none": "#ffffff",
          "aliceblue": "#f0f8ff",
          "antiquewhite": "#faebd7",
          "aqua": "#00ffff",
          "aquamarine": "#7fffd4",
          "azure": "#f0ffff",
          "beige": "#f5f5dc",
          "bisque": "#ffe4c4",
          "black": "#000000",
          "blanchedalmond": "#ffebcd",
          "blue": "#0000ff",
          "blueviolet": "#8a2be2",
          "brown": "#a52a2a",
          "burlywood": "#deb887",
          "cadetblue": "#5f9ea0",
          "chartreuse": "#7fff00",
          "chocolate": "#d2691e",
          "coral": "#ff7f50",
          "cornflowerblue": "#6495ed",
          "cornsilk": "#fff8dc",
          "crimson": "#dc143c",
          "cyan": "#00ffff",
          "darkblue": "#00008b",
          "darkcyan": "#008b8b",
          "darkgoldenrod": "#b8860b",
          "darkgray": "#a9a9a9",
          "darkgreen": "#006400",
          "darkkhaki": "#bdb76b",
          "darkmagenta": "#8b008b",
          "darkolivegreen": "#556b2f",
          "darkorange": "#ff8c00",
          "darkorchid": "#9932cc",
          "darkred": "#8b0000",
          "darksalmon": "#e9967a",
          "darkseagreen": "#8fbc8f",
          "darkslateblue": "#483d8b",
          "darkslategray": "#2f4f4f",
          "darkturquoise": "#00ced1",
          "darkviolet": "#9400d3",
          "deeppink": "#ff1493",
          "deepskyblue": "#00bfff",
          "dimgray": "#696969",
          "dodgerblue": "#1e90ff",
          "firebrick": "#b22222",
          "floralwhite": "#fffaf0",
          "forestgreen": "#228b22",
          "fuchsia": "#ff00ff",
          "gainsboro": "#dcdcdc",
          "ghostwhite": "#f8f8ff",
          "gold": "#ffd700",
          "goldenrod": "#daa520",
          "gray": "#808080",
          "green": "#008000",
          "greenyellow": "#adff2f",
          "honeydew": "#f0fff0",
          "hotpink": "#ff69b4",
          "indianred": "#cd5c5c",
          "indigo ": "#4b0082",
          "ivory": "#fffff0",
          "khaki": "#f0e68c",
          "lavender": "#e6e6fa",
          "lavenderblush": "#fff0f5",
          "lawngreen": "#7cfc00",
          "lemonchiffon": "#fffacd",
          "lightblue": "#add8e6",
          "lightcoral": "#f08080",
          "lightcyan": "#e0ffff",
          "lightgoldenrodyellow": "#fafad2",
          "lightgrey": "#d3d3d3",
          "lightgreen": "#90ee90",
          "lightpink": "#ffb6c1",
          "lightsalmon": "#ffa07a",
          "lightseagreen": "#20b2aa",
          "lightskyblue": "#87cefa",
          "lightslategray": "#778899",
          "lightsteelblue": "#b0c4de",
          "lightyellow": "#ffffe0",
          "lime": "#00ff00",
          "limegreen": "#32cd32",
          "linen": "#faf0e6",
          "magenta": "#ff00ff",
          "maroon": "#800000",
          "mediumaquamarine": "#66cdaa",
          "mediumblue": "#0000cd",
          "mediumorchid": "#ba55d3",
          "mediumpurple": "#9370d8",
          "mediumseagreen": "#3cb371",
          "mediumslateblue": "#7b68ee",
          "mediumspringgreen": "#00fa9a",
          "mediumturquoise": "#48d1cc",
          "mediumvioletred": "#c71585",
          "midnightblue": "#191970",
          "mintcream": "#f5fffa",
          "mistyrose": "#ffe4e1",
          "moccasin": "#ffe4b5",
          "navajowhite": "#ffdead",
          "navy": "#000080",
          "oldlace": "#fdf5e6",
          "olive": "#808000",
          "olivedrab": "#6b8e23",
          "orange": "#ffa500",
          "orangered": "#ff4500",
          "orchid": "#da70d6",
          "palegoldenrod": "#eee8aa",
          "palegreen": "#98fb98",
          "paleturquoise": "#afeeee",
          "palevioletred": "#d87093",
          "papayawhip": "#ffefd5",
          "peachpuff": "#ffdab9",
          "peru": "#cd853f",
          "pink": "#ffc0cb",
          "plum": "#dda0dd",
          "powderblue": "#b0e0e6",
          "purple": "#800080",
          "red": "#ff0000",
          "rosybrown": "#bc8f8f",
          "royalblue": "#4169e1",
          "saddlebrown": "#8b4513",
          "salmon": "#fa8072",
          "sandybrown": "#f4a460",
          "seagreen": "#2e8b57",
          "seashell": "#fff5ee",
          "sienna": "#a0522d",
          "silver": "#c0c0c0",
          "skyblue": "#87ceeb",
          "slateblue": "#6a5acd",
          "slategray": "#708090",
          "snow": "#fffafa",
          "springgreen": "#00ff7f",
          "steelblue": "#4682b4",
          "tan": "#d2b48c",
          "teal": "#008080",
          "thistle": "#d8bfd8",
          "tomato": "#ff6347",
          "turquoise": "#40e0d0",
          "violet": "#ee82ee",
          "wheat": "#f5deb3",
          "white": "#ffffff",
          "whitesmoke": "#f5f5f5",
          "yellow": "#ffff00",
          "yellowgreen": "#9acd32"
        };
      }
    });
    _myTrait_.rgbToHex = function(p) {
      var me = this;
      return "#" + me.componentToHex(p.r) + me.componentToHex(p.g) + me.componentToHex(p.b);
    }
    _myTrait_.rgbToHsv = function(c) {
      var rr, gg, bb,
        r = c.r / 255,
        g = c.g / 255,
        b = c.b / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c) {
          return (v - c) / 6 / diff + 1 / 2;
        };

      if (diff == 0) {
        h = s = 0;
      } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
          h = bb - gg;
        } else if (g === v) {
          h = (1 / 3) + rr - bb;
        } else if (b === v) {
          h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
      };
    }
    _myTrait_.rgbToYuv = function(c) {
      var R = c.r / 255;
      var G = c.g / 255;
      var B = c.b / 255;
      return {
        y: 0.299 * R + 0.587 * G + 0.114 * B,
        u: -0.14713 * R - 0.28885 * G + 0.436 * B,
        v: 0.615 * R - 0.51499 * G - 0.10001 * B
      }
    }
    _myTrait_.toRGB = function(c) {
      if (typeof(c) == "object") return c;
      var me = this;

      var hex = me.colourNameToHex(c);
      if (!hex) {
        hex = me.colorToHex(c);
      }
      return me.hexToRgb(hex);
    }
    _myTrait_.toRSpace = function(v) {
      return Math.max(0, Math.min(255, Math.round(v)));
    }
    _myTrait_.yuvConversion = function(c, fn) {
      var me = this;
      var yuv = me.rgbToYuv(me.toRGB(c));
      yuv = fn(yuv);
      var rgb = me.yuvToRgb(yuv);
      return me.rgbToHex(rgb);
    }
    _myTrait_.yuvConversion2 = function(c1, c2, fn) {
      var me = this;
      var yuv = me.rgbToYuv(me.toRGB(c1));
      var yuv2 = me.rgbToYuv(me.toRGB(c2));
      yuv = fn(yuv, yuv2);
      var rgb = me.yuvToRgb(yuv);
      return me.rgbToHex(rgb);
    }
    _myTrait_.yuvPixelConversion = function(c, fn) {
      var yuv = me.rgbToYuv(c);
      yuv = fn(yuv);
      var rgb = me.yuvToRgb(yuv);
      c.r = rgb.r;
      c.g = rgb.g;
      c.b = rgb.b;
      return c;
    }
    _myTrait_.yuvToRgb = function(c) {
      var Y = c.y;
      var U = c.u;
      var V = c.v;

      return {
        r: this.toRSpace(255 * (Y + 0 * U + 1.13983 * V)),
        g: this.toRSpace(255 * (Y - 0.39465 * U - 0.58060 * V)),
        b: this.toRSpace(255 * (Y + 2.03211 * U))
      }
    }
  }(this));;
  (function(_myTrait_) {
    var _eg;
    var _ee_;
    var guid;
    var _screenInit;
    var _svgElems;
    var _registry;
    var _elemNames;
    var _hasRemoted;
    var _elemNamesList;
    _myTrait_.__singleton = function(t) {
      return _eg;
    }
    if (!_myTrait_.hasOwnProperty('__factoryClass')) _myTrait_.__factoryClass = []
    _myTrait_.__factoryClass.push(function(elemName, into) {

      if (elemName) {
        if (_registry && _registry[elemName]) {
          var classConst = _registry[elemName];
          return new classConst(elemName, into);
        }
      }

    });
    _myTrait_.extendAll = function(name, fn) {

      if (this.isObject(name)) {

        for (var n in name) {
          if (name.hasOwnProperty(n)) this.extendAll(n, name[n]);
        }

        return this;
      }

      if (!_myTrait_[name]) {
        _myTrait_[name] = fn;
      }
      return this;
    }
    _myTrait_.getComponentRegistry = function(t) {
      return _registry;
    }
    _myTrait_.getElemNames = function(t) {
      return _elemNamesList;
    }
    _myTrait_.globalState = function(t) {

      var outPosition = {
        "transform": "translate(-2000px,0px)"
      };

      var inPosition = {
        "transform": "translate(0,0)",
      };

      css().animation("viewOut", {
        duration: "0.4s",
        "iteration-count": 1,
      }, inPosition, 0.5, outPosition, outPosition);

      css().animation("viewIn", {
        duration: "0.4s",
        "iteration-count": 1,
      }, outPosition, 0.5, inPosition, inPosition);



      if (!String.prototype.trim) {
        (function() {
          // Make sure we trim BOM and NBSP
          var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
          String.prototype.trim = function() {
            return this.replace(rtrim, '');
          };
        })();
      }

      var _eg = _ee_ = (function() {

        var o = {};
        var _compreg = {};

        var _dataId = 1;
        var _dataReg = {};
        var _dataBinds = {};

        var _listeners = {};

        var _dragging = false;
        var _dragItem = null;
        var _draggableItems = [];
        var _mouseDown = false;
        var _mouse = {
          x: 0,
          y: 0
        };
        var _dragVector = {
          sx: 0,
          sy: 0,
          dx: 0,
          dy: 0
        };

        o._cssfactor = 1;

        o.domIndex = {};

        var domGuidName = "data-egid";
        var domGuidPrefix = "huNqe7q1";
        var domGuidIndex = 1;

        // component or object which responds to evens...
        o.addListener = function(name, obj) {

          if (!_listeners[name]) _listeners[name] = [];
          var was = false;
          _listeners[name].forEach(function(l) {
            if (l == obj) was = true;
          });
          if (was) return;

          // Allow now only one listener... sorry...
          if (_listeners[name].length > 0) {
            _listeners[name][0] = obj;
          } else {
            _listeners[name].push(obj);
          }
          return o;
        }

        o.removeListener = function(name, obj) {

          if (!_listeners[name]) return;
          var list = _listeners[name];
          var len = list.length;
          for (var i = 0; i < len; i++) {
            var oo = list[i];
            if (oo == obj) {
              _listeners[name].splice(i, 1);
              break;
            }
          }
          return o;
        }


        var _popZStart = 2;
        o.popZ = function() {
          return _popZStart++;
        }



        o.addEventListener = function(dom, en, fn) {

          en = en.toLowerCase();

          if (dom.attachEvent) {
            dom.attachEvent("on" + en, fn);
          } else {
            dom.addEventListener(en, fn);
          }
          return true;
        }

        o.mouse = function() {
          return _mouse;
        }

        o.pxParam = function(v) {

          if (typeof(v) == "string") {
            return parseInt(v) + "px";
          } else {
            var i = parseInt(v);
            if (!isNaN(i)) {
              // this._dom.style.width = i+"px";
              return i + "px";
            }
          }
        }

        o.bexp = function(p, v) {
          var str = "";
          str += "-o-" + p + ":" + v + ";\n";
          str += "-moz-" + p + ":" + v + ";\n";
          str += "-webkit-" + p + ":" + v + ";\n";
          str += p + ":" + v + ";\n";
          return str;
        }

        o.addEventListener(document, "mousemove", function(e) {

          e = e || window.event;

          if (!e.pageX) {

            _mouse.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            _mouse.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);

          } else {
            _mouse.x = e.pageX;
            _mouse.y = e.pageY;
          }

          // console.log("Mousemove ", _dragging);
          if (_dragging) {

            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;

            _dragVector.dx = _mouse.x - _dragVector.sx;
            _dragVector.dy = _mouse.y - _dragVector.sy;
            if (_dragItem) _dragItem.trigger("drag", _dragVector);

          }
        });

        o.setDragged = function(i) {
          _dragging = true;
          _dragItem = i;
        }

        o.dragMouseUp = function() {
          if (_dragItem) {
            // enddrag
            _dragItem.trigger("enddrag", _dragVector);
          }
          _dragging = false;
          _dragItem = null;
        }

        o.dragMouseDown = function(forceElem) {
          _mouseDown = true;
          if (_dragging) return;
          var found = false;

          var candidates = [];
          if (forceElem) {
            candidates.push(forceElem);
          } else {
            _draggableItems.forEach(function(e) {
              if (e.isHovering()) {
                candidates.push(e);
              }
            });
            candidates.sort(function(a, b) {
              if (a.z && b.z) return b.z() - a.z();
              return 0;
            });
          }

          if (candidates[0]) {
            var e = candidates[0];
            // console.log("Could start drag");
            var off = e.offset();
            o.setDragged(e);
            _dragVector.sx = _mouse.x;
            _dragVector.sy = _mouse.y;
            _dragVector.dx = 0;
            _dragVector.dy = 0;
            _dragVector.x = off.left;
            _dragVector.y = off.top;
            found = true;
            e.trigger("startdrag", _dragVector);
            //console.log(_dragVector);
            return true;
          }
        }

        o.addEventListener(document, "mouseup", function() {
          o.dragMouseUp();
        });

        o.addEventListener(document, "mousedown", function(e) {
          if (o.dragMouseDown()) {
            e = e || window.event;
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
          }
        });






        o.draggable = function(e) {
          _draggableItems.push(e);
          e.isHovering();

          var me = e;

          e.touchevents();
          e.on("touchstart", function() {

            var off = me.offset();

            var t = e.touch(0);
            _dragVector.sx = t.startX;
            _dragVector.sy = t.startY;
            _dragVector.dx = 0;
            _dragVector.dy = 0;

            _dragVector.x = t.startX - off.left;
            _dragVector.y = t.startY - off.top;
            _dragging = true;
            e.trigger("startdrag", _dragVector);
          });
          e.on("touchmove", function() {
            //e.trigger("msg", "got touchmove");
            var t = e.touch(0);
            //e.trigger("msg", "got touchmove 2");
            _dragVector.dx = t.dx;
            _dragVector.dy = t.dy;
            _dragging = true;
            e.trigger("drag", _dragVector);
            //e.trigger("msg", "got touchmove 3");
          });
          e.on("touchend", function() {

            var t = e.touch(0);
            _dragVector.dx = t.dx;
            _dragVector.dy = t.dy;

            e.trigger("enddrag", _dragVector);
            _dragging = false;
          });

        }

        return o;
      }());

      return _eg;
    }
    if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit"))
      _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
    if (!_myTrait_.__traitInit) _myTrait_.__traitInit = []
    _myTrait_.__traitInit.push(function(elemName, into) {
      this.initAsTag(elemName, into);

    });
    _myTrait_.initAsTag = function(elemName, into, force) {

      if (this.isObject(elemName)) {
        this._dom = elemName;
        elemName = this._dom.tagName;

        if (elemName == "input") {
          if (this._dom.getAttribute("type") == "checkbox") {
            elemName = "checkbox";
          }
        }

        // ---- might be DOM object...
      } else {
        if (elemName && elemName.charAt) {
          if (elemName.charAt(0) == "#") {

            var ee = document.getElementById(elemName.substring(1));
            if (ee) {
              elemName = ee.tagName;
              this._dom = ee;
            }
          }
        }
      }

      if (!_registry) _registry = {};

      if (!elemName) elemName = "div";
      if (!_eg) {
        this.initElemNames();
        _eg = _ee_ = this.globalState();
        _svgElems = {
          "circle": "true",
          "rect": true,
          "path": true,
          "svg": true,
          "image": true,
          "line": true,
          "text": true,
          "tspan": true,
          "g": true,
          "pattern": true,
          "polygon": true,
          "polyline": true,
          "clippath": true,
          "defs": true,
          "feoffset": true,
          "femerge": true,
          "femergenode": true,
          "fegaussianblur": true,
          "filter": true
        }

      }
      var svgNS = "http://www.w3.org/2000/svg";
      var origElemName = elemName;
      elemName = elemName.toLowerCase()

      if (force) {

      } else {
        if (!_elemNames[elemName] && !_svgElems[elemName]) {
          this._invalidTag = elemName;
          return;
        }
      }

      if (!_screenInit) {
        this.initScreenEvents();
        _screenInit = true;
      }

      if (_svgElems[elemName]) {
        this._svgElem = true;
        this._svg = true;
      }

      // 
      this._type = elemName;
      this._tag = elemName.toLowerCase();
      if (this._type == "checkbox") {
        this._checked = false;
        this._tag = "input";
      }
      this._children = [];

      if (elemName == "svg") this._svg = true;

      if (!this._dom) {
        if (elemName == "svg") {
          this._dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          // xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"
          this._dom.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          this._dom.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        } else {
          if (this._svgElem) {
            this._dom = document.createElementNS(svgNS, origElemName);
          } else {
            this._dom = document.createElement(this._tag);
          }
        }
      }

      // jQuery emulation might be removed...
      this.q = new _qc(this._dom, this);


      if (this._type == "checkbox") {
        this.q.attr("type", "checkbox");
      }

      if (!this._component && into) {
        if (typeof(into.appendChild) != "undefined")
          into.appendChild(this._dom);
      }
    }
    _myTrait_.initElemNames = function(t) {
      if (_elemNames) return;
      _elemNamesList = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio",
        "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas",
        "caption", "center", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details",
        "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font",
        "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup",
        "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link",
        "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object",
        "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby",
        "s", "sampe", "script", "section", "select", "small", "source", "span", "strike", "strong", "style",
        "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title",
        "tr", "track", "tt", "u", "ul", "var", "video", "wbr"
      ];
      _elemNames = {};
      _elemNamesList.forEach(function(n) {
        _elemNames[n] = true;
      })

    }
    _myTrait_.registerComponent = function(name, classDef) {

      if (!_registry[name]) {
        _registry[name] = classDef;
      }
    }
  }(this));
}
var _e = function(a, b, c, d, e, f, g, h) {
  if (this instanceof _e) {
    var args = [a, b, c, d, e, f, g, h];
    if (this.__factoryClass) {
      var m = this;
      var res;
      this.__factoryClass.forEach(function(initF) {
        res = initF.apply(m, args);
      });
      if (Object.prototype.toString.call(res) == '[object Function]') {
        if (res._classInfo.name != _e._classInfo.name) return new res(a, b, c, d, e, f, g, h);
      } else {
        if (res) return res;
      }
    }
    if (this.__traitInit) {
      var m = this;
      this.__traitInit.forEach(function(initF) {
        initF.apply(m, args);
      })
    } else {
      if (typeof this.init == 'function')
        this.init.apply(this, args);
    }
  } else return new _e(a, b, c, d, e, f, g, h);
};
_e._classInfo = {
  name: '_e'
};
_e.prototype = new _e_prototype();
if (typeof(window) != 'undefined') window['_e'] = _e;
if (typeof(window) != 'undefined') window['_e_prototype'] = _e_prototype;