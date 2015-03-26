import {ddescribe, describe, it, iit, expect, beforeEach} from 'changular2/test_lib';
import {DirectiveMetadataReader} from 'changular2/src/core/compiler/directive_metadata_reader';
import {PrivateComponentLoader} from 'changular2/src/core/compiler/private_component_loader';
import {Decorator, Viewport} from 'changular2/src/core/annotations/annotations';

@Decorator({selector: 'someDecorator'})
class SomeDecorator {}

@Viewport({selector: 'someViewport'})
class SomeViewport {}

export function main() {
  describe("PrivateComponentLoader", () => {
    var loader;

    beforeEach(() => {
      loader = new PrivateComponentLoader(null, null, null,  new DirectiveMetadataReader());
    });

    describe('Load errors', () => {
      it('should throw when trying to load a decorator', () => {
        expect(() => loader.load(SomeDecorator, null))
            .toThrowError("Could not load 'SomeDecorator' because it is not a component.");
      });

      it('should throw when trying to load a viewport', () => {
        expect(() => loader.load(SomeViewport, null))
            .toThrowError("Could not load 'SomeViewport' because it is not a component.");
      });
    });
  });
}
