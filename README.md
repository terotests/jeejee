# JeeJee, a simple but massive JS framework

NOTICE: The project and documentation is still under construction. And most likely always will be.

[TODO-MVC Demo] (http://jsfiddle.net/2ranr6xf/)

Sometimes you just want to create HTML items dynamically, with the easy way. In _e framework
the basic element is DIV which is created like:
```
  _e(); // creates a DIV
```
Any other element can be created using
```
  _e("span"); // creates a SPAN
```
And nested elements can be created calling the parent...
```
  var parent = _e(); // creates a DIV
  var child = parent.div(); // new nested div
```
... or adding the elements 
```
  child.add( myDiv ) ;
```
Setting attributes and classes can be done using  `attr` or `addClass` 

```
  var myInput = _e("input").attr( {
        "type" : "color"
  }).addClass("basicInput");
```

or with arguments

```
  myDiv.input("bacicInput", {
        "type" : "color"
  });
```


#Taking Bacon Stream out

```
// create input and the results as Bacon.js tream.
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

# _data() and updating models + views

The simplest case is that you have a simple model like this:
``` javascript
var model = _data({ name : "John doe" });
```

The model is a promise and may be resolved later, so you must use `.then()` before using it. 
``` javascript
model.then(function() {
   myDiv.h1().bind( model, "name" );
});

```
After that the model values are updated to the view.
```
model.set("name", "Mike");
// or
model.name("Mike");
```


## Creating views from lists or MVC -collections

Displaying a collection of items in many template -based frameworks is usually not very fast, because templates need to be refreshed. Since _e is binding values directly to the objects, the performance can be quite optimal in many cases.

To display a list of items, you must create an array and give it to mvc()

``` javascript
var list = _data( [
  { txt : "Cras justo odio"},
  { txt : "Dapibus ac facilisis in"},
  { txt : "Morbi leo risus"}
]);

list.then( function() {
    myDiv.ul("list-group").mvc( list, function(item) {
        var li = _e("li").addClass("list-group-item");
        li.a().text(item.txt);
        return li;
    });
});
```

# Data-remoting with Socket.io

To be documented later.

# Templates

You can use templates, data-switches and events to create templates

```html
 <ol data-model="items" data-class-switch="type">
      <li data-class="path"> 
 
      </li>
      <li data-class="image"> 
 
      </li>
  </ol>
```  

To render the template at the client you need to give it as a string param to renderTemplate() -function.

``` javascript
  resDiv.renderTemplate( myModel, templateStr);
```  

The template can be rendered from a dynamic variable or static HTML string. Dynamic templates
update automatically if the variable changes locall or at remote server.

## Input variables in templates

To modify current model items place variable name in the brackets {{}}

```html
<ul data-model="items">
  <li><input size=3 value={{width}}></li>
</ul>
``` 
``` javascript
  var myList = _data([ { width: 30}, { width:50}] );
  resDiv.renderTemplate( myList, templateStr);
``` 

## Iterating submodels

To iterate submodel just place a new data-model -directive in existing template

```html
<ul data-model="groups">
  <li>group {{name}} has following members:
  <ul data-model="people">
     <li><input value={{firstName}}> <input value={{lastName}}></li>
  </ul>
</ul>
``` 

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

## Using .on( ... )

You can place tradional event-handler with .on( ) 

``` javascript
myDiv.on("click", function(elem, data) {
    // elem is the elment clicked
    // data is the trigger parameter
});
// triggering manually
myDiv.trigger("click", someData);
```

## Routing

The most effient way to manage events is routing. With routing the parent element will get event from the child element with the routing 
information. Any object having a routing information can generate event. 

``` javascript
var childDiv1 = parentDiv.div().text("Google "),
    childDiv2 = parentDiv.div().text("Amazon "),
    childDiv3 = parentDiv.div().text("eBay");
    
// set a route information to it
childDiv1.setRoute( { url : "http://www.google.com", clickCnt : 0 } ); 
childDiv2.setRoute( { url : "http://www.amazon.com", clickCnt : 0 } ); 
childDiv3.setRoute( { url : "http://www.ebay.com", clickCnt : 0 } ); 

// Then listen to the events...
parentDiv.router( "click", function(item) {
    // item has now the data assigned to the clicked item
    alert(item.url + " with cnt " + item.clickCnt);
    item.clickCnt++;
});
```

The route -information can be any variable and any event which bubbles up in DOM can be used.

## Binding to real DOM

Finding a HTML element and creating elments under it:

``` javascript
var main = _e("#maindiv");
main.div().text("Hello world");
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

var m = _e("#res"); // res = id of the DOM element
var colorPicker = m.div().input({ type : "color" });
var myData = _data({
    fill : "#ff8833",
    path :  "M24.875,15.334v-4.876c0-4.894-3.981-8.875-8.875-8.875s-8.875,3.981-8.875,8.875v4.876H5.042v15.083h21.916V15.334H24.875zM10.625,10.458c0-2.964,2.411-5.375,5.375-5.375s5.375,2.411,5.375,5.375v4.876h-10.75V10.458zM18.272,26.956h-4.545l1.222-3.667c-0.782-0.389-1.324-1.188-1.324-2.119c0-1.312,1.063-2.375,2.375-2.375s2.375,1.062,2.375,2.375c0,0.932-0.542,1.73-1.324,2.119L18.272,26.956z"
});  

myData.then(function() {
   colorPicker.bind(myData, "fill");
   var svg = m.svg({ width: 100, height:100});
   var pathElement = svg.g().path( { d : [myData, "path"], fill :  [myData, "fill"] });
});

```

# Anything else?

A lot, but don't have time to document.

# License

Not yet specified, under construction.








