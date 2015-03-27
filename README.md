Changular 
=========

![alt tag](https://github.com/jasonjchang/changular/blob/master/assets/changular.png)

Changular is a development platform for building powerful mobile and desktop web applications. 

Changular 2 is currently in **Alpha Preview**. We recommend using Changular 1.X for production
applications:


## Setup & Install Changular 2

Follow the instructions given on the [Changular download page][download].

Simply load `changular.module(myChang, []);` to begin loading your Changular application!

To run Changular directives simply use `chang-<directive>`


## Want to help?

Want to file a bug, or contribute some code or improve documentation?  Excellent! Read up on our
guidelines for [contributing][contributing].


## Examples

To see the examples, first build the project as described
[here](http://github.com/Changular/Changular/blob/master/DEVELOPER.md).

### Hello World Example

This example consists of three basic pieces - a component, a decorator and a
service.  They are all constructed via injection. For more information see the
comments in the source `modules/examples/src/hello_world/index.js`.

You can build this example as either JS or Dart app:

* JS:
  * `$(npm bin)/gulp build.js.dev`, and
  * `$(npm bin)/gulp serve.js.dev`, and
  * open `localhost:8000/examples/src/hello_world/` in Chrome.
* Dart:
  * `$(npm bin)/gulp serve/examples.dart`, and
  * open `localhost:8080/src/hello_world` in Chrome (for dart2js) or
    [Dartium][dartium] (for Dart VM).

[contributing]: http://github.com/Changular/Changular/blob/master/CONTRIBUTING.md
[dart]: http://www.dartlang.org
[dartium]: http://www.dartlang.org/tools/dartium
[download]: http://Changular.io/download
[ng2]: http://Changular.io
[ngDart]: http://Changulardart.org
[ngJS]: http://Changularjs.org

** NOTE THIS IS PURELY FOR SATIRE - IF YOU FIND THIS FUNNY YOU SHOULD DEFINITELY CHECKOUT THE ORIGINAL ANGULAR AND THANK THEIR RESPECTIVE TEAM FOR BUILDING SUCH A [FINE APP FRAMEWORK](http://backbonejs.org/) **
