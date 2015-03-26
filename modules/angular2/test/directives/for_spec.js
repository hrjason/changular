import {
  AsyncTestCompleter,
  beforeEach,
  beforeEachBindings,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  it,
  xit,
} from 'changular2/test_lib';

import {DOM} from 'changular2/src/dom/dom_adapter';
import {ListWrapper} from 'changular2/src/facade/collection';

import {Injector} from 'changular2/di';

import {Compiler} from 'changular2/src/core/compiler/compiler';
import {TemplateResolver} from 'changular2/src/core/compiler/template_resolver';

import {Template} from 'changular2/src/core/annotations/template';
import {Decorator, Component, Viewport} from 'changular2/src/core/annotations/annotations';

import {MockTemplateResolver} from 'changular2/src/mock/template_resolver_mock';

import {For} from 'changular2/src/directives/for';

import {bind} from 'changular2/di';

export function main() {
  describe('for', () => {
    var view, cd, compiler, component, tplResolver;

    beforeEachBindings(() => [
      bind(TemplateResolver).toClass(MockTemplateResolver),
    ]);

    beforeEach(inject([Compiler, TemplateResolver], (c, t) => {
      compiler = c;
      tplResolver = t;
    }));

    function createView(pv) {
      component = new TestComponent();
      view = pv.instantiate(null, null);
      view.hydrate(new Injector([]), null, null, component, null);
      cd = view.changeDetector;
    }

    function compileWithTemplate(html) {
      var template = new Template({
        inline: html,
        directives: [For]
      });
      tplResolver.setTemplate(TestComponent, template);
      return compiler.compile(TestComponent);
    }

    var TEMPLATE = '<div><copy-me template="for #item of items">{{item.toString()}};</copy-me></div>';

    it('should reflect initial elements', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('1;2;');
        async.done();
      });
    }));

    it('should reflect added elements', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();

        ListWrapper.push(component.items, 3);
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('1;2;3;');
        async.done();
      });
    }));

    it('should reflect removed elements', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();

        ListWrapper.removeAt(component.items, 1);
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('1;');
        async.done();
      });
    }));

    it('should reflect moved elements', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();

        ListWrapper.removeAt(component.items, 0);
        ListWrapper.push(component.items, 1);
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('2;1;');
        async.done();
      });
    }));

    it('should reflect a mix of all changes (additions/removals/moves)', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        component.items = [0, 1, 2, 3, 4, 5];
        cd.detectChanges();

        component.items = [6, 2, 7, 0, 4, 8];
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('6;2;7;0;4;8;');
        async.done();
      });
    }));

    it('should iterate over an array of objects', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate('<ul><li template="for #item of items">{{item["name"]}};</li></ul>').then((pv) => {
        createView(pv);

        // INIT
        component.items = [{'name': 'misko'}, {'name':'shyam'}];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('misko;shyam;');

        // GROW
        ListWrapper.push(component.items, {'name': 'adam'});
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('misko;shyam;adam;');

        // SHRINK
        ListWrapper.removeAt(component.items, 2);
        ListWrapper.removeAt(component.items, 0);
        cd.detectChanges();

        expect(DOM.getText(view.nodes[0])).toEqual('shyam;');
        async.done();
      });
    }));

    it('should gracefully handle nulls', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate('<ul><li template="for #item of null">{{item}};</li></ul>').then((pv) => {
        createView(pv);
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('');
        async.done();
      });
    }));

    it('should gracefully handle ref changing to null and back', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('1;2;');

        component.items = null;
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('');

        component.items = [1, 2, 3];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('1;2;3;');
        async.done();
      });
    }));

    it('should throw on ref changing to string', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('1;2;');

        component.items = 'whaaa';
        expect(() => cd.detectChanges()).toThrowError();
        async.done();
      });
    }));

    it('should works with duplicates', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(TEMPLATE).then((pv) => {
        createView(pv);
        var a = new Foo();
        component.items = [a, a];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('foo;foo;');
        async.done();
      });
    }));

    it('should repeat over nested arrays', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(
        '<div>'+
          '<div template="for #item of items">' +
            '<div template="for #subitem of item">' +
              '{{subitem}}-{{item.length}};' +
            '</div>|'+
          '</div>'+
        '</div>'
      ).then((pv) => {
        createView(pv);
        component.items = [['a', 'b'], ['c']];
        cd.detectChanges();
        cd.detectChanges();
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('a-2;b-2;|c-1;|');

        component.items = [['e'], ['f', 'g']];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('e-1;|f-2;g-2;|');

        async.done();
      });
    }));

    it('should repeat over nested arrays with no intermediate element', inject([AsyncTestCompleter], (async) => {
      compileWithTemplate(
          '<div><template [for] #item [of]="items">' +
            '<div template="for #subitem of item">' +
            '{{subitem}}-{{item.length}};' +
          '</div></template></div>'
      ).then((pv) => {
        createView(pv);

        component.items = [['a', 'b'], ['c']];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('a-2;b-2;c-1;');

        component.items = [['e'], ['f', 'g']];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('e-1;f-2;g-2;');
        async.done();
      });
    }));

    it('should display indices correctly', inject([AsyncTestCompleter], (async) => {
      var INDEX_TEMPLATE =
        '<div><copy-me template="for: var item of items; var i=index">{{i.toString()}}</copy-me></div>';
      compileWithTemplate(INDEX_TEMPLATE).then((pv) => {
        createView(pv);
        component.items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('0123456789');

        component.items = [1, 2, 6, 7, 4, 3, 5, 8, 9, 0];
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('0123456789');
        async.done();
      });
    }));

  });
}

class Foo {
  toString() {
    return 'foo';
  }
}

@Component({selector: 'test-cmp'})
class TestComponent {
  items: any;
  constructor() {
    this.items = [1, 2];
  }
}
