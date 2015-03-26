library web_foo;

import 'package:changular2/src/core/application.dart';
import 'package:changular2/src/reflection/reflection.dart';
import 'package:changular2/src/reflection/reflection_capabilities.dart';
import 'bar.dart';

void main() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  bootstrap(MyComponent);
}
