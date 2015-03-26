import {Injectable} from 'changular2/di';
import {isPresent, print} from 'changular2/src/facade/lang';
import {ListWrapper, isListLikeIterable} from 'changular2/src/facade/collection';

@Injectable()
export class ExceptionHandler {
  call(error, stackTrace = null, reason = null) {
    var longStackTrace = isListLikeIterable(stackTrace) ? ListWrapper.join(stackTrace, "\n\n") : stackTrace;
    var reasonStr = isPresent(reason) ? `\n${reason}` : '';
    print(`${error}${reasonStr}\nSTACKTRACE:\n${longStackTrace}`);
  }
}
