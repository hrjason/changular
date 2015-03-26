import {ddescribe, describe, it, iit, xit, expect, afterEach} from 'changular2/test_lib';
import {DOM} from 'changular2/src/dom/dom_adapter';

import {Title} from 'changular2/src/services/title';

export function main() {

  describe('title service', () => {
    var initialTitle = DOM.getTitle();
    var titleService = new Title();

    afterEach(() => {
      DOM.setTitle(initialTitle);
    });

    it('should allow reading initial title', () => {
      expect(titleService.getTitle()).toEqual(initialTitle);
    });

    it('should set a title on the injected document', () => {
      titleService.setTitle('test title');
      expect(DOM.getTitle()).toEqual('test title');
      expect(titleService.getTitle()).toEqual('test title');
    });

    it('should reset title to empty string if title not provided', () => {
      titleService.setTitle(null);
      expect(DOM.getTitle()).toEqual('');
    });

  });
}
