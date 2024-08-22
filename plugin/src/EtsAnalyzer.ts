import * as fs from 'fs';
import ts, { ExpressionStatement, Identifier, PropertyName, StringLiteral } from 'typescript';
import { JZRouterCompileOptions } from './types';
import * as path from 'path';

export class EtsAnalyzer {
  // 文件路径
  sourcePath: string;
  // hvigor配置
  pluginConfig: JZRouterCompileOptions;
  // 解析结果
  analyzeResult: AnalyzeResult = new AnalyzeResult();
  // 关键字位置
  keywordPos: number = 0;
  // 是否存在装饰器
  routerAnnotationExisted: boolean = false;

  constructor(pluginConfig: JZRouterCompileOptions, sourcePath: string) {
    this.pluginConfig = pluginConfig;
    this.sourcePath = sourcePath;
  }

  start() {
    // 读取文件
    const sourceCode = fs.readFileSync(this.sourcePath, "utf-8");
    // 解析文件，生成节点树信息
    const sourceFile = ts.createSourceFile(this.sourcePath, sourceCode, ts.ScriptTarget.ES2021, false);
    // 遍历节点信息
    ts.forEachChild(sourceFile, (node: ts.Node) => {
      // 解析节点
      this.resolveNode(node);
    });
  }

  resolveNode(node: ts.Node): NodeInfo | undefined {
    switch (node.kind) {
      // import节点（如 import * as path from "path";）
      case ts.SyntaxKind.ImportDeclaration:
        this.resolveImportDeclaration(node);
        break;
      // 未知的声明节点
      case ts.SyntaxKind.MissingDeclaration:
        this.resolveMissDeclaration(node);
        break;
      // 装饰器节点
      case ts.SyntaxKind.Decorator:
        this.resolveDecoration(node);
        break;
      // 函数调用节点
      case ts.SyntaxKind.CallExpression:
        this.resolveCallExpression(node);
        break;
      // 表达式节点
      case ts.SyntaxKind.ExpressionStatement:
        // this.resolveExpression(node);
        break;
      // 标识符节点
      case ts.SyntaxKind.Identifier:
        return this.resolveIdentifier(node);
      // 字符串节点
      case ts.SyntaxKind.StringLiteral:
        return this.resolveStringLiteral(node);
      // 对象赋值节点
      case ts.SyntaxKind.PropertyAssignment:
        return this.resolvePropertyAssignment(node);
    }
  }

  resolveConstantValue(constantName: string): ts.Node | undefined {
    const sourceFile = ts.createSourceFile(this.sourcePath, fs.readFileSync(this.sourcePath, 'utf-8'), ts.ScriptTarget.ES2021);
    let constantNode: ts.Node | undefined;

    // 1. 先在本地定义中查找
    ts.forEachChild(sourceFile, (node) => {
      if (node.kind === ts.SyntaxKind.VariableStatement) {
        const variableStatement = node as ts.VariableStatement;
        variableStatement.declarationList.declarations.forEach(declaration => {
          if (declaration.name.kind === ts.SyntaxKind.Identifier && (declaration.name as ts.Identifier).text === constantName) {
            constantNode = declaration.initializer;
          }
        });
      }
    });

    // 2. 如果本地未找到，再查找import语句，解析外部模块
    if (!constantNode) {
      ts.forEachChild(sourceFile, (node) => {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          const importDeclaration = node as ts.ImportDeclaration;
          const moduleName = (importDeclaration.moduleSpecifier as ts.StringLiteral).text;

          // 手动构建模块路径（假设模块路径是相对路径）
          let modulePath = moduleName;
          if (!fs.existsSync(moduleName) && !moduleName.startsWith('/')) {
            modulePath = path.join(this.pluginConfig.modulePath, "oh_modules", moduleName);
          }

          if (fs.existsSync(modulePath)) {
            const moduleSourceCode = fs.readFileSync(modulePath, 'utf-8');
            const moduleSourceFile = ts.createSourceFile(modulePath, moduleSourceCode, ts.ScriptTarget.ES2021, false);

            ts.forEachChild(moduleSourceFile, (node) => {
              if (node.kind === ts.SyntaxKind.VariableStatement) {
                const variableStatement = node as ts.VariableStatement;
                variableStatement.declarationList.declarations.forEach(declaration => {
                  if (declaration.name.kind === ts.SyntaxKind.Identifier && (declaration.name as ts.Identifier).text === constantName) {
                    constantNode = declaration.initializer;
                  }
                });
              }
            });

            // 如果找到常量值，直接返回
            if (constantNode) {
              return constantNode;
            }
          } else {
            console.error(`Module file not found: ${modulePath}`);
          }
        }
      });
    }

