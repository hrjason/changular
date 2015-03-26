library web_foo;

import 'package:changular2/src/core/application.dart';
import 'package:changular2/src/reflection/reflection.dart';
import 'package:changular2/src/reflection/reflection_capabilities.dart';

void main() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  bootstrap(MyComponent);
}
