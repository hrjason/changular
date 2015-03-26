import {bind} from 'changular2/di';
import {Compiler, CompilerCache} from 'changular2/src/core/compiler/compiler';
import {Reflector, reflector} from 'changular2/src/reflection/reflection';
import {Parser, Lexer, ChangeDetection, dynamicChangeDetection} from 'changular2/change_detection';
import {ExceptionHandler} from 'changular2/src/core/exception_handler';
import {TemplateLoader} from 'changular2/src/core/compiler/template_loader';
import {TemplateResolver} from 'changular2/src/core/compiler/template_resolver';
import {DirectiveMetadataReader} from 'changular2/src/core/compiler/directive_metadata_reader';
import {ShadowDomStrategy, NativeShadowDomStrategy} from 'changular2/src/core/compiler/shadow_dom_strategy';
import {XHR} from 'changular2/src/core/compiler/xhr/xhr';
import {XHRMock} from 'changular2/src/mock/xhr_mock';
import {ComponentUrlMapper} from 'changular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'changular2/src/core/compiler/url_resolver';
import {StyleUrlResolver} from 'changular2/src/core/compiler/style_url_resolver';
import {StyleInliner} from 'changular2/src/core/compiler/style_inliner';
import {CssProcessor} from 'changular2/src/core/compiler/css_processor';

import {Injector} from 'changular2/di';

import {List, ListWrapper} from 'changular2/src/facade/collection';
import {FunctionWrapper} from 'changular2/src/facade/lang';

/**
 * Returns the root injector bindings.
 *
 * This must be kept in sync with the _rootBindings in application.js
 *
 * @returns {*[]}
 */
function _getRootBindings() {
  return [
    bind(Reflector).toValue(reflector),
  ];
}

/**
 * Returns the application injector bindings.
 *
 * This must be kept in sync with _injectorBindings() in application.js
 *
 * @returns {*[]}
 */
function _getAppBindings() {
  return [
    bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy),
    Compiler,
    CompilerCache,
    TemplateResolver,
    bind(ChangeDetection).toValue(dynamicChangeDetection),
    TemplateLoader,
    DirectiveMetadataReader,
    Parser,
    Lexer,
    ExceptionHandler,
    bind(XHR).toClass(XHRMock),
    ComponentUrlMapper,
    UrlResolver,
    StyleUrlResolver,
    StyleInliner,
    bind(CssProcessor).toFactory(() => new CssProcessor(null), []),
  ];
}

export function createTestInjector(bindings: List) {
  var rootInjector = new Injector(_getRootBindings());
  return rootInjector.createChild(ListWrapper.concat(_getAppBindings(), bindings));
}

/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass, AsyncTestCompleter], (object, async) => {
 *   object.doSomething().then(() => {
 *     expect(...);
 *     async.done();
 *   });
 * })
 * ```
 *
 * Notes:
 * - injecting an `AsyncTestCompleter` allow completing async tests - this is the equivalent of
 *   adding a `done` parameter in Jasmine,
 * - inject is currently a function because of some Traceur limitation the syntax should eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function inject(tokens: List, fn: Function) {
  return new FunctionWithParamTokens(tokens, fn);
}

export class FunctionWithParamTokens {
  _tokens: List;
  _fn: Function;

  constructor(tokens: List, fn: Function) {
    this._tokens = tokens;
    this._fn = fn;
  }

  execute(injector: Injector) {
    var params = ListWrapper.map(this._tokens, (t) => injector.get(t));
    FunctionWrapper.apply(this._fn, params);
  }
}

