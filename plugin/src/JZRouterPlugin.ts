import {hvigor, HvigorNode, HvigorPlugin} from '@ohos/hvigor';
import * as fs from 'fs';
import {ConstValue, ImportClass, JZRouterCompileOptions, ModuleExecConfig, TemplateModel} from './types';
import * as path from 'path';
import {EtsAnalyzer} from './EtsAnalyzer';
import Handlebars from 'handlebars';
import {StructDeclarationAnalyzer} from "./StructDeclarationAnalyzer";

const PLUGIN_ID = 'hvigor-jz-router-plugin'
const ROUTER_ANNOTATION_NAME = 'Entry';
// const ROUTER_BUILDER_NAME = "jz_generated_route_map";
const ROUTER_MAP_PATH = "src/main/resources/rawfile";
const ROUTER_BUILDER_PATH = "src/main/ets/generated";
const ROUTER_BUILDER_TEMPLATE = "methodBuilder.tpl";
const ROUTER_IMPORTER_NAME = "JZRouterImporter.ets";

export function JZRouterPlugin(options: JZRouterCompileOptions = new JZRouterCompileOptions()): HvigorPlugin {
    options.annotation = ROUTER_ANNOTATION_NAME;
    options.routerMapDir = ROUTER_MAP_PATH;
    options.builderDir = ROUTER_BUILDER_PATH;
    options.importerFileName = ROUTER_IMPORTER_NAME;
    options.builderTpl = ROUTER_BUILDER_TEMPLATE;

    return {
        pluginId: PLUGIN_ID,
        async apply(currentNode: HvigorNode): Promise<void> {

            options.moduleName = currentNode.getNodeName();
            options.modulePath = currentNode.getNodePath();

            let entryModule: ModuleExecConfig = {
                moduleName: currentNode.getNodeName(),
                modulePath: currentNode.getNodePath(),
                scanFiles: getEtsFiles(currentNode.getNodePath() + '/src/main/ets'),
                isHapModule: true
            }

            options.modulesExecConfig = [entryModule]

            if (options.scanModules) {
                options.scanModules.forEach(depModuleName => {
                    let depModulePath = path.resolve(options.modulePath, 'oh_modules', depModuleName);
                    if (!fs.existsSync(depModulePath)) {
                        log(`！！！[${depModuleName}]不存在，请检查 scanModules 配置`)
                        return;
                    }
                    let depPath = path.resolve(depModulePath, 'src/main/ets');
                    let files = getEtsFiles(depPath);
                    let depModule: ModuleExecConfig = {
                        moduleName: depModuleName,
                        modulePath: depPath,
                        scanFiles: files,
                    }
                    options.modulesExecConfig?.push(depModule)
                })
            }

            log(`Exec start, module: ${currentNode.getNodeName()}`);
            pluginExec(options);
        }
    }
}

function getEtsFiles(dir: string, fileList: string[] | undefined): string[] {
    let files: string[] = fileList ?? [];

    // 读取dir文件夹下的所有ets后缀的文件
    const walk = (currentPath: string) => {
        const list = fs.readdirSync(currentPath);
        list.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                walk(filePath);
            } else {
                if (path.extname(file) === ".ets") {
                    files.push(filePath);
                }
            }
        });
    };

    walk(dir)

    return files;
}

function log(message: string) {
    console.log(`[${PLUGIN_ID}]: ` + message);
}

function pluginExec(options: JZRouterCompileOptions) {
    let viewList: ViewInfo[] = [];
    let importList: Set<ImportClass> = new Set();
    let constValueList: ConstValue[] = [];
    let templateModel: TemplateModel = {
        viewList: viewList,
        importList: importList,
        constValueList: constValueList
    }
    options.modulesExecConfig?.forEach((config) => {
        let moduleName = config.moduleName
        config.scanFiles?.forEach((filePath) => {
            let analyzer = new StructDeclarationAnalyzer(options, config, filePath);

            analyzer.start();
            if (analyzer.routerAnnotationExisted) {
                // 获取文件相对路径
                const importPath =
                    path.relative(config.isHapModule ? `${options.modulePath}/src/main` : `${options.modulePath}/oh_modules`,
                        filePath).replaceAll("\\", "/").replace(".ets", "");

                log(`解析[${moduleName}]路由: "${analyzer.analyzeResult.name}" -> ${importPath}`);

                if (analyzer.analyzeResult.name) {
                    let funcName = analyzer.analyzeResult.name.replace(/\//g, "_");
                    // if (analyzer.analyzeResult.isNameExpression) {
                    //     funcName = funcName.replace(/\{|\}/g, "");
                    //     constValueList.push({
                    //         key: funcName,
                    //         value: analyzer.analyzeResult.name
                    //     });
                    // }
                    viewList.push({
                        functionName: funcName,
                        importPath: importPath,
                        isNameExpression: analyzer.analyzeResult.isNameExpression
                    })
                    if (analyzer.analyzeResult.importExp) {
                        // 判断是否存在
                        let existed = false;
                        importList.forEach((importExp) => {
                            if (importExp.importClause === analyzer.analyzeResult.importExp?.importClause) {
                                existed = true;
                            }
                        });
                        if (!existed) {
                            importList.add(analyzer.analyzeResult.importExp);
                        }
                    }
                }
            }
        })
    });

    // 生成路由方法文件
    generateBuilder(templateModel, options);
}

// 根据模板生成路由方法文件
function generateBuilder(templateModel: TemplateModel, options: JZRouterCompileOptions) {
    const builderPath = path.resolve(__dirname, `../${options.builderTpl}`);
    const tpl = fs.readFileSync(builderPath, {encoding: "utf8"});
    const template = Handlebars.compile(tpl);
    const output = template({
        viewList: templateModel.viewList,
        importList: templateModel.importList,
        constValueList: templateModel.constValueList,
    });

    const routerBuilderDir = `${options.modulePath}/${options.builderDir}`;
    if (!fs.existsSync(routerBuilderDir)) {
        fs.mkdirSync(routerBuilderDir, {recursive: true});
    }
    fs.writeFileSync(`${routerBuilderDir}/${options.importerFileName}`, output, {encoding: "utf8"});
    log(`生成路由方法文件: ${routerBuilderDir}/${options.importerFileName}`);
}