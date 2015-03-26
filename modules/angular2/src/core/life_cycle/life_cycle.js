import {Injectable} from 'changular2/di';
import {ChangeDetector} from 'changular2/change_detection';
import {VmTurnZone} from 'changular2/src/core/zone/vm_turn_zone';
import {ExceptionHandler} from 'changular2/src/core/exception_handler';
import {isPresent} from 'changular2/src/facade/lang';

@Injectable()
export class LifeCycle {
  _errorHandler;
  _changeDetector:ChangeDetector;
  _enforceNoNewChanges:boolean;

  constructor(exceptionHandler:ExceptionHandler, changeDetector:ChangeDetector = null, enforceNoNewChanges:boolean = false) {
    this._errorHandler = (exception, stackTrace) => {
      exceptionHandler.call(exception, stackTrace);
      throw exception;
    };
    this._changeDetector = changeDetector; // may be null when instantiated from application bootstrap
    this._enforceNoNewChanges = enforceNoNewChanges;
  }

  registerWith(zone:VmTurnZone, changeDetector:ChangeDetector = null) {
    if (isPresent(changeDetector)) {
      this._changeDetector=changeDetector;
    }

    zone.initCallbacks({
      onErrorHandler: this._errorHandler,
      onTurnDone: () => this.tick()
    });
  }

  tick() {
    this._changeDetector.detectChanges();
    if (this._enforceNoNewChanges) {
      this._changeDetector.checkNoChanges();
    }
  }
}