    return constantNode;
  }


  // import节点，不做操作
  resolveImportDeclaration(node: ts.Node) {
    let importDeclaration = node as ts.ImportDeclaration;
  }

  // 未知节点，则继续解析子节点
  resolveMissDeclaration(node: ts.Node) {
    node.forEachChild((cnode) => {
      this.resolveNode(cnode);
    })
  }

  // 解析装饰器
  resolveDecoration(node: ts.Node) {
    // 转换为装饰器节点类型
    let decorator = node as ts.Decorator;
    // 判断表达式是否是函数调用
    if (decorator.expression.kind === ts.SyntaxKind.CallExpression) {
      const callExpression = decorator.expression as ts.CallExpression;
      // 表达式类型是否是标识符
      if (callExpression.expression.kind === ts.SyntaxKind.Identifier) {
        const identifier = callExpression.expression as ts.Identifier;
        // 标识符是否是自定义的装饰器
        if (identifier.text === this.pluginConfig.annotation) {
          this.routerAnnotationExisted = true;
          const arg = callExpression.arguments[0];
          // 调用方法的第一个参数是否是表达式
          if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const properties = (arg as ts.ObjectLiteralExpression).properties;
            // 遍历装饰器中的所有参数
            properties.forEach((propertie) => {
              if (propertie.kind === ts.SyntaxKind.PropertyAssignment) {
                const nameNode = propertie.name as ts.Identifier;
                let valueNode = propertie.initializer;

                // 如果是标识符，意味着可能是一个常量
                if (valueNode.kind === ts.SyntaxKind.Identifier) {
                  const constValueNode = this.getConstValue(valueNode as ts.Identifier);
                  if (constValueNode) {
                    valueNode = constValueNode;
                  }
                }

                // 参数是否是自定义装饰器中的变量名
                if (nameNode.escapedText === "routeName") {
                  // 将装饰器中的变量的值赋值给解析结果中的变量
                  this.analyzeResult.name = (valueNode as ts.StringLiteral).text;
                }
                if (nameNode.escapedText === "hasParam") {
                  // 将装饰器中的变量的值赋值给解析结果中的变量
                  this.analyzeResult.param = valueNode.kind === ts.SyntaxKind.TrueKeyword ? "param: ESObject" : "";
                }
              }
            });
          }
        }
      }
    }
  }

  // 查找标识符对应的常量值
  getConstValue(identifier: ts.Identifier): ts.Expression | undefined {
    let constValue: ts.Expression | undefined;
    ts.forEachChild(ts.createSourceFile(this.sourcePath, fs.readFileSync(this.sourcePath, 'utf-8'), ts.ScriptTarget.ES2021, false), (node) => {
      if (node.kind === ts.SyntaxKind.VariableStatement) {
        const variableStatement = node as ts.VariableStatement;
        const declarations = variableStatement.declarationList.declarations;
        declarations.forEach(declaration => {
          if (declaration.name.getText() === identifier.getText()) {
            constValue = declaration.initializer;
          }
        });
      }
    });
    return constValue;
  }


  // 解析函数调用
  resolveCallExpression(node: ts.Node) {
    let args = node as ts.CallExpression;
    let identifier = this.resolveNode(args.expression);
    this.parseRouterConfig(args.arguments, identifier);
  }

  // 解析函数
  resolveExpression(node: ts.Node) {
    let args = node as ts.ExpressionStatement;
    let identifier = this.resolveNode(args.expression);
    if (this.analyzeResult?.name?.endsWith(identifier?.value)) {
      this.analyzeResult.viewName = identifier?.value;
      let viewName: string = identifier?.value.toString();
      viewName = `${viewName.charAt(0).toLowerCase()}${viewName.slice(1, viewName.length)}`;
      this.analyzeResult.functionName = viewName;
    }
  }

  // 解析表达式
  resolveIdentifier(node: ts.Node): NodeInfo {
    let identifier = node as ts.Identifier;
    let info = new NodeInfo();
    info.value = identifier.escapedText.toString();
    return info;
  }

  // 解析字符串
  resolveStringLiteral(node: ts.Node): NodeInfo {
    let stringLiteral = node as ts.StringLiteral;
    let info = new NodeInfo();
    info.value = stringLiteral.text;
    return info;
  }

  // 解析属性赋值
  resolvePropertyAssignment(node: ts.Node): NodeInfo {
    let propertyAssignment = node as ts.PropertyAssignment;
    let propertyName = this.resolveNode(propertyAssignment.name)?.value;
    let propertyValue = this.resolveNode(propertyAssignment.initializer)?.value;
    let info = new NodeInfo();
    info.value = {
      key: propertyName,
      value: propertyValue
    }
    return info;
  }

  // 解析路由配置
  parseRouterConfig(node: ts.NodeArray<ts.Expression>, nodeInfo?: NodeInfo) {
    if (nodeInfo?.value === this.pluginConfig.annotation) {
      node.flatMap((e: ts.Expression) => {
        ((e as ts.ObjectLiteralExpression).properties).forEach((e: ts.ObjectLiteralElementLike) => {
          this.parseConfig(e, this.analyzeResult);
        })
      });
    }
  }

  parseConfig(node: ts.ObjectLiteralElementLike, analyzeResult: AnalyzeResult) {
    let info = this.resolveNode(node);
    Reflect.set(analyzeResult, info?.value["key"], info?.value["value"]);
  }
}


// 文件解析结果
class AnalyzeResult {
  // 加载的组件名
  viewName?: string;
  // 组件注册方法名
  functionName?: string;
  // 路由中配置的路径
  name?: string;
  // 路由中传递的参数
  param?:string;
}

class NodeInfo {
  value?: any;
}