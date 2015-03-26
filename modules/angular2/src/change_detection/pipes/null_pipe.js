import {isBlank} from 'changular2/src/facade/lang';
import {Pipe, NO_CHANGE} from './pipe';

export class NullPipeFactory {
  supports(obj):boolean {
    return NullPipe.supportsObj(obj);
  }

  create():Pipe {
    return new NullPipe();
  }
}

export class NullPipe extends Pipe {
  called:boolean;
  constructor() {
    super();
    this.called = false;
  }

  static supportsObj(obj):boolean {
    return isBlank(obj);
  }

  supports(obj) {
    return NullPipe.supportsObj(obj);
  }

  transform(value) {
    if (! this.called) {
      this.called = true;
      return null;
    } else {
      return NO_CHANGE;
    }
  }
}
