import common from '@ohos.app.ability.common';
import { RouteMapStorage } from './RouteMapStorage';
import sysRouter from '@ohos.router';
import { AsyncCallback, BusinessError } from '@ohos.base';

export namespace router {

  export function init(context: common.UIAbilityContext): void {
    RouteMapStorage.getInstance().init(context);
  }

  export function pushNamedRoute(
    options: sysRouter.NamedRouterOptions,
    mode?: sysRouter.RouterMode,
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
      let importModule = (moduleName: string) => {
        // 需要动态import模块
        import(moduleName)
          .then((m: ESObject) => {
            console.log("router import", m)
            resolve(m)
          })
          .catch((err: BusinessError) => {
            console.log("router import", err)
            reject(err)
          })
      }
      let importPath = RouteMapStorage.getInstance().getImportDir(routeName);
      importModule('exampleHar')
        // .then((m: ESObject) => {
        //   console.log("router import", m)
        //   resolve()
        // })
        // .catch((err: BusinessError)=> {
        //   console.log("router import", err)
        // })
    })
  }
}

