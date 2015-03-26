import {describe, beforeEach, it, xit, expect, iit, ddescribe, el} from 'changular2/test_lib';
import {isPresent, assertionsEnabled} from 'changular2/src/facade/lang';
import {ListWrapper, MapWrapper, StringMapWrapper} from 'changular2/src/facade/collection';
import {DirectiveParser} from 'changular2/src/core/compiler/pipeline/directive_parser';
import {CompilePipeline} from 'changular2/src/core/compiler/pipeline/compile_pipeline';
import {CompileStep} from 'changular2/src/core/compiler/pipeline/compile_step';
import {CompileElement} from 'changular2/src/core/compiler/pipeline/compile_element';
import {CompileControl} from 'changular2/src/core/compiler/pipeline/compile_control';
import {Component, DynamicComponent, Decorator, Viewport} from 'changular2/src/core/annotations/annotations';
import {Template} from 'changular2/src/core/annotations/template';
import {DirectiveMetadataReader} from 'changular2/src/core/compiler/directive_metadata_reader';
import {Lexer, Parser} from 'changular2/change_detection';

export function main() {
  describe('DirectiveParser', () => {
    var reader, directives;

    beforeEach( () => {
      reader = new DirectiveMetadataReader();
      directives = [
        SomeDecorator,
        SomeDecoratorIgnoringChildren,
        SomeDecoratorWithBinding,
        SomeViewport,
        SomeViewport2,
        SomeComponent,
        SomeComponent2,
        SomeDynamicComponent,
        SomeDynamicComponent2
      ];
    });

    function createPipeline({propertyBindings, variableBindings}={}) {
      var parser = new Parser(new Lexer());
      var annotatedDirectives = ListWrapper.create();
      for (var i=0; i<directives.length; i++) {
        ListWrapper.push(annotatedDirectives, reader.read(directives[i]));
      }

      return new CompilePipeline([new MockStep((parent, current, control) => {
          if (isPresent(propertyBindings)) {
            StringMapWrapper.forEach(propertyBindings, (v, k) => {
              current.addPropertyBinding(k, parser.parseBinding(v, null));
              MapWrapper.set(current.attrs(), k, v);
            });
          }
          if (isPresent(variableBindings)) {
            StringMapWrapper.forEach(variableBindings, (v, k) => {
              current.addVariableBinding(k, v);
              MapWrapper.set(current.attrs(), k, v);
            });
          }
        }), new DirectiveParser(annotatedDirectives)]);
    }

    it('should not add directives if they are not used', () => {
      var results = createPipeline().process(el('<div></div>'));
      expect(results[0].decoratorDirectives).toBe(null);
      expect(results[0].componentDirective).toBe(null);
      expect(results[0].viewportDirective).toBe(null);
    });

    describe('component directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<div some-comp></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });

      it('component directives must be first in collected directives', () => {
        var results = createPipeline().process(el('<div some-comp some-decor></div>'));
        var dirs = results[0].getAllDirectives();
        expect(dirs.length).toEqual(2);
        expect(dirs[0]).toEqual(reader.read(SomeComponent));
        expect(dirs[1]).toEqual(reader.read(SomeDecorator));
      });

      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {
          'some-comp': 'someExpr'
        }});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });

      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {
          'some-comp': 'someExpr'
        }});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeComponent));
      });

      it('should not allow multiple component directives on the same element', () => {
         expect( () => {
           createPipeline().process(
             el('<div some-comp some-comp2></div>')
           );
         }).toThrowError('Multiple component directives not allowed on the same element - check <div some-comp some-comp2>');
      });

      it('should not allow component directives on <template> elements', () => {
         expect( () => {
           createPipeline().process(
             el('<template some-comp></template>')
           );
         }).toThrowError('Only template directives are allowed on template elements - check <template some-comp>');
       });
    });

    describe("dynamic component directives", () => {
      it('should detect dynamic component', () => {
        var results = createPipeline().process(el('<div some-dynamic-comp></div>'));
        expect(results[0].componentDirective).toEqual(reader.read(SomeDynamicComponent));
      });

      it('should not allow multiple dynamic component directives on the same element', () => {
        expect( () => {
          createPipeline().process(
            el('<div some-dynamic-comp some-dynamic-comp2></div>')
          );
        }).toThrowError(new RegExp('Multiple component directives not allowed on the same element'));
      });

      it('should not allow component and dynamic directives on the same element', () => {
        expect( () => {
          createPipeline().process(
            el('<div some-dynamic-comp some-comp></div>')
          );
        }).toThrowError(new RegExp('Multiple component directives not allowed on the same element'));
      });
    });

    describe('viewport directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<template some-templ></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });

      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {
          'some-templ': 'someExpr'
        }});
        var results = pipeline.process(el('<template></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });

      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {
          'some-templ': 'someExpr'
        }});
        var results = pipeline.process(el('<template></template>'));
        expect(results[0].viewportDirective).toEqual(reader.read(SomeViewport));
      });

      it('should not allow multiple viewport directives on the same element', () => {
        expect( () => {
          createPipeline().process(
            el('<template some-templ some-templ2></template>')
          );
        }).toThrowError('Only one viewport directive can be used per element - check <template some-templ some-templ2>');
      });

      it('should not allow viewport directives on non <template> elements', () => {
        expect( () => {
          createPipeline().process(
            el('<div some-templ></div>')
          );

        }).toThrowError('Viewport directives need to be placed on <template> elements or elements with template attribute - check <div some-templ>');
      });
    });

    describe('decorator directives', () => {
      it('should detect them in attributes', () => {
        var results = createPipeline().process(el('<div some-decor></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });

      it('should detect them in property bindings', () => {
        var pipeline = createPipeline({propertyBindings: {
          'some-decor': 'someExpr'
        }});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });

      it('should compile children by default', () => {
        var results = createPipeline().process(el('<div some-decor></div>'));
        expect(results[0].compileChildren).toEqual(true);
      });

      it('should stop compiling children when specified in the decorator config', () => {
        var results = createPipeline().process(el('<div some-decor-ignorichang-children></div>'));
        expect(results[0].compileChildren).toEqual(false);
      });

      it('should detect them in variable bindings', () => {
        var pipeline = createPipeline({variableBindings: {
          'some-decor': 'someExpr'
        }});
        var results = pipeline.process(el('<div></div>'));
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecorator)]);
      });

      it('should not instantiate decorator directive twice', () => {
        var pipeline = createPipeline({propertyBindings: {
          'some-decor-with-binding': 'someExpr'
        }});
        var results = pipeline.process(el('<div some-decor-with-binding="foo"></div>'));
        expect(results[0].decoratorDirectives.length).toEqual(1);
        expect(results[0].decoratorDirectives).toEqual([reader.read(SomeDecoratorWithBinding)]);
      });
    });
  });
}

