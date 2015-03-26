export {AST} from './src/change_detection/parser/ast';
export {Lexer} from './src/change_detection/parser/lexer';
export {Parser} from './src/change_detection/parser/parser';
export {Locals}
  from './src/change_detection/parser/locals';
export {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError}
    from './src/change_detection/exceptions';
export {ChangeRecord, ChangeDispatcher, ChangeDetector,
    CHECK_ONCE, CHECK_ALWAYS, DETACHED, CHECKED} from './src/change_detection/interfaces';
export {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector, BindingRecord}
    from './src/change_detection/proto_change_detector';
export {DynamicChangeDetector}
    from './src/change_detection/dynamic_change_detector';
export * from './src/change_detection/pipes/pipe_registry';
export {uninitialized} from './src/change_detection/change_detection_util';
export * from './src/change_detection/pipes/pipe';

import {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector}
    from './src/change_detection/proto_change_detector';
import {PipeRegistry} from './src/change_detection/pipes/pipe_registry';
import {IterableChangesFactory} from './src/change_detection/pipes/iterable_changes';
import {KeyValueChangesFactory} from './src/change_detection/pipes/keyvalue_changes';
import {NullPipeFactory} from './src/change_detection/pipes/null_pipe';

export class ChangeDetection {
  createProtoChangeDetector(name:string):ProtoChangeDetector{
    // TODO: this should be abstract, once supported in AtScript
    return null;
  }
}

export var defaultPipes = {
  "iterableDiff" : [
    new IterableChangesFactory(),
    new NullPipeFactory()
  ],
  "keyValDiff" : [
    new KeyValueChangesFactory(),
    new NullPipeFactory()
  ]
};

export class DynamicChangeDetection extends ChangeDetection {
  registry:PipeRegistry;

  constructor(registry:PipeRegistry) {
    super();
    this.registry = registry;
  }

  createProtoChangeDetector(name:string):ProtoChangeDetector{
    return new DynamicProtoChangeDetector(this.registry);
  }
}

export class JitChangeDetection extends ChangeDetection {
  registry:PipeRegistry;

  constructor(registry:PipeRegistry) {
    super();
    this.registry = registry;
  }

  createProtoChangeDetector(name:string):ProtoChangeDetector{
    return new JitProtoChangeDetector(this.registry);
  }
}

var _registry = new PipeRegistry(defaultPipes);

export var dynamicChangeDetection = new DynamicChangeDetection(_registry);
export var jitChangeDetection = new JitChangeDetection(_registry);
