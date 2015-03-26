import {DOM} from 'changular2/src/dom/dom_adapter';

export class Title {

  getTitle():string {
    return DOM.getTitle();
  }

  setTitle(newTitle:string) {
    DOM.setTitle(newTitle);
  }
}
