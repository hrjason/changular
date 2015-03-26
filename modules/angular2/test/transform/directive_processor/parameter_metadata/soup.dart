library dinner.soup;

import 'package:changular2/src/core/annotations/annotations.dart';

@Component(selector: '[soup]')
class SoupComponent {
  SoupComponent(@Tasty String description, @Inject(Salt) salt);
}
