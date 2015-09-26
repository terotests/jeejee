# _e or "jee" - pure JavaScript UI library

NOTE: This is just early release of this version, bugs may appear.

This a simplified, data-agnostic version of the _e -UI library. It promotes creating
UI views in functional style so that each view is creates from a function receiving the data it should be using as a paramters.

Views can also be nested in infinite amount.

- [View push/pop Demo] (http://jsfiddle.net/55yxzuy4/)
- [Twitter Bootstrap Demo] (http://jsfiddle.net/kx9sdj3g/)
- [Functional views Demo] (http://jsfiddle.net/vbyssjmq/)


# Basics

Views are creates from nested objects using composing operations like `add` 
``` javascript
  var myDiv = _e(document.body).div();
  var childDiv = myDiv.div(); // creates a child div under the parent
```

When you have the object, you can add subvies to it with functional approach like this

``` javascript
    myDiv.ol(function(e) {
        e.li().text("One");
        e.li().text("Two");
        e.li().text("Three"); // e can be "this" for the same
    }); 
```

You can also create elements which are not binded to any DOM element like this:
``` javascript
  var mySpan = _e("span").text("Hello"); // creates a SPAN with no parent
```

The element can be added later to the main DOM tree
``` javascript
  myDiv.add( mySpan );
```

It is possible to just create a nested element and store it to variable for later use
``` javascript
  var parent = _e(); // creates a DIV
  var child = parent.div(); // new nested div
```

Setting attributes and classes can be done using  `attr` or `addClass` 

``` javascript
  var myInput = _e("input").attr( {
        "type" : "color"
  }).addClass("basicInput");
```

or with arguments

``` javascript
  myDiv.input("bacicInput", {
        "type" : "color"
  });
```

## Building views with pseudo -HTML style

You can also build views using this kind of view marking:

``` javascript
main = _e(document.body).div();
main.h1()
        .span().text("Hello")
        .spanEnd()
    .h1End()
    .ol()
        .li()
            .text("moro")
        .liEnd()
        .li()
            .span()
                .text("Hello")
            .spanEnd()
        .liEnd()
    .olEnd();

```

http://jsfiddle.net/w981roh0/


# Functional view creation

The most simple way of creating a view is just to have a function which returns the view object like this
``` javascript
  var someViewFunction( name ) {
    var view = _e();
    // Create the view here with any elements it is using
    view.h1().text("Hello "+name);
    return view;
  }
```

After that you can just `add()` the item to the main DOM.

``` javascript
  myDiv.add( someViewFunction("World") ); // gets the object
```

You can also create a new view using constructor functions like this

``` javascript
  myDiv.div( function(newDiv) {
       // manipulate the "newDiv" here
  });
```

Different ways of creating views are collected here

http://jsfiddle.net/vbyssjmq/

# Creating a view with polymer 

http://codepen.io/teroktolonen/full/WQoebR

# Using with tree views

Examples:

* http://jsfiddle.net/d45mggv6/

# AJAX commands

## post

Sends data as POST variables and gets a string from server

```javascript
var main = _e(document.body);
main.post("someUrl", {
   cmd : "login"
}, function(resultAsJson) {
    // success
}, function() {
    // fail
});

```

## postJSON

Sends data as JSON and parses the returned JSON to Object.

```javascript
var main = _e(document.body);
main.postJSON("someUrl", {
   cmd : "login"
}, function(resultAsJson) {
    // success
}, function() {
    // fail
});

```

## Hooking

Hooking to AJAX call is useful if you want to emulate the server behaviour on client.

```javascript
var main = _e(document.body);
main.ajaxHook("someUrl", function(data) {
    if(data.cmd=="test") {
      return {
         userid : 100,
         success : true
      }      
    }
   if(data.cmd=="login") {
      return {
         userid : 100,
         success : true
      }      
    }
});
main.postJSON("someUrl", {
   cmd : "login"
}, function() {
    // success
}, function() {
    // fail
});

```

## File Upload Hook

http://jsfiddle.net/s3whz24s/2/

```javascript

var main = _e(document.body);
var uploader = main.createUploader({
    testTraditional : false,
    images : true,
    autoupload : false,
    uploadSpeed : 10,
    url : "http://localhost:7777/upload/",
    done: function(r) {
        console.log(r);
    },
    progress : function(info) {
        progress.text(JSON.stringify(info));
    }, 
    vars : {
        fileInformation : "Extra playload carried"
    },
    onSelectFile : function(file) {
        if(file.type.indexOf("image")>=0) {
            tnList.clear();
            tnList.fileObjectThumbnail( 100,100,file );
        }
    }
});

main.uploadHook("http://localhost:7777/upload/", function(data) {
    console.log(data);
    data.files.forEach( 
        function(file) {
            uploads.fileObjectThumbnail( 100,100,file );
        });    
})
```
# Binding to Mosh models

http://jsfiddle.net/LLpa17gL/

Mosh is of course outside dependency, it is not mandatory to use it but it can help.

```javascript
var main = _e(document.body);

var model = _data({ text : "Hello world"});
input = main.input().bind(model, "text");
```

The default is to bind to either to textContent or value of the input.

You can also override the default binding if you wish

```javascript
var main = _e(document.body);

var model = _data({ text : "Hello world"});
input = main.input().bind(model, "text", function(newValue) {
     this.val( "Got this from outside "); 
});
```


# View factories

A new undocumented feature, tests are here:

* http://jsfiddle.net/yu3wjjwa/
* simple navigation http://jsfiddle.net/30jag1uq/2/

## using with _data

http://jsfiddle.net/s5wzww3e/

```javascript
var main = _e(document.body);

// create the basic layout for the page
main.createLayout("standard", function() {
    var o = _e();
    o.div("top")
    o.div("top2")
    o.div("content");
    return o;
});
main.setLayout("standard");

// view factory to show aribatry mosh object
main.viewFactory("showObject", function(id) {
    var o = _e().addClass("container");
    var data = _data(id);
    data.then(     
        function() {
            o.pre().text("page ID was "+id);
            o.h1().bind(data, "title");
            o.p().bind(data, "content");
        });
    return o;
});

// navigation for the items...
main.viewFactory("topNavi", function(id) {
    var o = _e().addClass("topNavi");
    var activeBtn;
    // create the mosh data to use for creating the navigation
    var data = _data([
        { title : "First Page", content : "Some content for the first page" },
        { title : "Second Page", content : "Some content for the Second page" }
    ]);
    data.then( 
        function() {
            o.div().mvc( data, function(item) {
                var btn = _e("button");
                btn.span().bind(item, "title");
                btn.on("click",function() {
                    if(activeBtn) activeBtn.removeClass("selected");
                    o.pushTo("content", "showObject", item.getID());
                    activeBtn = btn;
                    btn.addClass("selected");
                });
                return btn;
            });          
        });

    return o;
});
main.pushTo("top", "topNavi");
```

# Role based view factories

Demo: http://jsfiddle.net/Lsczxqdf/1/

The view factories can be also role-specific. To create a view for a role use syntax
``` javascript
    myDiv.viewFactory("rolename", "viewname", function() {
        var o = _e();
        // create the view here, 
        return o;
    });
```
The default role is `default`. For setting up certain role call
``` javascript
    myDiv.setRole("admin");
```

Example switching roles between "admin" and "user" :

``` javascript
    var main = _e(document.body).div();
    var tools = main.div();
    var myDiv = main.div();
    
    myDiv.layout("top 100% | content 100%");
    
    myDiv.viewFactory("admin", "testView", function() {
        var o = _e();
        o.div().text("Admin view");
        return o;
    });
    myDiv.viewFactory("admin", "topNavi", function() {
        var o = _e();
        o.div().text("Admin top navigation");
        return o;
    })        
    myDiv.viewFactory("user", "testView", function() {
        var o = _e();
        o.div().text("User view");
        return o;            
    });
    myDiv.viewFactory("user", "topNavi", function() {
        var o = _e();
        o.div().text("User top navigation");
        return o;
    })          
    myDiv.setRole("user");
    myDiv.pushTo("top", "topNavi");
    myDiv.pushTo("content", "testView");
    
    tools.button().text("admin").on("click", function() {
        myDiv.setRole("admin"); 
    });
    tools.button().text("user").on("click", function() {
        myDiv.setRole("user"); 
    });
```
# Avoiding local scope pollution

Better and more readable structure can be achieved using functions as constructor parameters. The
constructor gets the newly created element set to it´s `this` parameter and as the first parameter to the constructor function.

``` javascript
myDiv.ol(function(e) {
    e.li().text("One");
    e.li().text("Two");
    e.li().text("Three"); // e can be "this" for the same
}); 
```

SVG example comparing the approaches can be found here http://jsfiddle.net/fwsx6mv0/

# File uploader

``` javascript
var main = _e(document.body).div(),
    progress = main.pre();
var uploader = main.createUploader({
    testTraditional : false,
    images : true,
    url : "http://localhost:7777/upload/",
    done: function(r) {
        console.log(r);
    },
    progress : function(info) {
        progress.text(JSON.stringify(info));
    }, 
    vars : {
        hello : "world!"
    }
});

main.add(uploader);
main.div().button().text("Upload").on("click", function() {
    uploader.trigger("upload");
});
```

# Controllers and Routers

Example is here

http://jsfiddle.net/rhextnhs/


# Creating views

Elements can create subviews using

``` javascript
 elem.pushView( someOtherView );  
 
```

And restore the view using

``` javascript
 elem.popView( );  
 
```

The animation attribute for the view is `viewIn` and out `viewOut` the animation is assumed to take 0.4 seconds where 0.2 seconds is reserved for fading out / in.

The default animations are created like this and you can change them

``` javascript
var outPosition = {
    "transform" : "translate(-2000px,0px)"
};

var inPosition = {
    "transform" : "translate(0,0)",
};

css().animation("viewOut", {
    duration : "0.4s",
    "iteration-count" : 1,
},  inPosition,  0.5, outPosition, outPosition); 

css().animation("viewIn", {
    duration : "0.4s",
    "iteration-count" : 1,
},  outPosition, 0.5, inPosition, inPosition); 
 
```

# Using with Bacon.js

The inputs can be transformed to streams usin `toBacon()` like this

``` javascript
 // create a stream of color values
 var colorStream = m.div().input({type:"color", value :"#ff4433"}).toBacon();
```
The stream can be consumed by elements ( with certain restrictions at the moment), currently available are
 - attributes
 - text values
 - HTML content
 - class -names
 - string values with template function `str` 

For example, SVG rect element could consume the fill value like this:

``` javascript
myDiv.svg({ width : 150, height:150}).g().rect({
    x : 10, y : 10, width:100, height : 100,
    fill : colorStream // consumes values from the colorStream
});
```
- [Gradient Editor example] (http://jsfiddle.net/feho44zb/1/)
- [SVG Editor example is here] (http://jsfiddle.net/90u23ryx/1/)

If you want to handle events manually, you can use `bacon()` -function ( this may be changed to baconEvent) 

``` javascript
// create input and the results as Bacon.js stream.
var myDiv = _e("#res");
myDiv.input().bacon("keydown")
   .onValue( function(event) {
     myDiv.div().text(event.target.value);
  });
```

## Converting any view to stream

Any ui view can be converted to Bacon.js stream using `toBacon()` function. 

The component can then send any values to the resulting stream using `val( newValue )` function.
Example can be found here.

http://jsfiddle.net/w0g9193a/

## Template function "str"

You can combine strings from streaming values using `str` -function

``` javascript
var myInput = _e("input");
var myStream = myInput.toBagon();

// combine the input and stream into single sting value
var myDiv.text( _e().str( "The value is ", myStream ) );
```



# Drag and Drop

You can get information about drag -events on the elements, however it is up to you to actually move the items on the screen, the way you see best fit.

The basic callback has format

``` javascript
elem.drag(function(dragInfo) {
   // do something here with dragInfo
});
```

The object "dragInfo" has following format:

``` javascript
{"sx":0,        // start coordinates of the dragged element
 "sy":0,
 "dx":100,      // dx,dy number of pixels drag has moved
 "dy":129,
 "x":100,       // elements calculated x,y
 "y":129,       
 "start":false, // drag has just started
 "end":true,     // drag has ended
 "item" : obj    // item which is dragged
}
```

## Drag as Bacon.js Stream

If you want more control over the drag events you can subscript to the drag as Bacon.js
stream (requires the library)

``` javascript
elem.baconDrag().onValue(function(dragInfo) {

});
```

[Bacon.js drag demo] (http://jsfiddle.net/kmo77e5y/)

# Local Storage support

If you want some input to persist between updates, you can make them store things locally using

``` javascript
var inp = _e("input").localStore("myTestId");
```
The input will store it's value to the `myTestId` after the page reloads.

http://jsfiddle.net/kt58vqc7/


# Creating "Fiddles"

```javascript
var myDiv = _e(document.body).div();
myDiv.fiddle({
    stylesheets : [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"
    ],
    scripts : [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"
    ],
    html : "<div class='alert alert-info'>Bootstrap loaded</div>",
    jsCode : "setInterval( function() { fiddleDone('1000ms passed') }, 1000);",
    width : 300, height : 300,
    onReady : function(v) {
        alert(v);
    },
});
```
Simple Example:
http://jsfiddle.net/qfpj5su7/

Example using Bacon.js throttling the input streams with debounce() and localStore() to save the data between the edits. 
http://jsfiddle.net/drah36qf/

# Creating plugins / extending

You can add new functions all elements with extendAll.

``` javascript
var myDiv = _e();
myDiv.extendAll( {
    fancyButton : function() {
        var b = _e("button");
        b.addClass("btn btn-primary btn-group-sm");
        this.add(b);
        return b;
    }
});

myDiv.fancyButton().text("This is a fancy button");
```

# CSS namespacing

CSS can be built without Stylesheets using JavaScript objects as style mixins. 
It is possible to create code which uses no stylesheets or calculates the styles on-line.

Each element can have a namespaced CSS style object, which can be created like

``` javascript
o.css().bind("<CSSClassName>",  {
    "color"   : "black",
    "padding" : "1em"
});
```

The child elements of this node can then make use of this by adding the CSS class.

``` javascript
elem.addClass("<CSSClassName>");
```


# CSS gradients

[Demo with gradients] (http://jsfiddle.net/d9w9ky3f/)

Gradient markings are now expanded to browser -specific instructions:

``` javascript
    css().bind("button:hover", {
        "background" : "linear-gradient(#666, #333)"
    });
```

## YUV functions

For those familiar with YUV colors perhaps this demo explains it best

[Demo with gradients] (http://jsfiddle.net/9hu4w4tf/)


## Color mixing

Colors can be mixed with `.mix(color1, color2, amount)` or with `.dim(color, amount)` 

http://jsfiddle.net/ag4Lmxvv/


# CSS Effects

``` javascript
// The Effect is done here...
myDiv.createEffect("fade", 
                  { opacity : 1 }, 
                  { opacity : 0 }, 
                  {    
                         duration : 0.2
                  }); 
                 
// To enter the effect
myDiv.effectOut( "fade", function() [
   // callback after the effect has ended
});

// To restore back
myDiv.effectIn( "fade", function() {
   // callback after the effect has ended
});

```

http://jsfiddle.net/r77qk7pg/

# Components

http://jsfiddle.net/qhj458hc/2/

```javascript
var main = _e(document.body);
var scopeOne = main.div();

scopeOne.customElement("pri-button", {
    css : function(myCss) {
         var btnShadow = "0 3px 10px rgba(0, 0, 0, 0.34)";       
         myCss.bind("div", {
            "display": "inline-block",
            "padding": "0.4em 0.8em",
            "position": "relative",
            "margin" : "0.3em",
            "overflow": "hidden",
            "cursor": "pointer",
            "color": "#fff",
            "background-color": "#4a89dc",
            "box-shadow" : btnShadow
        });
        myCss.animation("tryMe", {
                duration : "4s",
                "iteration-count" : 1,
            },{ transform : "rotate(0deg)"},{ transform : "rotate(360deg)"});
    },
    init : function(params, createOptions) {
        this.text(params); // do something with the params
    },
    tagName : "div"
})
scopeOne.e("pri-button", "Hello there").addClass("tryMe");
```

# Events

You can either create traditional event handler on each element like:

``` javascript
myDiv.on("click", function(elem, data) {
   
});
```

Or you can create a routing information, which will be caught by parent elements.

``` javascript
// parent element
myDiv.router("click", function(data) {
   alert(data.msg);
});
// child sending event:
var childDiv = myDiv.div().text("Say hi");
childDiv.setRoute( { msg : "Hello" });
```

Routing is more efficient, since it requires only one event -handler function.

# Using .on( ... )

You can place tradional event-handler with .on( ) 

``` javascript
myDiv.on("click", function(elem, data) {
    // elem is the elment clicked
    // data is the trigger parameter
});
// triggering manually
myDiv.trigger("click", someData);
```

# Starting by connecting to document

Finding a HTML element and creating elments under it:

``` javascript
var main = _e("#maindiv"); // search by ID
main.div().text("Hello world");
```

or you can just insert a new element under BODY

``` javascript
var content = _e(document.body).div("content");
```

## Shortcuts for elements

Most DOM -elements can be created just by calling a function of their name:

``` javascript
var main = _e("#maindiv");

// creating table
var tbl = main.table();

// creating button
var btn = main.button();

// creating input
var inp = main.input();

// creating textarea
var ta = main.textarea();

// adding row to table
tbl.addRow(1,2,3);

// creating span
var s = main.span()

// creating svg element
var svg = main.svg({ width : 300, height : 300});

// creating svg group
var g = svg.g();

// creating svg path
var path = svg.path({ d : "M26,27.5H6c-0.829,0-1.5-0.672-1.5-1.5V6c0-0.829,0.671-1.5,1.5-1.5h20c0.828,0,1.5,0.671,1.5,1.5v20C27.5,26.828,26.828,27.5,26,27.5zM7.5,24.5h17v-17h-17V24.5z"});

```



# SVG support

Since SVG elements behave in many ways like DOM elements, you can use all MVC features also to them.

To create a simple SVG icon -example with color picker:

```

var svg = _e("svg");
svg.attr({
    width : 200,
    height :300
});

svg.g().path({
    d : "<some path>"
    fill : "<some color"
});

```

# Random tests

- custon drop-down http://jsfiddle.net/xudgwhjs/
- effects http://codepen.io/teroktolonen/full/pjNzMx



# ToDo

A lot of small fixes coming

- clear up the code from global namespace pollution
- clean the event handler code
- add support for color gradients in CSS
- document more CSS examples
- document using Data libraries
- document MVC model
- document updating extensions
- document DND functionality
- SVG examples
- document onFrame handlers etc.
- SVG path add-ons

# Ideas

Generic view navi -idea : a remote or local data browser

https://gist.github.com/terotests/c052b5abc841ca91cb19

# License

MIT. Currently use at own risk.

























   

 


   
#### Class _e


- [__singleton](README.md#_e___singleton)
- [_classFactory](README.md#_e__classFactory)
- [_isStdElem](README.md#_e__isStdElem)
- [extendAll](README.md#_e_extendAll)
- [getComponentRegistry](README.md#_e_getComponentRegistry)
- [getElemNames](README.md#_e_getElemNames)

- [initAsTag](README.md#_e_initAsTag)
- [initElemNames](README.md#_e_initElemNames)
- [registerComponent](README.md#_e_registerComponent)



   
    
##### trait Node ordering

- [add](README.md#_add)
- [addItem](README.md#_addItem)
- [clear](README.md#_clear)
- [collectFromDOM](README.md#_collectFromDOM)
- [insertAfter](README.md#_insertAfter)
- [insertAt](README.md#_insertAt)
- [insertBefore](README.md#_insertBefore)
- [moveDown](README.md#_moveDown)
- [moveUp](README.md#_moveUp)
- [parent](README.md#_parent)
- [prepend](README.md#_prepend)
- [reIndex](README.md#_reIndex)
- [remove](README.md#_remove)
- [removeChild](README.md#_removeChild)
- [removeChildEvents](README.md#_removeChildEvents)
- [removeIndexedChild](README.md#_removeIndexedChild)
- [replaceWith](README.md#_replaceWith)


    
    
    
##### trait TouchEvents

- [baconDrag](README.md#_baconDrag)
- [drag](README.md#_drag)
- [draggable](README.md#_draggable)
- [mousePos](README.md#_mousePos)
- [pauseEvents](README.md#_pauseEvents)
- [touch](README.md#_touch)
- [touchclick](README.md#_touchclick)
- [touchevents](README.md#_touchevents)


    
    
    
##### trait Dimensions

- [absolute](README.md#_absolute)
- [baseZ](README.md#_baseZ)
- [box](README.md#_box)
- [height](README.md#_height)
- [hoverLayer](README.md#_hoverLayer)
- [offset](README.md#_offset)
- [pxParam](README.md#_pxParam)
- [relative](README.md#_relative)
- [width](README.md#_width)
- [x](README.md#_x)
- [y](README.md#_y)
- [z](README.md#_z)


    
    
    
##### trait CSSTransform

- [applyTransforms](README.md#_applyTransforms)
- [compStyle](README.md#_compStyle)
- [createEffect](README.md#_createEffect)
- [css](README.md#_css)
- [effectIn](README.md#_effectIn)
- [effectOut](README.md#_effectOut)
- [hide](README.md#_hide)
- [show](README.md#_show)
- [style](README.md#_style)
- [styleString](README.md#_styleString)
- [transform](README.md#_transform)
- [transformOrigin](README.md#_transformOrigin)
- [transformString](README.md#_transformString)


    
    
    
##### trait Table

- [addRow](README.md#_addRow)


    
    
    
##### trait Iteration

- [child](README.md#_child)
- [childCount](README.md#_childCount)
- [domAttrIterator](README.md#_domAttrIterator)
- [domIterator](README.md#_domIterator)
- [forChildren](README.md#_forChildren)
- [forEach](README.md#_forEach)
- [searchTree](README.md#_searchTree)


    
    
    
##### trait DomClass

- [addClass](README.md#_addClass)
- [findPostFix](README.md#_findPostFix)
- [hasClass](README.md#_hasClass)
- [removeClass](README.md#_removeClass)


    
    
    
##### trait events

- [bacon](README.md#_bacon)
- [bindSysEvent](README.md#_bindSysEvent)
- [delegate](README.md#_delegate)
- [emitValue](README.md#_emitValue)
- [eventBinder](README.md#_eventBinder)
- [isHovering](README.md#_isHovering)
- [namedListener](README.md#_namedListener)
- [on](README.md#_on)
- [onValue](README.md#_onValue)
- [removeAllHandlers](README.md#_removeAllHandlers)
- [removeListener](README.md#_removeListener)
- [router](README.md#_router)
- [setRoute](README.md#_setRoute)
- [trigger](README.md#_trigger)
- [uniqueListener](README.md#_uniqueListener)


    
    
    
##### trait Table

- [bind](README.md#InputHandling_bind)
- [bindVal](README.md#InputHandling_bindVal)
- [blur](README.md#InputHandling_blur)
- [checked](README.md#InputHandling_checked)
- [clearOptions](README.md#InputHandling_clearOptions)
- [focus](README.md#InputHandling_focus)
- [getClipboard](README.md#InputHandling_getClipboard)
- [localStore](README.md#InputHandling_localStore)
- [options](README.md#InputHandling_options)
- [toBacon](README.md#InputHandling_toBacon)
- [val](README.md#InputHandling_val)


    
    
    
    
    
##### trait domShortcuts

- [a](README.md#domShortcuts_a)
- [attr](README.md#domShortcuts_attr)
- [b](README.md#domShortcuts_b)
- [button](README.md#domShortcuts_button)
- [canvas](README.md#domShortcuts_canvas)
- [checkbox](README.md#domShortcuts_checkbox)
- [clearCanvas](README.md#domShortcuts_clearCanvas)
- [ctx](README.md#domShortcuts_ctx)
- [div](README.md#domShortcuts_div)
- [e](README.md#domShortcuts_e)
- [form](README.md#domShortcuts_form)
- [getPixelFn](README.md#domShortcuts_getPixelFn)
- [h1](README.md#domShortcuts_h1)
- [h2](README.md#domShortcuts_h2)
- [h3](README.md#domShortcuts_h3)
- [h4](README.md#domShortcuts_h4)
- [img](README.md#domShortcuts_img)
- [input](README.md#domShortcuts_input)
- [label](README.md#domShortcuts_label)
- [li](README.md#domShortcuts_li)
- [ol](README.md#domShortcuts_ol)
- [p](README.md#domShortcuts_p)
- [pre](README.md#domShortcuts_pre)
- [processPixels](README.md#domShortcuts_processPixels)
- [row](README.md#domShortcuts_row)
- [shortcutFor](README.md#domShortcuts_shortcutFor)
- [span](README.md#domShortcuts_span)
- [src](README.md#domShortcuts_src)
- [strong](README.md#domShortcuts_strong)
- [table](README.md#domShortcuts_table)
- [textarea](README.md#domShortcuts_textarea)
- [toDataURL](README.md#domShortcuts_toDataURL)
- [ul](README.md#domShortcuts_ul)
- [video](README.md#domShortcuts_video)


    
    
    
##### trait domContent

- [_setDomText](README.md#domContent__setDomText)
- [html](README.md#domContent_html)
- [text](README.md#domContent_text)


    
    
    
##### trait viewsNavis

- [_refreshView](README.md#viewsNavis__refreshView)
- [contentRouter](README.md#viewsNavis_contentRouter)
- [createLayout](README.md#viewsNavis_createLayout)
- [factoryLoader](README.md#viewsNavis_factoryLoader)
- [fiddle](README.md#viewsNavis_fiddle)
- [findViewByName](README.md#viewsNavis_findViewByName)
- [findViewFactory](README.md#viewsNavis_findViewFactory)
- [getLayouts](README.md#viewsNavis_getLayouts)
- [getRole](README.md#viewsNavis_getRole)
- [getRouteObj](README.md#viewsNavis_getRouteObj)
- [initScreenEvents](README.md#viewsNavis_initScreenEvents)
- [layout](README.md#viewsNavis_layout)
- [onMediaChange](README.md#viewsNavis_onMediaChange)
- [onRoute](README.md#viewsNavis_onRoute)
- [pageController](README.md#viewsNavis_pageController)
- [popView](README.md#viewsNavis_popView)
- [push](README.md#viewsNavis_push)
- [pushTo](README.md#viewsNavis_pushTo)
- [pushView](README.md#viewsNavis_pushView)
- [removeControllersFor](README.md#viewsNavis_removeControllersFor)
- [scrollTo](README.md#viewsNavis_scrollTo)
- [setLayout](README.md#viewsNavis_setLayout)
- [setRole](README.md#viewsNavis_setRole)
- [viewFactory](README.md#viewsNavis_viewFactory)


    
    
    
##### trait mvc_trait

- [createItemView](README.md#mvc_trait_createItemView)
- [data](README.md#mvc_trait_data)
- [findModelFactory](README.md#mvc_trait_findModelFactory)
- [fromStream](README.md#mvc_trait_fromStream)
- [getViewFunction](README.md#mvc_trait_getViewFunction)
- [model](README.md#mvc_trait_model)
- [modelFactory](README.md#mvc_trait_modelFactory)
- [modelFactoryLoader](README.md#mvc_trait_modelFactoryLoader)
- [mv](README.md#mvc_trait_mv)
- [mvc](README.md#mvc_trait_mvc)
- [tree](README.md#mvc_trait_tree)


    
    
    
##### trait svgShortcuts

- [circle](README.md#svgShortcuts_circle)
- [defs](README.md#svgShortcuts_defs)
- [feGaussianBlur](README.md#svgShortcuts_feGaussianBlur)
- [feMerge](README.md#svgShortcuts_feMerge)
- [feMergeNode](README.md#svgShortcuts_feMergeNode)
- [feOffset](README.md#svgShortcuts_feOffset)
- [filter](README.md#svgShortcuts_filter)
- [g](README.md#svgShortcuts_g)
- [image](README.md#svgShortcuts_image)
- [line](README.md#svgShortcuts_line)
- [path](README.md#svgShortcuts_path)
- [rect](README.md#svgShortcuts_rect)
- [svg](README.md#svgShortcuts_svg)
- [svg_text](README.md#svgShortcuts_svg_text)
- [tspan](README.md#svgShortcuts_tspan)


    
    
    
##### trait util_fns

- [guid](README.md#util_fns_guid)
- [isArray](README.md#util_fns_isArray)
- [isFunction](README.md#util_fns_isFunction)
- [isObject](README.md#util_fns_isObject)
- [isStream](README.md#util_fns_isStream)
- [str](README.md#util_fns_str)
- [whenLoaded](README.md#util_fns_whenLoaded)


    
    
    
    
    
    
    
##### trait colors_trait

- [colorMix](README.md#_colorMix)
- [colorToHex](README.md#_colorToHex)
- [colourNameToHex](README.md#_colourNameToHex)
- [componentToHex](README.md#_componentToHex)
- [dim](README.md#_dim)
- [hexToRgb](README.md#_hexToRgb)
- [hexToYuv](README.md#_hexToYuv)
- [hsvToRgb](README.md#_hsvToRgb)
- [mix](README.md#_mix)
- [rgbToHex](README.md#_rgbToHex)
- [rgbToHsv](README.md#_rgbToHsv)
- [rgbToYuv](README.md#_rgbToYuv)
- [toRGB](README.md#_toRGB)
- [toRSpace](README.md#_toRSpace)
- [yuvConversion](README.md#_yuvConversion)
- [yuvConversion2](README.md#_yuvConversion2)
- [yuvPixelConversion](README.md#_yuvPixelConversion)
- [yuvToRgb](README.md#_yuvToRgb)


    
    
    
    
    
##### trait ajax_methods

- [_initAjax](README.md#__initAjax)
- [_traditionalUpload](README.md#__traditionalUpload)
- [ajaxHook](README.md#_ajaxHook)
- [createUploader](README.md#_createUploader)
- [fileObjectThumbnail](README.md#_fileObjectThumbnail)
- [get](README.md#_get)
- [getJSON](README.md#_getJSON)
- [post](README.md#_post)
- [postJSON](README.md#_postJSON)
- [send](README.md#_send)
- [uploadHook](README.md#_uploadHook)


    
    
    
##### trait web_comp

- [_findCustomElem](README.md#__findCustomElem)
- [customElement](README.md#_customElement)


    
    


   
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
#### Class _qc


- [attr](README.md#_qc_attr)
- [bindSysEvent](README.md#_qc_bindSysEvent)
- [blur](README.md#_qc_blur)
- [css](README.md#_qc_css)
- [focus](README.md#_qc_focus)
- [get](README.md#_qc_get)
- [pxParam](README.md#_qc_pxParam)



   


   



      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
#### Class later


- [add](README.md#later_add)
- [after](README.md#later_after)
- [asap](README.md#later_asap)
- [every](README.md#later_every)
- [once](README.md#later_once)
- [onFrame](README.md#later_onFrame)
- [polyfill](README.md#later_polyfill)
- [removeFrameFn](README.md#later_removeFrameFn)



   


   



      
    
      
            
#### Class css


- [_classFactory](README.md#css__classFactory)
- [animation](README.md#css_animation)
- [animSettings](README.md#css_animSettings)
- [assign](README.md#css_assign)
- [bind](README.md#css_bind)
- [buildCss](README.md#css_buildCss)
- [collectAnimationCss](README.md#css_collectAnimationCss)
- [convert](README.md#css_convert)
- [initConversions](README.md#css_initConversions)
- [makeCss](README.md#css_makeCss)
- [ruleToCss](README.md#css_ruleToCss)
- [updateStyleTag](README.md#css_updateStyleTag)



   
    
##### trait _dataTrait

- [guid](README.md#_dataTrait_guid)
- [isArray](README.md#_dataTrait_isArray)
- [isFunction](README.md#_dataTrait_isFunction)
- [isObject](README.md#_dataTrait_isObject)


    
    
    
    


   
      
    
      
            
#### Class later


- [add](README.md#later_add)
- [after](README.md#later_after)
- [asap](README.md#later_asap)
- [every](README.md#later_every)
- [once](README.md#later_once)
- [onFrame](README.md#later_onFrame)
- [polyfill](README.md#later_polyfill)
- [removeFrameFn](README.md#later_removeFrameFn)



   


   



      
    



      
    
      
    
      
            
#### Class clipBoard


- [del](README.md#clipBoard_del)
- [fromClipboard](README.md#clipBoard_fromClipboard)
- [get](README.md#clipBoard_get)
- [localStoreSupport](README.md#clipBoard_localStoreSupport)
- [set](README.md#clipBoard_set)
- [toClipboard](README.md#clipBoard_toClipboard)



   


   



      
    
      
    
      
    





   
# Class _e


The class has following internal singleton variables:
        
* _eg
        
* _ee_
        
* guid
        
* _screenInit
        
* _svgElems
        
* _registry
        
* _elemNames
        
* _hasRemoted
        
* _elemNamesList
        
        
### <a name="_e___singleton"></a>_e::__singleton(t)


```javascript
return _eg;
```

### <a name="_e__classFactory"></a>_e::_classFactory(elemName, into)


```javascript

if(elemName) {
    if(_registry && _registry[elemName]) {
        var classConst = _registry[elemName];
        return new classConst(elemName, into);
    }
}

```

### <a name="_e__isStdElem"></a>_e::_isStdElem(name)


```javascript
return _elemNames[name];
```

### <a name="_e_extendAll"></a>_e::extendAll(name, fn)


```javascript

if(this.isObject(name)) {
    
    for( var n in name ) {
        if(name.hasOwnProperty(n)) this.extendAll( n, name[n]);
    }
    
    return this;
}

if(!_myTrait_[name]) {
    _myTrait_[name] = fn;
}
return this;
```

### <a name="_e_getComponentRegistry"></a>_e::getComponentRegistry(t)


```javascript
return _registry;
```

### <a name="_e_getElemNames"></a>_e::getElemNames(t)


```javascript
return _elemNamesList;
```

        
### _e::constructor( elemName, into )

```javascript
this.initAsTag(elemName, into);

```
        
### <a name="_e_initAsTag"></a>_e::initAsTag(elemName, into, force)


```javascript

if(this.isObject(elemName)) {
    this._dom = elemName;
    elemName = this._dom.tagName;
    
    if(elemName=="input") {
        if(this._dom.getAttribute("type")=="checkbox") {
            elemName = "checkbox";
        }
    }
    
    // ---- might be DOM object...
} else {
   if(elemName && elemName.charAt) {
       if(elemName.charAt(0)=="#") {

           var ee = document.getElementById(elemName.substring(1));
           if(ee) {
               elemName = ee.tagName;
               this._dom = ee;
           }
       }
   }
}

if(!_registry) _registry = {};

if(!elemName) elemName = "div";

var addClass;
var pts = elemName.split("."); // => has classname?
if(pts[1]) {
    elemName = pts[0];
    addClass = pts[1];
}

if(!_eg) {
    this.initElemNames();
    _eg = _ee_ = this.globalState();
    _svgElems = {
        "circle" : "true",
        "rect" : true,
        "path" : true,
        "svg" : true,
        "image" : true,
        "line" : true,
        "text" : true,
        "tspan" : true,
        "g" : true,
        "pattern" : true,
        "polygon" : true,
        "polyline" : true,
        "clippath" : true,
        "defs" : true,
        "feoffset" : true,
        "femerge":true,
        "femergenode":true,
        "fegaussianblur" : true,
        "filter" : true
    }
    
}
var svgNS = "http://www.w3.org/2000/svg";  
var origElemName = elemName;
elemName = elemName.toLowerCase()

if(force) {
    
} else {
    if(!_elemNames[elemName] && !_svgElems[elemName] ) {
        // custom element, this may be a polymer element or similar
        this._customElement = elemName;
    }
}

if(!_screenInit) {
    this.initScreenEvents();
    _screenInit = true;
}

if(_svgElems[elemName]) {
    this._svgElem = true;
    this._svg = true;
}

// 
this._type = elemName;
this._tag = elemName.toLowerCase();
if(this._type=="checkbox") {
    this._checked = false;
    this._tag = "input";
}
this._children = [];

if(elemName == "svg") this._svg = true;

if(!this._dom) {
    if(elemName == "svg") {
        this._dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"
        this._dom.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this._dom.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    } else {
        if(this._svgElem) {
            this._dom = document.createElementNS(svgNS, origElemName);
        } else {
            this._dom = document.createElement(this._tag);
        }
    }
}

// jQuery emulation might be removed...
this.q = new _qc(this._dom, this);


if(this._type=="checkbox") {
    this.q.attr("type","checkbox");
}
if(!this._svg && addClass) this.addClass( addClass );

if(!this._component && into) {
    if(typeof(into.appendChild)!="undefined")
        into.appendChild(this._dom);
}
```

### <a name="_e_initElemNames"></a>_e::initElemNames(t)


```javascript
if(_elemNames) return;
_elemNamesList = ["a", "abbr", "acronym","address","applet","area","article","aside","audio",
"b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas",
"caption","center","cite","code","col","colgroup","datalist","dd","del","details",
"dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font",
"footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup",
"hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link",
"main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object",
"ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby",
"s","sampe","script","section","select","small","source","span","strike","strong","style",
"sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title",
"tr","track","tt","u","ul","var","video","wbr"];
_elemNames = {};
_elemNamesList.forEach( function(n) {
    _elemNames[n] = true;
})

var me = this;
_elemNamesList.forEach(function(en) {
     var o = {};
     o[en+"End"] = function() {
         return this.parent();
     }
     me.extendAll(o);
});



```

### <a name="_e_registerComponent"></a>_e::registerComponent(name, classDef)


```javascript

if(!_registry[name]) {
    _registry[name] = classDef;
}
```



   
    
## trait Node ordering

The class has following internal singleton variables:
        
        
### <a name="_add"></a>::add(items)


```javascript
if(! (items instanceof Array) ) {
    items = Array.prototype.slice.call(arguments, 0);
}    
var me = this;
items.forEach(  function(e) {
 
    //
    if(me.isFunction(e)) {
        var creator = e;
        var newItem = _e();
        var res = e.apply(newItem, [me]);
        if(res) {
            e = res;
        } else {
            e = newItem;
        }
        // optionally could be used later, 
        // e._creatorFn = creator;
    }    
    
    if(typeof(e)=="string" || !isNaN(e) ) {
        var nd = _e("span");
        nd._dom.innerHTML = e;
        me.add(nd);
        return me;
    }
    
    if(me.isStream(e)) {
        e.onValue( function(t) {
            me.add( t );
        });        
        return me;
    }
    
    if(typeof(e)=="undefined") return;
    
    if(typeof(e._dom)!="undefined") {
        
        if(e._parent) {
            e._parent.removeChild(e);
        }
        
        if(!me._children) {
            me._children = [];
        }
        var ii = me._children.length;
        e._index = ii;
        me._children.push(e);
        e._parent = me;
        e._svg = me._svg;
        me._dom.appendChild(e._dom);            
        
        e.trigger("parent",me);
        me.trigger("child",e);
    }                    
});

return this;
```

### <a name="_addItem"></a>::addItem(items)


```javascript

var list = Array.prototype.slice.call(arguments, 0);
return this.add.apply(this, list);
```

### <a name="_clear"></a>::clear(t)

Removes all the subnodes
```javascript

//this.removeAllHandlers();
//this.removeChildEvents();
//this.removeControllersFor(this);

this._children.forEach( function(c) {
    c.remove();
});
this._children = [];
while (this._dom.firstChild) {
    this._dom.removeChild(this._dom.firstChild);
}
return this;
```

### <a name="_collectFromDOM"></a>::collectFromDOM(elem)


```javascript
// collecting the nodes from DOM -tree...

var e = _e(elem);
var len = elem.childNodes.length;

var alen = elem.attributes.length;
for(var i=0; i<alen;i++) {
    var a = elem.attributes[i];
    e.q.attr(a.name, a.value);
}

var str = elem.className;
if(str) {
    str = str+" ";
    var classes = str.split(" ");
    var clen = classes.length;
    for(var i=0; i<clen;i++) {
        var a = classes[i];
        if(a) {
            e.addClass(a);
        }
    }
}

if(elem.innerText || elem.textContent) {
    e.text(elem.innerText || elem.textContent);
}

for(var i=0; i<len;i++) {
    var sub = elem.childNodes[i];
    e.add(this.collectFromDOM(sub));
}

return e;


```

### <a name="_insertAfter"></a>::insertAfter(newItem)


```javascript

// referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

if(!this._parent) return;
if(!this._parent._children) return;

if(newItem==this) {
    console.log("The items were the same!!!");
    return;
}
console.log("--- insert after ----");

// var newItem = _e(a,b,c,d,e,f);
var myIndex = this._index;
var chList = this._parent._children;
if(newItem._parent && (newItem._parent!=this._parent)) {
    newItem._parent.removeChild(newItem);
    var myIndex = chList.indexOf(this);
    chList.splice(myIndex+1,0,newItem); 
    this._parent.reIndex();
} else {
    
    if(!newItem._parent) {
        newItem._parent = this._parent;
        chList.splice(myIndex+1,0,newItem);
    } else {
        var oldIndex = chList.indexOf(newItem);
        chList.splice(oldIndex,1);
        var myIndex = chList.indexOf(this);
        console.log("--- insert placing into ",myIndex+1," ----");
        chList.splice(myIndex+1,0,newItem);
    }
    this._parent.reIndex();
}

var pDOM = newItem._dom;
var mDOM = this._dom;
       mDOM.parentNode.insertBefore(pDOM, mDOM.nextSibling);  
```

### <a name="_insertAt"></a>::insertAt(i, obj)


```javascript

if(i < this._children.length) {
    var ch = this.child(i);
    ch.insertBefore(obj);
} else {
    this.add(obj);
}

```

### <a name="_insertBefore"></a>::insertBefore(newItem)
`newItem` Item to be inserted
 

Inserts a new node before an existing node
```javascript

if(!this._parent) return;
if(!this._parent._children) return;

if(newItem==this) {
    return;
}

// var newItem = _e(a,b,c,d,e,f);
var myIndex = this._index;
var chList = this._parent._children;

if(newItem._parent && (newItem._parent!=this._parent)) {
    newItem._parent.removeChild(newItem);
    newItem._parent = this._parent;
    var myIndex = chList.indexOf(this);
    chList.splice(myIndex,0,newItem); 
    this._parent.reIndex();
} else {
    if(!newItem._parent) {
        newItem._parent = this._parent;
        chList.splice(myIndex,0,newItem);
    } else {
        var oldIndex = chList.indexOf(newItem);
        if(oldIndex>=0) chList.splice(oldIndex,1);
        var myIndex = chList.indexOf(this);
        chList.splice(myIndex,0,newItem);
    }
    this._parent.reIndex();
}

var pDOM = newItem._dom;
var mDOM = this._dom;
       mDOM.parentNode.insertBefore(pDOM, mDOM);  

return this;       

```

### <a name="_moveDown"></a>::moveDown(t)

Moves the node down in the DOM tree
```javascript
if(typeof(this._index)!="undefined" && this._parent) {
    var myIndex = this._index,
        nextIndex;
    if(!this._parent) return;
    if(!this._parent._children) return;
    if(myIndex>=(this._parent._children.length-1)) return;
    
    if(this._parent._children) {

        var next = this._parent._children[myIndex+1];

        next._index--;
        this._index++;
        var chList = this._parent._children;
        
        chList.splice(myIndex+1, 0, chList.splice(myIndex, 1)[0]);
        
        var pDOM = next._dom;
        var mDOM = this._dom;
        mDOM.parentNode.insertBefore(mDOM, pDOM.nextSibling);
        
        
    }
}
```

### <a name="_moveUp"></a>::moveUp(t)

Moves the node up in the DOM tree
```javascript
if(this._index && this._parent) {

    var myIndex = this._index,
        nextIndex;
    if(!myIndex) return;
    if(myIndex<=0) return;
    if(this._parent._children) {

        var prev = this._parent._children[myIndex-1];
        prev._index++;
        this._index--;
        var chList = this._parent._children;
        
        chList.splice(myIndex-1, 0, chList.splice(myIndex, 1)[0]);
        
        var pDOM = prev._dom;
        var mDOM = this._dom;
        pDOM.parentNode.insertBefore(mDOM, pDOM);
        
    }
}
```

### <a name="_parent"></a>::parent(t)


```javascript
return this._parent;
```

### <a name="_prepend"></a>::prepend(items)

Adds items as the first child of the current node
```javascript
if(! (items instanceof Array) ) {
    items = Array.prototype.slice.call(arguments, 0);
}    
var me = this;
items.forEach(  function(e) {
    if(typeof(e)=="string") {
        me._dom.innerHTML = e;
        return me;
    }
    
    if(typeof(e)=="undefined") return;
    
    if(typeof(e._dom)!="undefined") {
        
        if(e._parent) {
            e._parent.removeChild(e);
        }
        
        if(!me._children) {
            me._children = [];
        }
        
        e._index = 0;
        me._children.unshift(e);
        e._parent = me;
        me._dom.insertBefore(e._dom, me._dom.firstChild); 
        
        var len = me._children.length;
        for(var i=0; i<len; i++) me._children[i]._index = i;
        
        e.trigger("parent",me);
        me.trigger("child",e);
    }                    
});

return this;
```

### <a name="_reIndex"></a>::reIndex(t)


```javascript
var chList = this._children;
var i=0;
chList.forEach(function(ch) {
   ch._index = i++;
});
```

### <a name="_remove"></a>::remove(t)

Removes the item from the DOM -tree
```javascript

this.removeChildEvents();

if(this._parent) {
    this._parent.removeChild(this);
} else {
    var p = this._dom.parentElement;
    if(p) p.removeChild(this._dom);
}

this._children = [];
this.removeAllHandlers();
```

### <a name="_removeChild"></a>::removeChild(o)

Removes a child of the node
```javascript
if(this._children) {

    var me = this;
    var i = this._children.indexOf(o);
    if(i>=0) {
        this._children.splice(i,1);
        this._dom.removeChild( o._dom );
        
    } 
    this.reIndex();
}
```

### <a name="_removeChildEvents"></a>::removeChildEvents(t)


```javascript
this.forChildren( function(ch) {
    ch.removeAllHandlers();
    ch.removeChildEvents();
    ch.removeControllersFor(ch);
});
```

### <a name="_removeIndexedChild"></a>::removeIndexedChild(o)

Removes the node from the index, but not from the DOM tree
```javascript
if(this._children) {
    var i = this._children.indexOf(o);
    if(i>=0) {
        this._children.splice(i,1);
    }
}
```

### <a name="_replaceWith"></a>::replaceWith(elem)


```javascript
// var a = A.parentNode.replaceChild(document.createElement("span"), A);

var p = this.parent();
if(p) {
    var pi = p._children.indexOf(this);
    p._dom.replaceChild(elem._dom, this._dom);
    p._children.splice(pi, 1, elem);
    elem._parent = p;
    elem._svg = this._svg;
    // copy the event handlers of not????
    // this.remove();
}

```


    
    
    
## trait TouchEvents

The class has following internal singleton variables:
        
* _mousePoint
        
        
### <a name="_baconDrag"></a>::baconDrag(opts)


```javascript
var me = this;
return Bacon.fromBinder( function(sink) {
  me.drag( function(dv) {
      sink(dv);
  });
}); 
```

### <a name="_drag"></a>::drag(callBack)


```javascript
var me = this,
    state = {};
    
if(this.isObject(callBack) && !this.isFunction(callBack)) {
    
    var objToDrag = callBack;
    var sx,sy;
    callBack = function(dv) {
        if(dv.start) {
            sx = objToDrag.x();
            sy = objToDrag.y();            
        }
        objToDrag.x( sx + dv.dx).y( sy + dv.dy );           
    }
}
    
this.draggable( function(o,dv) {
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
}, function(o,dv) {
    state.start = false;
    state.dx = dv.dx;
    state.dy = dv.dy;
    state.x = state.sx +state.dx;
    state.y = state.sy +state.dy;                      
    callBack(state);
}, function(o,dv) {
    state.end = true;
    state.dx = dv.dx;
    state.dy = dv.dy;            
    callBack(state);
});
return this;
```

### <a name="_draggable"></a>::draggable(startFn, middleFn, endFn)

Three functions, fired when drag starts, proceeds and ends
```javascript
var _eg = this.__singleton();
_eg.draggable(this);

if(startFn) this.on("startdrag", startFn);
if(middleFn) this.on("drag", middleFn);
if(endFn) this.on("enddrag", endFn);

```

### ::constructor( t )

```javascript
this._touchItems = [];
```
        
### <a name="_mousePos"></a>::mousePos(t)


```javascript
if(!_mousePoint) {
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
```

### <a name="_pauseEvents"></a>::pauseEvents(e)


```javascript
e = e || window.event;

if(e.stopPropagation) e.stopPropagation();
if(e.preventDefault) e.preventDefault();
e.cancelBubble=true;
e.returnValue=false;

return false;
```

### <a name="_touch"></a>::touch(i)

Get touch number i
```javascript
return this._touchItems[i];

```

### <a name="_touchclick"></a>::touchclick(t)

Enables click emulation on touch devices
```javascript
this.touchevents();
var o = this;
this.on("touchstart", function(o,dv) {
    o.trigger("click");
});
```

### <a name="_touchevents"></a>::touchevents(t)

Initializes the touch events
```javascript

// NOTE
// http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx
// http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
// https://coderwall.com/p/egbgdw
// http://jessefreeman.com/articles/from-webkit-to-windows-8-touch-events/

var elem =  this._dom;

// No hope...
if(!elem.addEventListener) return;

var o = this;
this._touchItems = [];

var touchStart= function(e) {
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
                      if(e.targetTouches) allTouches = e.targetTouches;
                      o._touchCount = allTouches.length;
                      for(var i=0; i<allTouches.length; i++) {
                        var item = {};
                    
                        item.startX = allTouches[0].pageX;
                        item.startY = allTouches[0].pageY;
                        o._touchItems[i]  = item;
                      }

                      o.trigger("touchstart");
                      if(e.preventDefault) e.preventDefault();
                      
                      if(e.stopPropagation) e.stopPropagation();
                      
                      e.returnValue = false;
                      
                      
                      };

var touchMove =  function(e) {
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
                      if(e.targetTouches) allTouches = e.targetTouches; // [0].pageX;)
                      o._touchCount = allTouches.length;
                      for(var i=0; i<allTouches.length; i++) {
                         var item = o._touchItems[i];
                         
                         item.dx = e.touches[i].pageX - item.startX;
                         item.dy = e.touches[i].pageY - item.startY;
                         //item.x = e.touches[i].pageX - off.left;
                         //item.y = e.touches[i].pageY - off.top;
                      }
                      
                      o.trigger("touchmove");
                      
                      
                      if(e.preventDefault) e.preventDefault();
                      };

var touchEnd = function(e) {
    // o.q.css("transform", "rotate(20deg)");
                      o.trigger("touchend");
                      if(e.preventDefault) e.preventDefault();
                      e.returnValue = false;
                      };

/*elem.addEventListener("touchcancel", function(e) {
                      o.trigger("touchcancel");
                      e.preventDefault();
                      }, false);*/


var msHandler = function(event) {
    // o.trigger("mstouch",event);
    switch (event.type) {
        case "touchstart": case "MSPointerDown": touchStart(event);
        break;
        case "touchmove": case "MSPointerMove": touchMove(event);
        break;
        case "touchend": case "MSPointerUp": touchEnd(event);
        break;
    }
    // if(event.preventDefault) event.preventDefault();
    event.returnValue = false;
//                     event.preventDefault();
}


elem.addEventListener("touchstart", touchStart, false);
elem.addEventListener("touchmove", touchMove, false);
elem.addEventListener("touchend", touchEnd, false);



```


    
    
    
## trait Dimensions

The class has following internal singleton variables:
        
        
### <a name="_absolute"></a>::absolute(t)

Makes the DOM element absolute positioned
```javascript
this.q.css("position", "absolute");
this.x(0).y(0).z(this.baseZ());
return this;

    

```

### <a name="_baseZ"></a>::baseZ(v)


```javascript
if(typeof(v)!="undefined") {
    this._baseZ = v;
    return this;
}
if(typeof(this._baseZ)=="undefined") this._baseZ = 0;
return this._baseZ;
```

### <a name="_box"></a>::box(t)


```javascript
var box = { left : 0, top : 0, width : 800, height : 800 };

var elem = this._dom;
try {
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !=="undefined" ) {
		box = elem.getBoundingClientRect();
	}
} catch(e) {
    // for IE having this bg
    box = { left : 0, top : 0, width : 800, height : 800 };
}
return box;
```

### <a name="_height"></a>::height(v)


```javascript
if(typeof(v)=="undefined") return this._h;

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.height(v);
    });
    return this;
}

if(this.isFunction(v)) {
    var oo = v(false, true),
        me = this;
    oo.me.on(oo.name, function(o,v) {
        me.height(v);
    });
    this.height( v() );
    return this;
}

if(v=="auto"){
    this._dom.style.height = v;
    this._h = v;
    return this;
}
if(v.slice) {
    if(v.slice(-1)=="%") {
        this._dom.style.height = v;
        return this;
    }
    if(v.slice(-2)=="em") {
        this._dom.style.height = v;
        return this;
    }    
}

var p = this.pxParam(v);
if(typeof(p)!="undefined") {
    this._dom.style.height = p;
    this._h = parseInt(v);
    this.trigger("height");
}
return this;
```

### <a name="_hoverLayer"></a>::hoverLayer(preventAll, zIndex)


```javascript
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

if(preventAll) {
    o.addClass("Hoverlayer");
    o.draggable( function(o,dv) {
        console.log("hover, start drag");
    }, function(o,dv) {
        console.log("dragging ");
    }, function(o,dv) {
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



```

### ::constructor( t )

```javascript

```
        
### <a name="_offset"></a>::offset(t)


```javascript
var doc = document.documentElement;
var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

var box = this.box();
return {
	top: box.top + scrollTop, // + document.body.scrollTop, //  - docElem.clientTop,
	left: box.left+scrollLeft, // + document.body.scrollLeft // - docElem.clientLeft
	width : box.width,
	height : box.height
};  
```

### <a name="_pxParam"></a>::pxParam(v)

Transform the param into CSS pixel value, like &quot;12px&quot;
```javascript
if(typeof(v)=="string") {
    return parseInt(v)+"px";
} else {
    var i = parseInt(v);
    if(!isNaN(i)) {
        return i+"px";
    }
}
```

### <a name="_relative"></a>::relative(t)

Makes the DOM item relatively positioned
```javascript
this.q.css("position", "relative");
this.x(0).y(0).z(this.baseZ());
return this;

```

### <a name="_width"></a>::width(v)


```javascript
if(typeof(v)=="undefined") return this._w;

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.width(v);
    });
    return this;
}


//console.log("Width = > ", v);
if(this.isFunction(v)) {
    //console.log("Function ",v());
    var oo = v(false, true),
        me = this;
    //console.log(oo);
    //console.log(oo.me.on);
    oo.me.on(oo.name, function(o,v) {
        me.width(v);
    });

    this.width( v() );
    return this;
}

if(v=="auto"){
    this._dom.style.width = v;
    this._w = v;
    return this;
}

if(v.slice) {
    if(v.slice(-1)=="%") {
        this._dom.style.width = v;
        return this;
    }
    if(v.slice(-2)=="em") {
        this._dom.style.width = v;
        return this;
    }    
}

var p = this.pxParam(v);
if(typeof(p)!="undefined") {
    this._dom.style.width = p;
    this._w = parseInt(v);
    this.trigger("width");
}
return this;
```

### <a name="_x"></a>::x(v)
`v` if set, the value of the x
 


```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.x(v);
    });
    return this;
}


if(typeof(v)!="undefined") {
    if(this._svgElem) {
        var t = this.getTransform();
        
        if(!this._y) this._y = 0;
        if(!this._x) this._x = 0;
        var dx = v - this._x;
        this._x = v;
        if(dx != 0) { 
            t.translate(dx, 0);
            this.q.attr("transform", t.getSvgTransform());
            this.trigger("x");
        }
        return this;
    }
    this.q.css("left", v+"px");
    this._x = v;
    this.trigger("x");
    return this;
}
if(typeof(this._x)=="undefined") this._x = 0;
return this._x;
```

### <a name="_y"></a>::y(v)
`v` if set, the value of y
 


```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.y(v);
    });
    return this;
}

if(typeof(v)!="undefined") {
    if(this._svgElem) {
        var t = this.getTransform();
        
        if(!this._y) this._y = 0;
        if(!this._x) this._x = 0;
        var dy = v - this._y;
        this._y = v;
        if(dy != 0) { 
            t.translate(0, dy);
            this.q.attr("transform", t.getSvgTransform());
            this.trigger("y");
        }
        return this;
    }    
    this.q.css("top", v+"px");
    this._y = v;
    this.trigger("y");
    return this;
}
if(typeof(this._y)=="undefined") this._y = 0;
return this._y;
```

### <a name="_z"></a>::z(v)
`v` if set, the value of z-index
 


```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.z(v);
    });
    return this;
}

var base = this._baseZ || 0;
if(typeof(v)!="undefined") {
    this.q.css("zIndex", v+base);
    this._z = v;
    this.trigger("z");
    return this;
}
if(typeof(this._z)=="undefined") this._z = 0;
return this._z;
```


    
    
    
## trait CSSTransform

The class has following internal singleton variables:
        
* _effects
        
* _nsConversion
        
* _nsIndex
        
        
### <a name="_applyTransforms"></a>::applyTransforms(tx)


```javascript
var d = this._dom;
d.style["transform"] = tx;
d.style["-webkit-transform"] = tx; 
d.style["-moz-transform"] = tx; 
d.style["-ms-transform"] = tx; 
this.trigger("transform");
return this;
```

### <a name="_compStyle"></a>::compStyle(t)


```javascript
var elem = this._dom;
var cs = window.getComputedStyle(elem,null);
return {
 get : function(prop) {
    return cs.getPropertyValue(prop);
 }
};

```

### <a name="_createEffect"></a>::createEffect(name, inPosition, outPosition, options)


```javascript

css().bind("."+name+"OutPosition", outPosition);
css().bind("."+name+"InPosition", inPosition);

options = options || {};
options.duration = options.duration || 0.2;

css().animation(name+"Out", {
    duration : (options.duration.toFixed(2) * 2) + "s",
    "iteration-count" : 1,
},  inPosition,  0.5, outPosition, outPosition); 

css().animation(name+"In", {
    duration : (options.duration.toFixed(2) * 2) + "s",
    "iteration-count" : 1,
},  outPosition, 0.5, inPosition, inPosition); 

_effects[name] = options;


```

### <a name="_css"></a>::css(subNamespace)


```javascript

// convert the namespaces to shorter versions
if(!_nsConversion) {
    _nsConversion = {};
    _nsIndex = 1;
}

if(!this._myClass) {
    this._myClass = "css_"+this.guid();
}

// subNamespace is usually used together with custom components, which are
// defining their own styles in some namespace
if(subNamespace) {
    // css namespaces of this object
    if(!this._cssNs) this._cssNs = {};
    
    // if the CSS object has been constructed
    var cssObj = this._cssNs[subNamespace];
    if(cssObj) return cssObj;
    
    // if not, create a new css object in a new namespace
    var nsFull = this._myClass+"_"+subNamespace;
    if(!_nsConversion[nsFull]) _nsConversion[nsFull] = _nsIndex++;
    var nsShort = this._myClass+"_"+_nsConversion[nsFull];
    
    cssObj = css(nsShort);
    this._cssNs[subNamespace] = cssObj;
    cssObj._nameSpace = nsShort;
    return cssObj; 
}

if(!this._css) {
    this._css = css(this._myClass);
    this.addClass(this._myClass);
}

return this._css;


```

### <a name="_effectIn"></a>::effectIn(name, fn)


```javascript

if(!this._effectOn) this._effectOn = {};

if(this._effectOn[name]) {
    return;
}

if(!this._effectState) {
    this._effectState = {};
    this._effectState[name] = 1;
    return;
}

if(this._effectState[name]==1) return;

this._effectOn[name] = (new Date()).getTime();

var options = _effects[name];

var eOut = name+"Out",
    eIn = name+"In",
    eInPos = name+"InPosition",
    eOutPos = name+"OutPosition";
    
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
    if(fn) fn();
});    

```

### <a name="_effectOut"></a>::effectOut(name, fn)


```javascript
if(!this._effectOn) this._effectOn = {};

if(this._effectOn[name]) {
    return;
}
if(!this._effectState) {
    this._effectState = {};
    this._effectState[name] = 1;
}
if(this._effectState[name]==2) return;

this._effectOn[name] = (new Date()).getTime();

var options = _effects[name];

var eOut = name+"Out",
    eIn = name+"In",
    eInPos = name+"InPosition",
    eOutPos = name+"OutPosition";
    
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
    if(fn) fn();
}); 
```

### <a name="_hide"></a>::hide(t)

Hides the node from DOM tree
```javascript
this._dom.style.display = "none";
this.trigger("hide");


```

### ::constructor( t )

```javascript
if(!_effects) {
    _effects = {};
}
```
        
### <a name="_show"></a>::show(t)

Shows the node in the DOM tree if not visible
```javascript
this._dom.style.display = "";
this.trigger("show");

```

### <a name="_style"></a>::style(v)

Creates a local CSS style using the css() object
```javascript
if(typeof(v)!="undefined") {
    // should we have named styles... perhaps... TODO
}
if(!this._localStyle) {
    var createStyleGuid = "localstyle"+(new Date()).getTime()+"_"+guid();
    this._localStyle = css().css("width","auto");
    this._localStyle.writeRule(createStyleGuid);
    this.addClass(createStyleGuid);
}
return this._localStyle;
```

### <a name="_styleString"></a>::styleString(value)


```javascript
// TODO: binding the style string???
this._dom.style.cssText = value;
return this;
```

### <a name="_transform"></a>::transform(name, value)


```javascript
if(!this._transforms) this._transforms = [];
if(typeof(value)=="undefined") {
    
    if(this._transforms.indexOf(name)>=0) {
        var vi = this._transforms.indexOf(name);
        var val = this._transforms[vi+1];
        var v = val.substr(1, val.length-2);
        return v;
    }
    return;
}
if(this._transforms.indexOf(name)==-1) {
    this._transforms.push(name);
    this._transforms.push("("+value+")");
    this._transforms.push(" ");
} else {
    var vi = this._transforms.indexOf(name);
    this._transforms[vi+1] = "("+value+")";
}

var tx = this._transforms.join("");
this.applyTransforms(tx);
return this;
```

### <a name="_transformOrigin"></a>::transformOrigin(tx)


```javascript
var d = this._dom;
d.style["transform-origin"] = tx;
d.style["-webkit-transform-origin"] = tx; 
d.style["-moz-transform-origin"] = tx; 
d.style["-ms-transform-origin"] = tx; 
this.trigger("transform-origin");
return this;
```

### <a name="_transformString"></a>::transformString(t)


```javascript
if(!this._transforms) return "";
return this._transforms.join("");
```


    
    
    
## trait Table

The class has following internal singleton variables:
        
        
### <a name="_addRow"></a>::addRow(items)

adds rows of items into the table, for example tbl.addRow(a,b,c)
```javascript
var row = new _e("tr");
this.addItem(row);

row.addClass("row"+this._children.length);

if(!( Object.prototype.toString.call(items) === '[object Array]')) {
    items = Array.prototype.slice.call(arguments, 0);
} 


var colIndex=0, me = this;
items.forEach(function(ii) {
    var cell = new _e("td");
    cell._dom.setAttribute("valign", "top");
    if(me.isObject(ii)) {
        cell.add( ii );
    } else {
        cell.text(ii);
    }
    row.addItem( cell );
    cell.addClass("col"+colIndex);
    colIndex++;
});
return this;  
```


    
    
    
## trait Iteration

The class has following internal singleton variables:
        
        
### <a name="_child"></a>::child(i)


```javascript
if(this._children[i]) {
   return this._children[i];
}
```

### <a name="_childCount"></a>::childCount(t)


```javascript
if(!this._children) return 0;
return this._children.length
```

### <a name="_domAttrIterator"></a>::domAttrIterator(elem, fn)


```javascript

if(!elem) return;
if(!elem.attributes) return;

for (var i = 0; i < elem.attributes.length; i++) {
  var attrib = elem.attributes[i];
  if (attrib.specified) {
      fn(attrib.name, attrib.value);
  }
}
```

### <a name="_domIterator"></a>::domIterator(elem, fn, nameSpace)


```javascript

if(!elem) return;

var noRecurse = {
    "textarea" : true
};


var childNodes = elem.childNodes;
if(childNodes) {
  var len = childNodes.length;
  for (var i = 0; i < len ; i++) {
     var child = childNodes[i];
     if(child.tagName=="svg") nameSpace = "svg";
     if(child) {
         var bStop = fn(child, nameSpace);
         if(bStop) {
             // console.log("**** SHOULD NOT ITERATE CHILDREN *****");
         } else {
             var bFullElem = child instanceof HTMLElement;
             if(bFullElem) {
                 var tN = child.tagName.toLowerCase();
                 if(!noRecurse[tN])
                     this.domIterator( child, fn, nameSpace );
             }
         }
         
     }
  }    
}

```

### <a name="_forChildren"></a>::forChildren(fn, recursive)

Calls function for all the direct children of this node
```javascript
if(this._children) {
    this._children.forEach( function(c) {
        fn(c);
        if(recursive) c.forChildren(fn, recursive);
    });
}
```

### <a name="_forEach"></a>::forEach(fn)

Calls function for all the direct children of this node
```javascript
if(this._children) 
    this._children.forEach( function(c) {
        fn(c);
        // c.forChildren(fn);
    });
```

### <a name="_searchTree"></a>::searchTree(fn, list)

Returns all the children which return true when given as parameter to function fn.
```javascript
if(!list) list = [];
var v;
if(v = fn(this)) list.push(v)
if(this._children) 
    this._children.forEach( function(c) {
        // if(fn(c)) list.push(c);
        c.searchTree(fn,list);
    });
return list;
```


    
    
    
## trait DomClass

The class has following internal singleton variables:
        
        
### <a name="_addClass"></a>::addClass(c)


```javascript
// safari problem

if(this._svg) return this;
if(this._dom instanceof SVGElement) return;

if(!this._classes) {
    this._classes = [];
}

if(this.isStream(c)) {
    
    var me = this,
        oldClass = "";
    c.onValue(function(c) {
        if(oldClass && (c!= oldClass)) {
            me.removeClass(oldClass);
        }
        me.addClass(c);
        oldClass = c;
    });
    
    return this;
}

// Test: removed the postfix from the class names
var pf = this.findPostFix();
if(pf) {
    //this._classes.push(c+pf);
    // this._dom.className = this._classes.join(" ");     
}

this._classes.push(c);
if(!this._svg) this._dom.className = this._classes.join(" "); 

return this;
```

### <a name="_findPostFix"></a>::findPostFix(str)


```javascript

if(this._myClass) {
    return this._myClass;
} else {
    var p = this.parent();
    if(p) return p.findPostFix();
}
return "";
```

### <a name="_hasClass"></a>::hasClass(c)


```javascript
if(!this._classes) return false;
if(this._classes.indexOf(c)>=0) return true;
return false;
```

### <a name="_removeClass"></a>::removeClass(c)


```javascript
if(!this._classes) return this;
var i;
while( (i = this._classes.indexOf(c))>=0) {
    if(i>=0) {
        this._classes.splice(i,1);
        this._dom.className = this._classes.join(" ");
    }
}

var pf = this.findPostFix();

if(pf) {
    /*
    while( (i = this._classes.indexOf(c+pf))>=0) {
        if(i>=0) {
            this._classes.splice(i,1);
            this._dom.className = this._classes.join(" ");
        }
    }  
    */
}

return this;
```


    
    
    
## trait events

The class has following internal singleton variables:
        
* _routes
        
        
### <a name="_bacon"></a>::bacon(eventName, eventTransformer)


```javascript

return Bacon.fromEvent(this._dom, eventName, eventTransformer); // (this._dom, eventName [, eventTransformer]) 

```

### <a name="_bindSysEvent"></a>::bindSysEvent(en, fn, stop)


```javascript
en = en.toLowerCase();
if(!this._sys) this._sys = {};
if(this._sys[en]) return false;

this._sys[en] = true;

var me = this;

if(this._dom.attachEvent) {
    if(!stop) {
        this._dom.attachEvent("on"+en, fn); 
    } else {
        this._dom.attachEvent("on"+en, function(e) {
            e = e || window.event;
            me._event = e;
            fn();
            if(stop) {
                e = window.event;
                if(e) e.cancelBubble = true;
            }
            });        
    }

} else {
    if(!stop) {
        this._dom.addEventListener(en, fn);
    } else {
        this._dom.addEventListener(en, function(e) {
                e = e || window.event;
                me._event = e;
                if(stop) {
                    if(e && e.stopPropagation) {
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
```

### <a name="_delegate"></a>::delegate(myDelecate)

Delegates the events to this object
```javascript

if(!this._delegates) this._delegates = [];
this._delegates.push(myDelecate);

```

### <a name="_emitValue"></a>::emitValue(scope, data)


```javascript
if(this._controller) {
    if(this._controller[scope]) {
       this._controller[scope](data);
       return;
    }
}

if(this._valueFn && this._valueFn[scope]) {
    this._valueFn[scope](data);
} else {
    if(this._parent) this._parent.emitValue(scope,data);
}
```

### <a name="_eventBinder"></a>::eventBinder(dom, eventName, fn, stop)


```javascript
var me = this;
if(dom.attachEvent) {
    dom.attachEvent("on"+eventName, function(e) {
        e = e || window.event;
        me._event = e;
        fn();
        if(stop) {
            e = window.event;
            if(e) e.cancelBubble = true;
        }
        });
} else {
    dom.addEventListener(eventName, function(e) {
        e = e || window.event;
        me._event = e;
        if(stop) {
            if(e && e.stopPropagation) {
                e.stopPropagation();
            } else {
               e = window.event;
               e.cancelBubble = true;
            }
        }
        fn();
        });
}  
```

### <a name="_isHovering"></a>::isHovering(t)


```javascript
if(!this._hoverable) {
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
```

### <a name="_namedListener"></a>::namedListener(name, fn)


```javascript

if(typeof(fn)!="undefined") {
    
    if(!this._namedListeners) 
        this._namedListeners = {};
    this._namedListeners[name] = fn;   
    fn._listenerName = name;
    return this;
} 
if(!this._namedListeners) return;
return this._namedListeners[name];
```

### <a name="_on"></a>::on(en, ef)
`en` Event name
 

Binds event name to event function
```javascript
if(!this._ev) this._ev = {};
if(!this._ev[en]) this._ev[en] = [];

this._ev[en].push(ef);
var me = this;

ef._unbindEvent = function() {
   me.removeListener(en,ef);    
}


if(en=="load") {
    if(this._imgLoaded) {
        this.trigger("load");
    }
}

// To stop the prop...
if(en=="click") this.bindSysEvent("click", function() {
        me.trigger("click");
    }, true);
    
if(en=="dblclick") this.bindSysEvent("dblclick", function() {
        me.trigger("dblclick");
    }, true);    
    
if(en=="mousedown") this.bindSysEvent("mousedown", function() {
        me.trigger("mousedown");
    });
    
if(en=="mouseup") this.bindSysEvent("mouseup", function() {
        me.trigger("mouseup");
    });
    
if(en=="checked") {
    
    this.bindSysEvent("change", function() {
        if(me._type=="checkbox") {
            if(me._dom.checked) {
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
    
if(en=="value") {
    this.bindSysEvent("change", function() {
        
        
        if(me._type=="checkbox") {
            if(me._dom.checked) {
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
    
    if(this._type=="input" || this._type=="textarea") {
            var lastValue="";
            this.bindSysEvent("keyup", function() {
                                    var bch = false;
                                    if(lastValue != me._dom.value) bch = true;
                                    me._value = me._dom.value;
                                    if(bch) me.trigger("value");
                                    lastValue = me._dom.value;
                    });                        
        

    }
}

if(en=="focus") {
    this.bindSysEvent("focus", function() {
        me._value = me._dom.value;
        me.trigger("focus");
    });
}  

if(en=="play") {
    this.bindSysEvent("play", function() {
        me.trigger("play");
    });
}         

if(en=="mousemove") {
    this.bindSysEvent("mousemove", function() {
        me.trigger("mousemove");
    });
} 

if(en=="blur") {
    this.bindSysEvent("blur", function() {
        me._value = me._dom.value;
        me.trigger("blur");
    });
}

if(en=="mouseenter") {
    if(this._dom.attachEvent) {
        this.bindSysEvent("mouseenter", function(e) {
                e = e || window.event;
                if(me._hover) return;
                me._event = e;
                me._hover = true;
                me.trigger("mouseenter");
            });
        this.bindSysEvent("mouseleave", function(e) {
                e = e || window.event;
                if(!me._hover) return;
                me._event = e;
                me._hover = false;
                me.trigger("mouseleave");
        });
    } else {

        this.bindSysEvent("mouseover", function(e) {
                 e = e || window.event;
                if(me._hover) return;
                me._hover = true;
                me._event = e;
                if(me._parent) {
                    if(!me._parent._hover) {
                        me._parent.trigger("mouseenter");
                    }
                    // me._parent._childHover = true;
                }
                // console.log("Mouse over xxx");
                me.trigger("mouseenter");
            });
        this.bindSysEvent("mouseout", function(e) {
                if(!me._hover) return;
                
                var childHover = false;
                me.forChildren( function(c) { if(c._hover) childHover = true; });
                
                if(childHover) return;
                
                me._hover = false;

                me.trigger("mouseleave");
            });                        
        
    }

        
}

return this;
```

### <a name="_onValue"></a>::onValue(scope, fn)


```javascript
if(!this._valueFn) {
    this._valueFn = {};
}
this._valueFn[scope] = fn;
```

### <a name="_removeAllHandlers"></a>::removeAllHandlers(t)


```javascript

if(this._ev) {
    // console.log("Removing handlers....");
    for(var n in this._ev) {
        if(this._ev.hasOwnProperty(n)) {
            var list = this._ev[n],
                me = this;
            //console.log("Removing list....", list);
            list.forEach( function(fn) {
                if(me._namedListeners) {
                    var ln = fn._listenerName;
                    if(me._namedListeners[ln]) {
                        delete me._namedListeners[ln];
                    }
                }
                if(fn._unbindEvent) {
                    //console.log("Calling unbind event... for ", fn);
                    fn._unbindEvent();
                }
            });
        }
    }
    for(var n in this._namedListeners) {
        if(this._namedListeners.hasOwnProperty(n)) {
            var fn = this._namedListeners[n];
            if(fn._unbindEvent) {
                    //console.log("Calling unbind event... for ", fn);
                    fn._unbindEvent();
            }
            delete this._namedListeners[n];
        }
    }
}
```

### <a name="_removeListener"></a>::removeListener(eventName, fn)


```javascript
if(this._ev && this._ev[eventName]) {
    var i = this._ev[eventName].indexOf(fn);
    if(i>=0) this._ev[eventName].splice(i,1);
    
    if(this._ev[eventName].length==0) {
        delete this._ev[eventName];
    }    
}
```

### <a name="_router"></a>::router(eventName, fn)


```javascript

var me = this;
this._dom.addEventListener(eventName, function(event) {
    var elem = event.target;
    if(!elem) return;
    var routeId = elem.getAttribute("data-routeid");
    if(routeId) {
        var obj = _routes[routeId];
        if(obj) fn(obj);
    }
});
```

### <a name="_setRoute"></a>::setRoute(obj, recursive)


```javascript

var routeId = this.guid();
this._dom.setAttribute("data-routeid", routeId);
if(!_routes) _routes = {}
if(recursive) {
    this.forChildren( function(ch) {
        ch.setRoute( obj, recursive );
    });
}
_routes[routeId] = obj;
```

### <a name="_trigger"></a>::trigger(en, data, fn)

triggers event with data and optional function
```javascript
if(this._delegates) {
    this._delegates.forEach( function(d) {
        if(d && d.trigger) d.trigger(en,data, fn);
    });
    // return;
}
if(!this._ev) return;
if(!this._ev[en]) return;
var me = this;
this._ev[en].forEach( function(cb) { 
    if(cb) {
        cb.apply( me, [me, data, fn] );
    }
});    
return this;
```

### <a name="_uniqueListener"></a>::uniqueListener(listenerName, fn)


```javascript
var oldList = this.namedListener(listenerName);
if(oldList) {
  if(oldList._unbindEvent) oldList._unbindEvent();
}
this.namedListener(listenerName, fn);
return fn;

```


    
    
    
## trait Table

The class has following internal singleton variables:
        
        
### <a name="InputHandling_bind"></a>InputHandling::bind(obj, varName, withFunction)

Binds input value to an object with data
```javascript
var o = this, me = this;

if(this.isFunction(obj[varName])) {

    
    var val = obj[varName](),
        o = this,
        fn = function(v) {
            obj[varName](v);
        },
        bSendingEvent = false,
        me = this;
  
    var isNumber = false;
        
    var oo = obj;

    var valueInListener = this.uniqueListener("bind:valueIn", function(obj, newVal) {

        if(bSendingEvent) return;
        
        if(me.isFunction( withFunction) ) {
             withFunction.apply( me, [newVal, me, obj]);
             val = newVal;
             return;
        }
        
        if(o._type=="checkbox") {
            if(typeof(newVal)=="string") {
                newVal = (newVal == "true" );
            }
            o.checked(newVal);
        } else {
            o.bindVal(newVal);
        } 
        val = newVal;
    });
    var valueOutListener = this.uniqueListener("bind:valueOut",function(obj,v) {

        //console.trace();
        bSendingEvent = true;
        if(o._type=="checkbox") {
            fn(o.checked());
        } else {
            fn(isNumber ? parseFloat( o.val() ) : o.val() );
        }
        bSendingEvent = false;
    });    
    
    var invalidInputListener = this.uniqueListener("bind:invalidIn",function(obj, msg) {
        o.trigger("invalid", msg);
    });
    var validInputListener = this.uniqueListener("bind:validIn",function(obj, newVal) {
        o.trigger("valid", newVal);
    });
    if(o._type=="checkbox") {
        obj.on(varName, valueInListener );
        this.on("value", valueOutListener);         
    } else {
        obj.on(varName, valueInListener );
        this.on("value", valueOutListener); 
    }

    if(me.isFunction( withFunction) ) {
         withFunction.apply( me, [val, me, obj]);
    } else {    
        if(o._type=="checkbox") {
            o.checked(val);
        } else {
            o.bindVal(val);
        }    
    }
    
    // and exit...
    return this;
}

var _ee_ = this.__singleton();
_ee_.bind(obj, varName, this);
var o = this;
this.on("datachange", function() {
    if(o._type=="checkbox") {
        if(obj[varName]) {
            o.checked(true);
        } else {
            o.checked(false);
        }
    } else {

        if(typeof(obj[varName])!="undefined") {
            o.val(obj[varName]);
        }
        
    }
});
this.on("value", function() {
    if(obj) {
        
        if(o._type=="checkbox") {
            
            if(o.checked()) {
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

if(obj) {
    if(o._type=="checkbox") {

        if(obj[varName]) {
            o.checked(true);
        } else {
            o.checked(false);
        }
    } else {

        if(obj[varName]) {
            o.val(obj[varName]);
        }
        
    }
}
return o;
```

### <a name="InputHandling_bindVal"></a>InputHandling::bindVal(v)


```javascript


if(typeof(this._dom.value)!="undefined" || this._type=="option") {
    this._dom.value = v;
} else {

    this._dom.style.whiteSpace="pre-wrap";
    this._dom.textContent = v;
}
this._value = v;
return this;
```

### <a name="InputHandling_blur"></a>InputHandling::blur(t)


```javascript
if(this._dom.blur) this._dom.blur();
```

### <a name="InputHandling_checked"></a>InputHandling::checked(v)


```javascript
if(typeof(v)=="undefined") {

    // if(typeof( this._checked)=="undefined") {
    this._checked = this._dom.checked;
    // this.trigger("value");
    return this._checked;
}

var nowOn = this._dom.checked;
this._dom.checked = v;

if( (nowOn && !v) || (!nowOn && v) ){
    this.trigger("value", nowOn);
} 

return this;
```

### <a name="InputHandling_clearOptions"></a>InputHandling::clearOptions(t)


```javascript
 if(this._dataList) {
    var node = this._dataList._dom;
    if(node.parentNode) node.parentNode.removeChild(node);
    this._options = {};
    this._dataList = null;
}    
```

### <a name="InputHandling_focus"></a>InputHandling::focus(t)

Focus into this element
```javascript
if(this._dom.focus) this._dom.focus();
```

### <a name="InputHandling_getClipboard"></a>InputHandling::getClipboard(name)


```javascript
return clipBoard( name );
```

### <a name="InputHandling_localStore"></a>InputHandling::localStore(withName)


```javascript


var cb = clipBoard(withName);

var val = cb.fromClipboard();
if(val) {
    this.val( val );
}

var me = this;
this.on("value", function() {
    cb.toClipboard( me.val() );
})

// toClipboard
return this;
```

### <a name="InputHandling_options"></a>InputHandling::options(list)


```javascript
// creates the input options for html5 usage...

if(this._tag=="input") {
    if(this._dataList) {
        var node = this._dataList._dom;
        if(node.parentNode) node.parentNode.removeChild(node);
        this._options = {};
        this._dataList = null;
    }
    if(!this._dataList) {
        this._options = {};
        this._dataList = _e("datalist");
        this._dataListId = this.guid();
        this._dataList.q.attr("id", this._dataListId);
        // console.log("DATA", list);
        if( Object.prototype.toString.call( list ) === '[object Array]' ) {
            var me = this;
            list.forEach( function(n) {
                var opt = _e("option");
                opt.q.attr("value", n);
                opt.text( n );
                me._options[n] = opt;
                me._dataList.add( opt );
            });
        } else {
             for( var n in list ) {
                if(this._options[n]) continue;
                if(list.hasOwnProperty(n)) {
                    var opt = _e("option");
                    opt.q.attr("value", n);
                    opt.text( list[n] );
                    this._options[n] = opt;
                    this._dataList.add( opt );
                }
            }                           
        }

        this.q.attr("list", this._dataListId);
        if(document.body) {
            document.body.appendChild( this._dataList._dom );
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
```

### <a name="InputHandling_toBacon"></a>InputHandling::toBacon(transformFn)


```javascript

var me = this;
later().asap( function() {
    if(typeof( me.val()) != "undefined" ) {
        me.trigger("value");
    }
});

return Bacon.fromBinder( function(sink) {
     me.on("value", function(o,v) {
         if(transformFn) {
             sink(transformFn( me.val()) );
         } else {
             sink(me.val());
         }
     });
     return function() {
         
     }
});
```

### <a name="InputHandling_val"></a>InputHandling::val(v)

Sets or gets the input value
```javascript
if(typeof(v)=="undefined"){
    if(this._type=="select" || this._type=="input" || this._type=="textarea") {
        this._value = this._dom.value;
    }
    return this._value;
}

if(typeof(this._dom.value)!="undefined" || this._type=="option") {
    this._dom.value = v;
} else {
    // this._dom.innerHTML = v;
}

this._value = v;
this.trigger("value", v);
return this;
```


    
    
    
    
    
## trait domShortcuts

The class has following internal singleton variables:
        
* _shInit
        
        
### <a name="domShortcuts_a"></a>domShortcuts::a(className, attrs)


```javascript
var el = this.shortcutFor("a", className, attrs);
return el;
```

### <a name="domShortcuts_attr"></a>domShortcuts::attr(v, v2)


```javascript

if(this.isObject(v)) {
   for(var n in v) {
       if(v.hasOwnProperty(n)) {
           this.attr(n, v[n]);
       }
   }
   
} else {
    if(this._tag=="canvas") {
        if(v=="width") {
            this._canWidth = parseInt(v2);
        }
        if(v=="height") this._canHeight = parseInt(v2);
    }
    this.q.attr(v,v2);
}
return this;
```

### <a name="domShortcuts_b"></a>domShortcuts::b(className, attrs)


```javascript
var el = this.shortcutFor("b", className, attrs);
return el;
```

### <a name="domShortcuts_button"></a>domShortcuts::button(className, attrs)


```javascript
var el = this.shortcutFor("button", className, attrs);
return el;
```

### <a name="domShortcuts_canvas"></a>domShortcuts::canvas(className, attrs)


```javascript
var el = this.shortcutFor("canvas", className, attrs);
el._canvas = true;
return el;
```

### <a name="domShortcuts_checkbox"></a>domShortcuts::checkbox(className, attrs)


```javascript
var el = this.shortcutFor("checkbox", className, attrs);
return el;
```

### <a name="domShortcuts_clearCanvas"></a>domShortcuts::clearCanvas(t)


```javascript
var ctx = this.ctx(),
    canvas = this._dom;
    
ctx.clearRect(0, 0, canvas.width, canvas.height);

return this;
```

### <a name="domShortcuts_ctx"></a>domShortcuts::ctx(t)


```javascript
if(this._dom.getContext) {
    return this._dom.getContext("2d")
}
```

### <a name="domShortcuts_div"></a>domShortcuts::div(className, attrs)


```javascript
var el = this.shortcutFor("div", className, attrs);
return el;
```

### <a name="domShortcuts_e"></a>domShortcuts::e(elemName, className, attrs)


```javascript

if(!this._isStdElem(elemName)) {
    
    // o.e("pri-buttom", {});
    
    var customElem = this._findCustomElem(elemName);
    if(customElem) {
        // customElem.css
        // customElem.tagName
        // customElem.init
        // customElem.baseCss
        if(customElem.init) {
            
            // create the element HTML tag
            var elem = _e(customElem.tagName);
            this.add(elem);
            if(customElem.baseCss) {
                elem.addClass( customElem.baseCss._nameSpace);
            }
            
            // then apply the component init routine
            customElem.init.apply(elem, [className || {}, customElem]);
            
            return elem;
        }
        
    }
    
}
var el = this.shortcutFor(elemName, className, attrs);
return el;
```

### <a name="domShortcuts_form"></a>domShortcuts::form(className, attrs)


```javascript
var el = this.shortcutFor("form", className, attrs);
return el;
```

### <a name="domShortcuts_getPixelFn"></a>domShortcuts::getPixelFn(pixelData)


```javascript

var ctx = this.ctx();

if(pixelData && pixelData._dom) {
    ctx = pixelData.ctx();
    pixelData = ctx.getImageData(0,0,pixelData._canWidth, pixelData._canWidth);
} else {
    // Get the context...
    if(!pixelData) pixelData = ctx.getImageData(0,0,this._canWidth,this._canWidth);
}

var data = pixelData.data;

return function(x,y) {
    var index = (x + y * pixelData.width) * 4;
    return  {
        x : x,
        y : y,
        r : data[index+0],
        g : data[index+1],
        b : data[index+2],
        a : data[index+3]
    };      
};

```

### <a name="domShortcuts_h1"></a>domShortcuts::h1(className, attrs)


```javascript
var el = this.shortcutFor("h1", className, attrs);
return el;
```

### <a name="domShortcuts_h2"></a>domShortcuts::h2(className, attrs)


```javascript
var el = this.shortcutFor("h2", className, attrs);
return el;
```

### <a name="domShortcuts_h3"></a>domShortcuts::h3(className, attrs)


```javascript
var el = this.shortcutFor("h3", className, attrs);
return el;
```

### <a name="domShortcuts_h4"></a>domShortcuts::h4(className, attrs)


```javascript
var el = this.shortcutFor("h4", className, attrs);
return el;
```

### <a name="domShortcuts_img"></a>domShortcuts::img(className, attrs)


```javascript
var el = this.shortcutFor("img", className, attrs);
return el;
```

### domShortcuts::constructor( t )

```javascript


```
        
### <a name="domShortcuts_input"></a>domShortcuts::input(className, attrs)


```javascript
var el = this.shortcutFor("input", className, attrs);
return el;
```

### <a name="domShortcuts_label"></a>domShortcuts::label(className, attrs)


```javascript
var el = this.shortcutFor("label", className, attrs);
return el;
```

### <a name="domShortcuts_li"></a>domShortcuts::li(className, attrs)


```javascript
var el = this.shortcutFor("li", className, attrs);
return el;
```

### <a name="domShortcuts_ol"></a>domShortcuts::ol(className, attrs)


```javascript
var el = this.shortcutFor("ol", className, attrs);
return el;
```

### <a name="domShortcuts_p"></a>domShortcuts::p(className, attrs)


```javascript
var el = this.shortcutFor("p", className, attrs);
return el;
```

### <a name="domShortcuts_pre"></a>domShortcuts::pre(className, attrs)


```javascript
var el = this.shortcutFor("pre", className, attrs);
return el;
```

### <a name="domShortcuts_processPixels"></a>domShortcuts::processPixels(fn, pixelData, doNotUpdate)


```javascript

var ctx = this.ctx();

// Get the context...
if(!pixelData) pixelData = ctx.getImageData(0,0,this._canWidth,this._canHeight);

var data = pixelData.data;
var index = 0;
for(var y=0; y<this._canHeight; y++) {
    for(var x=0; x<this._canWidth; x++) {
        var r = data[index],
            g = data[index+1],
            b = data[index+2],
            a = data[index+3];
            
        var p =  {
              x : x,
              y : y, 
              r : r, 
              g : g, 
              b : b, 
              a : a };
        fn(p);
        if(p.r != r ) data[index] = p.r;
        if(p.g != g ) data[index+1] = p.g;
        if(p.b != b ) data[index+2] = p.b;
        if(p.a != a ) data[index+3] = p.a;
        
        index+=4;
    }
}
if(!doNotUpdate) {
    console.log(this._canWidth, this._canHeight);
    ctx.putImageData(pixelData, 0, 0, 0, 0, this._canWidth, this._canHeight );
}
return pixelData;
```

### <a name="domShortcuts_row"></a>domShortcuts::row(params)


```javascript
var args = Array.prototype.slice.call(arguments);
if(this._tag == "table") {
    this.addRow(args);
    return this;
}

var tbl = this.table();
tbl.addRow(args);
return tbl;
```

### <a name="domShortcuts_shortcutFor"></a>domShortcuts::shortcutFor(name, className, attrs)


```javascript
var el = _e(name);
this.add(el);


var constr = [],
    classes = [],
    attrList = [];
    
var args = Array.prototype.slice.call(arguments);
args.shift();
var me = this;

args.forEach( function( a, i ) {
    if(classes.length==0 && (typeof a == "string" ) ) {
        classes.push(a);
        return;
    }
    if(classes.length==0 && me.isStream( a ) ) {
        classes.push(a);
        return;
    }  
    if(attrList.length==0 && me.isObject( a ) && (!me.isFunction( a )) ) {
        attrList.push(a);
        return;
    }  
    if(constr.length==0 &&  me.isFunction( a ) ) {
        constr.push(a);
        return;
    }     
});

classes.forEach( function(c) { el.addClass( c )});
attrList.forEach( function(myAttrs) {     
      for(var n in myAttrs) {
        if(myAttrs.hasOwnProperty(n)) {
            if(name=="input" && (n=="type" && myAttrs[n]=="checkbox")) {
                el._type = "checkbox";
            }
            el.attr(n, myAttrs[n]);
        }
    }});
constr.forEach( function(c) {     
      c.apply(el, [el]);
    });

return el;
```

### <a name="domShortcuts_span"></a>domShortcuts::span(className, attrs)


```javascript
var el = this.shortcutFor("span", className, attrs);
return el;
```

### <a name="domShortcuts_src"></a>domShortcuts::src(src)


```javascript
if(this._tag=="img") {
    if(!this._hasLoadL) {
        var me = this;
        me._imgLoaded = false;
        this.__singleton().addEventListener(this._dom, "load", function() {
                me.trigger("load");
                me._imgLoaded = true;
            });
        this._hasLoadL = true;
    }
}

if(this._tag=="canvas") {
    var img = _e("img"),
        me = this;
    me._imgLoaded = false;
    img.src(src);
    img.on("load", function() {

        var im = img._dom;

        //me.width(im.width);
        //me.height(im.height);
        
        if(!me._canWidth) {

            me.q.attr("width",im.width);
            me.q.attr("height",im.height);            
            
            me._canWidth  = im.width;
            me._canHeight = im.height;            
        }
        
        var ctx = me._dom.getContext("2d");
        ctx.drawImage(im, 0,0, im.width, im.height, 0, 0, me._canWidth, me._canHeight);
        me.trigger("load");
        me._imgLoaded = true;
    });
    return this;
}
this.q.attr("src",src);

return this;
```

### <a name="domShortcuts_strong"></a>domShortcuts::strong(className, attrs)


```javascript
var el = this.shortcutFor("strong", className, attrs);
return el;
```

### <a name="domShortcuts_table"></a>domShortcuts::table(className, attrs)


```javascript
var el = this.shortcutFor("table", className, attrs);
return el;
```

### <a name="domShortcuts_textarea"></a>domShortcuts::textarea(className, attrs)


```javascript
var el = this.shortcutFor("textarea", className, attrs);
return el;
```

### <a name="domShortcuts_toDataURL"></a>domShortcuts::toDataURL(format, quality)


```javascript

if(!quality) quality = 1;

return this._dom.toDataURL(format || "image/png", quality);
```

### <a name="domShortcuts_ul"></a>domShortcuts::ul(className, attrs)


```javascript
var el = this.shortcutFor("ul", className, attrs);
return el;
```

### <a name="domShortcuts_video"></a>domShortcuts::video(className, attrs)


```javascript
var el = this.shortcutFor("video", className, attrs);
return el;
```


    
    
    
## trait domContent

The class has following internal singleton variables:
        
        
### <a name="domContent__setDomText"></a>domContent::_setDomText(elem, text)


```javascript
if( typeof(elem.textContent)!="undefined") {
   elem.textContent = text;
} else {
   var html = text;
   var div = document.createElement("div");
   div.innerHTML = html;
   var newText = div.innerText || "";
   elem.innerHTML = newText;    
}
```

### <a name="domContent_html"></a>domContent::html(h)


```javascript

// test if the value is a stream
if(this.isStream(h)) {
    var me = this;
    // TODO: check if we are re-binding two streams on the same element, possible error
    h.onValue( function(t) {
        // 
        me.clear();
        me.add( t );
        //me._dom.innerHTML = t;
        //me._html = t;
    });
    return this;
}

if(this.isFunction(h)) {
    
    var val = h();
    var oo = h(null, true), 
        me = this;
    oo.me.on(oo.name, me.uniqueListener("text:value",function(o,v) {
        me._dom.innerHTML = v;
    }));
    this._dom.innerHTML = val;
    return this;
}

if (typeof(h) == "undefined") return this._dom.innerHTML;
this._dom.innerHTML = h;
return this;
```

### <a name="domContent_text"></a>domContent::text(t)


```javascript
if(typeof(t)=="undefined") return this._html;

var args = Array.prototype.slice.call(arguments);

if(args.length > 1 ) {

    var bHadNonS = false, me = this;
    args.forEach( function(o) {
        if(me.isObject(o) && !me.isStream(o)) bHadNonS = true;
    });
    
    if(bHadNonS) {
        this.clear();
        this.add( args );
        return this;
    }
    t = this.str( args );
}

if(this.isObject(t)) {
    if(t.onValue) {
        var me = this;
        // TODO: check if we are re-binding two streams on the same element, possible error
        t.onValue( function(t) {
            if(me._svgElem || typeof(me._dom.textContent)!="undefined") {
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

if(this.isFunction(t)) {
    
    var val = t();
    var oo = t(null, true), 
        me = this,
        soon = later(),
        bTSpan = false;
        
    if(me._tag == "tspan") bTSpan = true;
        
    if(this._svgElem || typeof(me._dom.textContent)!="undefined") {
         oo.me.on(oo.name, me.uniqueListener("text:value",function(o,v) {
            if(bTSpan) v = v.trim(); 
            // soon.add(me.text, me, v);
            if(bTSpan && (!v || v.length==0) ) {
                me._dom.textContent = '\u00A0';
               
            } else {
                me._dom.textContent = v;
            }
         }));         
    } else {
        oo.me.on(oo.name, me.uniqueListener("text:value",function(o,v) {
            var html = v;
            var div = document.createElement("div");
            div.innerHTML = html;
            var newText = div.textContent || div.innerText || "";        
            me._dom.innerHTML = newText;
        }));        
    }
        
    if(this._svgElem || typeof(this._dom.textContent)!="undefined") {
        if(bTSpan) val = val.trim(); 
        if(bTSpan && (!val || val.length==0) ) {
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

if(this._svgElem || typeof(this._dom.textContent)!="undefined") {
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
```


    
    
    
## trait viewsNavis

The class has following internal singleton variables:
        
* lastView
        
* bInited
        
* _settingView
        
* _eventState
        
* _windowSize
        
* _mediaListeners
        
* mql
        
* _transitionOn
        
* _pageViews
        
* _pageControllers
        
* _ctrlObjs
        
* _viewStructures
        
* _contentRouters
        
* _viewFactory
        
* _viewCache
        
* _dynamicFactory
        
        
### <a name="viewsNavis__refreshView"></a>viewsNavis::_refreshView(oldObj)


```javascript

if(!oldObj) oldObj = this;

// The object should have _refreshView property
if(!oldObj._refeshView) return;

/*
    obj._refeshView = {
        name : name,
        factoryName : name,
        paramName : paramName,
        view : view
    }
*/
var currentRole = oldObj.getRole();

// the original view where the object was pushed into
var view = oldObj._refeshView.view;
if(!view) {
    return;
}
if(!_viewCache) _viewCache = {};

var obj, wf;
var me = this, cache_key;
var factoryName = oldObj._refeshView.factoryName,
    paramName = oldObj._refeshView.paramName,
    activeLayout = oldObj._refreshView.activeLayout;
    
if(!paramName) paramName = "";

if(this.isObject( factoryName) ) {
    obj = factoryName;
    cache_key = currentRole+"."+factoryName+"."+paramName;
} else {
    
    // find the view factory...
    wf = this.findViewFactory( factoryName, currentRole );
    
    // factory function object has the cache
    if(wf && !wf._viewCache) wf._viewCache = {};

    // views with same params will be cached
    cache_key = currentRole+"."+factoryName+"."+paramName;

    if(wf) {
        if(wf._viewCache[cache_key]) {
            obj = wf._viewCache[cache_key];
        } else {
            var f = wf;
            if(f) {
                obj = f( paramName );
                if(obj) {
                    wf._viewCache[cache_key] = obj;
                }
            }
        }
    }
}

if(obj) {
    
    //if(!activeLayout.parts) activeLayout.parts = {};
    //activeLayout.parts[name] = view;
    
    // view = the div or element the object created by the factory is pushed into
    // for example "top" in layout top 100% | content 100%
    // view.pushView( obj );
    
    // --- not using the "pushView"
    oldObj.replaceWith( obj );
    
    // to emulate React.js behaviour...
    if(obj.componentDidMount) {
        obj.componentDidMount();
    }
    obj.trigger("mount");
    
    // in case the view should be refreshed with some other 
    obj._refeshView = oldObj._refeshView;

    if(wf && wf._dynamic && !wf._binded) {
        wf._binded = true;
        wf._dynamic.on("body", function(o,v) {
            try {
                var newF = new Function(v);
                var newObj = newF( paramName );
                if(newObj) {
                    obj.replaceWith( newObj );
                    obj = newObj;
                    
                    wf._container._viewFactory[factoryName] = newF;
                    if(newF && !newF._viewCache) newF._viewCache = {};
                    newF._viewCache[cache_key] = newObj;
                }
            } catch(e) {
                
            }
        });
    }
}
```

### <a name="viewsNavis_contentRouter"></a>viewsNavis::contentRouter(name, fn)


```javascript

if(!_contentRouters) _contentRouters  = {};
if(this.isFunction(name)) {
    _contentRouters["default"] = name;
} else {
    _contentRouters[name] = fn;
}
```

### <a name="viewsNavis_createLayout"></a>viewsNavis::createLayout(name, fn)


```javascript
if(!_viewStructures) _viewStructures = {}

var holder = _e();
var view;
if(this.isFunction(fn)) {
   view = fn();
} else {
   view = fn;
}

_viewStructures[name] = {
    view : view,
    viewHolder : holder
}
```

### <a name="viewsNavis_factoryLoader"></a>viewsNavis::factoryLoader(data)

This is very opinionated function to load _data from some store
```javascript

// load the factories from the _data()
var me = this;
return data.then( function(res) {
    data.forTree( function(t) {
        if(t.get("type")=="function") {
            var wf = new Function(t.get("body") );
            wf._dynamic = t;
            me.viewFactory( t.get("name"), wf );
        }            
    });
});
```

### <a name="viewsNavis_fiddle"></a>viewsNavis::fiddle(options)


```javascript
var iframe = _e("iframe"); 
var myId = this.guid();

var html = decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chead%3E"); 

if(options.scripts) options.scripts.forEach( function(s) {
    html+=decodeURIComponent("%3Cscript%20src%3D'")+s+decodeURIComponent("'%3E%3C%2Fscript%3E");
});
if(options.stylesheets) options.stylesheets.forEach( function(s) {
    html+='<link rel="stylesheet" href="'+s+'"></link>';
});
if(options.head) html+=options.head;
html+="</head><body>";

if(!options.callBackName) options.callBackName = "fiddleDone";

if(options.onReady && options.callBackName ) {
    var ls = window['localStorage'];
    var waitFor = function() {
        var res;
        if( res = ls.getItem(myId) ) {
            later().removeFrameFn( waitFor );
            options.onReady( JSON.parse( res ) );
        }
    }
    later().onFrame(waitFor);
    html += decodeURIComponent("%3Cscript%3E")+"function "+options.callBackName+"(v){window['localStorage'].setItem('"+myId+"', JSON.stringify(v));}";
    html += decodeURIComponent("%3C%2Fscript%3E");
}

if(options.html) html+=options.html;
if(options.jsCode) html+=decodeURIComponent("%3Cscript%3E")+options.jsCode+decodeURIComponent("%3C%2Fscript%3E");
html+="</body></html>";
this.addItem(iframe);

iframe._dom.contentWindow.document.open();
iframe._dom.contentWindow.document.write(html);
iframe._dom.contentWindow.document.close();    

iframe.width(options.width || 800).height(options.height || 600);

return this;
```

### <a name="viewsNavis_findViewByName"></a>viewsNavis::findViewByName(name, layout)


```javascript

if(layout.hasClass(name)) {
    return layout;
} else {
    var o = null, i=0, ch;
    
    while( ch = layout.child( i++ )) {
        if(ch.hasClass(name)) return ch;
    }
    i=0;
    while( ch = layout.child( i++ )) {
        var res = ch.findViewByName(name, ch);
        if(res) return res;
    }    
    // console.log("could not find ", name, " from layout");
}
```

### <a name="viewsNavis_findViewFactory"></a>viewsNavis::findViewFactory(name, role)


```javascript

if(!role) {
    role = this.getRole();
    if(!role) role = "default";
}

if(this._viewFactory && this._viewFactory[role]) {
    var ff = this._viewFactory[role][name];
    if(ff) {
        return ff;
    }
}
var p = this.parent();
if(p) return p.findViewFactory(name, role);

if(_viewFactory[role]) {
    return _viewFactory[role][name];
}

return null;
```

### <a name="viewsNavis_getLayouts"></a>viewsNavis::getLayouts(t)


```javascript
return _viewStructures;
```

### <a name="viewsNavis_getRole"></a>viewsNavis::getRole(t)


```javascript
if(this._role) {
    return this._role;
}
var p = this.parent();
if(p) return p.getRole();
```

### <a name="viewsNavis_getRouteObj"></a>viewsNavis::getRouteObj(t)


```javascript
var parts = document.location.hash.split("/");

var toParamsObj = function(a) {
    var o = {};
    for(var i=0; i<a.length;i+=2) o[a[i]] = a[i+1]; 
    return o;
}
return {
        hash : document.location.hash,
        parts : parts.slice(),
        controller : parts.shift().substring(1),
        action : parts.shift(),
        params : toParamsObj( parts ),
        rest : parts
     };
```

### viewsNavis::constructor( t )

```javascript

if(!_eventState) {
    var me = this;
    this.eventBinder(window, "hashchange", function() {
        if( ("#"+_eventState.lastSetValue) ==  document.location.hash) return;
        if(_eventState.pushing) return;
        
        _eventState.routers.forEach( function(fn) {
             fn(me.getRouteObj());
        });
    });
    _eventState = {
        inited : true,
        routers : []
    }
    _pageViews = {};
    _ctrlObjs = [];
    _pageControllers = [];
    this.onRoute( function(r) {
        // console.log("on route with ", r);
        _ctrlObjs.forEach( function(obj) {
            var pc = obj._pageController;
            var rFn = pc[r.controller] || pc["default"];
            if(rFn) {
                // console.log("pageController ", rFn);
                var action = rFn.ctrl[r.action] || rFn.ctrl["default"];
                // console.log("action ", action);
                if(action) {
                    action.apply( rFn.canvas, [ r.params, rFn.canvas, r ] );
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
```
        
### <a name="viewsNavis_initScreenEvents"></a>viewsNavis::initScreenEvents(t)


```javascript
// object.addEventListener("resize", myScript);
// if(window.matchMedia) {
_windowSize = {
    w : 0,
    h : 0
};

var _widthLimits = [700];

var eventCnt = 0;

_mediaListeners = [];
if(window.matchMedia) {
     mql = window.matchMedia("(max-width:700px)");
     mql.addListener(function(q) {
         eventCnt++;
         if(q.matches) {
            _mediaListeners.forEach( function(fn) {
                fn({ w : window.innerWidth || document.documentElement.clientWidth, 
                     h : window.innerHeight || document.documentElement.clientHeight,
                     limit : 700,
                     width_less : true,
                     eCnt : eventCnt
                     }); 
            });              
         } else {
             _mediaListeners.forEach( function(fn) {
                 fn({ w : window.innerWidth || document.documentElement.clientWidth, 
                      h : window.innerHeight || document.documentElement.clientHeight,
                      limit : 700,
                      width_more : true,
                      eCnt : eventCnt
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
        
        _widthLimits.forEach( function(w) {
            var ch = (w - width) * (w - _windowSize.w);
            if(ch<0) {
                limit = w;
                doAlert = true;
            }
        });
        
        _windowSize.w = window.innerWidth || document.documentElement.clientWidth;
        _windowSize.h = window.innerHeight || document.documentElement.clientHeight;
        
        if(doAlert) {
            _mediaListeners.forEach( function(fn) {
                var data = {
                    limit :limit,
                    w : _windowSize.w,
                    h : _windowSize.h,
                    eCnt : eventCnt
                };
                if(_windowSize.w>limit) {
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
```

### <a name="viewsNavis_layout"></a>viewsNavis::layout(layoutName, layoutDef)


```javascript

if(!layoutDef) {
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
vParts.forEach( function(pDef) {
    
    var row = base.div(); // <-- or the factory name...
    pDef.split(",").forEach( function(layItem) {
        
        layItem = layItem.trim();
        var parts = layItem.split(" ");
        var partName = parts[0];
        
        // => the layout item using just a CSS class etc.
        var elem = row.div(partName);
        elem._dom.style.display = "inline-block";
        elem._dom.style.verticalAlign = "top";
        
        if(parts.length>1) {
            parts.shift();
            var prosStr = parts.join(""); // 10% => 10
            elem.width(prosStr);
        } else {
            
        }
    });
    
})
this.createLayout( layoutName, base );
this.setLayout( layoutName );

// ==> should set the layout object here...

return this;

// => returns the layout object to modify the layout if necessary...


```

### <a name="viewsNavis_onMediaChange"></a>viewsNavis::onMediaChange(fn)


```javascript

_mediaListeners.push(fn);
```

### <a name="viewsNavis_onRoute"></a>viewsNavis::onRoute(fn)


```javascript

_eventState.routers.push(fn);
var me = this;
later().add( 
    function() {
        fn(me.getRouteObj());
    } );

```

### <a name="viewsNavis_pageController"></a>viewsNavis::pageController(page, controllerObj)


```javascript

if(!this._pageController) this._pageController = {};

this._pageController[page] = {
    ctrl : controllerObj,
    canvas : this
};

if(_ctrlObjs.indexOf( this ) < 0) {
    _ctrlObjs.push(this);
};
```

### <a name="viewsNavis_popView"></a>viewsNavis::popView(toView)


```javascript


if(!this._views || this._views.length==0) {
    if(this._parent) {
        this._parent.popView();
        return this;
    }
    this._views = [];
    return this;
}       

var ms = (new Date()).getTime();
if(_transitionOn && ( ms - _transitionOn < 1000)) return;
_transitionOn = ms;

var cont = this;
var lastView = this;
var view = this._views.pop();

var showP = true;
var me = this;

if(!this._poppedViews) this._poppedViews = _e();

cont.forChildren(function(ch) {
    
    ch.removeClass("viewOut");
    ch.removeClass("viewIn");
    ch.addClass("viewOut");
    
    if(showP) {
        later().after(0.2, function() {
            // console.log("Old view child count ", view.oldChildren._children.length);
            var addThese = [];
            view.oldChildren.forChildren( function(ch) {
                ch.show();
                addThese.push(ch);
            });
            addThese.forEach( function(c) {
                cont.add( c );
                c.removeClass("viewOut");
                c.removeClass("viewIn");
                c.addClass("viewIn");                
            });
            
            if(view.oldTitle && me.setTitle) me.setTitle(view.oldTitle);                
            showP = false;
            later().after(0.2, function() {
                _transitionOn = 0;
                if(addThese[0]) addThese[0].scrollTo();
            });
        });
    }
    later().after(0.2, function() {
        // ch.remove();
        me._poppedViews.add( ch );
    });
    
});



```

### <a name="viewsNavis_push"></a>viewsNavis::push(model, viewName)


```javascript

var fn = this.findViewFactory(viewName);
if(fn) {
    var modelId;
    if(model.getID) {
        modelId = model.getID();
    } else {
        modelId = model;
    }
    var newView = fn.apply( null, [modelId] );
    this.pushView( newView );
}
return this;

```

### <a name="viewsNavis_pushTo"></a>viewsNavis::pushTo(name, factoryName, paramName)
`name` Name of the layout element, for example &quot;top&quot;, &quot;content&quot; or &quot;bottom&quot;
 
`factoryName` Name of the view factory created with viewFactory
 
`paramName` Parameter name for the view
 


```javascript

if(this.isObject(paramName)) {
    var mm = paramName;
    if(paramName.model) {
        mm = paramName.model
    }
    if(mm.getID) paramName = mm.getID();
}

if(!this._activeLayout) {
    var p = this.parent();
    if(p) {
        p.pushTo(name, factoryName, paramName);
    }
    return this;
} else {

    var currentRole = this.getRole();
    if(!currentRole) currentRole = "default";
    
    var view = this.findViewByName( name, this._activeLayout.view );
    
    if(!view) {
        return;
    }
    
    if(!_viewCache) _viewCache = {};
    
    var obj, wf;
    var me = this, cache_key;
    
    if(!paramName) paramName = "";
    if(this.isObject( factoryName) ) {
        obj = factoryName;
        cache_key = currentRole+"."+factoryName+"."+paramName;
    } else {
        
        // returns the function which creates the view
        wf = this.findViewFactory( factoryName, currentRole );
        if(!wf) wf = this.findViewFactory( factoryName, "default" );
        // factory function object has the cache
        if(wf && !wf._viewCache) wf._viewCache = {};
   
        // views with same params will be cached
        cache_key = currentRole+"."+factoryName+"."+paramName;
   
        if(wf) {
            if(wf._viewCache[cache_key]) {
                obj = wf._viewCache[cache_key];
            } else {
                var f = wf;
                if(f) {
                    obj = f( paramName );
                    if(obj) {
                        wf._viewCache[cache_key] = obj;
                    }
                }
            }
        }
    }
    
    if(obj) {
        
        if(!this._activeLayout.parts) this._activeLayout.parts = {};
        this._activeLayout.parts[name] = view;
        
        // view = the div or element the object created by the factory is pushed into
        // for example "top" in layout top 100% | content 100%
        view.pushView( obj );
        
        // to emulate React.js behaviour...
        if(obj.componentDidMount) {
            obj.componentDidMount();
        }
        obj.trigger("mount");
        
        // in case the view should be refreshed with some other 
        obj._refeshView = {
            name : name,
            factoryName : factoryName,
            paramName : paramName,
            view : view,
            activeLayout : this._activeLayout
        }

        if(wf && wf._dynamic && !wf._binded) {
            wf._binded = true;
            wf._dynamic.on("body", function(o,v) {
                try {
                    var newF = new Function(v);
                    var newObj = newF( paramName );
                    if(newObj) {
                        obj.replaceWith( newObj );
                        obj = newObj;
                        
                        wf._container._viewFactory[factoryName] = newF;
                        if(newF && !newF._viewCache) newF._viewCache = {};
                        newF._viewCache[cache_key] = newObj;
                    }
                } catch(e) {
                    
                }
            });
        }
    }
}

```

### <a name="viewsNavis_pushView"></a>viewsNavis::pushView(newView, params, oldViewHolder)


```javascript

if(!this._views) {
    this._views = [];
}

if(newView == this) return;
if(newView == lastView) return;

var cont = this;
if(cont._children && cont._children[0]==newView) {
    // console.error("... pushing view failed because this view had already the child view???.... ", newView);
    return;
}

if(this.isFunction(newView)) {
    newView = newView();
}

var ms = (new Date()).getTime();
if(this._transitionOn && ( ms - this._transitionOn < 1000)) return;
this._transitionOn = ms;

if(!params) params = null;

var oldChildren = oldViewHolder || _e();

var viewData = {
    parentView : null,
    oldTitle : this.__currentTitle,
    oldChildren : oldChildren,
    params : params
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
            
            me._transitionOn = 0;
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
if(!hadChildren) {

    later().after(0.3, function() {
        newView.removeClass("viewIn");
        newView.removeClass("viewOut");
        newView.addClass("viewIn");
        cont.add(newView);
        
        newView.show();

        later().after(0.2, function() {
            me._transitionOn = 0;
            newView.scrollTo();
        });        
    });
}

_eventState.pushing = false;

return this;
```

### <a name="viewsNavis_removeControllersFor"></a>viewsNavis::removeControllersFor(o)


```javascript
var i = _ctrlObjs.indexOf( o );

if(i>=0) {
    _ctrlObjs.splice(i, 1);
}
```

### <a name="viewsNavis_scrollTo"></a>viewsNavis::scrollTo(noThing)
`noThing` Not a param
 

Make the window scroll to this element
```javascript
if(window) {
    var box = this.offset();
    var currLeft = window.pageXOffset;

    this.addClass("lastScrollTarget");
    var me = this;
    setTimeout(function() {
        me.removeClass("lastScrollTarget");
    },1000);
    
    var toY = box.top;
    if(toY<window.innerHeight/2) {
        return;
    }
    if(box.top<window.innerHeight) {
        toY = toY / 2;
    } else {
        toY = toY - window.innerHeight*0.2
    }
    if(parseInt(toY) < 300) toY = 0;
    window.scrollTo(currLeft || 0, parseInt(toY));
}
```

### <a name="viewsNavis_setLayout"></a>viewsNavis::setLayout(name)


```javascript
var me = this;
// ok, need to think about how to create this thing
if(_viewStructures && _viewStructures[name]) {
    
    var layout = _viewStructures[name];
    
    if(this._activeLayout == layout) return this;
    
    this._activeLayout = layout;
    this._children.length = 0;
    this._children[0] = layout.view;
    layout.view._parent = this;
    if(this._dom.firstChild ) this._dom.removeChild( this._dom.firstChild );
    this._dom.appendChild( layout.view._dom );

}
```

### <a name="viewsNavis_setRole"></a>viewsNavis::setRole(name)

The role the user interface is currently at
```javascript

if(this._role && this._role != name) {
    this._role = name;
    // update subviews to correspond this role view...
    this._refreshView();
    this.forChildren( function(ch) {
        ch._refreshView();
    }, true);
} else {
    this._role = name;
}

```

### <a name="viewsNavis_viewFactory"></a>viewsNavis::viewFactory(role, name, fn)

one could call it like 
o.viewFactory(&quot;children&quot;, &quot;messages&quot;, function() {

});
```javascript

if(this.isFunction(name)) {
    fn = name;
    name = role;
    role = "default";
}

if(!_viewFactory) _viewFactory = {};
if(!_viewFactory[role]) _viewFactory[role] = {};

if(!this._viewFactory) this._viewFactory = {};
if(!this._viewFactory[role]) this._viewFactory[role] = {};

var me = this;
this._viewFactory[role][name] = function(id) {
    if(me.isObject(id)) {
        return fn( id.getID() );
    } else {
        return fn(id);
    }
}
_viewFactory[role][name] = function(id) {
    if(me.isObject(id)) {
        return fn( id.getID() );
    } else {
        return fn(id);
    }
}
fn._container = this;

```


    
    
    
## trait mvc_trait

The class has following internal singleton variables:
        
* _modelTemplates
        
* _viewContent
        
* _viewTemplates
        
* _namedModels
        
* _namedViews
        
* _dataLink
        
* _customDirectives
        
        
### <a name="mvc_trait_createItemView"></a>mvc_trait::createItemView(item)


```javascript
var vf = this.getViewFunction(item),
    me = this,
    newView;
if(vf) {
    newView = vf(item);
    
    if(item.viewClass) {
        if(this.isFunction(item.viewClass)) {
            var oo = item.viewClass(null, true);
            var oldClass = item.viewClass();
            var myEventH = function(o,v) {
                if(oldClass!=v) {
                    var nv = me.createItemView(item);
                    oldClass = v;
                    newView.replaceWith(nv);
                    newView = nv;
                    oo.me.removeListener(oo.name, myEventH);
                }
            };
            oo.me.on(oo.name, myEventH );
        }
    }

}
return newView;
```

### <a name="mvc_trait_data"></a>mvc_trait::data(v)


```javascript
if(typeof(v) != "undefined") {
    this.__mdata = v;
    return this;
}
return this.__mdata;
```

### <a name="mvc_trait_findModelFactory"></a>mvc_trait::findModelFactory(name)


```javascript

if(this._modelFactory) {
    var ff = this._modelFactory[name];
    if(ff) {
        return ff;
    }
}
var p = this.parent();
if(p) return p.findModelFactory(name);

return null;
```

### <a name="mvc_trait_fromStream"></a>mvc_trait::fromStream(stream, viewFn)


```javascript

var me = this;

stream.onValue( function(data) {
    var newView = viewFn( data );
    later().add( function() {
        me.clear();
        me.add( newView );
    });
});
```

### <a name="mvc_trait_getViewFunction"></a>mvc_trait::getViewFunction(item)


```javascript
if(this.isFunction(this._view)) {
    return this._view;
}
if(item.viewClass) {
    var vf;
    if(vf=this._view[item.viewClass()])
        return vf;
}
// if no other options...
for(var n in this._view) {
    if(this._view.hasOwnProperty(n)) {
        var vf = this._view[n];
        if(this.isFunction(vf)) {
            return vf;
        }
    }
}
```

### mvc_trait::constructor( t )

```javascript

```
        
### <a name="mvc_trait_model"></a>mvc_trait::model(name, params)


```javascript

var me = this;
return _promise( function(result, reject) {
    
    var getModel = function() {
            // returns the function which creates the view
            var wf = me.findModelFactory( name );
            
            if(wf) {
                // could have functions etc.
                if(!wf._obj) wf._obj = {};
                var bAutoCache = wf._autoCache;
                var key = params || "undefined";
                try {
                    if(bAutoCache) {
                        if(wf._obj._autoCache) {
                            var cachedModel = wf._obj._autoCache[key];
                            if(cachedModel) {
                                result({ model : cachedModel });
                                return;
                            }
                        }
                    }                    
                    wf.apply(wf._obj, [params, function(resModel) {
                        if(bAutoCache) {
                            if(!wf._obj._autoCache) wf._obj._autoCache = {};
                            wf._obj._autoCache[key] = resModel;
                        }
                        result({ model : resModel });
                    }, reject]);
                } catch(e) {
                    reject(e);
                }
                
            } else {
                reject({ reason : "not found"});
            }
        };
    if(me.parent()) {
        getModel();
    } else {
        me.on("parent", getModel);
    }
});

```

### <a name="mvc_trait_modelFactory"></a>mvc_trait::modelFactory(name, fn, autoCache)


```javascript

if(!this._modelFactory) this._modelFactory = {};

this._modelFactory[name] = fn;
fn._container = this;
fn._autoCache = autoCache;
```

### <a name="mvc_trait_modelFactoryLoader"></a>mvc_trait::modelFactoryLoader(data)


```javascript
// load the factories from the _data()
var me = this;
return data.then( function(res) {
    data.forTree( function(t) {
        if(t.get("type")=="function") {
            var wf = new Function(t.get("body") );
            wf._dynamic = t;
            me.modelFactory( t.get("name"), wf );
        }            
    });
});
```

### <a name="mvc_trait_mv"></a>mvc_trait::mv(model, type, controller)


```javascript

var o, fn, elemName = "div";
if(this.isFunction(type)) {
    fn = type;
} else {
    if(this.isFunction(controller)) {
        elemName = type;
        fn = controller;
    } else {
        if(typeof(type) == "string") {
            fn = this.findViewFactory(type);
            if(fn) {
                var newItem = fn.apply( null, [model] );
                this.add( newItem );
            }
            return this;
        }
    }
}

if(fn) {
    this.mvc( model, function(item) {
        var o = _e(elemName);
        fn.apply( o, [item] );
        return o; 
    });
}

```

### <a name="mvc_trait_mvc"></a>mvc_trait::mvc(model, view, controller)


```javascript

var me = this;
if(view) {
    this._view = view;
}

if(model) {
    // assume now that it is array 
    this._model = model;
    
    // TODO: sort, delete, move...
    if(this._model.on) {
        this._model.on("insert", function(o,i) {
            var item = me._model.item(i);
            var nv = me.createItemView(item);
            if(nv) {
                me.insertAt(i,nv);
            } 
        });
        
        this._model.on("move", function(o, cmd) {

            var old = me.child(cmd.from),
                after = me.child(cmd.to);

            if(!after || !old) {
                return;
            }
            
            if(cmd.to < cmd.from) {
                after.insertBefore(old);
            } else {
                after.insertAfter(old);
            }
        });
        this._model.on("remove", function(o,i) {

            var ch = me.child(i);
            if(ch) {
                ch.remove(); 
            }
        });
        this._model.on("sort", function(o,ops) {
            
            if(ops.length==0) return;
            
            if(me.isObject(ops[0][1])) return;
            
            var tmpOps = new Array();
            
            for(var i=0; i<ops.length;i++) {
                if(ops[i][1]==ops[i][2]) {
                    ops[i][0] = null;
                    continue;
                }
                tmpOps[i] = new Array(3);
                tmpOps[i][1] = me.child(ops[i][1]);
                tmpOps[i][2] = me.child(ops[i][2]);
            } 
            
            // console.log("Sort with", ops, JSON.stringify(ops));
            for(var i=0; i<tmpOps.length;i++) {
                var c1 = tmpOps[i][1],
                    c2 = tmpOps[i][2],
                    cmd = ops[i][0];
                if(cmd=="a") {
                   c2.insertBefore(c1); 
                } 
                if(cmd=="b") {
                   c2.insertAfter(c1); 
                }
            }            

        });
    }
    
    if(this._model.forEach) {
        this._model.forEach( function(item) {
            var nv = me.createItemView(item);
            if(nv) {
                me.add(nv);
            }            
        });
    }
    
}

if(controller) {
    this._controller = controller;
}
return this;
```

### <a name="mvc_trait_tree"></a>mvc_trait::tree(treeData, itemFn, options)


```javascript
var _dragState = {};      
var _dragOn;

options = options || {};

var showTree = function(item, currLevel) {
    
    var subData, 
        subDataElem,
        dragHandle;
    
    var subList = [];
    
    var li;
    
    var myObj = {
        subTree : function(dataList, elem) {
            subList.push([dataList, elem]);
        },
        drag : function(elem, options) {
            dragHandle = elem;
        }
    }
    
    li = itemFn.apply(myObj, [item, currLevel] ); 
    li.on("click", function() {
        _dragState.lastActive = item;
    });
    li.on("mouseenter", function() {
        if(dragHandle) {
            if(_dragOn && !_dragState.dropTarget) {
                li.addClass("draggedOn");
               _dragState.dropTarget = item;
               _dragState.dropElem = li;            
            } else {
                li.addClass("mouseOn");
            }
        }
    });
    
    li.on("mouseleave", function() {
        li.removeClass("mouseOn");
        li.removeClass("draggedOn");
        _dragState.dropTarget = null;
    });
    

    if(dragHandle) {
        dragHandle.drag(function(dragInfo) {
            if(dragHandle) {
               // do something here with dragInfo
               if(dragInfo.start && !_dragState.item) {
                   _dragOn = true;
                   _dragState.item = item;
                   _dragState.srcElem = li;
               }
               if(dragInfo.end) {
                   _dragOn = false;
                   if(_dragState.dropTarget && _dragState.item) {
                      
                       if(_dragState.dropTarget.parent() == _dragState.item.parent()) {
                           if(_dragState.dropTarget != _dragState.item) {
                                var new_i = _dragState.dropTarget.indexOf();
                                _dragState.item.moveToIndex(new_i);
                           }
                       } else {
                           if(_dragState.dropTarget.items) {
                              _dragState.item.remove();
                              _dragState.dropTarget.items.push( _dragState.item );
                           }
                       }
                      
                   }
                   _dragState.item = null;
                   _dragState.dropTarget = null;
               }
            }
        });
    }
    subList.forEach( function(a) {

            var subDataElem = a.pop();
            var subData     = a.pop();

            if(subData && subDataElem ) {
                var subTree = subDataElem;
                // maybe these are not really necessary...
                if(subData.length()>0) {
                    li.addClass("hasChildren");
                }
                subDataElem.on("insert", function() {
                    li.addClass("hasChildren");
                });
                subDataElem.on("remove", function() {
                    if(item.items.length()==0) {
                        li.removeClass("hasChildren");
                    }       
                })    
                if(options.clickToOpen) subTree.hide();
                subDataElem.mvc( subData, function(item) {
                    return showTree(item,currLevel+1);
                });                  
                var sub_vis = item.get("open");
                if(options.clickToOpen) {
                    item.on("open", function(o,v) {
                        if(v) {
                            subTree.show();
                        } else {
                            subTree.hide();
                        }
                    });
                }
                // is the "open" a good thing to have for the tree?
                li.on("click", function() {
                    if(options.clickToOpen) {
                        sub_vis = !sub_vis;
                        item.set("open", sub_vis);
                    }
                });
                if(sub_vis) subTree.show();        
            }  
        
    })



    return li;
}
this.mvc( treeData, function(item) {
    return showTree(item,1);
});        


```


    
    
    
## trait svgShortcuts

The class has following internal singleton variables:
        
        
### <a name="svgShortcuts_circle"></a>svgShortcuts::circle(className, attrs)


```javascript
var el = this.shortcutFor("circle", className, attrs);
return el;
```

### <a name="svgShortcuts_defs"></a>svgShortcuts::defs(className, attrs)


```javascript
var el = this.shortcutFor("defs", className, attrs);
return el;
```

### <a name="svgShortcuts_feGaussianBlur"></a>svgShortcuts::feGaussianBlur(className, attrs)


```javascript
var el = this.shortcutFor("feGaussianBlur", className, attrs);
return el;
```

### <a name="svgShortcuts_feMerge"></a>svgShortcuts::feMerge(className, attrs)


```javascript
var el = this.shortcutFor("feMerge", className, attrs);
return el;
```

### <a name="svgShortcuts_feMergeNode"></a>svgShortcuts::feMergeNode(className, attrs)


```javascript
var el = this.shortcutFor("feMergeNode", className, attrs);
return el;
```

### <a name="svgShortcuts_feOffset"></a>svgShortcuts::feOffset(className, attrs)


```javascript
var el = this.shortcutFor("feOffset", className, attrs);
return el;
```

### <a name="svgShortcuts_filter"></a>svgShortcuts::filter(className, attrs)


```javascript
var el = this.shortcutFor("filter", className, attrs);
return el;
```

### <a name="svgShortcuts_g"></a>svgShortcuts::g(className, attrs)


```javascript
var el = this.shortcutFor("g", className, attrs);
return el;
```

### <a name="svgShortcuts_image"></a>svgShortcuts::image(className, attrs)


```javascript
var el = this.shortcutFor("image", className, attrs);
return el;
```

### <a name="svgShortcuts_line"></a>svgShortcuts::line(className, attrs)


```javascript
var el = this.shortcutFor("line", className, attrs);
return el;
```

### <a name="svgShortcuts_path"></a>svgShortcuts::path(className, attrs)


```javascript
var el = this.shortcutFor("path", className, attrs);
return el;
```

### <a name="svgShortcuts_rect"></a>svgShortcuts::rect(className, attrs)


```javascript
var el = this.shortcutFor("rect", className, attrs);
return el;
```

### <a name="svgShortcuts_svg"></a>svgShortcuts::svg(className, attrs, none)


```javascript
var el = this.shortcutFor("svg", className, attrs);
return el;
```

### <a name="svgShortcuts_svg_text"></a>svgShortcuts::svg_text(className, attrs)


```javascript
var el = this.shortcutFor("text", className, attrs);
return el;
```

### <a name="svgShortcuts_tspan"></a>svgShortcuts::tspan(className, attrs)


```javascript
var el = this.shortcutFor("tspan", className, attrs);
return el;
```


    
    
    
## trait util_fns

The class has following internal singleton variables:
        
        
### <a name="util_fns_guid"></a>util_fns::guid(t)


```javascript
return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
```

### <a name="util_fns_isArray"></a>util_fns::isArray(someVar)


```javascript
return Object.prototype.toString.call( someVar ) === '[object Array]';
```

### <a name="util_fns_isFunction"></a>util_fns::isFunction(fn)


```javascript
return Object.prototype.toString.call(fn) == '[object Function]';
```

### <a name="util_fns_isObject"></a>util_fns::isObject(obj)


```javascript
return obj === Object(obj);
```

### <a name="util_fns_isStream"></a>util_fns::isStream(obj)


```javascript

if(this.isObject(obj)) {
    if(obj.onValue && obj.bufferWithTime) return true;
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
```

### <a name="util_fns_str"></a>util_fns::str(params)


```javascript

var args;
if(this.isArray(params)) {
    args = params;
} else {
    args = Array.prototype.slice.call(arguments);
}

// Supports Bacon.js streams at the moment...
var bHadStream = false, me = this;
var indexes = [], streams = [], all = [];
args.forEach( function(item, i) {
    if(me.isStream(item)) {
        bHadStream = true;
        all.push("");
    } else {
        all.push(item);
    }
});
if(!bHadStream) return args.join("");

return Bacon.fromBinder(function(sink) {
    
    args.forEach( function(item, i) {
        if(me.isStream(item)) {   
            item.onValue( function(v) {
                all[i] = v;
                sink(all.join(""));
            })
        }
    });
    
    later().add( function() {
        sink(all.join(""));
    });

    return function() {
        
    };
});



```

### <a name="util_fns_whenLoaded"></a>util_fns::whenLoaded(imgList, fn)


```javascript

var cnt = imgList.length;

imgList.forEach( function(im) {
    im.on("load", function() {
        cnt--;
        if(cnt==0) {
            fn(imgList);
        }
    }) 
});

if(imgList.length==0) fn([]);

```


    
    
    
    
    
    
    
## trait colors_trait

The class has following internal singleton variables:
        
* colors
        
        
### <a name="_colorMix"></a>::colorMix(c1, c2, t)


```javascript

var from = this.toRGB(c1),
    to = this.toRGB(c2);
    
var res = this.yuvConversion2(from,to, function(y1,y2) {
    return {
        y : (1-t)*y1.y + t*y2.y,
        u : (1-t)*y1.u + t*y2.u,
        v : (1-t)*y1.v + t*y2.v
    }
});

return res;
```

### <a name="_colorToHex"></a>::colorToHex(color)


```javascript
if (color.substr(0, 1) === '#') {
    return color;
}
var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

var red = parseInt(digits[2]);
var green = parseInt(digits[3]);
var blue = parseInt(digits[4]);

var rgb = blue | (green << 8) | (red << 16);
return digits[1] + '#' + rgb.toString(16);
```

### <a name="_colourNameToHex"></a>::colourNameToHex(colour)


```javascript

if (typeof colors[colour.toLowerCase()] != 'undefined')
    return colors[colour.toLowerCase()];

return false;
```

### <a name="_componentToHex"></a>::componentToHex(c)


```javascript
c = parseInt(c);
var hex = c.toString(16);
return hex.length == 1 ? "0" + hex : hex;
```

### <a name="_dim"></a>::dim(colorName, brightness)


```javascript
return this.yuvConversion( colorName, function(yuv) {
        yuv.y = yuv.y - brightness;
        return yuv;
    });
```

### <a name="_hexToRgb"></a>::hexToRgb(hex)


```javascript
if (hex[0]=="#") hex=hex.substr(1);
if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
}
if(!hex) return null;
if(hex==null) return;
var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);

return {
    r: parseInt(triplets[0],16),
    g: parseInt(triplets[1],16),
    b: parseInt(triplets[2],16)
}
```

### <a name="_hexToYuv"></a>::hexToYuv(hexVal)


```javascript
var me = this;
return me.rgbToYuv( me.toRGB(hexVal) );
```

### <a name="_hsvToRgb"></a>::hsvToRgb(c)


```javascript
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

if(s == 0) {
    // Achromatic (grey)
    r = g = b = v;
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

h /= 60; // sector 0 to 5
i = Math.floor(h);
f = h - i; // factorial part of h
p = v * (1 - s);
q = v * (1 - s * f);
t = v * (1 - s * (1 - f));

switch(i) {
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

return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
```

### ::constructor( t )

```javascript

if(!colors) {
    colors = {"none": "#ffffff", "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};
    }
```
        
### <a name="_mix"></a>::mix(c1, c2, amount)


```javascript

if(typeof(amount)=="undefined") amount = 0.5;

return this.yuvConversion2( c1,c2, function(y1,y2) {
    return {
        y : (1-amount) * y1.y + amount * y2.y,
        u : (1-amount) * y1.u + amount * y2.u,
        v : (1-amount) * y1.v + amount * y2.v
    }
})
```

### <a name="_rgbToHex"></a>::rgbToHex(p)


```javascript
var me = this;
return "#" + me.componentToHex(p.r) + me.componentToHex(p.g) + me.componentToHex(p.b);
```

### <a name="_rgbToHsv"></a>::rgbToHsv(c)


```javascript
var rr, gg, bb,
    r = c.r / 255,
    g = c.g / 255,
    b = c.b / 255,
    h, s,
    v = Math.max(r, g, b),
    diff = v - Math.min(r, g, b),
    diffc = function(c){
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
    }else if (g === v) {
        h = (1 / 3) + rr - bb;
    }else if (b === v) {
        h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
        h += 1;
    }else if (h > 1) {
        h -= 1;
    }
}
return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
};
```

### <a name="_rgbToYuv"></a>::rgbToYuv(c)


```javascript
var R = c.r / 255;
var G = c.g / 255;
var B = c.b / 255;
return { y : 0.299 * R + 0.587 * G + 0.114 * B,
         u  : -0.14713  * R - 0.28885 * G + 0.436*B,
         v:  0.615 * R - 0.51499*G - 0.10001*B  }
```

### <a name="_toRGB"></a>::toRGB(c)


```javascript
if(typeof(c)=="object") return c;
var me = this;

var hex = me.colourNameToHex(c);
if(!hex) {
    hex = me.colorToHex(c);
}
return me.hexToRgb(hex);
```

### <a name="_toRSpace"></a>::toRSpace(v)


```javascript
return Math.max(0, Math.min(255, Math.round(v)));
```

### <a name="_yuvConversion"></a>::yuvConversion(c, fn)


```javascript
var me = this;
var yuv = me.rgbToYuv( me.toRGB(c) );
yuv = fn(yuv);
var rgb = me.yuvToRgb( yuv );
return me.rgbToHex( rgb );
```

### <a name="_yuvConversion2"></a>::yuvConversion2(c1, c2, fn)


```javascript
var me = this;
var yuv = me.rgbToYuv( me.toRGB(c1) );
var yuv2 = me.rgbToYuv( me.toRGB(c2) );
yuv = fn(yuv, yuv2);
var rgb = me.yuvToRgb( yuv );
return me.rgbToHex( rgb );
```

### <a name="_yuvPixelConversion"></a>::yuvPixelConversion(c, fn)


```javascript
var yuv = me.rgbToYuv( c );
yuv = fn(yuv);
var rgb = me.yuvToRgb( yuv );
c.r = rgb.r;
c.g = rgb.g;
c.b = rgb.b;
return c;
```

### <a name="_yuvToRgb"></a>::yuvToRgb(c)


```javascript
var Y = c.y;
var U = c.u;
var V = c.v;

return {    r : this.toRSpace(255*(Y+ 0 * U + 1.13983 * V)),
            g : this.toRSpace(255*(Y -0.39465 * U  -0.58060 * V)),
            b : this.toRSpace(255*(Y + 2.03211 * U  )) }
```


    
    
    
    
    
## trait ajax_methods

The class has following internal singleton variables:
        
* x
        
* _ajaxHook
        
* _uploadHook
        
        
### <a name="__initAjax"></a>::_initAjax(t)


```javascript
if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();  
}
var versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",   
    "MSXML2.XmlHttp.4.0",  
    "MSXML2.XmlHttp.3.0",   
    "MSXML2.XmlHttp.2.0",  
    "Microsoft.XmlHttp"
];

var xhr;
for(var i = 0; i < versions.length; i++) {  
    try {  
        xhr = new ActiveXObject(versions[i]);  
        break;  
    } catch (e) {
    }  
}
return xhr;
```

### <a name="__traditionalUpload"></a>::_traditionalUpload(options)


```javascript

var o = _e();
var form = o.form("",{
    "action" :  options.url,
    "enctype" : "multipart/form-data",
    "method" : "POST",
    "name" : o.guid()
});

var maxCnt = options.maxCnt || 20;
var chStr = "complete"+this.guid();

var onComplete = function(v) {
   delete window[chStr];
   if(options.progress) {
        var info = {
            loadPros : 100,
            ready : true
        };
        options.progress( info );   
   }
   if(options.done) {
       options.done(v);
   }  
};

window[chStr] = onComplete;
form.input("", {
    type : "hidden",
    value : chStr,
    name : "onComplete"
});

if(options.vars) {
    for(var n in options.vars) {
        if(options.vars.hasOwnProperty(n)) {
            form.input("", {
                type : "hidden",
                value : options.vars[n],
                name : n
            });
        }
    }
}
var uplFields = form.div("form-group");

var maxFileCnt = options.maxFileCnt || 5,
    fileCnt = 0;

// <input type="file" name="my-file" size="50" maxlength="25" /> <br />

var fieldNumber = 1;
var createUploadField = function() {
    if(fileCnt>=maxFileCnt) return;
    // <label for="exampleInputFile">File input</label>
    var inp = uplFields.input("", {
         type : "file",
         name : options.fieldName || "newFile"+(fieldNumber++),
         size : 50
    });
    inp.on("value", function() {
        if(options.autoupload) {
            o.uploadFiles();
        } else {
            if(fileCnt<maxCnt) createUploadField(); 
        }
    });
    
    fileCnt++;
}

createUploadField();
var iFrame = _e("iframe");
var frame_id = o.guid();
iFrame.q.attr("id", frame_id);
iFrame.q.attr("name", frame_id);
iFrame.absolute().x(-4000).y(-4000);

var loadCnt = 0;

// iFrame._dom.onreadystatechange = MyIframeReadyStateChanged;
iFrame._dom.addEventListener("load", function() {
    loadCnt++;
    if(loadCnt==1) return;
    
    if(options.done) {
        var ifrm = iFrame._dom;
        var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
        // var form = doc.getElementById('demoForm');        
       if(options.progress) {
            var info = {
                loadPros : 100,
                ready : true
            };
            options.progress( info );   
       }        
       if(options.done) options.done(doc.body.innerHTML);
    }
})
o.add( iFrame );

o.uploadFiles = function(vars) {


    var hook = _uploadHook[options.url];
    if(hook) {
        
        var sendData = {
            traditional : true,
            postData : {},
            files : []
        };
        if(options.vars) {
             if(options.vars) {
                for(var n in options.vars) {
                    if(options.vars.hasOwnProperty(n)) {
                        sendData.postData[n] = options.vars[n];
                    }
                }
            }           
        }        
        uplFields.forEach(
            function(input) {
                if(!input._dom.files) return;
                var len = input._dom.files.length;
                for(var fi=0; fi<len; fi++) {
                    var file = input._dom.files[fi];
                    if (file) {
                        sendData.files.push(file);
                    }
                } 
            });
        
        try {
            var progress = 0;
            var sendI = setInterval(
                function() {
                    progress+= Math.random()*(options.uploadSpeed || 10);
                    if(progress>100) progress = 100;
                    
                    if(progress == 100) {
                        var res = hook(sendData);
                        if(options.done) {
                            options.done(res);
                        } 
                        clearInterval(sendI);
                    }
                    if(options.progress) options.progress({
                                                loadPros : parseInt( progress ),
                                                ready : parseInt( progress ) == 100
                                            }); 
                               
                },30);
        } catch(e) {
            if(options.error) {
                options.error(e.message);
            }              
        }
        return;
    }    
    
    if(vars) {
        for(var n in vars) {
            if(vars.hasOwnProperty(n)) {
                form.input("", {
                    type : "hidden",
                    value : vars[n],
                    name : n
                });
            }
        }        
    }
    form._dom.target = frame_id; //'my_iframe' is the name of the iframe
	form._dom.submit();
	/*
	uplFields.clear();
	fileCnt=0;
	createUploadField();
	*/
}

if(options.getUploader) {
    options.getUploader(o.uploadFiles);
}
o.on("upload", function(o, v) {
    o.uploadFiles( v || {} );   
});
return o;


```

### <a name="_ajaxHook"></a>::ajaxHook(url, handlerFunction)


```javascript
if(!_ajaxHook) {
    _ajaxHook = {};
}

if(!_ajaxHook[url]) {
    _ajaxHook[url] = [];
}

_ajaxHook[url].unshift( handlerFunction );

```

### <a name="_createUploader"></a>::createUploader(options)


```javascript

if(options.testTraditional || typeof(window.FormData) == "undefined") {
    return this._traditionalUpload(options);
}

// The file uploader
var inp = _e("input").addClass("uploader-field");
inp.q.attr("type", "file");

// uploader basic settings
inp._uploadGUID = "uploadField"+this.guid();
inp.q.attr("id", inp._uploadGUID);
inp.q.attr("name", inp._uploadGUID);

if(options.audio) {
   inp.q.attr("capture", "microphone");
   inp.q.attr("accept", "audio/*");    
}
if(options.video) {
   inp.q.attr("capture", "camcorder");
   inp.q.attr("accept", "video/*");    
}
if(options.images) {
   inp.q.attr("capture", "camera");
   inp.q.attr("accept", "image/*");
}

/*
<p>Capture Image: <input type="file" accept="image/*" id="capture" capture="camera"> 
<p>Capture Audio: <input type="file" accept="audio/*" id="capture" capture="microphone"> 
<p>Capture Video: <input type="file" accept="video/*" id="capture" capture="camcorder"> 
*/

// upload handler here...
var upload = function(uploadElement) {

    var hook = _uploadHook[options.url];
    if(hook) {
        
        var sendData = {
            postData : {},
            files : []
        };
        if(options.vars) {
             if(options.vars) {
                for(var n in options.vars) {
                    if(options.vars.hasOwnProperty(n)) {
                        sendData.postData[n] = options.vars[n];
                    }
                }
            }           
        }        
        var len = uploadElement.files.length;
        for(var fi=0; fi<len; fi++) {
            var file = uploadElement.files[fi];
            if (file) {
                sendData.files.push(file);
            }
        } 
        try {
            var progress = 0;
            var sendI = setInterval(
                function() {
                    progress+= Math.random()*(options.uploadSpeed || 10);
                    if(progress>100) progress = 100;
                    
                    if(progress == 100) {
                        var res = hook(sendData);
                        if(options.done) {
                            options.done(res);
                        } 
                        clearInterval(sendI);
                    }
                    if(options.progress) options.progress({
                                                loadPros : parseInt( progress ),
                                                ready : parseInt( progress ) == 100
                                            }); 
                               
                },30);
        } catch(e) {
            if(options.error) {
                options.error(e.message);
            }              
        }
        return;
    }

    var len = uploadElement.files.length;
    for(var fi=0; fi<len; fi++) {
        var file = uploadElement.files[fi];
        if (file) {
            var formData = new window.FormData();
            if(options.vars) {
                 if(options.vars) {
                    for(var n in options.vars) {
                        if(options.vars.hasOwnProperty(n)) {
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
                        if(options.done) {
                            options.done(xhr.responseText);
                        }
                    } else {
                        if(options.error) {
                            options.error(xhr.responseText, xhr );
                        }                    
                    }
                }
            };
            xhr.open('POST', options.url);
            if(options.progress && xhr.upload) {
                xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                var done = (e.loaded / e.total) * 100;
                                var info = {
                                    loadPros : done,
                                    ready : false
                                };
                                if(e.loaded==e.total) {
                                    info.ready = true;
                                }
                                options.progress( info );
                            }
                        }            
            }
            xhr.send(formData);
        }
    }
}

inp._dom.addEventListener('change', function(event) {
    
    if(options.autoupload) {
        if(event.target.files.length == 1 ) {
            upload(inp._dom);
        }
    }
    if(options.onSelectFile) {
        var len = inp._dom.files.length;
        for(var fi=0; fi<len; fi++) {
            var file = inp._dom.files[fi];   
            options.onSelectFile( file, file.type );
        }
    }

	});
inp.on("upload", function() {
    if(inp._dom.files.length >= 1 ) {
        upload(inp._dom);
    }    
});
return inp;

```

### <a name="_fileObjectThumbnail"></a>::fileObjectThumbnail(width, height, fileObject)


```javascript
var reader = new FileReader();
var myImage = _e("img");
var me = this;

myImage.width( width );
myImage.height( height );

reader.onload = function(event){
    var img = myImage._dom;
    img.onload = function(){
        me.add( myImage );
    }
    img.src = event.target.result;
}
reader.readAsDataURL(fileObject);    
return myImage;
```

### <a name="_get"></a>::get(url, data, callback)


```javascript
var query = [];
if(this.isFunction(data)) {
    callback = data;
    this.send(url, callback, 'GET', null);
} else {
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    this.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null);
}
return this;


```

### <a name="_getJSON"></a>::getJSON(url, data, callback)


```javascript
var query = [];
if(this.isFunction(data)) {
    callback = data;
    this.send(url, function(r) {
        callback(JSON.parse(r));
    }, 'GET', null);
} else {
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    this.send(url + (query.length ? '?' + query.join('&') : ''), function(r) {
        callback(JSON.parse(r));
    }, 'GET', null);
}
return this;

```

### <a name="_post"></a>::post(url, data, callback, errCallback)


```javascript

if(_ajaxHook && _ajaxHook[url]) {
    try {
        for( var i=0; i<_ajaxHook[url].length;i++) {
            var ff = _ajaxHook[url][i];
            var res = ff( data );
            if(res) {
                callback( res );
                return;
            }
        }
    } catch(e) {
        errCallback(e);
    }
    return this;
}

var query = [];
for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
}
this.send(url, callback, 'POST', query.join('&'), errCallback);

return this;

```

### <a name="_postJSON"></a>::postJSON(url, data, callback, errCallback)


```javascript

if(_ajaxHook && _ajaxHook[url]) {
    try {
        for( var i=0; i<_ajaxHook[url].length;i++) {
            var ff = _ajaxHook[url][i];
            var res = ff( data );
            if(res) {
                callback( res );
                return;
            }
        }
    } catch(e) {
        errCallback(e);
    }
    return this;
}
this.send(url, function(result) {
    try {
        var data = JSON.parse(result);
        callback(data);
    } catch(e) {
        errCallback(e);
    }
}, 'POST', JSON.stringify(data), errCallback);

return this;

```

### <a name="_send"></a>::send(url, callback, method, data, errorCallback)


```javascript
var x = this._initAjax();
x.open(method, url);
x.onreadystatechange = function() {
    if (x.readyState == 4) {
        if (x.status==200) {
            callback(x.responseText)
        } else {
            errorCallback(x);
        }
    }
};
if (method == 'POST') {
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
```

### <a name="_uploadHook"></a>::uploadHook(url, handlerFunction)


```javascript
if(!_uploadHook) {
    _uploadHook = {};
}

_uploadHook[url] = handlerFunction;
```


    
    
    
## trait web_comp

The class has following internal singleton variables:
        
* _customElems
        
        
### <a name="__findCustomElem"></a>::_findCustomElem(name)


```javascript
// might be also hierarchy based
// if(this._customElems) 

// ?? could you delay the execution of the initialization code to the point
// the element is actually attached to the tree?

if(this._customElems) {
    var e = this._customElems[name];
    if(e) return e;
}
var p = this.parent();
if(p) return p._findCustomElem(name);


```

### <a name="_customElement"></a>::customElement(elemName, options)


```javascript
debugger;

if(!this._customElems) this._customElems = {};

// options.css = factory object for creating CSS styles for the element
// options.init = factory to create the actual user interface element
// options.tagName = tag name to use to create the element, if

// do not re-create this time the element
if(this._customElems[elemName]) return;

// this would create the factory for the custom element to be used
this._customElems[elemName] = options;

// register the element creation process...
if(document.registerElement) {
    // custom elements can be used to create the element eventually
    options._customElems = true;
} else {
    
}

// create the CSS if necessary to the namespace of the element
if(options.css) {
    var baseCss = this.css(elemName);
    options.css(baseCss);
    options.baseCss = baseCss;
}

```


    
    


   
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
# Class _qc


The class has following internal singleton variables:
        
        
### <a name="_qc_attr"></a>_qc::attr(n, v)


```javascript


if(!isNaN(n)) {
    if(typeof(console)!="undefined" && typeof(console.trace)!="undefined") {
        //console.log("Attr set to ", n);
        //console.trace();
    }
    return;
}

if(this._host._svgElem) {
    
    if(this._host.isObject(v)) {
        if(v.onValue) {
            // Assume it is a stream...
            var me = this;
            v.onValue( function(val) {
                if(typeof(val)!="undefined" && ( val !== null) ) {
                    if(n=="xlink:href") {
                        me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
                     } else {
                        me._dom.setAttributeNS(null, n,val);
                     }
                }
            });            
            
            return this;
        }
    }
    
    if(this._host.isArray(v)) {

        var oo = v[0],
            fName = v[1],
            val = oo[fName](),
            me = this,
            domi = me._dom,
            host = this._host,
            list;

        if(n=="xlink:href") {
            list = host.uniqueListener("attr:"+n, function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newV);      
                }
            });            
        } else {
            list = host.uniqueListener("attr:"+n,function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS(null, n, newV);
                }
            });            
        }
        oo.on(fName, list);
        if(typeof(val)!="undefined" && ( val !== null) ) {
            if(n=="xlink:href") {
                this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
             } else {
                this._dom.setAttributeNS(null, n,val);
             }
        } else {
            
        }
        return this;        
    }
    
    if( this._host.isFunction(v) ) {
        
        var val = v();
        var oo = v(null, true),
            me = this,
            domi = me._dom,
            host = this._host,
            list;
        //console.log("setting attr for ", oo.me._guid, "for ", oo.name);
        
        if(n=="xlink:href") {
            list = host.uniqueListener("attr:"+n, function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newV);      
                }
            });            
        } else {
            list = host.uniqueListener("attr:"+n,function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS(null, n,newV);
                }
            });            
        }
        oo.me.on(oo.name, list);
        if(typeof(val)!="undefined" && ( val !== null) ) {
            if(n=="xlink:href") {
                this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
             } else {
                this._dom.setAttributeNS(null, n,val);
             }
        } else {
            
        }
        return this;
    }
    if(typeof(v)!="undefined") {
        if(n=="xlink:href"){
            this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', v);
        } else {
           this._dom.setAttributeNS(null,n,v); 
        }
    }
        
    return this;    
}


if(this._host.isArray(v)) {
    
    // console.log("Taking array as ", v);
    
    var oo = v[0],
        fName = v[1],
        val = oo[fName](),
        me = this,
        domi = me._dom,
        host = this._host,
        list;


    list = host.uniqueListener("attr:"+n,function(o,newV) {
        if(typeof(newV)!="undefined" && ( newV !== null) ) {
            domi.setAttribute(n, newV);
        }
    });            
    oo.on(fName, list);
    if(typeof(val)!="undefined" && ( val !== null) ) {
        if(n=="xlink:href") {
            this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
         } else {
            this._dom.setAttributeNS(null, n,val);
         }
    } 
    return this;
}
       
    
if(this._host.isObject(v)) {
    if(v.onValue) {
        // Assume it is a stream...
        var me = this;
        v.onValue( function(val) {
            if(typeof(val)!="undefined" && ( val !== null) ) {
                if(n=="xlink:href") {
                    me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
                 } else {
                    me._dom.setAttributeNS(null, n,val);
                 }
            }
        });            
        
        return this;
    }
}

if( this._host.isFunction(v) ) {
    
    var val = v();
    var oo = v(null, true),
        me = this,
        domi = me._dom,
        host = this._host;
        
    var list = host.uniqueListener("attr:"+n,function(o,newV) {
        if(typeof(newV)!="undefined")
            domi.setAttribute(n,newV);
    });        
    oo.me.on(oo.name, list);
    if(typeof(val)!="undefined" && isNaN(n))
        this._dom.setAttribute(n,val);
    return this;
}
if(typeof(v)!="undefined" && isNaN(n) )
    this._dom.setAttribute(n,v);
return this;
```

### <a name="_qc_bindSysEvent"></a>_qc::bindSysEvent(en, fn, stop)


```javascript
en = en.toLowerCase();
if(!this._sys) this._sys = {};
if(this._sys[en]) return false;

this._sys[en] = true;

var me = this;

if(this._dom.attachEvent) {
    this._dom.attachEvent("on"+en, function(e) {
        e = e || window.event;
        me._event = e;
        fn();
        if(stop) {
            e = window.event;
            if(e) e.cancelBubble = true;
        }
        });
} else {
    this._dom.addEventListener(en, function(e) {
            e = e || window.event;
            me._event = e;
            if(stop) {
                if(e && e.stopPropagation) {
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
```

### <a name="_qc_blur"></a>_qc::blur(t)


```javascript
if(this._dom.blur) this._dom.blur();
```

### <a name="_qc_css"></a>_qc::css(n, v)


```javascript
if(n=="background-color") n = "backgroundColor";
if(n=="margin-left") n = "marginLeft";
if(n=="font-size") {
    n = "fontSize";
    v = this.pxParam(v);
}

if(n=="left"||n=="top"||n=="bottom"||n=="right"||n=="width"||n=="height") {
    
    v = this.pxParam(v);
}
    
if(v.substring) {
 if(v.substring(0,3)=="NaN") {
     return;
 }
}
this._dom.style[n] = v;
return this;
```

### <a name="_qc_focus"></a>_qc::focus(t)


```javascript
if(this._dom.focus) this._dom.focus();
```

### <a name="_qc_get"></a>_qc::get(index)


```javascript
return this._dom;
```

### _qc::constructor( myDom, host )

```javascript
this._dom = myDom;
this._host = host;
```
        
### <a name="_qc_pxParam"></a>_qc::pxParam(v)


```javascript

if(v=="auto") return v;

if(typeof(v.slice)!="undefined") {
   if(v.slice(-1)=="%") {
        return v;
    }
    if(v.slice(-2)=="em") {
        return v;
    }
    if(v.slice(-2)=="px") {
        return v;
    }
}

if(isNaN( parseInt(v)) ) {
    return "";
}
if(typeof(v)=="string") {
    return parseInt(v)+"px";
} else {
    var i = parseInt(v);
    if(!isNaN(i)) {
        // this._dom.style.width = i+"px";
        return i+"px";
    }
}
```



   


   



      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
# Class later


The class has following internal singleton variables:
        
* _initDone
        
* _callers
        
* _oneTimers
        
* _everies
        
* _framers
        
* _localCnt
        
        
### <a name="later_add"></a>later::add(fn, thisObj, args)


```javascript
if(thisObj || args) {
   var tArgs;
   if( Object.prototype.toString.call( args ) === '[object Array]' ) {
       tArgs = args;
   } else {
       tArgs = Array.prototype.slice.call(arguments, 2);
       if(!tArgs) tArgs = [];
   }
   _callers.push([thisObj, fn, tArgs]);   
} else {
    _callers.push(fn);
}
```

### <a name="later_after"></a>later::after(seconds, fn, name)


```javascript

if(!name) {
    name = "aft7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0,
    remove : true
};
```

### <a name="later_asap"></a>later::asap(fn)


```javascript
this.add(fn);

```

### <a name="later_every"></a>later::every(seconds, fn, name)


```javascript

if(!name) {
    name = "t7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0
};
```

### later::constructor( interval, fn )

```javascript
if(!_initDone) {

   _localCnt=1;
   this.polyfill();
 
   var frame, cancelFrame;
   if(typeof(window) != "undefined") {
       var frame = window['requestAnimationFrame'], 
           cancelFrame= window['cancelRequestAnimationFrame'];
       ['', 'ms', 'moz', 'webkit', 'o'].forEach( function(x) { 
           if(!frame) {
            frame = window[x+'RequestAnimationFrame'];
            cancelFrame = window[x+'CancelAnimationFrame'] 
                                       || window[x+'CancelRequestAnimationFrame'];
           }
        });
   }
 
    if (!frame)
        frame= function(cb) {
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
       while(fn=_callers.shift()) {
          if(Object.prototype.toString.call( fn ) === '[object Array]' ) {
              fn[1].apply(fn[0], fn[2]);
          } else {
              fn();
          }
           
       }
       
       for(var i=0; i<_framers.length;i++) {
           var fFn = _framers[i];
           fFn();
       }
       
       for(var n in _oneTimers) {
           if(_oneTimers.hasOwnProperty(n)) {
               var v = _oneTimers[n];
               v[0](v[1]);
               delete _oneTimers[n];
           }
       }
       
       for(var n in _everies) {
           if(_everies.hasOwnProperty(n)) {
               var v = _everies[n];
               if(v.nextTime < ms) {
                   if(v.remove) {
                       if(v.nextTime > 0) {
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
               if(v.until) {
                   if(v.until < ms) {
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
```
        
### <a name="later_once"></a>later::once(key, fn, value)


```javascript
// _oneTimers

_oneTimers[key] = [fn,value];
```

### <a name="later_onFrame"></a>later::onFrame(fn)


```javascript

_framers.push(fn);
```

### <a name="later_polyfill"></a>later::polyfill(t)


```javascript
// --- let's not ---
```

### <a name="later_removeFrameFn"></a>later::removeFrameFn(fn)


```javascript

var i = _framers.indexOf(fn);
if(i>=0) {
    if(fn._onRemove) {
        fn._onRemove();
    }
    _framers.splice(i,1);
    return true;
} else {
    return false;
}
```



   


   



      
    
      
            
# Class css


The class has following internal singleton variables:
        
* head
        
* styleTag
        
* bexp
        
* bexp2
        
* _conversions
        
* _instances
        
* _insInit
        
        
### <a name="css__classFactory"></a>css::_classFactory(id)


```javascript

if(!id) id = "_global_";

if(!_instances) {
    _instances = {};
    _instances[id] = this;
} else {
    if(_instances[id]) return _instances[id];
    _instances[id] = this;
}
```

### <a name="css_animation"></a>css::animation(animName, settings)


```javascript

var args = Array.prototype.slice.call(arguments),
    animName = args.shift(),
    settings = args.shift(),
    animKeyName = animName+"-keyframes",
    parts = args,
    t = 0,
    me = this,
    animStr = "",
    postFix = this._cssScope || "";
    
args.forEach( function(cssRuleObj) {
    if(me.isObject(cssRuleObj)) {
        var pros = parseInt( t*100.00 );
        animStr += pros+"% "+me.ruleToCss(cssRuleObj) +" \n";
        t = 1;
    } else {
        t = cssRuleObj;
    }
});
var fullStr = "";
var exp = ["", "-o-", "-moz-", "-webkit-"];
exp.forEach( function(r) {
    fullStr+="@"+r+"keyframes "+animKeyName+postFix+" { "+animStr+" } \n";
})
this._animations[animKeyName+postFix] = fullStr;

var animDef = {};
if(this.isObject(settings)) {
    var so = this.animSettings( settings );
    so["animation-name"] = animKeyName+postFix;
    this.bind("."+animName, so );
} else {
    this.bind( "."+animName, { animation : animKeyName+postFix+" "+settings  } );
}

```

### <a name="css_animSettings"></a>css::animSettings(obj)


```javascript

if(this.isObject(obj)) {
    var res = {};
    for(var n in obj) {
       if(obj.hasOwnProperty(n)) {
           res["animation-"+n] = obj[n]; 
       }
    }
    return res;
} else {
    return {};
}
```

### <a name="css_assign"></a>css::assign(objectList)


```javascript
var o = {}, args;
if(this.isArray(objectList)) {
    args = objectList;
} else {
    args = Array.prototype.slice.call(arguments);
}
args.forEach(function(rules) {
            for(var n in rules) {
                if(rules.hasOwnProperty(n)) {
                    o[n] = rules[n];
                }
            }
        });          
return o;

```

### <a name="css_bind"></a>css::bind(t)


```javascript
// my rulesets...
var args = Array.prototype.slice.call(arguments),
    rule = args.shift();

this._data[rule] = args;
this._dirty = true;

return this;

```

### <a name="css_buildCss"></a>css::buildCss(mediaRule)


```javascript

if(this._data) {
    var o = {};
    for( var rule in this._data) {
        if(this._data.hasOwnProperty(rule)) {
            var ruleData = this._data[rule];
            if(this._composedData[rule]) {
                ruleData = [this._composedData[rule]].concat(ruleData);
            }
            o[rule] = this.assign( ruleData );
        }
    }
    this._composedData = o;
    this.updateStyleTag( this.makeCss(o, mediaRule) );
}

```

### <a name="css_collectAnimationCss"></a>css::collectAnimationCss(t)


```javascript

var anims = this._animations,
    str = "";
    
for(var n in anims) {
    if(anims.hasOwnProperty(n))  str += anims[n];
}
return str;
```

### <a name="css_convert"></a>css::convert(n, v)


```javascript
var str = "", gPos;

if(v && v.indexOf && (gPos=v.indexOf("-gradient")) >= 0) {
    
    var start = gPos - 1,   
        end = gPos+8,
        bError = false;
    var legals = "lineardg-wbktmozp"; // repeating
    while(legals.indexOf( v.charAt(start)) >=0) {
        start--;
        if(start<=0) {
            start = 0;
            break;
        }
    }
    
    var pCnt = 1;

    while(v.charAt(end++)!="(");
    
    while(pCnt>0) {
        if( v.charAt(end)=="(") pCnt++;
        if( v.charAt(end)==")") pCnt--;
        end++;
        if(v.length < end ) {
            bError = true;
            break;
        }
    }
    if(!bError) {
        var gradString  = v.substring( start, end ),
            s = v.substring(0,start),
            e = v.substring(end);
        var str = "";
        ["-webkit-","","-moz-","-o-"].forEach( function(p) {
             str+= n+" : "+s+" "+p+gradString+e+";\n";
        });
    }
    
    
}

if(_conversions[n]) {
    str = _conversions[n](n,v);
} else {
    str+= n+" : "+v+";\n";
}
return str;
```

### css::constructor( cssScope )

```javascript
// my rulesets...
this._data = this._data  || {};
this._animations = {};
this._composedData = this._composedData || {};

// this used to be cssPostFix;
this._cssScope = cssScope || "";
// this._postFix = cssPostFix || "";

if(!head) {
    var me = this;
    later().every(1/10, function() {
        for( var id in _instances) {
            if(_instances.hasOwnProperty(id)) {
                var ins = _instances[id];
                if(ins._dirty) {
                    ins.buildCss();
                    ins._dirty = false;
                }
            }
            
        }

    });
}
if(!_insInit) _insInit = {};
var id = cssScope || "_global_";
if(!_insInit[id]) {
    _insInit[id] = true;
    this.initConversions();
}


```
        
### <a name="css_initConversions"></a>css::initConversions(t)


```javascript
head = document.getElementsByTagName('head')[0];
var styleTag = document.createElement('style');
styleTag.setAttribute('type', 'text/css');
if (styleTag.styleSheet) {   // IE
    styleTag.styleSheet.cssText = "";
} else {                // the world
    styleTag.appendChild(document.createTextNode(""));
}
head.appendChild(styleTag);      
this._styleTag = styleTag;

bexp = function(p, v) {
    var str = "";
    str+="-o-"+p+":"+v+";\n";
    str+="-moz-"+p+":"+v+";\n";
    str+="-webkit-"+p+":"+v+";\n";
    str+=p+":"+v+";\n";
    return str;
}

bexp2 = function(p, v) {
    var str = "";
    str+="-o-"+p+":"+"-o-"+v+";\n";
    str+="-moz-"+p+":"+"-moz-"+v+";\n";
    str+="-webkit-"+p+":"+"-webkit-"+v+";\n";
    str+=p+":"+v+";\n";
    return str;
}
    
 _conversions = {
    "border-radius" : function(n,v) {
        return bexp(n,v);
    },
    "box-shadow" : function(n,v) {
        return bexp(n,v);
    },
    "rotate" : function(n,v) {
        n = "transform";
        v = "rotate("+parseInt(v)+"deg)";
        return bexp(n,v);
    },
    "transition" : function(n,v) {
        return bexp2(n,v);
    },
    "filter" : function(n,v) {
        return bexp(n,v);
    },
    "animation" : function(n,v) {
        return bexp(n,v);
    },
    "animation-iteration-count" : function(n,v) {
        return bexp(n,v);
    },
    "animation-name" : function(n,v) {
        return bexp(n,v);
    },
    "animation-timing-function" : function(n,v) {
        return bexp(n,v);
    },
    "animation-duration" : function(n,v) {
        return bexp(n,v);
    },                        
    "transform" : function(n,v) {
        return bexp(n,v);
    },
    "transform-style" : function(n,v) {
        return bexp(n,v);
    },
    "transform-origin" : function(n,v) {
        return bexp(n,v);
    },
    "perspective" : function(n,v) {
        return bexp(n,v);
    },
    "text-shadow" : function(n,v) {
        return bexp(n,v);
    },
    "opacity" : function(n,v) {
        v = parseFloat(v);
        var str = '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity='+parseInt(v*100)+')";';
        str+='filter: alpha(opacity='+parseInt(v*100)+');';
        str+= bexp(n,v);
        return str;
    }
};    

```

### <a name="css_makeCss"></a>css::makeCss(o, mediaRule)


```javascript
var str = mediaRule ?  mediaRule + "{" : "";

for(var rule in o) {
    if(o.hasOwnProperty(rule)) {
        var cssRules = o[rule];
        if(this._cssScope) {
            var cssString = this.ruleToCss( cssRules );
            str += "."+this._cssScope+" "+rule+cssString+" ";
            str += rule+"."+this._cssScope+" "+cssString;
        } else {
            str += rule+this.ruleToCss( cssRules );
        }
    }
}

// add the animation css also into this mediarule...
str += this.collectAnimationCss();

str += mediaRule ? "}\n" : "";
return str;
```

### <a name="css_ruleToCss"></a>css::ruleToCss(cssRulesObj)


```javascript
var str = "{";
for(var n in cssRulesObj) {
    str += this.convert(n, cssRulesObj[n]);
}
str += "}\n";
return str;
```

### <a name="css_updateStyleTag"></a>css::updateStyleTag(cssText)


```javascript
var styleTag = this._styleTag,
    old =  styleTag.firstChild;
    
// console.log(cssText);
    
if (styleTag.styleSheet) {   // IE
    styleTag.styleSheet.cssText = cssText;
} else {                // the world
    var old = styleTag.firstChild;
    styleTag.appendChild(document.createTextNode(cssText));
    if(typeof(old)!="undefined") {
        styleTag.removeChild(old);
    }
} 

```



   
    
## trait _dataTrait

The class has following internal singleton variables:
        
        
### <a name="_dataTrait_guid"></a>_dataTrait::guid(t)


```javascript

return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

```

### <a name="_dataTrait_isArray"></a>_dataTrait::isArray(t)


```javascript

if(typeof(t)=="undefined") return this.__isA;

return Object.prototype.toString.call( t ) === '[object Array]';
```

### <a name="_dataTrait_isFunction"></a>_dataTrait::isFunction(fn)


```javascript
return Object.prototype.toString.call(fn) == '[object Function]';
```

### <a name="_dataTrait_isObject"></a>_dataTrait::isObject(t)


```javascript

if(typeof(t)=="undefined") return this.__isO;

return t === Object(t);
```


    
    
    
    


   
      
    
      
            
# Class later


The class has following internal singleton variables:
        
* _initDone
        
* _callers
        
* _oneTimers
        
* _everies
        
* _framers
        
* _localCnt
        
        
### <a name="later_add"></a>later::add(fn, thisObj, args)


```javascript
if(thisObj || args) {
   var tArgs;
   if( Object.prototype.toString.call( args ) === '[object Array]' ) {
       tArgs = args;
   } else {
       tArgs = Array.prototype.slice.call(arguments, 2);
       if(!tArgs) tArgs = [];
   }
   _callers.push([thisObj, fn, tArgs]);   
} else {
    _callers.push(fn);
}
```

### <a name="later_after"></a>later::after(seconds, fn, name)


```javascript

if(!name) {
    name = "aft7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0,
    remove : true
};
```

### <a name="later_asap"></a>later::asap(fn)


```javascript
this.add(fn);

```

### <a name="later_every"></a>later::every(seconds, fn, name)


```javascript

if(!name) {
    name = "t7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0
};
```

### later::constructor( interval, fn )

```javascript
if(!_initDone) {

   _localCnt=1;
   this.polyfill();
 
   var frame, cancelFrame;
   if(typeof(window) != "undefined") {
       var frame = window['requestAnimationFrame'], 
           cancelFrame= window['cancelRequestAnimationFrame'];
       ['', 'ms', 'moz', 'webkit', 'o'].forEach( function(x) { 
           if(!frame) {
            frame = window[x+'RequestAnimationFrame'];
            cancelFrame = window[x+'CancelAnimationFrame'] 
                                       || window[x+'CancelRequestAnimationFrame'];
           }
        });
   }
 
    if (!frame)
        frame= function(cb) {
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
       while(fn=_callers.shift()) {
          if(Object.prototype.toString.call( fn ) === '[object Array]' ) {
              fn[1].apply(fn[0], fn[2]);
          } else {
              fn();
          }
           
       }
       
       for(var i=0; i<_framers.length;i++) {
           var fFn = _framers[i];
           fFn();
       }
       
       for(var n in _oneTimers) {
           if(_oneTimers.hasOwnProperty(n)) {
               var v = _oneTimers[n];
               v[0](v[1]);
               delete _oneTimers[n];
           }
       }
       
       for(var n in _everies) {
           if(_everies.hasOwnProperty(n)) {
               var v = _everies[n];
               if(v.nextTime < ms) {
                   if(v.remove) {
                       if(v.nextTime > 0) {
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
               if(v.until) {
                   if(v.until < ms) {
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
```
        
### <a name="later_once"></a>later::once(key, fn, value)


```javascript
// _oneTimers

_oneTimers[key] = [fn,value];
```

### <a name="later_onFrame"></a>later::onFrame(fn)


```javascript

_framers.push(fn);
```

### <a name="later_polyfill"></a>later::polyfill(t)


```javascript
// --- let's not ---
```

### <a name="later_removeFrameFn"></a>later::removeFrameFn(fn)


```javascript

var i = _framers.indexOf(fn);
if(i>=0) {
    if(fn._onRemove) {
        fn._onRemove();
    }
    _framers.splice(i,1);
    return true;
} else {
    return false;
}
```



   


   



      
    



      
    
      
    
      
            
# Class clipBoard


The class has following internal singleton variables:
        
* _hasSupport
        
        
### <a name="clipBoard_del"></a>clipBoard::del(name)


```javascript

if( this.localStoreSupport() ) {
    localStorage.removeItem(name);
}
else {
    this.set(name,"",-1);
}

```

### <a name="clipBoard_fromClipboard"></a>clipBoard::fromClipboard(opts)


```javascript

var str = this.get( this._name  );
var o = JSON.parse( str );

return o;
```

### <a name="clipBoard_get"></a>clipBoard::get(name)


```javascript

if( this.localStoreSupport() ) {
    return localStorage.getItem(name);
}
else {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
```

### clipBoard::constructor( name )

```javascript

this._name = name;
```
        
### <a name="clipBoard_localStoreSupport"></a>clipBoard::localStoreSupport(t)


```javascript
if(_hasSupport) return _hasSupport;

try {
    _hasSupport = 'localStorage' in window && window['localStorage'] !== null;
    return  _hasSupport;
} catch (e) {
    return false;
}
```

### <a name="clipBoard_set"></a>clipBoard::set(name, value, days)


```javascript

if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
}
else {
    var expires = "";
}
if( this.localStoreSupport() ) {
    localStorage.setItem(name, value);
}
else {
    document.cookie = name+"="+value+expires+"; path=/";
}
```

### <a name="clipBoard_toClipboard"></a>clipBoard::toClipboard(items)


```javascript
this.set(this._name, JSON.stringify( items ) );

return this;

```



   


   



      
    
      
    
      
    




