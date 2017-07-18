# SplitPane.js
Easily create adjustable views for your web app  
Can be fully controlled through your HTML class definitions

* [Getting started](#getting-started)
* [Optional settings](#optional-settings)
* [Demos](#demos)
* [Advanced Options](#advanced-options)


## Getting started
Add the split-pane class to your div  
Then add the pane-[horizontal/vertical] to specify direction

Call `SplitPane()` in your document ready function  
optional arguments are SplitPane(*root elemnt*, *width*)

``` HTML
<div class="split-pane pane-horizontal">Div1</div>
<div class="split-pane pane-horizontal">Div2</div>
```
Produces
![Demo1](img/Demo1.png)

## Optional settings
Can add the options 
* **pane-min-[number]** where the number is the minimum % width/height that the column can be  
* **pane-weight-[number]** where the number is the weighted initial width/height of the column

![Demo2](img/Demo2.gif)

## Demos
[Demo here](demo.html)

## Advanced options
Each divider has the class *pane-divider* so can be customised with css  
