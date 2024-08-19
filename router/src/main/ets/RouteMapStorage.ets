import { common } from '@kit.AbilityKit';

const JZ_ROUTER_MAP_STORAGE_NAME: string = '__JZ_ROUTER_MAP_STORAGE__'

export class RouteMapStorage {
  private static instance: RouteMapStorage;

  context?: common.UIAbilityContext;

  private constructor() {
  }

  public static getInstance(): RouteMapStorage {
    if (!RouteMapStorage.instance) {
      if (AppStorage.has(JZ_ROUTER_MAP_STORAGE_NAME)) {
        let cache = AppStorage.get<RouteMapStorage>(JZ_ROUTER_MAP_STORAGE_NAME)
        if (cache) {
          RouteMapStorage.instance
        }
      }
      if (!RouteMapStorage.instance) {
        RouteMapStorage.instance = new RouteMapStorage();
        AppStorage.setOrCreate(JZ_ROUTER_MAP_STORAGE_NAME, RouteMapStorage.instance)
      }
    }
    return RouteMapStorage.instance;
  }

  init(context: common.UIAbilityContext) {
    RouteMapStorage.getInstance().context = context
    this.buildRouteMap();
  }

  buildRouteMap() {
    let vs = RouteMapStorage.getInstance()
    // 没有调用初始化，则不构建路由图
    if (!vs.context) {
      return
    }
      try {
        let metaDataArray = vs.context.resourceManager.getStringArrayByNameSync('compiled_route_meta_data')
        if (metaDataArray?.length) {
          for (let item of metaDataArray) {
            console.log("-------- " + JSON.stringify(item));
          }
        }
      } catch (e) {
        console.log('router', '%{public}s',
          `Cannot read [compiled_route_meta_data], cause:${e.message ||
            '<unknown>'}. Please check if the routing compilation plugin [hvigor-easy-router-plugin] is correctly configured`)
      }
  }

}