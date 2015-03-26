import {
  AsyncTestCompleter,
  beforeEach,
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
import {Injector} from 'changular2/di';
import {Lexer, Parser, dynamicChangeDetection} from 'changular2/change_detection';

import {Compiler, CompilerCache} from 'changular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'changular2/src/core/compiler/directive_metadata_reader';
import {NativeShadowDomStrategy} from 'changular2/src/core/compiler/shadow_dom_strategy';
import {ComponentUrlMapper} from 'changular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'changular2/src/core/compiler/url_resolver';
import {StyleUrlResolver} from 'changular2/src/core/compiler/style_url_resolver';
import {CssProcessor} from 'changular2/src/core/compiler/css_processor';

import {Component} from 'changular2/src/core/annotations/annotations';
import {Template} from 'changular2/src/core/annotations/template';
import {TemplateLoader} from 'changular2/core';
import {Switch, SwitchWhen, SwitchDefault} from 'changular2/src/directives/switch';
import {MockTemplateResolver} from 'changular2/src/mock/template_resolver_mock';

export function main() {
  describe('switch', () => {
    var view, cd, compiler, component, tplResolver;
    beforeEach(() => {
      var urlResolver = new UrlResolver();
      tplResolver = new MockTemplateResolver();
      compiler = new Compiler(
        dynamicChangeDetection,
        new TemplateLoader(null, null),
        new DirectiveMetadataReader(),
        new Parser(new Lexer()),
        new CompilerCache(),
        new NativeShadowDomStrategy(new StyleUrlResolver(urlResolver)),
        tplResolver,
        new ComponentUrlMapper(),
        urlResolver,
        new CssProcessor(null)
      );
    });

    function createView(pv) {
      component = new TestComponent();
      view = pv.instantiate(null, null);
      view.hydrate(new Injector([]), null, null, component, null);
      cd = view.changeDetector;
    }

    function compileWithTemplate(html) {
      var template = new Template({
        inline: html,
        directives: [Switch, SwitchWhen, SwitchDefault]
      });
      tplResolver.setTemplate(TestComponent, template);
      return compiler.compile(TestComponent);
    }

    describe('switch value changes', () => {
      it('should switch amongst when values', inject([AsyncTestCompleter], (async) => {
        var template = '<div>' +
          '<ul [switch]="switchValue">' +
            '<template [switch-when]="\'a\'"><li>when a</li></template>' +
            '<template [switch-when]="\'b\'"><li>when b</li></template>' +
          '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('');

          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a');

          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when b');

          async.done();
        });
      }));

      it('should switch amongst when values with fallback to default', inject([AsyncTestCompleter], (async) => {
        var template = '<div>' +
          '<ul [switch]="switchValue">' +
            '<li template="switch-when \'a\'">when a</li>' +
            '<li template="switch-default">when default</li>' +
          '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default');

          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a');

          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default');

          async.done();
        });
      }));

      it('should support multiple whens with the same value', inject([AsyncTestCompleter], (async) => {
        var template = '<div>' +
          '<ul [switch]="switchValue">' +
            '<template [switch-when]="\'a\'"><li>when a1;</li></template>' +
            '<template [switch-when]="\'b\'"><li>when b1;</li></template>' +
            '<template [switch-when]="\'a\'"><li>when a2;</li></template>' +
            '<template [switch-when]="\'b\'"><li>when b2;</li></template>' +
            '<template [switch-default]><li>when default1;</li></template>' +
            '<template [switch-default]><li>when default2;</li></template>' +
          '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default1;when default2;');

          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a1;when a2;');

          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when b1;when b2;');

          async.done();
        });
      }));
    });

    describe('when values changes', () => {
      it('should switch amongst when values', inject([AsyncTestCompleter], (async) => {
        var template = '<div>' +
          '<ul [switch]="switchValue">' +
            '<template [switch-when]="when1"><li>when 1;</li></template>' +
            '<template [switch-when]="when2"><li>when 2;</li></template>' +
            '<template [switch-default]><li>when default;</li></template>' +
          '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);

          component.when1 = 'a';
          component.when2 = 'b';
          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 1;');

          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 2;');

          component.switchValue = 'c';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default;');

          component.when1 = 'c';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 1;');

          component.when1 = 'd';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default;');

          async.done();
        });
      }));
    });
  });
}

@Component({selector: 'test-cmp'})
class TestComponent {
  switchValue: any;
  when1: any;
  when2: any;

  constructor() {
    this.switchValue = null;
    this.when1 = null;
    this.when2 = null;
  }
}
