
export class JZRouterCompileOptions {
  moduleName?: string;
  // 扫描的文件路径
  scanFiles?: string[];
  // 装饰器名称
  annotation?: string;
  // 注册路由的方法的文件名
  builderFileName?: string;
  // 注册路由的方法的文件路径
  builderDir?: string;
  // 路由表所在路径
  routerMapDir?: string;
}
