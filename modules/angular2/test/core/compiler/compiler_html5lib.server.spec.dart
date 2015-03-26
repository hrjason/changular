library changular2.compiler.html5lib_dom_adapter.test;

import 'package:changular2/src/dom/html5lib_adapter.dart';
import 'package:changular2/src/test_lib/test_lib.dart' show testSetup;
import 'compiler_common_tests.dart';

void main() {
  Html5LibDomAdapter.makeCurrent();
  testSetup();
  runCompilerCommonTests();
}
