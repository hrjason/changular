import {DOM} from 'changular2/src/dom/dom_adapter';
import {normalizeBlank} from 'changular2/src/facade/lang';

/**
 * @publicModule changular2/changular2
 */
export class NgElement {
  domElement;
  constructor(domElement) {
    this.domElement = domElement;
  }

  getAttribute(name:string) {
    return normalizeBlank(DOM.getAttribute(this.domElement, name));
  }
}