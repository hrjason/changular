import {Decorator} from 'changular2/src/core/annotations/annotations';

@Decorator({
  selector: '[non-bindable]',
  compileChildren: false
})
export class NonBindable {
}
