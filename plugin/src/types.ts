
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
  // 扫描的外部依赖
  scanModules?: string[];
  // 扫描的模块配置
  modulesExecConfig?: ModuleExecConfig[];
  // 生成代码模板
  builderTpl?: string;
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

export interface TemplateModel {
  importList: string[];
  viewList: ViewInfo[];
  constValueList: ConstValue[];
}

// 文件解析结果
export class AnalyzeResult {
  // 加载的组件名
  viewName?: string;
  // 组件注册方法名
  functionName?: string;
  // 路由中配置的路径
  name?: string;
  // 路由名是否为表达式
  isNameExpression?: Boolean = false;
  // 生成文件需要导入的组件
  importExp?: importClass;
  // 路由中传递的参数
  param?:string;
}

export class ImportClass {
  importClause?: string;
  importFrom?: string;
}

export class NodeInfo {
  value?: any;
}

export class ConstValue {
  key: string;
  value: string;
}