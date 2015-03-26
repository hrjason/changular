Changular [![Build Status](https://travis-ci.org/Changular/Changular.svg?branch=master)](https://travis-ci.org/Changular/Changular) [![Join the chat at https://gitter.im/Changular/Changular](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Changular/Changular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
=========

Changular is a development platform for building mobile and desktop web applications. This is the
repository for [Changular 2][ng2], both the JavaScript (JS) and [Dart][dart] versions.

Changular 2 is currently in **Alpha Preview**. We recommend using Changular 1.X for production
applications:

* [ChangularJS][ngJS]: [Changular/Changular.js](http://github.com/Changular/Changular.js).
* [ChangularDart][ngDart]: [Changular/Changular.dart](http://github.com/Changular/Changular.dart).


## Setup & Install Changular 2

Follow the instructions given on the [Changular download page][download].


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
