// The code template begins here
"use strict";

(function () {

  var __amdDefs__ = {};

  // The class definition is here...
  var _e_prototype = function _e_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param array items
       */
      _myTrait_.add = function (items) {
        if (!(items instanceof Array)) {
          items = Array.prototype.slice.call(arguments, 0);
        }
        var me = this;
        items.forEach(function (e) {

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

          if (typeof e == "string" || !isNaN(e)) {
            var nd = _e("span");
            nd._dom.innerHTML = e;
            me.add(nd);
            return me;
          }

          if (me.isStream(e)) {
            e.onValue(function (t) {
              me.add(t);
            });
            return me;
          }

          if (typeof e == "undefined") return;

          if (typeof e._dom != "undefined") {

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
      };

      /**
       * @param array items
       */
      _myTrait_.addItem = function (items) {

        var list = Array.prototype.slice.call(arguments, 0);
        return this.add.apply(this, list);
      };

      /**
       * Removes all the subnodes
       * @param float t
       */
      _myTrait_.clear = function (t) {

        //this.removeAllHandlers();
        //this.removeChildEvents();
        //this.removeControllersFor(this);

        this._children.forEach(function (c) {
          c.remove();
        });
        this._children = [];
        while (this._dom.firstChild) {
          this._dom.removeChild(this._dom.firstChild);
        }
        return this;
      };

      /**
       * @param DOMElement elem
       */
      _myTrait_.collectFromDOM = function (elem) {
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
      };

      /**
       * @param Object newItem
       */
      _myTrait_.insertAfter = function (newItem) {

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
        if (newItem._parent && newItem._parent != this._parent) {
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
      };

      /**
       * @param float i
       * @param float obj
       */
      _myTrait_.insertAt = function (i, obj) {

        if (i < this._children.length) {
          var ch = this.child(i);
          ch.insertBefore(obj);
        } else {
          this.add(obj);
        }
      };

      /**
       * Inserts a new node before an existing node
       * @param _e newItem  - Item to be inserted
       */
      _myTrait_.insertBefore = function (newItem) {

        if (!this._parent) return;
        if (!this._parent._children) return;

        if (newItem == this) {
          return;
        }

        // var newItem = _e(a,b,c,d,e,f);
        var myIndex = this._index;
        var chList = this._parent._children;

        if (newItem._parent && newItem._parent != this._parent) {
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
      };

      /**
       * Moves the node down in the DOM tree
       * @param float t
       */
      _myTrait_.moveDown = function (t) {
        if (typeof this._index != "undefined" && this._parent) {
          var myIndex = this._index,
              nextIndex;
          if (!this._parent) return;
          if (!this._parent._children) return;
          if (myIndex >= this._parent._children.length - 1) return;

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
      };

      /**
       * Moves the node up in the DOM tree
       * @param float t
       */
      _myTrait_.moveUp = function (t) {
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
      };

      /**
       * @param float t
       */
      _myTrait_.parent = function (t) {
        return this._parent;
      };

      /**
       * Adds items as the first child of the current node
       * @param array items
       */
      _myTrait_.prepend = function (items) {
        if (!(items instanceof Array)) {
          items = Array.prototype.slice.call(arguments, 0);
        }
        var me = this;
        items.forEach(function (e) {
          if (typeof e == "string") {
            me._dom.innerHTML = e;
            return me;
          }

          if (typeof e == "undefined") return;

          if (typeof e._dom != "undefined") {

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
      };

      /**
       * @param float t
       */
      _myTrait_.reIndex = function (t) {
        var chList = this._children;
        var i = 0;
        chList.forEach(function (ch) {
          ch._index = i++;
        });
      };

      /**
       * Removes the item from the DOM -tree
       * @param float t
       */
      _myTrait_.remove = function (t) {

        this.removeChildEvents();

        if (this._parent) {
          this._parent.removeChild(this);
        } else {
          var p = this._dom.parentElement;
          if (p) p.removeChild(this._dom);
        }

        this._children = [];
        this.removeAllHandlers();
      };

      /**
       * Removes a child of the node
       * @param Object o
       */
      _myTrait_.removeChild = function (o) {
        if (this._children) {

          var me = this;
          var i = this._children.indexOf(o);
          if (i >= 0) {
            this._children.splice(i, 1);
            this._dom.removeChild(o._dom);
          }
          this.reIndex();
        }
      };

      /**
       * @param float t
       */
      _myTrait_.removeChildEvents = function (t) {
        this.forChildren(function (ch) {
          ch.removeAllHandlers();
          ch.removeChildEvents();
          ch.removeControllersFor(ch);
        });
      };

      /**
       * Removes the node from the index, but not from the DOM tree
       * @param Object o
       */
      _myTrait_.removeIndexedChild = function (o) {
        if (this._children) {
          var i = this._children.indexOf(o);
          if (i >= 0) {
            this._children.splice(i, 1);
          }
        }
      };

      /**
       * @param Object elem
       */
      _myTrait_.replaceWith = function (elem) {
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
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _mousePoint;

      // Initialize static variables here...

      /**
       * @param float opts
       */
      _myTrait_.baconDrag = function (opts) {
        var me = this;
        return Bacon.fromBinder(function (sink) {
          me.drag(function (dv) {
            sink(dv);
          });
        });
      };

      /**
       * @param float callBack
       */
      _myTrait_.drag = function (callBack) {
        var me = this,
            state = {};

        if (this.isObject(callBack) && !this.isFunction(callBack)) {

          var objToDrag = callBack;
          var sx, sy;
          callBack = function (dv) {
            if (dv.start) {
              sx = objToDrag.x();
              sy = objToDrag.y();
            }
            objToDrag.x(sx + dv.dx).y(sy + dv.dy);
          };
        }

        this.draggable(function (o, dv) {
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
        }, function (o, dv) {
          state.start = false;
          state.dx = dv.dx;
          state.dy = dv.dy;
          state.x = state.sx + state.dx;
          state.y = state.sy + state.dy;
          callBack(state);
        }, function (o, dv) {
          state.end = true;
          state.dx = dv.dx;
          state.dy = dv.dy;
          callBack(state);
        });
        return this;
      };

      /**
       * Three functions, fired when drag starts, proceeds and ends
       * @param function startFn
       * @param float middleFn
       * @param float endFn
       */
      _myTrait_.draggable = function (startFn, middleFn, endFn) {
        var _eg = this.__singleton();
        _eg.draggable(this);

        if (startFn) this.on("startdrag", startFn);
        if (middleFn) this.on("drag", middleFn);
        if (endFn) this.on("enddrag", endFn);
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {
        this._touchItems = [];
      });

      /**
       * @param float t
       */
      _myTrait_.mousePos = function (t) {
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
      };

      /**
       * @param float e
       */
      _myTrait_.pauseEvents = function (e) {
        e = e || window.event;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        return false;
      };

      /**
       * Get touch number i
       * @param int i
       */
      _myTrait_.touch = function (i) {
        return this._touchItems[i];
      };

      /**
       * Enables click emulation on touch devices
       * @param float t
       */
      _myTrait_.touchclick = function (t) {
        this.touchevents();
        var o = this;
        this.on("touchstart", function (o, dv) {
          o.trigger("click");
        });
      };

      /**
       * Initializes the touch events
       * @param float t
       */
      _myTrait_.touchevents = function (t) {

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

        var touchStart = function touchStart(e) {
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

        var touchMove = function touchMove(e) {
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

        var touchEnd = function touchEnd(e) {
          // o.q.css("transform", "rotate(20deg)");
          o.trigger("touchend");
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        };

        /*elem.addEventListener("touchcancel", function(e) {
                      o.trigger("touchcancel");
                      e.preventDefault();
                      }, false);*/

        var msHandler = function msHandler(event) {
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
        };

        elem.addEventListener("touchstart", touchStart, false);
        elem.addEventListener("touchmove", touchMove, false);
        elem.addEventListener("touchend", touchEnd, false);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * Makes the DOM element absolute positioned
       * @param float t
       */
      _myTrait_.absolute = function (t) {
        this.q.css("position", "absolute");
        this.x(0).y(0).z(this.baseZ());
        return this;
      };

      /**
       * @param float v
       */
      _myTrait_.baseZ = function (v) {
        if (typeof v != "undefined") {
          this._baseZ = v;
          return this;
        }
        if (typeof this._baseZ == "undefined") this._baseZ = 0;
        return this._baseZ;
      };

      /**
       * @param float t
       */
      _myTrait_.box = function (t) {
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
      };

      /**
       * @param float v
       */
      _myTrait_.height = function (v) {
        if (typeof v == "undefined") return this._h;

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.height(v);
          });
          return this;
        }

        if (this.isFunction(v)) {
          var oo = v(false, true),
              me = this;
          oo.me.on(oo.name, function (o, v) {
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
        if (typeof p != "undefined") {
          this._dom.style.height = p;
          this._h = parseInt(v);
          this.trigger("height");
        }
        return this;
      };

      /**
       * @param bool preventAll
       * @param float zIndex
       */
      _myTrait_.hoverLayer = function (preventAll, zIndex) {
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
          o.draggable(function (o, dv) {
            console.log("hover, start drag");
          }, function (o, dv) {
            console.log("dragging ");
          }, function (o, dv) {
            console.log("end drag");
          });

          o.bindSysEvent("mouseenter", function () {
            o.trigger("mouseenter");
          }, true);

          o.bindSysEvent("mouseleave", function () {
            o.trigger("mouseleave");
          }, true);

          o.bindSysEvent("click", function () {
            o.trigger("click");
          }, true);

          o.bindSysEvent("mousedown", function () {
            o.trigger("mousedown");
            _eg.dragMouseDown(o);
          }, true);

          o.bindSysEvent("mouseup", function () {
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
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {});

      /**
       * @param float t
       */
      _myTrait_.offset = function (t) {
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
      };

      /**
       * Transform the param into CSS pixel value, like &quot;12px&quot;
       * @param float v
       */
      _myTrait_.pxParam = function (v) {
        if (typeof v == "string") {
          return parseInt(v) + "px";
        } else {
          var i = parseInt(v);
          if (!isNaN(i)) {
            return i + "px";
          }
        }
      };

      /**
       * Makes the DOM item relatively positioned
       * @param float t
       */
      _myTrait_.relative = function (t) {
        this.q.css("position", "relative");
        this.x(0).y(0).z(this.baseZ());
        return this;
      };

      /**
       * @param float v
       */
      _myTrait_.width = function (v) {
        if (typeof v == "undefined") return this._w;

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
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
          oo.me.on(oo.name, function (o, v) {
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
        if (typeof p != "undefined") {
          this._dom.style.width = p;
          this._w = parseInt(v);
          this.trigger("width");
        }
        return this;
      };

      /**
       * @param float v  - if set, the value of the x
       */
      _myTrait_.x = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.x(v);
          });
          return this;
        }

        if (typeof v != "undefined") {
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
        if (typeof this._x == "undefined") this._x = 0;
        return this._x;
      };

      /**
       * @param float v  - if set, the value of y
       */
      _myTrait_.y = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.y(v);
          });
          return this;
        }

        if (typeof v != "undefined") {
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
        if (typeof this._y == "undefined") this._y = 0;
        return this._y;
      };

      /**
       * @param float v  - if set, the value of z-index
       */
      _myTrait_.z = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.z(v);
          });
          return this;
        }

        var base = this._baseZ || 0;
        if (typeof v != "undefined") {
          this.q.css("zIndex", v + base);
          this._z = v;
          this.trigger("z");
          return this;
        }
        if (typeof this._z == "undefined") this._z = 0;
        return this._z;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _effects;

      // Initialize static variables here...

      /**
       * @param string tx
       */
      _myTrait_.applyTransforms = function (tx) {
        var d = this._dom;
        d.style["transform"] = tx;
        d.style["-webkit-transform"] = tx;
        d.style["-moz-transform"] = tx;
        d.style["-ms-transform"] = tx;
        this.trigger("transform");
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.compStyle = function (t) {
        var elem = this._dom;
        var cs = window.getComputedStyle(elem, null);
        return {
          get: function get(prop) {
            return cs.getPropertyValue(prop);
          }
        };
      };

      /**
       * @param float name
       * @param float inPosition
       * @param float outPosition
       * @param float options
       */
      _myTrait_.createEffect = function (name, inPosition, outPosition, options) {

        css().bind("." + name + "OutPosition", outPosition);
        css().bind("." + name + "InPosition", inPosition);

        options = options || {};
        options.duration = options.duration || 0.2;

        css().animation(name + "Out", {
          duration: options.duration.toFixed(2) * 2 + "s",
          "iteration-count": 1 }, inPosition, 0.5, outPosition, outPosition);

        css().animation(name + "In", {
          duration: options.duration.toFixed(2) * 2 + "s",
          "iteration-count": 1 }, outPosition, 0.5, inPosition, inPosition);

        _effects[name] = options;
      };

      /**
       * @param float options
       */
      _myTrait_.css = function (options) {

        if (!this._myClass) {
          this._myClass = this.guid();
          this._css = css(this._myClass);
        }

        return this._css;
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.effectIn = function (name, fn) {

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

        this._effectOn[name] = new Date().getTime();

        var options = _effects[name];

        var eOut = name + "Out",
            eIn = name + "In",
            eInPos = name + "InPosition",
            eOutPos = name + "OutPosition";

        this.removeClass(eOut);
        this.removeClass(eIn);
        this.addClass(eIn);
        var me = this;
        later().after(options.duration, function () {
          me.removeClass(eOutPos);
          me.addClass(eInPos);
          me.removeClass(eIn);
          me._effectOn[name] = 0;
          me._effectState[name] = 1;
          if (fn) fn();
        });
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.effectOut = function (name, fn) {
        if (!this._effectOn) this._effectOn = {};

        if (this._effectOn[name]) {
          return;
        }
        if (!this._effectState) {
          this._effectState = {};
          this._effectState[name] = 1;
        }
        if (this._effectState[name] == 2) return;

        this._effectOn[name] = new Date().getTime();

        var options = _effects[name];

        var eOut = name + "Out",
            eIn = name + "In",
            eInPos = name + "InPosition",
            eOutPos = name + "OutPosition";

        this.removeClass(eOut);
        this.removeClass(eIn);
        this.addClass(eOut);
        var me = this;
        later().after(options.duration, function () {
          me.removeClass(eInPos);
          me.addClass(eOutPos);
          me.removeClass(eOut);
          me._effectOn[name] = 0;
          me._effectState[name] = 2;
          if (fn) fn();
        });
      };

      /**
       * Hides the node from DOM tree
       * @param float t
       */
      _myTrait_.hide = function (t) {
        this._dom.style.display = "none";
        this.trigger("hide");
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {
        if (!_effects) {
          _effects = {};
        }
      });

      /**
       * Shows the node in the DOM tree if not visible
       * @param float t
       */
      _myTrait_.show = function (t) {
        this._dom.style.display = "";
        this.trigger("show");
      };

      /**
       * Creates a local CSS style using the css() object
       * @param string v
       */
      _myTrait_.style = function (v) {
        if (typeof v != "undefined") {}
        if (!this._localStyle) {
          var createStyleGuid = "localstyle" + new Date().getTime() + "_" + guid();
          this._localStyle = css().css("width", "auto");
          this._localStyle.writeRule(createStyleGuid);
          this.addClass(createStyleGuid);
        }
        return this._localStyle;
      };

      /**
       * @param String value
       */
      _myTrait_.styleString = function (value) {
        // TODO: binding the style string???
        this._dom.style.cssText = value;
        return this;
      };

      /**
       * @param string name
       * @param string value
       */
      _myTrait_.transform = function (name, value) {
        if (!this._transforms) this._transforms = [];
        if (typeof value == "undefined") {

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
      };

      /**
       * @param float tx
       */
      _myTrait_.transformOrigin = function (tx) {
        var d = this._dom;
        d.style["transform-origin"] = tx;
        d.style["-webkit-transform-origin"] = tx;
        d.style["-moz-transform-origin"] = tx;
        d.style["-ms-transform-origin"] = tx;
        this.trigger("transform-origin");
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.transformString = function (t) {
        if (!this._transforms) return "";
        return this._transforms.join("");
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * adds rows of items into the table, for example tbl.addRow(a,b,c)
       * @param Array items
       */
      _myTrait_.addRow = function (items) {
        var row = new _e("tr");
        this.addItem(row);

        row.addClass("row" + this._children.length);

        if (!(Object.prototype.toString.call(items) === "[object Array]")) {
          items = Array.prototype.slice.call(arguments, 0);
        }

        var colIndex = 0,
            me = this;
        items.forEach(function (ii) {
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
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param int i
       */
      _myTrait_.child = function (i) {
        if (this._children[i]) {
          return this._children[i];
        }
      };

      /**
       * @param float t
       */
      _myTrait_.childCount = function (t) {
        if (!this._children) return 0;
        return this._children.length;
      };

      /**
       * @param float elem
       * @param float fn
       */
      _myTrait_.domAttrIterator = function (elem, fn) {

        if (!elem) return;
        if (!elem.attributes) return;

        for (var i = 0; i < elem.attributes.length; i++) {
          var attrib = elem.attributes[i];
          if (attrib.specified) {
            fn(attrib.name, attrib.value);
          }
        }
      };

      /**
       * @param float elem
       * @param float fn
       * @param float nameSpace
       */
      _myTrait_.domIterator = function (elem, fn, nameSpace) {

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
              if (bStop) {} else {
                var bFullElem = child instanceof HTMLElement;
                if (bFullElem) {
                  var tN = child.tagName.toLowerCase();
                  if (!noRecurse[tN]) this.domIterator(child, fn, nameSpace);
                }
              }
            }
          }
        }
      };

      /**
       * Calls function for all the direct children of this node
       * @param function fn
       */
      _myTrait_.forChildren = function (fn) {
        if (this._children) {
          this._children.forEach(function (c) {
            fn(c);
            // c.forChildren(fn);
          });
        }
      };

      /**
       * Calls function for all the direct children of this node
       * @param function fn
       */
      _myTrait_.forEach = function (fn) {
        if (this._children) this._children.forEach(function (c) {
          fn(c);
          // c.forChildren(fn);
        });
      };

      /**
       * Returns all the children which return true when given as parameter to function fn.
       * @param function fn
       * @param float list
       */
      _myTrait_.searchTree = function (fn, list) {
        if (!list) list = [];
        var v;
        if (v = fn(this)) list.push(v);
        if (this._children) this._children.forEach(function (c) {
          // if(fn(c)) list.push(c);
          c.searchTree(fn, list);
        });
        return list;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param string c
       */
      _myTrait_.addClass = function (c) {
        // safari problem

        if (this._svg) return this;
        if (this._dom instanceof SVGElement) return;

        if (!this._classes) {
          this._classes = [];
        }

        if (this.isStream(c)) {

          var me = this,
              oldClass = "";
          c.onValue(function (c) {
            if (oldClass && c != oldClass) {
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
        if (!this._svg) this._dom.className = this._classes.join(" ");

        return this;
      };

      /**
       * @param float str
       */
      _myTrait_.findPostFix = function (str) {

        if (this._myClass) {
          return this._myClass;
        } else {
          var p = this.parent();
          if (p) return p.findPostFix();
        }
        return "";
      };

      /**
       * @param string c
       */
      _myTrait_.hasClass = function (c) {
        if (!this._classes) return false;
        if (this._classes.indexOf(c) >= 0) return true;
        return false;
      };

      /**
       * @param string c
       */
      _myTrait_.removeClass = function (c) {
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
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _routes;

      // Initialize static variables here...

      /**
       * @param float eventName
       * @param float eventTransformer
       */
      _myTrait_.bacon = function (eventName, eventTransformer) {

        return Bacon.fromEvent(this._dom, eventName, eventTransformer); // (this._dom, eventName [, eventTransformer])
      };

      /**
       * @param String en
       * @param float fn
       * @param float stop
       */
      _myTrait_.bindSysEvent = function (en, fn, stop) {
        en = en.toLowerCase();
        if (!this._sys) this._sys = {};
        if (this._sys[en]) return false;

        this._sys[en] = true;

        var me = this;

        if (this._dom.attachEvent) {
          if (!stop) {
            this._dom.attachEvent("on" + en, fn);
          } else {
            this._dom.attachEvent("on" + en, function (e) {
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
            this._dom.addEventListener(en, function (e) {
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
      };

      /**
       * Delegates the events to this object
       * @param _e myDelecate
       */
      _myTrait_.delegate = function (myDelecate) {

        if (!this._delegates) this._delegates = [];
        this._delegates.push(myDelecate);
      };

      /**
       * @param string scope
       * @param float data
       */
      _myTrait_.emitValue = function (scope, data) {
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
      };

      /**
       * @param float dom
       * @param float eventName
       * @param float fn
       * @param float stop
       */
      _myTrait_.eventBinder = function (dom, eventName, fn, stop) {
        var me = this;
        if (dom.attachEvent) {
          dom.attachEvent("on" + eventName, function (e) {
            e = e || window.event;
            me._event = e;
            fn();
            if (stop) {
              e = window.event;
              if (e) e.cancelBubble = true;
            }
          });
        } else {
          dom.addEventListener(eventName, function (e) {
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
      };

      /**
       * @param float t
       */
      _myTrait_.isHovering = function (t) {
        if (!this._hoverable) {
          this._hovering = false;
          var o = this;

          this.on("mouseenter", function () {
            // console.log("Entered...");
            o._hovering = true;
          });
          this.on("mouseleave", function () {
            o._hovering = false;
          });
          this._hoverable = true;
        }
        return this._hovering;
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.namedListener = function (name, fn) {

        if (typeof fn != "undefined") {

          if (!this._namedListeners) this._namedListeners = {};
          this._namedListeners[name] = fn;
          fn._listenerName = name;
          return this;
        }
        if (!this._namedListeners) return;
        return this._namedListeners[name];
      };

      /**
       * Binds event name to event function
       * @param string en  - Event name
       * @param float ef
       */
      _myTrait_.on = function (en, ef) {
        if (!this._ev) this._ev = {};
        if (!this._ev[en]) this._ev[en] = [];

        this._ev[en].push(ef);
        var me = this;

        ef._unbindEvent = function () {
          me.removeListener(en, ef);
        };

        if (en == "load") {
          if (this._imgLoaded) {
            this.trigger("load");
          }
        }

        // To stop the prop...
        if (en == "click") this.bindSysEvent("click", function () {
          me.trigger("click");
        }, true);

        if (en == "dblclick") this.bindSysEvent("dblclick", function () {
          me.trigger("dblclick");
        }, true);

        if (en == "mousedown") this.bindSysEvent("mousedown", function () {
          me.trigger("mousedown");
        });

        if (en == "mouseup") this.bindSysEvent("mouseup", function () {
          me.trigger("mouseup");
        });

        if (en == "checked") {

          this.bindSysEvent("change", function () {
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
          this.bindSysEvent("change", function () {

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
            this.bindSysEvent("keyup", function () {
              var bch = false;
              if (lastValue != me._dom.value) bch = true;
              me._value = me._dom.value;
              if (bch) me.trigger("value");
              lastValue = me._dom.value;
            });
          }
        }

        if (en == "focus") {
          this.bindSysEvent("focus", function () {
            me._value = me._dom.value;
            me.trigger("focus");
          });
        }

        if (en == "play") {
          this.bindSysEvent("play", function () {
            me.trigger("play");
          });
        }

        if (en == "mousemove") {
          this.bindSysEvent("mousemove", function () {
            me.trigger("mousemove");
          });
        }

        if (en == "blur") {
          this.bindSysEvent("blur", function () {
            me._value = me._dom.value;
            me.trigger("blur");
          });
        }

        if (en == "mouseenter") {
          if (this._dom.attachEvent) {
            this.bindSysEvent("mouseenter", function (e) {
              e = e || window.event;
              if (me._hover) return;
              me._event = e;
              me._hover = true;
              me.trigger("mouseenter");
            });
            this.bindSysEvent("mouseleave", function (e) {
              e = e || window.event;
              if (!me._hover) return;
              me._event = e;
              me._hover = false;
              me.trigger("mouseleave");
            });
          } else {

            this.bindSysEvent("mouseover", function (e) {
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
            this.bindSysEvent("mouseout", function (e) {
              if (!me._hover) return;

              var childHover = false;
              me.forChildren(function (c) {
                if (c._hover) childHover = true;
              });

              if (childHover) return;

              me._hover = false;

              me.trigger("mouseleave");
            });
          }
        }

        return this;
      };

      /**
       * @param string scope
       * @param float fn
       */
      _myTrait_.onValue = function (scope, fn) {
        if (!this._valueFn) {
          this._valueFn = {};
        }
        this._valueFn[scope] = fn;
      };

      /**
       * @param float t
       */
      _myTrait_.removeAllHandlers = function (t) {

        if (this._ev) {
          // console.log("Removing handlers....");
          for (var n in this._ev) {
            if (this._ev.hasOwnProperty(n)) {
              var list = this._ev[n],
                  me = this;
              //console.log("Removing list....", list);
              list.forEach(function (fn) {
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
      };

      /**
       * @param float eventName
       * @param float fn
       */
      _myTrait_.removeListener = function (eventName, fn) {
        if (this._ev && this._ev[eventName]) {
          var i = this._ev[eventName].indexOf(fn);
          if (i >= 0) this._ev[eventName].splice(i, 1);

          if (this._ev[eventName].length == 0) {
            delete this._ev[eventName];
          }
        }
      };

      /**
       * @param string eventName
       * @param float fn
       */
      _myTrait_.router = function (eventName, fn) {

        var me = this;
        this._dom.addEventListener(eventName, function (event) {
          var elem = event.target;
          if (!elem) return;
          var routeId = elem.getAttribute("data-routeid");
          if (routeId) {
            var obj = _routes[routeId];
            if (obj) fn(obj);
          }
        });
      };

      /**
       * @param float obj
       * @param float recursive
       */
      _myTrait_.setRoute = function (obj, recursive) {

        var routeId = this.guid();
        this._dom.setAttribute("data-routeid", routeId);
        if (!_routes) _routes = {};
        if (recursive) {
          this.forChildren(function (ch) {
            ch.setRoute(obj, recursive);
          });
        }
        _routes[routeId] = obj;
      };

      /**
       * triggers event with data and optional function
       * @param string en
       * @param float data
       * @param float fn
       */
      _myTrait_.trigger = function (en, data, fn) {
        if (this._delegates) {
          this._delegates.forEach(function (d) {
            if (d && d.trigger) d.trigger(en, data, fn);
          });
          // return;
        }
        if (!this._ev) return;
        if (!this._ev[en]) return;
        var me = this;
        this._ev[en].forEach(function (cb) {
          if (cb) {
            cb.apply(me, [me, data, fn]);
          }
        });
        return this;
      };

      /**
       * @param string listenerName
       * @param float fn
       */
      _myTrait_.uniqueListener = function (listenerName, fn) {
        var oldList = this.namedListener(listenerName);
        if (oldList) {
          if (oldList._unbindEvent) oldList._unbindEvent();
        }
        this.namedListener(listenerName, fn);
        return fn;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * Binds input value to an object with data
       * @param object obj
       * @param float varName
       */
      _myTrait_.bind = function (obj, varName) {
        var o = this;
        // The special case here...
        if (this.isFunction(obj[varName])) {

          var val = obj[varName](),
              o = this,
              fn = function fn(v) {
            obj[varName](v);
          },
              bSendingEvent = false,
              me = this;

          //
          //  var isNumber = !isNaN(val);

          var isNumber = false;

          var oo = obj;

          var valueInListener = this.uniqueListener("bind:valueIn", function (obj, newVal) {
            if (bSendingEvent) return;
            if (o._type == "checkbox") {
              o.checked(newVal);
            } else {
              o.bindVal(newVal);
            }
            val = newVal;
          });
          var valueOutListener = this.uniqueListener("bind:valueOut", function (obj) {
            //console.log("Got value out for ", obj, "which value was ",val);
            //console.trace();
            bSendingEvent = true;
            if (o._type == "checkbox") {
              fn(o.checked());
            } else {
              fn(isNumber ? parseFloat(o.val()) : o.val());
            }
            bSendingEvent = false;
          });

          //

          var invalidInputListener = this.uniqueListener("bind:invalidIn", function (obj, msg) {
            o.trigger("invalid", msg);
          });
          var validInputListener = this.uniqueListener("bind:validIn", function (obj, newVal) {
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
            //if(o._type=="select" || o._type=="input" || o._type=="textarea") {
            o.bindVal(val);
            //}
          }

          // and exit...
          return this;
        }

        var _ee_ = this.__singleton();
        _ee_.bind(obj, varName, this);
        var o = this;
        this.on("datachange", function () {
          if (o._type == "checkbox") {
            if (obj[varName]) {
              o.checked(true);
            } else {
              o.checked(false);
            }
          } else {

            if (typeof obj[varName] != "undefined") {
              o.val(obj[varName]);
            }
          }
        });
        this.on("value", function () {
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
      };

      /**
       * @param float v
       */
      _myTrait_.bindVal = function (v) {

        if (typeof this._dom.value != "undefined" || this._type == "option") {
          this._dom.value = v;
        } else {
          this._dom.innerHTML = v;
        }
        this._value = v;
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.blur = function (t) {
        if (this._dom.blur) this._dom.blur();
      };

      /**
       * @param bool v
       */
      _myTrait_.checked = function (v) {
        if (typeof v == "undefined") {

          // if(typeof( this._checked)=="undefined") {
          this._checked = this._dom.checked;
          // this.trigger("value");
          return this._checked;
        }

        var nowOn = this._dom.checked;
        this._dom.checked = v;

        if (nowOn && !v || !nowOn && v) {
          this.trigger("value");
        }

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.clearOptions = function (t) {
        if (this._dataList) {
          var node = this._dataList._dom;
          if (node.parentNode) node.parentNode.removeChild(node);
          this._options = {};
          this._dataList = null;
        }
      };

      /**
       * Focus into this element
       * @param float t
       */
      _myTrait_.focus = function (t) {
        if (this._dom.focus) this._dom.focus();
      };

      /**
       * @param float name
       */
      _myTrait_.getClipboard = function (name) {
        return clipBoard(name);
      };

      /**
       * @param float withName
       */
      _myTrait_.localStore = function (withName) {

        var cb = clipBoard(withName);

        var val = cb.fromClipboard();
        if (val) {
          this.val(val);
        }

        var me = this;
        this.on("value", function () {
          cb.toClipboard(me.val());
        });

        // toClipboard
        return this;
      };

      /**
       * @param Array list
       */
      _myTrait_.options = function (list) {
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
            if (Object.prototype.toString.call(list) === "[object Array]") {
              var me = this;
              list.forEach(function (n) {
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
          } else {}
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
      };

      /**
       * @param float transformFn
       */
      _myTrait_.toBacon = function (transformFn) {

        var me = this;
        later().asap(function () {
          if (typeof me.val() != "undefined") {
            me.trigger("value");
          }
        });

        return Bacon.fromBinder(function (sink) {
          me.on("value", function (o, v) {
            if (transformFn) {
              sink(transformFn(me.val()));
            } else {
              sink(me.val());
            }
          });
          return function () {};
        });
      };

      /**
       * Sets or gets the input value
       * @param object v
       */
      _myTrait_.val = function (v) {
        if (typeof v == "undefined") {
          if (this._type == "select" || this._type == "input" || this._type == "textarea") {
            this._value = this._dom.value;
          }
          return this._value;
        }

        if (typeof this._dom.value != "undefined" || this._type == "option") {
          this._dom.value = v;
        } else {}

        this._value = v;
        this.trigger("value", v);
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _shInit;

      // Initialize static variables here...

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.a = function (className, attrs) {
        var el = this.shortcutFor("a", className, attrs);
        return el;
      };

      /**
       * @param object v
       * @param float v2
       */
      _myTrait_.attr = function (v, v2) {

        if (this.isObject(v)) {
          for (var n in v) {
            if (v.hasOwnProperty(n)) {
              this.attr(n, v[n]);
            }
          }
        } else {
          if (this._tag == "canvas") {
            if (v == "width") {
              this._canWidth = parseInt(v2);
            }
            if (v == "height") this._canHeight = parseInt(v2);
          }
          this.q.attr(v, v2);
        }
        return this;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.b = function (className, attrs) {
        var el = this.shortcutFor("b", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.button = function (className, attrs) {
        var el = this.shortcutFor("button", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.canvas = function (className, attrs) {
        var el = this.shortcutFor("canvas", className, attrs);
        el._canvas = true;
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.checkbox = function (className, attrs) {
        var el = this.shortcutFor("checkbox", className, attrs);
        return el;
      };

      /**
       * @param float t
       */
      _myTrait_.clearCanvas = function (t) {
        var ctx = this.ctx(),
            canvas = this._dom;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.ctx = function (t) {
        if (this._dom.getContext) {
          return this._dom.getContext("2d");
        }
      };

      /**
       * @param string className
       * @param float attrs
       */
      _myTrait_.div = function (className, attrs) {
        var el = this.shortcutFor("div", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.form = function (className, attrs) {
        var el = this.shortcutFor("form", className, attrs);
        return el;
      };

      /**
       * @param float pixelData
       */
      _myTrait_.getPixelFn = function (pixelData) {

        var ctx = this.ctx();

        if (pixelData && pixelData._dom) {
          ctx = pixelData.ctx();
          pixelData = ctx.getImageData(0, 0, pixelData._canWidth, pixelData._canWidth);
        } else {
          // Get the context...
          if (!pixelData) pixelData = ctx.getImageData(0, 0, this._canWidth, this._canWidth);
        }

        var data = pixelData.data;

        return function (x, y) {
          var index = (x + y * pixelData.width) * 4;
          return {
            x: x,
            y: y,
            r: data[index + 0],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
          };
        };
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.h1 = function (className, attrs) {
        var el = this.shortcutFor("h1", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.h2 = function (className, attrs) {
        var el = this.shortcutFor("h2", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.h3 = function (className, attrs) {
        var el = this.shortcutFor("h3", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.h4 = function (className, attrs) {
        var el = this.shortcutFor("h4", className, attrs);
        return el;
      };

      /**
       * @param String className
       * @param float attrs
       */
      _myTrait_.img = function (className, attrs) {
        var el = this.shortcutFor("img", className, attrs);
        return el;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {});

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.input = function (className, attrs) {
        var el = this.shortcutFor("input", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.label = function (className, attrs) {
        var el = this.shortcutFor("label", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.li = function (className, attrs) {
        var el = this.shortcutFor("li", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.ol = function (className, attrs) {
        var el = this.shortcutFor("ol", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.p = function (className, attrs) {
        var el = this.shortcutFor("p", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.pre = function (className, attrs) {
        var el = this.shortcutFor("pre", className, attrs);
        return el;
      };

      /**
       * @param float fn
       * @param float pixelData
       * @param bool doNotUpdate
       */
      _myTrait_.processPixels = function (fn, pixelData, doNotUpdate) {

        var ctx = this.ctx();

        // Get the context...
        if (!pixelData) pixelData = ctx.getImageData(0, 0, this._canWidth, this._canHeight);

        var data = pixelData.data;
        var index = 0;
        for (var y = 0; y < this._canHeight; y++) {
          for (var x = 0; x < this._canWidth; x++) {
            var r = data[index],
                g = data[index + 1],
                b = data[index + 2],
                a = data[index + 3];

            var p = {
              x: x,
              y: y,
              r: r,
              g: g,
              b: b,
              a: a
            };
            fn(p);
            if (p.r != r) data[index] = p.r;
            if (p.g != g) data[index + 1] = p.g;
            if (p.b != b) data[index + 2] = p.b;
            if (p.a != a) data[index + 3] = p.a;

            index += 4;
          }
        }
        if (!doNotUpdate) {
          console.log(this._canWidth, this._canHeight);
          ctx.putImageData(pixelData, 0, 0, 0, 0, this._canWidth, this._canHeight);
        }
        return pixelData;
      };

      /**
       * @param float params
       */
      _myTrait_.row = function (params) {
        var args = Array.prototype.slice.call(arguments);
        if (this._tag == "table") {
          this.addRow(args);
          return this;
        }

        var tbl = this.table();
        tbl.addRow(args);
        return tbl;
      };

      /**
       * @param String name
       * @param float className
       * @param float attrs
       */
      _myTrait_.shortcutFor = function (name, className, attrs) {
        var el = _e(name);
        this.add(el);

        var constr = [],
            classes = [],
            attrList = [];

        var args = Array.prototype.slice.call(arguments);
        args.shift();
        var me = this;

        args.forEach(function (a, i) {
          if (classes.length == 0 && typeof a == "string") {
            classes.push(a);
            return;
          }
          if (classes.length == 0 && me.isStream(a)) {
            classes.push(a);
            return;
          }
          if (attrList.length == 0 && me.isObject(a) && !me.isFunction(a)) {
            attrList.push(a);
            return;
          }
          if (constr.length == 0 && me.isFunction(a)) {
            constr.push(a);
            return;
          }
        });

        classes.forEach(function (c) {
          el.addClass(c);
        });
        attrList.forEach(function (myAttrs) {
          for (var n in myAttrs) {
            if (myAttrs.hasOwnProperty(n)) {
              el.attr(n, myAttrs[n]);
            }
          }
        });
        constr.forEach(function (c) {
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
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.span = function (className, attrs) {
        var el = this.shortcutFor("span", className, attrs);
        return el;
      };

      /**
       * @param String src
       */
      _myTrait_.src = function (src) {
        if (this._tag == "img") {
          if (!this._hasLoadL) {
            var me = this;
            me._imgLoaded = false;
            this.__singleton().addEventListener(this._dom, "load", function () {
              me.trigger("load");
              me._imgLoaded = true;
            });
            this._hasLoadL = true;
          }
        }

        if (this._tag == "canvas") {
          var img = _e("img"),
              me = this;
          me._imgLoaded = false;
          img.src(src);
          img.on("load", function () {

            var im = img._dom;

            //me.width(im.width);
            //me.height(im.height);

            if (!me._canWidth) {

              me.q.attr("width", im.width);
              me.q.attr("height", im.height);

              me._canWidth = im.width;
              me._canHeight = im.height;
            }

            var ctx = me._dom.getContext("2d");
            ctx.drawImage(im, 0, 0, im.width, im.height, 0, 0, me._canWidth, me._canHeight);
            me.trigger("load");
            me._imgLoaded = true;
          });
          return this;
        }
        this.q.attr("src", src);

        return this;
      };

      /**
       * @param String className
       * @param float attrs
       */
      _myTrait_.strong = function (className, attrs) {
        var el = this.shortcutFor("strong", className, attrs);
        return el;
      };

      /**
       * @param String className
       * @param float attrs
       */
      _myTrait_.table = function (className, attrs) {
        var el = this.shortcutFor("table", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.textarea = function (className, attrs) {
        var el = this.shortcutFor("textarea", className, attrs);
        return el;
      };

      /**
       * @param float format
       * @param float quality
       */
      _myTrait_.toDataURL = function (format, quality) {

        if (!quality) quality = 1;

        return this._dom.toDataURL(format || "image/png", quality);
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.ul = function (className, attrs) {
        var el = this.shortcutFor("ul", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.video = function (className, attrs) {
        var el = this.shortcutFor("video", className, attrs);
        return el;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float elem
       * @param float text
       */
      _myTrait_._setDomText = function (elem, text) {
        if (typeof elem.textContent != "undefined") {
          elem.textContent = text;
        } else {
          var html = text;
          var div = document.createElement("div");
          div.innerHTML = html;
          var newText = div.innerText || "";
          elem.innerHTML = newText;
        }
      };

      /**
       * @param string h
       */
      _myTrait_.html = function (h) {

        // test if the value is a stream
        if (this.isStream(h)) {
          var me = this;
          // TODO: check if we are re-binding two streams on the same element, possible error
          h.onValue(function (t) {
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
          oo.me.on(oo.name, me.uniqueListener("text:value", function (o, v) {
            me._dom.innerHTML = v;
          }));
          this._dom.innerHTML = val;
          return this;
        }

        if (typeof h == "undefined") return this._dom.innerHTML;
        this._dom.innerHTML = h;
        return this;
      };

      /**
       * @param string t
       */
      _myTrait_.text = function (t) {
        if (typeof t == "undefined") return this._html;

        var args = Array.prototype.slice.call(arguments);

        if (args.length > 1) {

          var bHadNonS = false,
              me = this;
          args.forEach(function (o) {
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
            t.onValue(function (t) {
              if (me._svgElem || typeof me._dom.textContent != "undefined") {
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

          if (this._svgElem || typeof me._dom.textContent != "undefined") {
            oo.me.on(oo.name, me.uniqueListener("text:value", function (o, v) {
              if (bTSpan) v = v.trim();
              // soon.add(me.text, me, v);
              if (bTSpan && (!v || v.length == 0)) {
                me._dom.textContent = " ";
              } else {
                me._dom.textContent = v;
              }
            }));
          } else {
            oo.me.on(oo.name, me.uniqueListener("text:value", function (o, v) {
              var html = v;
              var div = document.createElement("div");
              div.innerHTML = html;
              var newText = div.textContent || div.innerText || "";
              me._dom.innerHTML = newText;
            }));
          }

          if (this._svgElem || typeof this._dom.textContent != "undefined") {
            if (bTSpan) val = val.trim();
            if (bTSpan && (!val || val.length == 0)) {
              this._dom.textContent = "";
              me._dom.textContent = " ";
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

        if (this._svgElem || typeof this._dom.textContent != "undefined") {
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
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var lastView;
      var bInited;
      var _settingView;
      var _eventState;
      var _windowSize;
      var _mediaListeners;
      var mql;
      var _transitionOn;
      var _pageViews;
      var _pageControllers;
      var _ctrlObjs;
      var _viewStructures;
      var _contentRouters;
      var _viewFactory;
      var _viewCache;
      var _dynamicFactory;

      // Initialize static variables here...

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.contentRouter = function (name, fn) {

        if (!_contentRouters) _contentRouters = {};
        if (this.isFunction(name)) {
          _contentRouters["default"] = name;
        } else {
          _contentRouters[name] = fn;
        }
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.createLayout = function (name, fn) {
        if (!_viewStructures) _viewStructures = {};

        var holder = _e();
        var view;
        if (this.isFunction(fn)) {
          view = fn();
        } else {
          view = fn;
        }

        _viewStructures[name] = {
          view: view,
          viewHolder: holder
        };
      };

      /**
       * This is very opinionated function to load _data from some store
       * @param float data
       */
      _myTrait_.factoryLoader = function (data) {

        // load the factories from the _data()
        var me = this;
        return data.then(function (res) {
          data.forTree(function (t) {
            if (t.get("type") == "function") {
              if (!_dynamicFactory) _dynamicFactory = {};
              _dynamicFactory[t.get("name")] = t; // allows to listen to the factory assigments...
              me.viewFactory(t.get("name"), new Function(t.get("body")));
            }
          });
        });
      };

      /**
       * @param float options
       */
      _myTrait_.fiddle = function (options) {
        var iframe = _e("iframe");
        var myId = this.guid();

        var html = decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chead%3E");

        if (options.scripts) options.scripts.forEach(function (s) {
          html += decodeURIComponent("%3Cscript%20src%3D'") + s + decodeURIComponent("'%3E%3C%2Fscript%3E");
        });
        if (options.stylesheets) options.stylesheets.forEach(function (s) {
          html += "<link rel=\"stylesheet\" href=\"" + s + "\"></link>";
        });
        if (options.head) html += options.head;
        html += "</head><body>";

        if (!options.callBackName) options.callBackName = "fiddleDone";

        if (options.onReady && options.callBackName) {
          var ls = window["localStorage"];
          var waitFor = function waitFor() {
            var res;
            if (res = ls.getItem(myId)) {
              later().removeFrameFn(waitFor);
              options.onReady(JSON.parse(res));
            }
          };
          later().onFrame(waitFor);
          html += decodeURIComponent("%3Cscript%3E") + "function " + options.callBackName + "(v){window['localStorage'].setItem('" + myId + "', JSON.stringify(v));}";
          html += decodeURIComponent("%3C%2Fscript%3E");
        }

        if (options.html) html += options.html;
        if (options.jsCode) html += decodeURIComponent("%3Cscript%3E") + options.jsCode + decodeURIComponent("%3C%2Fscript%3E");
        html += "</body></html>";
        this.addItem(iframe);

        iframe._dom.contentWindow.document.open();
        iframe._dom.contentWindow.document.write(html);
        iframe._dom.contentWindow.document.close();

        iframe.width(options.width || 800).height(options.height || 600);

        return this;
      };

      /**
       * @param float name
       * @param float layout
       */
      _myTrait_.findViewByName = function (name, layout) {

        if (layout.hasClass(name)) {
          return layout;
        } else {
          var o = null,
              i = 0,
              ch;

          while (ch = layout.child(i++)) {
            if (ch.hasClass(name)) return ch;
          }
          i = 0;
          while (ch = layout.child(i++)) {
            var res = ch.findViewByName(name, ch);
            if (res) return res;
          }
          // console.log("could not find ", name, " from layout");
        }
      };

      /**
       * @param float t
       */
      _myTrait_.getLayouts = function (t) {
        return _viewStructures;
      };

      /**
       * @param float t
       */
      _myTrait_.getRouteObj = function (t) {
        var parts = document.location.hash.split("/");

        var toParamsObj = function toParamsObj(a) {
          var o = {};
          for (var i = 0; i < a.length; i += 2) o[a[i]] = a[i + 1];
          return o;
        };
        return {
          hash: document.location.hash,
          parts: parts.slice(),
          controller: parts.shift().substring(1),
          action: parts.shift(),
          params: toParamsObj(parts),
          rest: parts
        };
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!_eventState) {
          var me = this;
          this.eventBinder(window, "hashchange", function () {
            if ("#" + _eventState.lastSetValue == document.location.hash) return;
            if (_eventState.pushing) return;

            _eventState.routers.forEach(function (fn) {
              fn(me.getRouteObj());
            });
          });
          _eventState = {
            inited: true,
            routers: []
          };
          _pageViews = {};
          _ctrlObjs = [];
          _pageControllers = [];
          this.onRoute(function (r) {
            // console.log("on route with ", r);
            _ctrlObjs.forEach(function (obj) {
              var pc = obj._pageController;
              var rFn = pc[r.controller] || pc["default"];
              if (rFn) {
                // console.log("pageController ", rFn);
                var action = rFn.ctrl[r.action] || rFn.ctrl["default"];
                // console.log("action ", action);
                if (action) {
                  action.apply(rFn.canvas, [r.params, rFn.canvas, r]);
                }
              }
            });
          });
          /*
          {
          "hash": "#frontpage/",
          "parts": [
          "#frontpage",
          ""
          ],
          "controller": "frontpage",
          "action": "",
          "params": {},
          "rest": []
          }    
          */
        }
      });

      /**
       * @param float t
       */
      _myTrait_.initScreenEvents = function (t) {
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
          mql.addListener(function (q) {
            eventCnt++;
            if (q.matches) {
              _mediaListeners.forEach(function (fn) {
                fn({
                  w: window.innerWidth || document.documentElement.clientWidth,
                  h: window.innerHeight || document.documentElement.clientHeight,
                  limit: 700,
                  width_less: true,
                  eCnt: eventCnt
                });
              });
            } else {
              _mediaListeners.forEach(function (fn) {
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

          this.eventBinder(bindTo, "resize", function () {
            // what is the screen size...

            eventCnt++;

            var width = window.innerWidth || document.documentElement.clientWidth,
                doAlert = false,
                limit = 700;

            _widthLimits.forEach(function (w) {
              var ch = (w - width) * (w - _windowSize.w);
              if (ch < 0) {
                limit = w;
                doAlert = true;
              }
            });

            _windowSize.w = window.innerWidth || document.documentElement.clientWidth;
            _windowSize.h = window.innerHeight || document.documentElement.clientHeight;

            if (doAlert) {
              _mediaListeners.forEach(function (fn) {
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
      };

      /**
       * @param String layoutName
       * @param float layoutDef
       */
      _myTrait_.layout = function (layoutName, layoutDef) {

        if (!layoutDef) {
          layoutDef = layoutName;
          layoutName = this.guid();
        }

        // -> how to define the layout
        // o.layout("top 100% | bottom 100% " );
        // top 100% | left 20%, content 80% | bottom 100%
        /*
        var o _e();
        o.div("icon");
        o.div("title");
        o.div("else");
        return o;
        */

        // --> maybe some day this might be possible, but not now...
        // "top 100% | left 20% ( leftTools | leftTree | leftBottom ), content 80% | bottom 100% "

        var vParts = layoutDef.split("|");

        var base = _e();
        vParts.forEach(function (pDef) {

          var row = base.div(); // <-- or the factory name...
          pDef.split(",").forEach(function (layItem) {

            layItem = layItem.trim();
            var parts = layItem.split(" ");
            var partName = parts[0];

            // => the layout item using just a CSS class etc.
            var elem = row.div(partName);
            elem._dom.style.display = "inline-block";

            if (parts.length > 1) {
              parts.shift();
              var prosStr = parts.join(""); // 10% => 10
              elem.width(prosStr);
            } else {}
          });
        });
        this.createLayout(layoutName, base);
        this.setLayout(layoutName);

        // ==> should set the layout object here...

        return this;

        // => returns the layout object to modify the layout if necessary...
      };

      /**
       * @param function fn
       */
      _myTrait_.onMediaChange = function (fn) {

        _mediaListeners.push(fn);
      };

      /**
       * @param float fn
       */
      _myTrait_.onRoute = function (fn) {

        _eventState.routers.push(fn);
        var me = this;
        later().add(function () {
          fn(me.getRouteObj());
        });
      };

      /**
       * @param float page
       * @param float controllerObj
       */
      _myTrait_.pageController = function (page, controllerObj) {

        if (!this._pageController) this._pageController = {};

        this._pageController[page] = {
          ctrl: controllerObj,
          canvas: this
        };

        if (_ctrlObjs.indexOf(this) < 0) {
          _ctrlObjs.push(this);
        };
      };

      /**
       * @param Object toView
       */
      _myTrait_.popView = function (toView) {

        if (!this._views || this._views.length == 0) {
          if (this._parent) {
            this._parent.popView();
            return this;
          }
          this._views = [];
          return this;
        }

        var ms = new Date().getTime();
        if (_transitionOn && ms - _transitionOn < 1000) return;
        _transitionOn = ms;

        var cont = this;
        var lastView = this;
        var view = this._views.pop();

        var showP = true;
        var me = this;

        if (!this._poppedViews) this._poppedViews = _e();

        cont.forChildren(function (ch) {

          ch.removeClass("viewOut");
          ch.removeClass("viewIn");
          ch.addClass("viewOut");

          if (showP) {
            later().after(0.2, function () {
              // console.log("Old view child count ", view.oldChildren._children.length);
              var addThese = [];
              view.oldChildren.forChildren(function (ch) {
                ch.show();
                addThese.push(ch);
              });
              addThese.forEach(function (c) {
                cont.add(c);
                c.removeClass("viewOut");
                c.removeClass("viewIn");
                c.addClass("viewIn");
              });
              if (addThese[0]) addThese[0].scrollTo();
              if (view.oldTitle && me.setTitle) me.setTitle(view.oldTitle);
              showP = false;
              later().after(0.2, function () {
                _transitionOn = 0;
              });
            });
          }
          later().after(0.2, function () {
            // ch.remove();
            me._poppedViews.add(ch);
          });
        });
      };

      /**
       * @param float name
       * @param float factoryName
       * @param float paramName
       */
      _myTrait_.pushTo = function (name, factoryName, paramName) {

        if (!this._activeLayout) {
          var p = this.parent();
          if (p) {
            //console.log("no active layout Looking parent .... ");
            //console.log(p);
            p.pushTo(name, factoryName, paramName);
          }
          return this;
        } else {

          // could use replaceWith to create dynamic replace

          var view = this.findViewByName(name, this._activeLayout.view);

          if (!view) {
            return;
          }

          if (!_viewCache) _viewCache = {};

          var obj;
          if (!paramName) paramName = "";
          if (this.isObject(factoryName)) {
            obj = factoryName;
          } else {
            if (_viewCache[factoryName + "." + paramName]) {
              obj = _viewCache[factoryName + "." + paramName];
            } else {
              var f = _viewFactory[factoryName];
              if (f) {
                obj = f(paramName);
                if (obj) {
                  _viewCache[factoryName + "." + paramName] = obj;
                }
              }
            }
          }

          if (obj) {
            if (!this._activeLayout.parts) this._activeLayout.parts = {};
            this._activeLayout.parts[name] = view;
            view.pushView(obj);
            if (obj.componentDidMount) {
              obj.componentDidMount();
            }
            var dyn;
            if (dyn = _dynamicFactory[factoryName]) {
              dyn.on("body", function (o, v) {
                try {
                  var newF = new Function(v);
                  var newObj = newF(paramName);
                  if (newObj) {
                    obj.replaceWith(newObj);
                    obj = newObj;
                    _viewFactory[factoryName] = newF;
                    _viewCache[factoryName + "." + paramName] = newObj;
                  }
                } catch (e) {}
              });
            }
          }
        }
      };

      /**
       * @param float newView
       * @param float params
       * @param float oldViewHolder
       */
      _myTrait_.pushView = function (newView, params, oldViewHolder) {

        if (!this._views) {
          this._views = [];
        }

        // console.log("... trying pushing .... ", newView );
        if (newView == this) return;
        if (newView == lastView) return;

        // console.log("... pushing view .... ", newView );

        var cont = this;
        if (cont._children && cont._children[0] == newView) {
          // console.error("... pushing view failed because this view had already the child view???.... ", newView);
          return;
        }

        if (this.isFunction(newView)) {
          newView = newView();
        }

        var ms = new Date().getTime();
        if (this._transitionOn && ms - this._transitionOn < 1000) return;
        this._transitionOn = ms;

        if (!params) params = null;

        var oldChildren = oldViewHolder || _e();

        var viewData = {
          parentView: null,
          oldTitle: this.__currentTitle,
          oldChildren: oldChildren,
          params: params
        };

        var showP = true,
            hadChildren = false,
            me = this;

        this.onValue("pushView", function (v) {
          me.pushView(v);
        });

        this.onValue("popView", function (toView) {
          me.popView(toView);
        });

        lastView = this;

        // console.log("PUSH, view child count ", cont._children.length);
        cont.forChildren(function (ch) {

          hadChildren = true;
          // fadeout, fadein, not used here...
          later().after(0.3, function () {

            newView.removeClass("viewOut");
            newView.removeClass("viewIn");

            newView.addClass("viewIn");
            cont.add(newView);

            newView.show();
            showP = false;

            later().after(0.2, function () {

              me._transitionOn = 0;
              newView.scrollTo();
            });
          });
          ch.removeClass("viewIn");
          ch.removeClass("viewOut");
          ch.addClass("viewOut");
          later().after(0.2, function () {
            oldChildren.add(ch);
          });
        });
        this._views.push(viewData);
        if (!hadChildren) {

          later().after(0.3, function () {
            newView.removeClass("viewIn");
            newView.removeClass("viewOut");
            newView.addClass("viewIn");
            cont.add(newView);

            newView.show();

            later().after(0.2, function () {
              me._transitionOn = 0;
              newView.scrollTo();
            });
          });
        }

        _eventState.pushing = false;

        return this;
      };

      /**
       * @param float o
       */
      _myTrait_.removeControllersFor = function (o) {
        var i = _ctrlObjs.indexOf(o);

        if (i >= 0) {
          _ctrlObjs.splice(i, 1);
        }
      };

      /**
       * Make the window scroll to this element
       * @param int noThing  - Not a param
       */
      _myTrait_.scrollTo = function (noThing) {
        if (window) {
          var box = this.offset();
          var currLeft = window.pageXOffset;

          var toY = box.top;
          if (toY < window.innerHeight / 2) return;
          if (box.top < window.innerHeight) {
            toY = toY / 2;
          } else {
            toY = toY - window.innerHeight * 0.2;
          }
          window.scrollTo(currLeft || 0, parseInt(toY));
        }
      };

      /**
       * @param float name
       */
      _myTrait_.setLayout = function (name) {
        var me = this;
        // ok, need to think about how to create this thing
        if (_viewStructures && _viewStructures[name]) {

          var layout = _viewStructures[name];

          if (this._activeLayout == layout) return this;

          this._activeLayout = layout;
          this._children.length = 0;
          this._children[0] = layout.view;
          layout.view._parent = this;
          if (this._dom.firstChild) this._dom.removeChild(this._dom.firstChild);
          this._dom.appendChild(layout.view._dom);

          /*
          var viewHolder = null;
          // how the layout goes...
          if(this._activeLayout) {
          layout.parts = this._activeLayout.parts;
          viewHolder = this._activeLayout.viewHolder;
          }
          if(layout.viewHolder.child(0)) {
          layout.view = layout.viewHolder.child(0);
          }
          console.log("1", _viewStructures["basic"].view.childCount());
          var layout = _viewStructures[name];
          // this.clear();
          console.log("2", _viewStructures["basic"].view.childCount());
          this.pushView( layout.view, null, viewHolder );
          console.log("3", _viewStructures["basic"].view.childCount());
          this._activeLayout = layout;
          */
          /*
          later().after(0.5, function() {
          for(var n in layout.parts) {
            if(layout.parts.hasOwnProperty(n)) {
                me.pushTo(n, layout.parts[n]);   
                console.log("pushTo", _viewStructures["basic"].view.childCount());
            }
          }    
          });
          */
        }
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.viewFactory = function (name, fn) {

        if (!_viewFactory) _viewFactory = {};

        _viewFactory[name] = fn;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _modelTemplates;
      var _viewContent;
      var _viewTemplates;
      var _namedModels;
      var _namedViews;
      var _dataLink;
      var _customDirectives;

      // Initialize static variables here...

      /**
       * @param Object item
       */
      _myTrait_.createItemView = function (item) {
        var vf = this.getViewFunction(item),
            me = this,
            newView;
        if (vf) {
          newView = vf(item);

          if (item.viewClass) {
            if (this.isFunction(item.viewClass)) {
              var oo = item.viewClass(null, true);
              var oldClass = item.viewClass();
              var myEventH = function myEventH(o, v) {
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
      };

      /**
       * @param float v
       */
      _myTrait_.data = function (v) {
        if (typeof v != "undefined") {
          this.__mdata = v;
          return this;
        }
        return this.__mdata;
      };

      /**
       * @param float stream
       * @param float viewFn
       */
      _myTrait_.fromStream = function (stream, viewFn) {

        var me = this;

        stream.onValue(function (data) {
          var newView = viewFn(data);
          later().add(function () {
            me.clear();
            me.add(newView);
          });
        });
      };

      /**
       * @param Object item
       */
      _myTrait_.getViewFunction = function (item) {
        if (this.isFunction(this._view)) {
          return this._view;
        }
        if (item.viewClass) {
          var vf;
          if (vf = this._view[item.viewClass()]) return vf;
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
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {});

      /**
       * @param float model
       * @param float type
       * @param float controller
       */
      _myTrait_.mv = function (model, type, controller) {

        var o, fn, elemName;
        if (this.isFunction(type)) {
          elemName = "div";
          fn = type;
        } else {
          elemName = type;
          fn = controller;
        }

        this.mvc(model, function (item) {
          var o = _e(elemName);
          fn.apply(o, [item]);
          return o;
        });
      };

      /**
       * @param Object model
       * @param float view
       * @param float controller
       */
      _myTrait_.mvc = function (model, view, controller) {

        var me = this;
        if (view) {
          this._view = view;
        }

        if (model) {
          // assume now that it is array
          this._model = model;

          // TODO: sort, delete, move...
          if (this._model.on) {
            this._model.on("insert", function (o, i) {
              var item = me._model.item(i);
              var nv = me.createItemView(item);
              if (nv) {
                me.insertAt(i, nv);
              }
            });

            this._model.on("move", function (o, cmd) {

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
            this._model.on("remove", function (o, i) {

              var ch = me.child(i);
              if (ch) {
                ch.remove();
              }
            });
            this._model.on("sort", function (o, ops) {

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
            this._model.forEach(function (item) {
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
      };

      /**
       * @param float treeData
       * @param float itemFn
       */
      _myTrait_.tree = function (treeData, itemFn) {
        var _dragState = {};
        var _dragOn;

        var showTree = function showTree(item, currLevel) {

          var subData, subDataElem, dragHandle;

          var subList = [];

          var li;

          var myObj = {
            subTree: function subTree(dataList, elem) {
              subList.push([dataList, elem]);
            },
            drag: function drag(elem, options) {
              dragHandle = elem;
            }
          };

          li = itemFn.apply(myObj, [item, currLevel]);
          li.on("click", function () {
            _dragState.lastActive = item;
          });
          li.on("mouseenter", function () {
            if (dragHandle) {
              if (_dragOn && !_dragState.dropTarget) {
                li.addClass("draggedOn");
                _dragState.dropTarget = item;
                _dragState.dropElem = li;
              } else {
                li.addClass("mouseOn");
              }
            }
          });

          li.on("mouseleave", function () {
            li.removeClass("mouseOn");
            li.removeClass("draggedOn");
            _dragState.dropTarget = null;
          });

          if (dragHandle) {
            dragHandle.drag(function (dragInfo) {
              if (dragHandle) {
                // do something here with dragInfo
                if (dragInfo.start && !_dragState.item) {
                  _dragOn = true;
                  _dragState.item = item;
                  _dragState.srcElem = li;
                }
                if (dragInfo.end) {
                  _dragOn = false;
                  if (_dragState.dropTarget && _dragState.item) {

                    if (_dragState.dropTarget.parent() == _dragState.item.parent()) {
                      if (_dragState.dropTarget != _dragState.item) {
                        var new_i = _dragState.dropTarget.indexOf();
                        _dragState.item.moveToIndex(new_i);
                      }
                    } else {
                      if (_dragState.dropTarget.items) {
                        _dragState.item.remove();
                        _dragState.dropTarget.items.push(_dragState.item);
                      }
                    }
                  }
                  _dragState.item = null;
                  _dragState.dropTarget = null;
                }
              }
            });
          }
          subList.forEach(function (a) {

            var subDataElem = a.pop();
            var subData = a.pop();

            if (subData && subDataElem) {
              var subTree = subDataElem;
              // maybe these are not really necessary...
              if (subData.length() > 0) {
                li.addClass("hasChildren");
              }
              subDataElem.on("insert", function () {
                li.addClass("hasChildren");
              });
              subDataElem.on("remove", function () {
                if (item.items.length() == 0) {
                  li.removeClass("hasChildren");
                }
              });
              subTree.hide();
              subDataElem.mvc(subData, function (item) {
                return showTree(item, currLevel + 1);
              });
              var sub_vis = item.get("open");
              item.on("open", function (o, v) {
                if (v) {
                  subTree.show();
                } else {
                  subTree.hide();
                }
              });
              // is the "open" a good thing to have for the tree?
              li.on("click", function () {
                sub_vis = !sub_vis;
                item.set("open", sub_vis);
              });
              if (sub_vis) subTree.show();
            }
          });

          return li;
        };
        this.mvc(treeData, function (item) {
          return showTree(item, 1);
        });
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.circle = function (className, attrs) {
        var el = this.shortcutFor("circle", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.defs = function (className, attrs) {
        var el = this.shortcutFor("defs", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.feGaussianBlur = function (className, attrs) {
        var el = this.shortcutFor("feGaussianBlur", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.feMerge = function (className, attrs) {
        var el = this.shortcutFor("feMerge", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.feMergeNode = function (className, attrs) {
        var el = this.shortcutFor("feMergeNode", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.feOffset = function (className, attrs) {
        var el = this.shortcutFor("feOffset", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.filter = function (className, attrs) {
        var el = this.shortcutFor("filter", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.g = function (className, attrs) {
        var el = this.shortcutFor("g", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.image = function (className, attrs) {
        var el = this.shortcutFor("image", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.line = function (className, attrs) {
        var el = this.shortcutFor("line", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.path = function (className, attrs) {
        var el = this.shortcutFor("path", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.rect = function (className, attrs) {
        var el = this.shortcutFor("rect", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       * @param float none
       */
      _myTrait_.svg = function (className, attrs, none) {
        var el = this.shortcutFor("svg", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.svg_text = function (className, attrs) {
        var el = this.shortcutFor("text", className, attrs);
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.tspan = function (className, attrs) {
        var el = this.shortcutFor("tspan", className, attrs);
        return el;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      };

      /**
       * @param float someVar
       */
      _myTrait_.isArray = function (someVar) {
        return Object.prototype.toString.call(someVar) === "[object Array]";
      };

      /**
       * @param Function fn
       */
      _myTrait_.isFunction = function (fn) {
        return Object.prototype.toString.call(fn) == "[object Function]";
      };

      /**
       * @param Object obj
       */
      _myTrait_.isObject = function (obj) {
        return obj === Object(obj);
      };

      /**
       * @param float obj
       */
      _myTrait_.isStream = function (obj) {

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
      };

      /**
       * @param float params
       */
      _myTrait_.str = function (params) {

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
        args.forEach(function (item, i) {
          if (me.isStream(item)) {
            bHadStream = true;
            all.push("");
          } else {
            all.push(item);
          }
        });
        if (!bHadStream) return args.join("");

        return Bacon.fromBinder(function (sink) {

          args.forEach(function (item, i) {
            if (me.isStream(item)) {
              item.onValue(function (v) {
                all[i] = v;
                sink(all.join(""));
              });
            }
          });

          later().add(function () {
            sink(all.join(""));
          });

          return function () {};
        });
      };

      /**
       * @param float imgList
       * @param float fn
       */
      _myTrait_.whenLoaded = function (imgList, fn) {

        var cnt = imgList.length;

        imgList.forEach(function (im) {
          im.on("load", function () {
            cnt--;
            if (cnt == 0) {
              fn(imgList);
            }
          });
        });

        if (imgList.length == 0) fn([]);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var colors;

      // Initialize static variables here...

      /**
       * @param float c1
       * @param float c2
       * @param float t
       */
      _myTrait_.colorMix = function (c1, c2, t) {

        var from = this.toRGB(c1),
            to = this.toRGB(c2);

        var res = this.yuvConversion2(from, to, function (y1, y2) {
          return {
            y: (1 - t) * y1.y + t * y2.y,
            u: (1 - t) * y1.u + t * y2.u,
            v: (1 - t) * y1.v + t * y2.v
          };
        });

        return res;
      };

      /**
       * @param String color
       */
      _myTrait_.colorToHex = function (color) {
        if (color.substr(0, 1) === "#") {
          return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | green << 8 | red << 16;
        return digits[1] + "#" + rgb.toString(16);
      };

      /**
       * @param String colour
       */
      _myTrait_.colourNameToHex = function (colour) {

        if (typeof colors[colour.toLowerCase()] != "undefined") return colors[colour.toLowerCase()];

        return false;
      };

      /**
       * @param float c
       */
      _myTrait_.componentToHex = function (c) {
        c = parseInt(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      };

      /**
       * @param float colorName
       * @param float brightness
       */
      _myTrait_.dim = function (colorName, brightness) {
        return this.yuvConversion(colorName, function (yuv) {
          yuv.y = yuv.y - brightness;
          return yuv;
        });
      };

      /**
       * @param String hex
       */
      _myTrait_.hexToRgb = function (hex) {
        if (hex[0] == "#") hex = hex.substr(1);
        if (hex.length == 3) {
          var temp = hex;
          hex = "";
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
        };
      };

      /**
       * @param String hexVal
       */
      _myTrait_.hexToYuv = function (hexVal) {
        var me = this;
        return me.rgbToYuv(me.toRGB(hexVal));
      };

      /**
       * @param Object c
       */
      _myTrait_.hsvToRgb = function (c) {
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

          default:
            // case 5:
            r = v;
            g = p;
            b = q;
        }

        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        };
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

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

      /**
       * @param float c1
       * @param float c2
       * @param float amount
       */
      _myTrait_.mix = function (c1, c2, amount) {

        if (typeof amount == "undefined") amount = 0.5;

        return this.yuvConversion2(c1, c2, function (y1, y2) {
          return {
            y: (1 - amount) * y1.y + amount * y2.y,
            u: (1 - amount) * y1.u + amount * y2.u,
            v: (1 - amount) * y1.v + amount * y2.v
          };
        });
      };

      /**
       * @param Object p
       */
      _myTrait_.rgbToHex = function (p) {
        var me = this;
        return "#" + me.componentToHex(p.r) + me.componentToHex(p.g) + me.componentToHex(p.b);
      };

      /**
       * @param Object c
       */
      _myTrait_.rgbToHsv = function (c) {
        var rr,
            gg,
            bb,
            r = c.r / 255,
            g = c.g / 255,
            b = c.b / 255,
            h,
            s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function diffc(c) {
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
            h = 1 / 3 + rr - bb;
          } else if (b === v) {
            h = 2 / 3 + gg - rr;
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
      };

      /**
       * @param Object c
       */
      _myTrait_.rgbToYuv = function (c) {
        var R = c.r / 255;
        var G = c.g / 255;
        var B = c.b / 255;
        return {
          y: 0.299 * R + 0.587 * G + 0.114 * B,
          u: -0.14713 * R - 0.28885 * G + 0.436 * B,
          v: 0.615 * R - 0.51499 * G - 0.10001 * B
        };
      };

      /**
       * @param Object c
       */
      _myTrait_.toRGB = function (c) {
        if (typeof c == "object") return c;
        var me = this;

        var hex = me.colourNameToHex(c);
        if (!hex) {
          hex = me.colorToHex(c);
        }
        return me.hexToRgb(hex);
      };

      /**
       * @param float v
       */
      _myTrait_.toRSpace = function (v) {
        return Math.max(0, Math.min(255, Math.round(v)));
      };

      /**
       * @param color c
       * @param float fn
       */
      _myTrait_.yuvConversion = function (c, fn) {
        var me = this;
        var yuv = me.rgbToYuv(me.toRGB(c));
        yuv = fn(yuv);
        var rgb = me.yuvToRgb(yuv);
        return me.rgbToHex(rgb);
      };

      /**
       * @param string c1
       * @param float c2
       * @param float fn
       */
      _myTrait_.yuvConversion2 = function (c1, c2, fn) {
        var me = this;
        var yuv = me.rgbToYuv(me.toRGB(c1));
        var yuv2 = me.rgbToYuv(me.toRGB(c2));
        yuv = fn(yuv, yuv2);
        var rgb = me.yuvToRgb(yuv);
        return me.rgbToHex(rgb);
      };

      /**
       * @param Object c
       * @param function fn
       */
      _myTrait_.yuvPixelConversion = function (c, fn) {
        var yuv = me.rgbToYuv(c);
        yuv = fn(yuv);
        var rgb = me.yuvToRgb(yuv);
        c.r = rgb.r;
        c.g = rgb.g;
        c.b = rgb.b;
        return c;
      };

      /**
       * @param Object c
       */
      _myTrait_.yuvToRgb = function (c) {
        var Y = c.y;
        var U = c.u;
        var V = c.v;

        return {
          r: this.toRSpace(255 * (Y + 0 * U + 1.13983 * V)),
          g: this.toRSpace(255 * (Y - 0.39465 * U - 0.5806 * V)),
          b: this.toRSpace(255 * (Y + 2.03211 * U))
        };
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var x;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_._initAjax = function (t) {
        if (typeof XMLHttpRequest !== "undefined") {
          return new XMLHttpRequest();
        }
        var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];

        var xhr;
        for (var i = 0; i < versions.length; i++) {
          try {
            xhr = new ActiveXObject(versions[i]);
            break;
          } catch (e) {}
        }
        return xhr;
      };

      /**
       * @param float options
       */
      _myTrait_._traditionalUpload = function (options) {

        var o = _e();
        var form = o.form("", {
          "action": options.url,
          "enctype": "multipart/form-data",
          "method": "POST",
          "name": o.guid()
        });

        var maxCnt = options.maxCnt || 20;
        var chStr = "complete" + this.guid();

        var onComplete = function onComplete(v) {
          delete window[chStr];
          if (options.done) {
            options.done(v);
          }
        };

        window[chStr] = onComplete;
        form.input("", {
          type: "hidden",
          value: chStr,
          name: "onComplete"
        });

        if (options.vars) {
          for (var n in options.vars) {
            if (options.vars.hasOwnProperty(n)) {
              form.input("", {
                type: "hidden",
                value: options.vars[n],
                name: n
              });
            }
          }
        }
        var uplFields = form.div("form-group");

        var maxFileCnt = options.maxFileCnt || 5,
            fileCnt = 0;

        var createUploadField = function createUploadField() {
          if (fileCnt >= maxFileCnt) return;
          // <label for="exampleInputFile">File input</label>
          var inp = uplFields.input("", {
            type: "file",
            name: options.fieldName || "newFile"
          });
          inp.on("value", function () {
            if (options.autoUpload) {
              o.uploadFiles();
            } else {
              if (fileCnt < maxCnt) createUploadField();
            }
          });

          fileCnt++;
        };

        createUploadField();
        var iFrame = _e("iframe");
        var frame_id = o.guid();
        iFrame.q.attr("id", frame_id);
        iFrame.q.attr("name", frame_id);
        iFrame.absolute().x(-4000).y(-4000);
        o.add(iFrame);

        o.uploadFiles = function (vars) {
          if (vars) {
            for (var n in vars) {
              if (vars.hasOwnProperty(n)) {
                form.input("", {
                  type: "hidden",
                  value: vars[n],
                  name: n
                });
              }
            }
          }
          form._dom.target = frame_id; //'my_iframe' is the name of the iframe
          form._dom.submit();
          uplFields.clear();
          fileCnt = 0;
          createUploadField();
        };

        if (options.getUploader) {
          options.getUploader(o.uploadFiles);
        }
        o.on("upload", function (o, v) {
          o.uploadFiles(v || {});
        });
        return o;
      };

      /**
       * @param float options
       */
      _myTrait_.createUploader = function (options) {

        if (options.testTraditional || typeof window.FormData == "undefined") {
          return this._traditionalUpload(options);
        }

        // The file uploader
        var inp = _e("input").addClass("uploader-field");
        inp.q.attr("type", "file");

        // uploader basic settings
        inp._uploadGUID = "uploadField" + this.guid();
        inp.q.attr("id", inp._uploadGUID);
        inp.q.attr("name", inp._uploadGUID);

        if (options.audio) {
          inp.q.attr("capture", "microphone");
          inp.q.attr("accept", "audio/*");
        }
        if (options.video) {
          inp.q.attr("capture", "camcorder");
          inp.q.attr("accept", "video/*");
        }
        if (options.images) {
          inp.q.attr("capture", "camera");
          inp.q.attr("accept", "image/*");
        }

        /*
        <p>Capture Image: <input type="file" accept="image/*" id="capture" capture="camera"> 
        <p>Capture Audio: <input type="file" accept="audio/*" id="capture" capture="microphone"> 
        <p>Capture Video: <input type="file" accept="video/*" id="capture" capture="camcorder"> 
        */

        // upload handler here...
        var upload = function upload(uploadElement) {

          var file = uploadElement.files[0];
          if (file) {
            var formData = new window.FormData();
            if (options.vars) {
              if (options.vars) {
                for (var n in options.vars) {
                  if (options.vars.hasOwnProperty(n)) {
                    formData.append(n, options.vars[n]);
                  }
                }
              }
            }

            formData.append(options.fieldName || "newFile", file);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) //done
                {
                  if (xhr.status === 200) {
                    if (options.done) {
                      options.done(xhr.responseText);
                    }
                  } else {
                    if (options.error) {
                      options.error(xhr.responseText, xhr);
                    }
                  }
                }
            };
            xhr.open("POST", options.url);
            if (options.progress && xhr.upload) {
              xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                  var done = e.loaded / e.total * 100;
                  var info = {
                    loadPros: done,
                    ready: false
                  };
                  if (e.loaded == e.total) {
                    info.ready = true;
                  }
                  options.progress(info);
                }
              };
            }
            xhr.send(formData);
          }
        };

        inp._dom, addEventListener("change", function (event) {

          // todo: check if the file is of correct type
          // event.target.files[0].type.indexOf("image/") == 0) {

          if (event.target.files.length == 1) {
            upload(inp._dom);
          }
        });
        inp.on("upload", function () {
          if (event.target.files.length == 1) {
            upload(inp._dom);
          }
        });
        return inp;
      };

      /**
       * @param float url
       * @param float data
       * @param float callback
       */
      _myTrait_.get = function (url, data, callback) {
        var query = [];
        if (this.isFunction(data)) {
          callback = data;
          ajax.send(url, callback, "GET", null);
        } else {
          for (var key in data) {
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
          }
          ajax.send(url + (query.length ? "?" + query.join("&") : ""), callback, "GET", null);
        }
      };

      /**
       * @param float url
       * @param float data
       * @param float callback
       */
      _myTrait_.getJSON = function (url, data, callback) {
        var query = [];
        if (this.isFunction(data)) {
          callback = data;
          ajax.send(url, callback, "GET", null);
        } else {
          for (var key in data) {
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
          }
          ajax.send(url + (query.length ? "?" + query.join("&") : ""), function (r) {
            callback(JSON.parse(r));
          }, "GET", null);
        }
      };

      /**
       * @param float url
       * @param float data
       * @param float callback
       */
      _myTrait_.post = function (url, data, callback) {
        var query = [];
        for (var key in data) {
          query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        ajax.send(url, callback, "POST", query.join("&"));
      };

      /**
       * @param float url
       * @param float callback
       * @param float method
       * @param float data
       * @param float errorCallback
       */
      _myTrait_.send = function (url, callback, method, data, errorCallback) {
        var x = this._initAjax();
        x.open(method, url);
        x.onreadystatechange = function () {
          if (x.readyState == 4) {
            if (x.status == 200) {
              callback(x.responseText);
            } else {
              errorCallback(x);
            }
          }
        };
        if (method == "POST") {
          x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        x.send(data);

        return this;

        /*
        ajax.send = function(url, callback, method, data, sync) {
        var x = ajax.x();
        x.open(method, url, sync);
        x.onreadystatechange = function() {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
        };
        if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
        };
        */
      };
    })(this);

    // the subclass definition comes around here then

    // The class definition is here...
    var _qc_prototype = function _qc_prototype() {
      // Then create the traits and subclasses for this class here...

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param float n
         * @param float v
         */
        _myTrait_.attr = function (n, v) {

          if (!isNaN(n)) {
            if (typeof console != "undefined" && typeof console.trace != "undefined") {}
            return;
          }

          if (this._host._svgElem) {

            if (this._host.isObject(v)) {
              if (v.onValue) {
                // Assume it is a stream...
                var me = this;
                v.onValue(function (val) {
                  if (typeof val != "undefined" && val !== null) {
                    if (n == "xlink:href") {
                      me._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                    } else {
                      me._dom.setAttributeNS(null, n, val);
                    }
                  }
                });

                return this;
              }
            }

            if (this._host.isArray(v)) {

              var oo = v[0],
                  fName = v[1],
                  val = oo[fName](),
                  me = this,
                  domi = me._dom,
                  host = this._host,
                  list;

              if (n == "xlink:href") {
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS("http://www.w3.org/1999/xlink", "href", newV);
                  }
                });
              } else {
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS(null, n, newV);
                  }
                });
              }
              oo.on(fName, list);
              if (typeof val != "undefined" && val !== null) {
                if (n == "xlink:href") {
                  this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                } else {
                  this._dom.setAttributeNS(null, n, val);
                }
              } else {}
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
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS("http://www.w3.org/1999/xlink", "href", newV);
                  }
                });
              } else {
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS(null, n, newV);
                  }
                });
              }
              oo.me.on(oo.name, list);
              if (typeof val != "undefined" && val !== null) {
                if (n == "xlink:href") {
                  this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                } else {
                  this._dom.setAttributeNS(null, n, val);
                }
              } else {}
              return this;
            }
            if (typeof v != "undefined") {
              if (n == "xlink:href") {
                this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", v);
              } else {
                this._dom.setAttributeNS(null, n, v);
              }
            }

            return this;
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

            list = host.uniqueListener("attr:" + n, function (o, newV) {
              if (typeof newV != "undefined" && newV !== null) {
                domi.setAttribute(n, newV);
              }
            });
            oo.on(fName, list);
            if (typeof val != "undefined" && val !== null) {
              if (n == "xlink:href") {
                this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
              } else {
                this._dom.setAttributeNS(null, n, val);
              }
            }
            return this;
          }

          if (this._host.isObject(v)) {
            if (v.onValue) {
              // Assume it is a stream...
              var me = this;
              v.onValue(function (val) {
                if (typeof val != "undefined" && val !== null) {
                  if (n == "xlink:href") {
                    me._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
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

            var list = host.uniqueListener("attr:" + n, function (o, newV) {
              if (typeof newV != "undefined") domi.setAttribute(n, newV);
            });
            oo.me.on(oo.name, list);
            if (typeof val != "undefined" && isNaN(n)) this._dom.setAttribute(n, val);
            return this;
          }
          if (typeof v != "undefined" && isNaN(n)) this._dom.setAttribute(n, v);
          return this;
        };

        /**
         * @param String en
         * @param float fn
         * @param float stop
         */
        _myTrait_.bindSysEvent = function (en, fn, stop) {
          en = en.toLowerCase();
          if (!this._sys) this._sys = {};
          if (this._sys[en]) return false;

          this._sys[en] = true;

          var me = this;

          if (this._dom.attachEvent) {
            this._dom.attachEvent("on" + en, function (e) {
              e = e || window.event;
              me._event = e;
              fn();
              if (stop) {
                e = window.event;
                if (e) e.cancelBubble = true;
              }
            });
          } else {
            this._dom.addEventListener(en, function (e) {
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
        };

        /**
         * @param float t
         */
        _myTrait_.blur = function (t) {
          if (this._dom.blur) this._dom.blur();
        };

        /**
         * @param string n
         * @param float v
         */
        _myTrait_.css = function (n, v) {
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
        };

        /**
         * @param float t
         */
        _myTrait_.focus = function (t) {
          if (this._dom.focus) this._dom.focus();
        };

        /**
         * @param float index
         */
        _myTrait_.get = function (index) {
          return this._dom;
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (myDom, host) {
          this._dom = myDom;
          this._host = host;
        });

        /**
         * @param String v
         */
        _myTrait_.pxParam = function (v) {

          if (v == "auto") return v;

          if (typeof v.slice != "undefined") {
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
          if (typeof v == "string") {
            return parseInt(v) + "px";
          } else {
            var i = parseInt(v);
            if (!isNaN(i)) {
              // this._dom.style.width = i+"px";
              return i + "px";
            }
          }
        };
      })(this);
    };

    var _qc = function _qc(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof _qc) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != _qc._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new _qc(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    _qc._classInfo = {
      name: "_qc"
    };
    _qc.prototype = new _qc_prototype();

    // the subclass definition comes around here then

    // The class definition is here...
    var later_prototype = function later_prototype() {
      // Then create the traits and subclasses for this class here...

      (function (_myTrait_) {
        var _initDone;
        var _callers;
        var _oneTimers;
        var _everies;
        var _framers;
        var _localCnt;

        // Initialize static variables here...

        /**
         * @param function fn
         * @param float thisObj
         * @param float args
         */
        _myTrait_.add = function (fn, thisObj, args) {
          if (thisObj || args) {
            var tArgs;
            if (Object.prototype.toString.call(args) === "[object Array]") {
              tArgs = args;
            } else {
              tArgs = Array.prototype.slice.call(arguments, 2);
              if (!tArgs) tArgs = [];
            }
            _callers.push([thisObj, fn, tArgs]);
          } else {
            _callers.push(fn);
          }
        };

        /**
         * @param float seconds
         * @param float fn
         * @param float name
         */
        _myTrait_.after = function (seconds, fn, name) {

          if (!name) {
            name = "aft7491_" + _localCnt++;
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0,
            remove: true
          };
        };

        /**
         * @param function fn
         */
        _myTrait_.asap = function (fn) {
          this.add(fn);
        };

        /**
         * @param float seconds
         * @param float fn
         * @param float name
         */
        _myTrait_.every = function (seconds, fn, name) {

          if (!name) {
            name = "t7491_" + _localCnt++;
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0
          };
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (interval, fn) {
          if (!_initDone) {

            _localCnt = 1;
            this.polyfill();

            var frame, cancelFrame;
            if (typeof window != "undefined") {
              var frame = window["requestAnimationFrame"],
                  cancelFrame = window["cancelRequestAnimationFrame"];
              ["", "ms", "moz", "webkit", "o"].forEach(function (x) {
                if (!frame) {
                  frame = window[x + "RequestAnimationFrame"];
                  cancelFrame = window[x + "CancelAnimationFrame"] || window[x + "CancelRequestAnimationFrame"];
                }
              });
            }

            if (!frame) frame = function (cb) {
              return setTimeout(cb, 16);
            };

            if (!cancelFrame) cancelFrame = function (id) {
              clearTimeout(id);
            };

            _callers = [];
            _oneTimers = {};
            _everies = {};
            _framers = [];
            var lastMs = 0;

            var _callQueQue = function _callQueQue() {
              var ms = new Date().getTime();
              var fn;
              while (fn = _callers.shift()) {
                if (Object.prototype.toString.call(fn) === "[object Array]") {
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

        /**
         * @param  key
         * @param float fn
         * @param float value
         */
        _myTrait_.once = function (key, fn, value) {
          // _oneTimers

          _oneTimers[key] = [fn, value];
        };

        /**
         * @param function fn
         */
        _myTrait_.onFrame = function (fn) {

          _framers.push(fn);
        };

        /**
         * @param float t
         */
        _myTrait_.polyfill = function (t) {};

        /**
         * @param float fn
         */
        _myTrait_.removeFrameFn = function (fn) {

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
        };
      })(this);
    };

    var later = function later(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof later) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new later(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    later._classInfo = {
      name: "later"
    };
    later.prototype = new later_prototype();

    // the subclass definition comes around here then

    // The class definition is here...
    var css_prototype = function css_prototype() {
      // Then create the traits and subclasses for this class here...

      // trait comes here...

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param float t
         */
        _myTrait_.guid = function (t) {

          return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        };

        /**
         * @param float t
         */
        _myTrait_.isArray = function (t) {

          if (typeof t == "undefined") return this.__isA;

          return Object.prototype.toString.call(t) === "[object Array]";
        };

        /**
         * @param float fn
         */
        _myTrait_.isFunction = function (fn) {
          return Object.prototype.toString.call(fn) == "[object Function]";
        };

        /**
         * @param float t
         */
        _myTrait_.isObject = function (t) {

          if (typeof t == "undefined") return this.__isO;

          return t === Object(t);
        };
      })(this);

      // the subclass definition comes around here then

      // The class definition is here...
      var later_prototype = function later_prototype() {
        // Then create the traits and subclasses for this class here...

        (function (_myTrait_) {
          var _initDone;
          var _callers;
          var _oneTimers;
          var _everies;
          var _framers;
          var _localCnt;

          // Initialize static variables here...

          /**
           * @param function fn
           * @param float thisObj
           * @param float args
           */
          _myTrait_.add = function (fn, thisObj, args) {
            if (thisObj || args) {
              var tArgs;
              if (Object.prototype.toString.call(args) === "[object Array]") {
                tArgs = args;
              } else {
                tArgs = Array.prototype.slice.call(arguments, 2);
                if (!tArgs) tArgs = [];
              }
              _callers.push([thisObj, fn, tArgs]);
            } else {
              _callers.push(fn);
            }
          };

          /**
           * @param float seconds
           * @param float fn
           * @param float name
           */
          _myTrait_.after = function (seconds, fn, name) {

            if (!name) {
              name = "aft7491_" + _localCnt++;
            }

            _everies[name] = {
              step: Math.floor(seconds * 1000),
              fn: fn,
              nextTime: 0,
              remove: true
            };
          };

          /**
           * @param function fn
           */
          _myTrait_.asap = function (fn) {
            this.add(fn);
          };

          /**
           * @param float seconds
           * @param float fn
           * @param float name
           */
          _myTrait_.every = function (seconds, fn, name) {

            if (!name) {
              name = "t7491_" + _localCnt++;
            }

            _everies[name] = {
              step: Math.floor(seconds * 1000),
              fn: fn,
              nextTime: 0
            };
          };

          if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
          if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
          _myTrait_.__traitInit.push(function (interval, fn) {
            if (!_initDone) {

              _localCnt = 1;
              this.polyfill();

              var frame, cancelFrame;
              if (typeof window != "undefined") {
                var frame = window["requestAnimationFrame"],
                    cancelFrame = window["cancelRequestAnimationFrame"];
                ["", "ms", "moz", "webkit", "o"].forEach(function (x) {
                  if (!frame) {
                    frame = window[x + "RequestAnimationFrame"];
                    cancelFrame = window[x + "CancelAnimationFrame"] || window[x + "CancelRequestAnimationFrame"];
                  }
                });
              }

              if (!frame) frame = function (cb) {
                return setTimeout(cb, 16);
              };

              if (!cancelFrame) cancelFrame = function (id) {
                clearTimeout(id);
              };

              _callers = [];
              _oneTimers = {};
              _everies = {};
              _framers = [];
              var lastMs = 0;

              var _callQueQue = function _callQueQue() {
                var ms = new Date().getTime();
                var fn;
                while (fn = _callers.shift()) {
                  if (Object.prototype.toString.call(fn) === "[object Array]") {
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

          /**
           * @param  key
           * @param float fn
           * @param float value
           */
          _myTrait_.once = function (key, fn, value) {
            // _oneTimers

            _oneTimers[key] = [fn, value];
          };

          /**
           * @param function fn
           */
          _myTrait_.onFrame = function (fn) {

            _framers.push(fn);
          };

          /**
           * @param float t
           */
          _myTrait_.polyfill = function (t) {};

          /**
           * @param float fn
           */
          _myTrait_.removeFrameFn = function (fn) {

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
          };
        })(this);
      };

      var later = function later(a, b, c, d, e, f, g, h) {
        var m = this,
            res;
        if (m instanceof later) {
          var args = [a, b, c, d, e, f, g, h];
          if (m.__factoryClass) {
            m.__factoryClass.forEach(function (initF) {
              res = initF.apply(m, args);
            });
            if (typeof res == "function") {
              if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
            } else {
              if (res) return res;
            }
          }
          if (m.__traitInit) {
            m.__traitInit.forEach(function (initF) {
              initF.apply(m, args);
            });
          } else {
            if (typeof m.init == "function") m.init.apply(m, args);
          }
        } else return new later(a, b, c, d, e, f, g, h);
      };
      // inheritance is here

      later._classInfo = {
        name: "later"
      };
      later.prototype = new later_prototype();

      (function (_myTrait_) {
        var head;
        var styleTag;
        var bexp;
        var bexp2;
        var _conversions;
        var _instances;
        var _insInit;

        // Initialize static variables here...

        if (!_myTrait_.hasOwnProperty("__factoryClass")) _myTrait_.__factoryClass = [];
        _myTrait_.__factoryClass.push(function (id) {

          if (!id) id = "_global_";

          if (!_instances) {
            _instances = {};
            _instances[id] = this;
          } else {
            if (_instances[id]) return _instances[id];
            _instances[id] = this;
          }
        });

        /**
         * @param float animName
         * @param float settings
         */
        _myTrait_.animation = function (animName, settings) {

          var args = Array.prototype.slice.call(arguments),
              animName = args.shift(),
              settings = args.shift(),
              animKeyName = animName + "-keyframes",
              parts = args,
              t = 0,
              me = this,
              animStr = "";

          args.forEach(function (cssRuleObj) {
            if (me.isObject(cssRuleObj)) {
              var pros = parseInt(t * 100);
              animStr += pros + "% " + me.ruleToCss(cssRuleObj) + " \n";
              t = 1;
            } else {
              t = cssRuleObj;
            }
          });
          var fullStr = "";
          var exp = ["", "-o-", "-moz-", "-webkit-"];
          exp.forEach(function (r) {
            fullStr += "@" + r + "keyframes " + animKeyName + " { " + animStr + " } \n";
          });
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
        };

        /**
         * @param float obj
         */
        _myTrait_.animSettings = function (obj) {

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
        };

        /**
         * @param float objectList
         */
        _myTrait_.assign = function (objectList) {
          var o = {},
              args;
          if (this.isArray(objectList)) {
            args = objectList;
          } else {
            args = Array.prototype.slice.call(arguments);
          }
          args.forEach(function (rules) {
            for (var n in rules) {
              if (rules.hasOwnProperty(n)) {
                o[n] = rules[n];
              }
            }
          });
          return o;
        };

        /**
         * @param float t
         */
        _myTrait_.bind = function (t) {
          // my rulesets...
          var args = Array.prototype.slice.call(arguments),
              rule = args.shift();

          this._data[rule] = args;
          this._dirty = true;

          return this;
        };

        /**
         * @param float mediaRule
         */
        _myTrait_.buildCss = function (mediaRule) {

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
        };

        /**
         * @param float t
         */
        _myTrait_.collectAnimationCss = function (t) {

          var anims = this._animations,
              str = "";

          for (var n in anims) {
            if (anims.hasOwnProperty(n)) str += anims[n];
          }
          return str;
        };

        /**
         * @param float n
         * @param float v
         */
        _myTrait_.convert = function (n, v) {
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
              ["-webkit-", "", "-moz-", "-o-"].forEach(function (p) {
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
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (cssPostFix) {
          // my rulesets...
          this._data = this._data || {};
          this._animations = {};
          this._composedData = this._composedData || {};

          this._postFix = cssPostFix || "";

          if (!head) {
            var me = this;
            later().every(1 / 10, function () {
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

        /**
         * @param float t
         */
        _myTrait_.initConversions = function (t) {
          head = document.getElementsByTagName("head")[0];
          var styleTag = document.createElement("style");
          styleTag.setAttribute("type", "text/css");
          if (styleTag.styleSheet) {
            // IE
            styleTag.styleSheet.cssText = "";
          } else {
            // the world
            styleTag.appendChild(document.createTextNode(""));
          }
          head.appendChild(styleTag);
          this._styleTag = styleTag;

          bexp = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + v + ";\n";
            str += "-moz-" + p + ":" + v + ";\n";
            str += "-webkit-" + p + ":" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          bexp2 = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + "-o-" + v + ";\n";
            str += "-moz-" + p + ":" + "-moz-" + v + ";\n";
            str += "-webkit-" + p + ":" + "-webkit-" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          _conversions = {
            "border-radius": function borderRadius(n, v) {
              return bexp(n, v);
            },
            "box-shadow": function boxShadow(n, v) {
              return bexp(n, v);
            },
            "rotate": function rotate(n, v) {
              n = "transform";
              v = "rotate(" + parseInt(v) + "deg)";
              return bexp(n, v);
            },
            "transition": function transition(n, v) {
              return bexp2(n, v);
            },
            "filter": function filter(n, v) {
              return bexp(n, v);
            },
            "animation": function animation(n, v) {
              return bexp(n, v);
            },
            "animation-iteration-count": function animationIterationCount(n, v) {
              return bexp(n, v);
            },
            "animation-name": function animationName(n, v) {
              return bexp(n, v);
            },
            "animation-timing-function": function animationTimingFunction(n, v) {
              return bexp(n, v);
            },
            "animation-duration": function animationDuration(n, v) {
              return bexp(n, v);
            },
            "transform": function transform(n, v) {
              return bexp(n, v);
            },
            "transform-style": function transformStyle(n, v) {
              return bexp(n, v);
            },
            "transform-origin": function transformOrigin(n, v) {
              return bexp(n, v);
            },
            "perspective": function perspective(n, v) {
              return bexp(n, v);
            },
            "text-shadow": function textShadow(n, v) {
              return bexp(n, v);
            },
            "opacity": function opacity(n, v) {
              v = parseFloat(v);
              var str = "-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + parseInt(v * 100) + ")\";";
              str += "filter: alpha(opacity=" + parseInt(v * 100) + ");";
              str += bexp(n, v);
              return str;
            }
          };
        };

        /**
         * @param float o
         * @param float mediaRule
         */
        _myTrait_.makeCss = function (o, mediaRule) {
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
        };

        /**
         * @param float cssRulesObj
         */
        _myTrait_.ruleToCss = function (cssRulesObj) {
          var str = "{";
          for (var n in cssRulesObj) {
            str += this.convert(n, cssRulesObj[n]);
          }
          str += "}\n";
          return str;
        };

        /**
         * @param float cssText
         */
        _myTrait_.updateStyleTag = function (cssText) {
          var styleTag = this._styleTag,
              old = styleTag.firstChild;

          // console.log(cssText);

          if (styleTag.styleSheet) {
            // IE
            styleTag.styleSheet.cssText = cssText;
          } else {
            // the world
            var old = styleTag.firstChild;
            styleTag.appendChild(document.createTextNode(cssText));
            if (typeof old != "undefined") {
              styleTag.removeChild(old);
            }
          }
        };
      })(this);
    };

    var css = function css(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof css) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != css._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new css(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    css._classInfo = {
      name: "css"
    };
    css.prototype = new css_prototype();

    (function () {
      if (typeof define !== "undefined" && define !== null && define.amd != null) {
        __amdDefs__["css"] = css;
        this.css = css;
      } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
        module.exports["css"] = css;
      } else {
        this.css = css;
      }
    }).call(new Function("return this")());

    // the subclass definition comes around here then

    // The class definition is here...
    var clipBoard_prototype = function clipBoard_prototype() {
      // Then create the traits and subclasses for this class here...

      (function (_myTrait_) {
        var _hasSupport;

        // Initialize static variables here...

        /**
         * @param float name
         */
        _myTrait_.del = function (name) {

          if (this.localStoreSupport()) {
            localStorage.removeItem(name);
          } else {
            this.set(name, "", -1);
          }
        };

        /**
         * @param float opts
         */
        _myTrait_.fromClipboard = function (opts) {

          var str = this.get(this._name);
          var o = JSON.parse(str);

          return o;
        };

        /**
         * @param float name
         */
        _myTrait_.get = function (name) {

          if (this.localStoreSupport()) {
            return localStorage.getItem(name);
          } else {
            var nameEQ = name + "=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == " ") c = c.substring(1, c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
          }
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (name) {

          this._name = name;
        });

        /**
         * @param float t
         */
        _myTrait_.localStoreSupport = function (t) {
          if (_hasSupport) return _hasSupport;

          try {
            _hasSupport = "localStorage" in window && window["localStorage"] !== null;
            return _hasSupport;
          } catch (e) {
            return false;
          }
        };

        /**
         * @param float name
         * @param float value
         * @param float days
         */
        _myTrait_.set = function (name, value, days) {

          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            var expires = "; expires=" + date.toGMTString();
          } else {
            var expires = "";
          }
          if (this.localStoreSupport()) {
            localStorage.setItem(name, value);
          } else {
            document.cookie = name + "=" + value + expires + "; path=/";
          }
        };

        /**
         * @param float items
         */
        _myTrait_.toClipboard = function (items) {
          this.set(this._name, JSON.stringify(items));

          return this;
        };
      })(this);
    };

    var clipBoard = function clipBoard(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof clipBoard) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != clipBoard._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new clipBoard(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    clipBoard._classInfo = {
      name: "clipBoard"
    };
    clipBoard.prototype = new clipBoard_prototype();

    (function (_myTrait_) {
      var _eg;
      var _ee_;
      var guid;
      var _screenInit;
      var _svgElems;
      var _registry;
      var _elemNames;
      var _hasRemoted;
      var _elemNamesList;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.__singleton = function (t) {
        return _eg;
      };

      if (!_myTrait_.hasOwnProperty("__factoryClass")) _myTrait_.__factoryClass = [];
      _myTrait_.__factoryClass.push(function (elemName, into) {

        if (elemName) {
          if (_registry && _registry[elemName]) {
            var classConst = _registry[elemName];
            return new classConst(elemName, into);
          }
        }
      });

      /**
       * @param string name
       * @param float fn
       */
      _myTrait_.extendAll = function (name, fn) {

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
      };

      /**
       * @param float t
       */
      _myTrait_.getComponentRegistry = function (t) {
        return _registry;
      };

      /**
       * @param float t
       */
      _myTrait_.getElemNames = function (t) {
        return _elemNamesList;
      };

      /**
       * @param float t
       */
      _myTrait_.globalState = function (t) {

        var outPosition = {
          "transform": "translate(-2000px,0px)"
        };

        var inPosition = {
          "transform": "translate(0,0)" };

        css().animation("viewOut", {
          duration: "0.4s",
          "iteration-count": 1 }, inPosition, 0.5, outPosition, outPosition);

        css().animation("viewIn", {
          duration: "0.4s",
          "iteration-count": 1 }, outPosition, 0.5, inPosition, inPosition);

        if (!String.prototype.trim) {
          (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
              return this.replace(rtrim, "");
            };
          })();
        }

        var _eg = _ee_ = (function () {

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
          o.addListener = function (name, obj) {

            if (!_listeners[name]) _listeners[name] = [];
            var was = false;
            _listeners[name].forEach(function (l) {
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
          };

          o.removeListener = function (name, obj) {

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
          };

          var _popZStart = 2;
          o.popZ = function () {
            return _popZStart++;
          };

          o.addEventListener = function (dom, en, fn) {

            en = en.toLowerCase();

            if (dom.attachEvent) {
              dom.attachEvent("on" + en, fn);
            } else {
              dom.addEventListener(en, fn);
            }
            return true;
          };

          o.mouse = function () {
            return _mouse;
          };

          o.pxParam = function (v) {

            if (typeof v == "string") {
              return parseInt(v) + "px";
            } else {
              var i = parseInt(v);
              if (!isNaN(i)) {
                // this._dom.style.width = i+"px";
                return i + "px";
              }
            }
          };

          o.bexp = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + v + ";\n";
            str += "-moz-" + p + ":" + v + ";\n";
            str += "-webkit-" + p + ":" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          o.addEventListener(document, "mousemove", function (e) {

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

          o.setDragged = function (i) {
            _dragging = true;
            _dragItem = i;
          };

          o.dragMouseUp = function () {
            if (_dragItem) {
              // enddrag
              _dragItem.trigger("enddrag", _dragVector);
            }
            _dragging = false;
            _dragItem = null;
          };

          o.dragMouseDown = function (forceElem) {
            _mouseDown = true;
            if (_dragging) return;
            var found = false;

            var candidates = [];
            if (forceElem) {
              candidates.push(forceElem);
            } else {
              _draggableItems.forEach(function (e) {
                if (e.isHovering()) {
                  candidates.push(e);
                }
              });
              candidates.sort(function (a, b) {
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
          };

          o.addEventListener(document, "mouseup", function () {
            o.dragMouseUp();
          });

          o.addEventListener(document, "mousedown", function (e) {
            if (o.dragMouseDown()) {
              e = e || window.event;
              if (e.stopPropagation) e.stopPropagation();
              if (e.preventDefault) e.preventDefault();
              e.cancelBubble = true;
              e.returnValue = false;
            }
          });

          var _imSending = false;
          o.send = function (d, vname, event, from) {

            if (_imSending) return; // no circular

            if (!d.__id) {
              return;
            }

            _imSending = true;
            var id = d.__id();
            var vb = _dataBinds[id];

            if (vb) {
              var b = vb[vname];
              if (b) {
                // console.log(b);
                b.forEach(function (oo) {
                  if (oo == from) return;
                  oo.trigger(event);
                });
              }
            }
            _imSending = false;
          };

          o.bind = function (d, vname, obj) {

            if (!d.__id) o.data(d);
            var id = d.__id();
            var vb = _dataBinds[id];
            if (!vb) {
              _dataBinds[id] = {};
              vb = _dataBinds[id];
            }

            var b = vb[vname];
            if (!b) {
              vb[vname] = [];
              b = vb[vname];
            }
            var was = false;
            var dbL = b.length;
            for (var i = 0; i < dbL; i++) {
              if (b[i] == obj) return o;
            }
            b.push(obj);
            return o;
          };

          o.data = function (d) {
            if (!d.__fn) {
              _dataId++;
              var t = (function (_dataId) {
                d.__id = function () {
                  return "gd" + _dataId;
                };
              })(_dataId);
              _dataReg[d.__id()] = d;
            }
            return d;
          };

          o.draggable = function (e) {
            _draggableItems.push(e);
            e.isHovering();

            var me = e;

            e.touchevents();
            e.on("touchstart", function () {

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
            e.on("touchmove", function () {
              //e.trigger("msg", "got touchmove");
              var t = e.touch(0);
              //e.trigger("msg", "got touchmove 2");
              _dragVector.dx = t.dx;
              _dragVector.dy = t.dy;
              _dragging = true;
              e.trigger("drag", _dragVector);
              //e.trigger("msg", "got touchmove 3");
            });
            e.on("touchend", function () {

              var t = e.touch(0);
              _dragVector.dx = t.dx;
              _dragVector.dy = t.dy;

              e.trigger("enddrag", _dragVector);
              _dragging = false;
            });
          };

          return o;
        })();

        return _eg;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elemName, into) {
        this.initAsTag(elemName, into);
      });

      /**
       * @param float elemName
       * @param float into
       * @param float force
       */
      _myTrait_.initAsTag = function (elemName, into, force) {

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

        var addClass;
        var pts = elemName.split("."); // => has classname?
        if (pts[1]) {
          elemName = pts[0];
          addClass = pts[1];
        }

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
          };
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var origElemName = elemName;
        elemName = elemName.toLowerCase();

        if (force) {} else {
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
        if (!this._svg && addClass) this.addClass(addClass);

        if (!this._component && into) {
          if (typeof into.appendChild != "undefined") into.appendChild(this._dom);
        }
      };

      /**
       * @param float t
       */
      _myTrait_.initElemNames = function (t) {
        if (_elemNames) return;
        _elemNamesList = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "sampe", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
        _elemNames = {};
        _elemNamesList.forEach(function (n) {
          _elemNames[n] = true;
        });

        var me = this;
        _elemNamesList.forEach(function (en) {
          var o = {};
          o[en + "End"] = function () {
            return this.parent();
          };
          me.extendAll(o);
        });
      };

      /**
       * @param float name
       * @param float classDef
       */
      _myTrait_.registerComponent = function (name, classDef) {

        if (!_registry[name]) {
          _registry[name] = classDef;
        }
      };
    })(this);
  };

  var _e = function _e(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof _e) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != _e._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new _e(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  _e._classInfo = {
    name: "_e"
  };
  _e.prototype = new _e_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["_e"] = _e;
      this._e = _e;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["_e"] = _e;
    } else {
      this._e = _e;
    }
  }).call(new Function("return this")());

  if (typeof define !== "undefined" && define !== null && define.amd != null) {
    define(__amdDefs__);
  }
}).call(new Function("return this")());

// should we have named styles... perhaps... TODO

// console.log("**** SHOULD NOT ITERATE CHILDREN *****");

// this._dom.innerHTML = v;

//console.log("Attr set to ", n);
//console.trace();

// --- let's not ---

// --- let's not ---