
export class JZRouterCompileOptions {
  // 注册路由的方法的文件名
  importerFileName?: string;

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

// 用于生成组件注册类
class ViewInfo {
  // 自定义组件的名字
  viewName?: string;
  // import路径
  importPath?: string;
  // 组件注册方法名
  functionName?: string;
}

interface TemplateModel {
  viewList: ViewInfo[];
}