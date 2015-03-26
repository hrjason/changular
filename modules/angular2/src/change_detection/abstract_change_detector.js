import {isPresent} from 'changular2/src/facade/lang';
import {List, ListWrapper} from 'changular2/src/facade/collection';
import {ChangeDetector, CHECK_ALWAYS, CHECK_ONCE, CHECKED, DETACHED} from './interfaces';

export class AbstractChangeDetector extends ChangeDetector {
  children:List;
  parent:ChangeDetector;
  mode:string;

  constructor() {
    super();
    this.children = [];
    this.mode = CHECK_ALWAYS;
  }

  addChild(cd:ChangeDetector) {
    ListWrapper.push(this.children, cd);
    cd.parent = this;
  }

  removeChild(cd:ChangeDetector) {
    ListWrapper.remove(this.children, cd);
  }

  remove() {
    this.parent.removeChild(this);
  }

  detectChanges() {
    this._detectChanges(false);
  }

  checkNoChanges() {
    this._detectChanges(true);
  }

  _detectChanges(throwOnChange:boolean) {
    if (this.mode === DETACHED || this.mode === CHECKED) return;

    this.detectChangesInRecords(throwOnChange);
    this._detectChangesInChildren(throwOnChange);

    if (this.mode === CHECK_ONCE) this.mode = CHECKED;
  }

  detectChangesInRecords(throwOnChange:boolean){}

  _detectChangesInChildren(throwOnChange:boolean) {
    var children = this.children;
    for(var i = 0; i < children.length; ++i) {
      children[i]._detectChanges(throwOnChange);
    }
  }

  markPathToRootAsCheckOnce() {
    var c = this;
    while(isPresent(c) && c.mode != DETACHED) {
      if (c.mode === CHECKED) c.mode = CHECK_ONCE;
      c = c.parent;
    }
  }
}
