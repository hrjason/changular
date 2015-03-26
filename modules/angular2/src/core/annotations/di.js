import {CONST} from 'changular2/src/facade/lang';
import {DependencyAnnotation} from 'changular2/di';

/**
 * The directive can inject an emitter function that would emit events onto the
 * directive host element.
 */
export class EventEmitter extends DependencyAnnotation {
  eventName: string;
  @CONST()
  constructor(eventName) {
    super();
    this.eventName = eventName;
  }
}

/**
 * The directive can inject a property setter that would allow setting this property on the
 * host element
 */
export class PropertySetter extends DependencyAnnotation {
  propName: string;
  @CONST()
  constructor(propName) {
    super();
    this.propName = propName;
  }
}
