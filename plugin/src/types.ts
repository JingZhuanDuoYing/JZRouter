
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
  // 查找生成struct的关键字
  viewKeyword?: string[];
  // 生成代码模板
  builderTpl?: string;
  // 扫描的外部依赖
  scanModules?: string[];
  // 扫描的模块配置
  moduleExecConfig?: ModuleExecConfig[];
}

class ModuleExecConfig {
  // 模块名
  moduleName?: string;
  // 模块路径
  modulePath?: string;
  // 扫描的文件路径
  scanFiles?: string[];
}

class RouterInfo {
  // 路由名，自定义装饰器中配置的参数值
  name?: string;
  // 模块名
  pageModule?: string;
  // 所在目录
  importDir?: string;
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

interface TemplateModel {
  viewList: ViewInfo[];
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

