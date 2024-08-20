
export class JZRouterCompileOptions {
  // 注册路由的方法的文件名
  builderFileName?: string;
  // 注册路由的方法的文件路径
  builderDir?: string;
  // 路由表所在路径
  routerMapDir?: string;
  // 模块名
  moduleName?: string;
  // 模块路径
  modulePath?: string;
  // 装饰器名称
  annotation?: string;
  // 扫描的文件路径
  scanFiles?: string[];
  // 扫描的外部依赖
  scanModules?: string[];
  // 扫描的模块配置
  modulesExecConfig?: ModuleExecConfig[];
}

export class ModuleExecConfig {
  // 模块名
  moduleName?: string;
  // 模块路径
  modulePath?: string;
  // 扫描的文件路径
  scanFiles?: string[];
  // 是否Hap模块
  isHapModule: boolean = false;
}

class RouterInfo {
  // 路由名，自定义装饰器中配置的参数值
  name?: string;
  // 模块名
  module?: string;
  // 所在目录
  value?: string;
}

// 路由表
interface RouterMap {
  name: string;
  value: RouterInfo[];
}

interface StrArray {
  strarray: RouterMap[];
}

// 用于生成组件注册类
class ViewInfo {
  // 自定义组件的名字
  viewName?: string;
  // import路径
  importPath?: string;
  // 组件注册方法名
  functionName?: string;
  // 方法是否有参数
  param?:string;
}

