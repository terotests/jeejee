# jeejee - the little UI library that could

NOTE: This is just early release of this version, bugs may appear.

This a simplified, data-agnostic version of the _e -UI library. It promotes creating
UI views in functional style so that each view is creates from a function receiving the data it should be using as a paramters.

Views can also be nested in infinite amount.

[View push/pop Demo] (http://jsfiddle.net/55yxzuy4/)


# Basics

Views are creates from nested objects using composing operations like `add` 
``` javascript
  var myDiv = _e(); // creates a DIV
  var childDiv = myDiv.div(); // creates a child div under the parent
```

Any element can be created using constructor
``` javascript
  _e("span"); // creates a SPAN
```

And nested elements can be created calling the parent...
``` javascript
  var parent = _e(); // creates a DIV
  var child = parent.div(); // new nested div
```
... or adding the elements 
``` javascript
  child.add( myDiv ) ;
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

# Functional view creation

The purpose of the libray is to make possible creating UI views in functional style

``` javascript
  var someViewFunction( data ) {
    var view = _e();
    // Create the view here...
    return view;
  }
```

This makes possible easily nesting views using `pushView` and `popView`. The nice thing about functional views is that they can be composed. Any element can serve as parent to another view created using view function.

The functions can be also be given as a parameter to the `add` or similar functions like this

``` javascript
  myDiv.add( function() {
      // function that returns a view
      return _e(); // just a div here...
  });
```


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
[Gradient Editor example] (http://jsfiddle.net/feho44zb/1/)
[SVG Editor example is here] (http://jsfiddle.net/90u23ryx/1/)

If you want to handle events manually, you can use `bacon()` -function ( this may be changed to baconEvent) 

``` javascript
// create input and the results as Bacon.js stream.
var myDiv = _e("#res");
myDiv.input().bacon("keydown")
   .onValue( function(event) {
     myDiv.div().text(event.target.value);
  });
```

The _e is supporting also many standard "on" events like

``` javascript
var inp = myDiv.div().input().val("the value");
myDiv.button().text("Click me").on("click", function() {
   alert(inp.val());
});
```

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


# License

MIT. Currently use at own risk.








