library web_foo;

import 'package:changular2/src/core/application.dart';
import 'package:changular2/src/reflection/reflection_capabilities.dart';
import 'bar.dart';

bool _visited = false;
void setupReflection(reflector) {
  if (_visited) return;
  _visited = true;
}
