library changular2.transform.common.options;

const ENTRY_POINT_PARAM = 'entry_point';
const REFLECTION_ENTRY_POINT_PARAM = 'reflection_entry_point';

/// Provides information necessary to transform an changular2 app.
class TransformerOptions {
  /// The path to the file where the application's call to [bootstrap] is.
  // TODO(kegluneq): Allow multiple entry points.
  final String entryPoint;

  /// The reflection entry point, that is, the path to the file where the
  /// application's [ReflectionCapabilities] are set.
  final String reflectionEntryPoint;

  TransformerOptions._internal(this.entryPoint, this.reflectionEntryPoint);

  factory TransformerOptions(String entryPoint, {String reflectionEntryPoint}) {
    if (entryPoint == null) {
      throw new ArgumentError.notNull(ENTRY_POINT_PARAM);
    } else if (entryPoint.isEmpty) {
      throw new ArgumentError.value(entryPoint, 'entryPoint');
    }
    if (reflectionEntryPoint == null || entryPoint.isEmpty) {
      reflectionEntryPoint = entryPoint;
    }
    return new TransformerOptions._internal(entryPoint, reflectionEntryPoint);
  }
}
