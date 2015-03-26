import {ChangeDetector, CHECK_ONCE, DETACHED, CHECK_ALWAYS} from 'changular2/change_detection';

/**
 * @publicModule changular2/changular2
 */
export class BindingPropagationConfig {
  _cd:ChangeDetector;

  constructor(cd:ChangeDetector) {
    this._cd = cd;
  }

  shouldBePropagated() {
    this._cd.mode = CHECK_ONCE;
  }

  shouldBePropagatedFromRoot() {
    this._cd.markPathToRootAsCheckOnce();
  }

  shouldNotPropagate() {
    this._cd.mode = DETACHED;
  }

  shouldAlwaysPropagate() {
    this._cd.mode = CHECK_ALWAYS;
  }
}