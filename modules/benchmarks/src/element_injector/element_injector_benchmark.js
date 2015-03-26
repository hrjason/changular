import {reflector} from 'changular2/src/reflection/reflection';
import {Injector} from 'changular2/di';
import {ProtoElementInjector} from 'changular2/src/core/compiler/element_injector';
import {getIntParameter, bindAction} from 'changular2/src/test_lib/benchmark_util';
import {BrowserDomAdapter} from 'changular2/src/dom/browser_adapter';

var count = 0;

function setupReflector() {
  reflector.registerType(A, {
    'factory': () => new A(),
    'parameters': [],
    'annotations' : []
  });
  reflector.registerType(B, {
    'factory': () => new B(),
    'parameters': [],
    'annotations' : []
  });
  reflector.registerType(C, {
    'factory': (a,b) => new C(a,b),
    'parameters': [[A],[B]],
    'annotations' : []
  });
}

export function main() {
  BrowserDomAdapter.makeCurrent();
  var iterations = getIntParameter('iterations');

  setupReflector();
  var appInjector = new Injector([]);

  var bindings = [A, B, C];
  var proto = new ProtoElementInjector(null, 0, bindings);
  var elementInjector = proto.instantiate(null, null);

  function instantiate () {
    for (var i = 0; i < iterations; ++i) {
      var ei = proto.instantiate(null, null);
      ei.instantiateDirectives(appInjector, null, null);
    }
  }

  function instantiateDirectives () {
    for (var i = 0; i < iterations; ++i) {
      elementInjector.clearDirectives();
      elementInjector.instantiateDirectives(appInjector, null, null);
    }
  }

  bindAction('#instantiate', instantiate);
  bindAction('#instantiateDirectives', instantiateDirectives);
}

class A {
  constructor() {
    count++;
  }
}

class B {
  constructor() {
    count++;
  }
}

class C {
  constructor(a:A, b:B) {
    count++;
  }
}
