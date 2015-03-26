import {Map, MapWrapper, ListWrapper} from 'changular2/src/facade/collection';
import {Type, isPresent} from 'changular2/src/facade/lang';

import {Template} from 'changular2/src/core/annotations/template';
import {TemplateResolver} from 'changular2/src/core/compiler/template_resolver';

export class MockTemplateResolver extends TemplateResolver {
  _cmpTemplates: Map;

  constructor() {
    super();
    this._cmpTemplates = MapWrapper.create();
  }

  setTemplate(component: Type, template: Template) {
    MapWrapper.set(this._cmpTemplates, component, template);
  }

  resolve(component: Type): Template {
    var override = MapWrapper.get(this._cmpTemplates, component);

    if (isPresent(override)) {
      return override;
    }

    return super.resolve(component);
  }
}
