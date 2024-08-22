import common from '@ohos.app.ability.common';
import { RouteMapStorage } from './RouteMapStorage';
import sysRouter from '@ohos.router';
import { AsyncCallback, BusinessError } from '@ohos.base';

export namespace router {

  let ensureImportFunc: (importPath: string) => Promise<void>
  let importer: Record<string, Function>

  export function init(context: common.UIAbilityContext, routeImporter: Record<string, Function>): void {
    RouteMapStorage.getInstance().init(context);
    importer = routeImporter;
  }

  export function pushNamedRoute(
    options: sysRouter.NamedRouterOptions,
    // mode?: sysRouter.RouterMode,
    callback?: AsyncCallback<void>
  ): void | Promise<void> {
    return ensureImportRoute(options.name).catch(callback)
      .finally(() => {
        console.log("sysRouter", "sysRouter.pushNamedRoute")
        sysRouter.pushNamedRoute(options)
      })
  }

  function ensureImportRoute(routeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let importPath = RouteMapStorage.getInstance().getImportDir(routeName);
      console.log("router import", importPath)
      let funcName = "import_" + routeName.replaceAll("/", "_");
      importer[funcName]().then(resolve).catch(reject)
    })
  }
}

export default router;