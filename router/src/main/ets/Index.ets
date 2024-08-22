import sysRouter from '@ohos.router';
import { AsyncCallback } from '@ohos.base';

export namespace router {

  let importer: Record<string, Function>

  export function init(routeImporter: Record<string, Function>): void {
    importer = routeImporter;
  }

  function ensureImportRoute(routeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let funcName = "import_" + routeName.replaceAll("/", "_");
      importer[funcName]().then(resolve).catch(reject)
    })
  }

  export function pushNamedRoute(options: sysRouter.NamedRouterOptions): void;
  export function pushNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode): Promise<void>;
  export function pushNamedRoute(options: sysRouter.NamedRouterOptions, callback?: AsyncCallback<void>): Promise<void>;
  export function pushNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode, callback?: AsyncCallback<void>): Promise<void>;
  export function pushNamedRoute(
    options: sysRouter.NamedRouterOptions, callbackOrMode?: AsyncCallback<void> | sysRouter.RouterMode, callback?: AsyncCallback<void>
  ): void | Promise<void> {
    return ensureImportRoute(options.name).catch(callback)
      .finally(() => {
        if (callbackOrMode && callbackOrMode instanceof Function) {
            return sysRouter.pushNamedRoute(options, callbackOrMode);
        } else {
          if (callbackOrMode) {
            if (callback) {
              return sysRouter.pushNamedRoute(options, callbackOrMode as sysRouter.RouterMode, callback);
            } else {
              return sysRouter.pushNamedRoute(options, callbackOrMode as sysRouter.RouterMode);
            }
          } else if (callback) {
            return sysRouter.pushNamedRoute(options, callback);
          } else {
            return sysRouter.pushNamedRoute(options);
          }
        }
      })
  }

  export function replaceNamedRoute(options: sysRouter.NamedRouterOptions): void;
  export function replaceNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode): Promise<void>;
  export function replaceNamedRoute(options: sysRouter.NamedRouterOptions, callback?: AsyncCallback<void>): Promise<void>;
  export function replaceNamedRoute(options: sysRouter.NamedRouterOptions, mode: sysRouter.RouterMode, callback?: AsyncCallback<void>): Promise<void>;
  export function replaceNamedRoute(
    options: sysRouter.NamedRouterOptions, callbackOrMode?: AsyncCallback<void> | sysRouter.RouterMode, callback?: AsyncCallback<void>
  ): void | Promise<void> {
    return ensureImportRoute(options.name).catch(callback)
      .finally(() => {
        if (callbackOrMode && callbackOrMode instanceof Function) {
            return sysRouter.replaceNamedRoute(options, callbackOrMode);
        } else {
          if (callbackOrMode) {
            if (callback) {
              return sysRouter.replaceNamedRoute(options, callbackOrMode as sysRouter.RouterMode, callback);
            } else {
              return sysRouter.replaceNamedRoute(options, callbackOrMode as sysRouter.RouterMode);
            }
          } else if (callback) {
            return sysRouter.replaceNamedRoute(options, callback);
          } else {
            return sysRouter.replaceNamedRoute(options);
          }
        }
      })
  }

  export function pushUrl(options: sysRouter.RouterOptions): void;
  export function pushUrl(options: sysRouter.RouterOptions, mode: sysRouter.RouterMode): Promise<void>;
  export function pushUrl(options: sysRouter.RouterOptions, callback?: AsyncCallback<void>): Promise<void>;
  export function pushUrl(options: sysRouter.RouterOptions, mode: sysRouter.RouterMode, callback?: AsyncCallback<void>): Promise<void>;
  export function pushUrl(
    options: sysRouter.RouterOptions, callbackOrMode?: AsyncCallback<void> | sysRouter.RouterMode, callback?: AsyncCallback<void>
  ): void | Promise<void> {
    if (callbackOrMode && callbackOrMode instanceof Function) {
      return sysRouter.pushUrl(options, callbackOrMode);
    } else {
      if (callbackOrMode) {
        if (callback) {
          return sysRouter.pushUrl(options, callbackOrMode as sysRouter.RouterMode, callback);
        } else {
          return sysRouter.pushUrl(options, callbackOrMode as sysRouter.RouterMode);
        }
      } else {
        if (callback) {
          return sysRouter.pushUrl(options, callback);
        } else {
          return sysRouter.pushUrl(options);
        }
      }
    }
  }

  export function replaceUrl(options: sysRouter.RouterOptions): void;
  export function replaceUrl(options: sysRouter.RouterOptions, mode: sysRouter.RouterMode): Promise<void>;
  export function replaceUrl(options: sysRouter.RouterOptions, callback?: AsyncCallback<void>): Promise<void>;
  export function replaceUrl(options: sysRouter.RouterOptions, mode: sysRouter.RouterMode, callback?: AsyncCallback<void>): Promise<void>;
  export function replaceUrl(
    options: sysRouter.RouterOptions, callbackOrMode?: AsyncCallback<void> | sysRouter.RouterMode, callback?: AsyncCallback<void>
  ): void | Promise<void> {
    if (callbackOrMode && callbackOrMode instanceof Function) {
      return sysRouter.replaceUrl(options, callbackOrMode);
    } else {
      if (callbackOrMode) {
        if (callback) {
          return sysRouter.replaceUrl(options, callbackOrMode as sysRouter.RouterMode, callback);
        } else {
          return sysRouter.replaceUrl(options, callbackOrMode as sysRouter.RouterMode);
        }
      } else {
        if (callback) {
          return sysRouter.replaceUrl(options, callback);
        } else {
          return sysRouter.replaceUrl(options);
        }
      }
    }
  }

  export function back(index: number, params?: Object): void;
  export function back(options?: sysRouter.RouterOptions): void;
  export function back(optionsOrIndex?: sysRouter.RouterOptions | number, params?: Object): void {
    if (optionsOrIndex) {
      if (optionsOrIndex instanceof Number) {
        sysRouter.back(optionsOrIndex as number, params);
      } else {
        sysRouter.back(optionsOrIndex as sysRouter.RouterOptions);
      }
    } else {
      sysRouter.back();
    }
  }

  export function getParams(): Object {
    return sysRouter.getParams()
  }

  export function clear(): void {
    sysRouter.clear()
  }

  export function getState(): sysRouter.RouterState {
    return sysRouter.getState()
  }

  export function getLength(): string {
    return sysRouter.getLength()
  }

  export function getStateByIndex(index: number): sysRouter.RouterState | undefined {
    return sysRouter.getStateByIndex(index)
  }

  export function getStateByUrl(url: string): Array<sysRouter.RouterState> {
    return sysRouter.getStateByUrl(url)
  }

  export function showAlertBeforeBackPage(options: sysRouter.EnableAlertOptions): void {
    sysRouter.showAlertBeforeBackPage(options);
  }

  export function hideAlertBeforeBackPage(): void {
    sysRouter.hideAlertBeforeBackPage();
  }

}

export default router;