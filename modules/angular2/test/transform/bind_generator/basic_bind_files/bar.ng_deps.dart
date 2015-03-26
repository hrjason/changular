library bar;

import 'bar.dart';
import 'package:changular2/src/core/annotations/annotations.dart';

bool _visited = false;
void setupReflection(reflector) {
  if (_visited) return;
  _visited = true;
  reflector
    ..registerType(ToolTip, {
      'factory': () => new ToolTip(),
      'parameters': const [],
      'annotations': const [
        const Decorator(
            selector: '[tool-tip]', bind: const {'text': 'tool-tip'})
      ]
    });
}
