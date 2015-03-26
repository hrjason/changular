library bar;

import 'bar.dart';
import 'package:changular2/src/core/annotations/annotations.dart';
import 'foo.ng_deps.dart' as i0;

export 'foo.dart';

bool _visited = false;
void setupReflection(reflector) {
  if (_visited) return;
  _visited = true;
  reflector
    ..registerType(MyComponent, {
      'factory': () => new MyComponent(),
      'parameters': const [],
      'annotations': const [const Component(selector: '[soup]')]
    });
  i0.setupReflection(reflector);
}
