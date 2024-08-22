import sysRouter from '@ohos.router'
import { AsyncCallback } from '@ohos.base';
import uiObserver from '@ohos.arkui.observer';
import { UIContext } from '@ohos.arkui.UIContext';

const JZ_PAGE_ROUTE_UPDATE_EVENT = "__JZ_PAGE_ROUTE_EVENT__"

class JZRouterEmitter {

  static pushNamedRoute(options: sysRouter.NamedRouterOptions): void;
  static pushNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode): Promise<void>;
  static pushNamedRoute(options: sysRouter.NamedRouterOptions, callback?: AsyncCallback<void>): Promise<void>;
  static pushNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode, callback?: AsyncCallback<void>): Promise<void>;

  static pushNamedRoute(options: sysRouter.NamedRouterOptions, callbackOrMode?: AsyncCallback<void> | sysRouter.RouterMode, callback?: AsyncCallback<void>): void | Promise<void>{
    if (callbackOrMode && callbackOrMode instanceof Function) {
      return sysRouter.pushNamedRoute(options, callbackOrMode);
    } else {
      if (callbackOrMode && callback) {
        return sysRouter.pushNamedRoute(options, callbackOrMode as sysRouter.RouterMode, callback);
      } else {
        return sysRouter.pushNamedRoute(options, callbackOrMode as sysRouter.RouterMode);
      }
    }
  }


}
