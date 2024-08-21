import { common } from '@kit.AbilityKit';
import util from '@ohos.util';
import { HashMap, JSON } from '@kit.ArkTS';
import { RouterMap } from "./type";

const JZ_ROUTER_MAP_STORAGE_NAME: string = '__JZ_ROUTER_MAP_STORAGE__'

export class RouteMapStorage {
  private static instance: RouteMapStorage;
  context?: common.UIAbilityContext;
  routeMap: HashMap<string, string> = new HashMap<string, string>()

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
      vs.context.resourceManager.getRawFileContent('jz_generated_route_map.json').then((content) => {
        const decoder = util.TextDecoder.create("utf-8")
        const jsonString = decoder.decodeWithStream(content)
        let jsonObj = JSON.parse(jsonString) as RouterMap

        jsonObj.generatedRouteMap?.forEach((info)=> {
          console.log("jz_generated_route_map.json, --  ", JSON.stringify(info))
          if (info.name) {
            this.routeMap.set(info.name, info.importDir)
          }
        })
      })

    } catch (e) {
      console.log('router', '%{public}s',
        `Cannot read [compiled_route_meta_data], cause:${e.message ||
          '<unknown>'}. Please check if the routing compilation plugin [hvigor-easy-router-plugin] is correctly configured`)
    }
  }

  getImportDir(routeName: string): string {
    return RouteMapStorage.getInstance().routeMap.get(routeName);
  }
}

