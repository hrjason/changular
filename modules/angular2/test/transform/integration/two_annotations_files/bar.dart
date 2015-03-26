library bar;

import 'package:changular2/src/core/annotations/annotations.dart';
import 'package:changular2/src/core/annotations/template.dart';

@Component(selector: '[soup]')
@Template(inline: 'Salad')
class MyComponent {
  MyComponent();
}
