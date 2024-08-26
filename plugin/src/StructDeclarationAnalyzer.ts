import {StructDeclaration} from "ohos-typescript";
import {AnalyzeResult, JZRouterCompileOptions, ModuleExecConfig} from "./types";
import * as fs from "fs";
import * as path from "path";
import ts from "ohos-typescript";

export class StructDeclarationAnalyzer {

    // 文件路径
    sourcePath: string;
    // hvigor配置
    pluginConfig: JZRouterCompileOptions;
    // 模块配置
    moduleExecConfig: ModuleExecConfig;
    // 解析结果
    analyzeResult: AnalyzeResult = new AnalyzeResult();
    // 是否存在装饰器
    routerAnnotationExisted: boolean = false;

    allImportDeclaration: ts.ImportDeclaration[] = [];

    constructor(pluginConfig: JZRouterCompileOptions, moduleConfig: ModuleExecConfig, sourcePath: string) {
        this.pluginConfig = pluginConfig;
        this.sourcePath = sourcePath;
        this.moduleExecConfig = moduleConfig;
    }

    public start() {
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

    private analyze(node: StructDeclaration) {
        node.modifiers?.forEach(modifier => {
            if (modifier.kind === ts.SyntaxKind.Decorator) {
                this.parseDecoratorExpression(modifier.expression);
            }
        });
    }

    private parseDecoratorExpression(expression: ts.Expression) {
        if (expression?.kind === ts.SyntaxKind.CallExpression.valueOf()) {
            const name = expression.expression as ts.Identifier;
            if (name.escapedText === this.pluginConfig.annotation) {
                this.routerAnnotationExisted = true;
                const args = expression.arguments as ts.NodeArray<ts.Expression>;
                args.forEach(arg => {
                    if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression.valueOf()) {
                        const properties = arg as ts.ObjectLiteralExpression;
                        properties.properties.forEach(property => {
                            if (property.kind === ts.SyntaxKind.PropertyAssignment.valueOf()) {
                                const propertyAssignment = property as ts.PropertyAssignment;
                                if (propertyAssignment.name.escapedText == "routeName") {
                                    const propertyInitializer = propertyAssignment.initializer;
                                    if (propertyInitializer.kind === ts.SyntaxKind.StringLiteral) {
                                        const name = (propertyInitializer as ts.StringLiteral).text;
                                        this.analyzeResult.name = name;
                                    } else if (propertyInitializer.kind === ts.SyntaxKind.PropertyAccessExpression) {
                                        const propertyAccess = propertyInitializer as ts.PropertyAccessExpression;
                                        if (propertyAccess.expression.kind === ts.SyntaxKind.Identifier) {
                                            const spaceName = propertyAccess.expression.escapedText;
                                            // 保留所在import语句
                                            this.allImportDeclaration.forEach(importDeclaration => {
                                                const importClause = importDeclaration.importClause;
                                                const moduleSpecifier = importDeclaration.moduleSpecifier;
                                                importClause?.namedBindings?.elements?.forEach((element) => {
                                                    if (element.name.escapedText === spaceName) {
                                                        const importFrom = this.parseImportFrom(moduleSpecifier.text);
                                                        this.analyzeResult.importExp = {
                                                            importClause: spaceName,
                                                            importFrom: importFrom
                                                        };
                                                    }
                                                });
                                            })

                                            const value = spaceName + "." + propertyAccess.name.escapedText;
                                            
                                            this.analyzeResult.name = value;
                                            this.analyzeResult.isNameExpression = true;
                                        }
                                    }
                                }
                            }
                        });
                    }
                })
            }
        }
    }

    private resolveNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.StructDeclaration) {
            this.analyze(node as ts.StructDeclaration);
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            this.allImportDeclaration.push(node as ts.ImportDeclaration);
        }
    }

    private parseImportFrom(text: string) {
        // 如果是相对路径，则引入当前扫描的模块名
        if (text.startsWith(".")) {
            return this.moduleExecConfig.moduleName;
        }
        return text;
    }
}