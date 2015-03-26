library examples.hello_world.index_common_dart;

import 'hello.dart';
import 'package:changular2/changular2.dart'
    show bootstrap, Component, Decorator, Template, NgElement;

bool _visited = false;
void setupReflection(reflector) {
  if (_visited) return;
  _visited = true;
  reflector
    ..registerType(HelloCmp, {
      'factory': () => new HelloCmp(),
      'parameters': const [const []],
      'annotations': const [
        const Component(selector: 'hello-app'),
        const Template(inline: '{{greeting}}')
      ]
    });
}
