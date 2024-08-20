
export class RouterInfo {
  // 路由名，自定义装饰器中配置的参数值
  name?: string;
  // 模块名
  module?: string;
  // 所在目录
  importDir?: string;
}

export class RouterMap {
  generatedRouteMap?: RouterInfo[]
}
