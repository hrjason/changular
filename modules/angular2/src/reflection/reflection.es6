import {Type, isPresent} from 'changular2/src/facade/lang';
import {List, ListWrapper} from 'changular2/src/facade/collection';
import {Reflector} from './reflector';
export {Reflector} from './reflector';
import {ReflectionCapabilities} from './reflection_capabilities';

export var reflector = new Reflector(new ReflectionCapabilities());
