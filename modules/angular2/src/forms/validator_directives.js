import {Decorator} from 'changular2/changular2';

import {ControlDirective, Validators} from 'changular2/forms';

@Decorator({
  selector: '[required]'
})
export class RequiredValidatorDirective {
  constructor(c:ControlDirective) {
    c.validator = Validators.compose([c.validator, Validators.required]);
  }
}