class MockStep extends CompileStep {
  processClosure:Function;
  constructor(process) {
    super();
    this.processClosure = process;
  }
  process(parent:CompileElement, current:CompileElement, control:CompileControl) {
    this.processClosure(parent, current, control);
  }
}

@Decorator({
  selector: '[some-decor]'
})
class SomeDecorator {}

@Decorator({
  selector: '[some-decor-ignorichang-children]',
  compileChildren: false
})
class SomeDecoratorIgnoringChildren {
}

@Decorator({
  selector: '[some-decor-with-binding]',
  bind: {
    'some-decor-with-binding': 'foo'
  }
})
class SomeDecoratorWithBinding {}

@Viewport({
  selector: '[some-templ]'
})
class SomeViewport {}

@Viewport({
  selector: '[some-templ2]'
})
class SomeViewport2 {}

@Component({selector: '[some-comp]'})
class SomeComponent {}

@Component({selector: '[some-comp2]'})
class SomeComponent2 {}

@DynamicComponent({selector: '[some-dynamic-comp]'})
class SomeDynamicComponent {}

@DynamicComponent({selector: '[some-dynamic-comp2]'})
class SomeDynamicComponent2 {}

@Component()
@Template({
    directives: [SomeDecorator, SomeViewport, SomeViewport2,
      SomeComponent, SomeComponent2,
      SomeDynamicComponent, SomeDynamicComponent2
    ]
})
class MyComp {}
