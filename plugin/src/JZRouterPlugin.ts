import { hvigor, HvigorNode, HvigorPlugin } from '@ohos/hvigor';
import * as fs from 'fs';
import { JZRouterCompileOptions, RouterInfo, TemplateModel, ViewInfo } from './types';
import * as path from 'path';
import { EtsAnalyzer } from './EtsAnalyzer';
import Handlebars from 'handlebars';

const PLUGIN_ID = 'hvigor-jz-router-plugin'
const ROUTER_ANNOTATION_NAME = 'Entry';
const ROUTER_BUILDER_PATH = "src/main/ets/generated";
const ROUTER_BUILDER_NAME = "RouterBuilder.ets";
const ROUTER_MAP_PATH = "src/main/resources/rawfile/routerMap";
const ROUTER_BUILDER_TEMPLATE = "viewBuilder.tpl";

export function JZRouterPlugin(options: JZRouterCompileOptions = new JZRouterCompileOptions()): HvigorPlugin {
  options.annotation = ROUTER_ANNOTATION_NAME;
  options.routerMapDir = ROUTER_MAP_PATH;
  options.builderDir = ROUTER_BUILDER_PATH;
  options.builderFileName = ROUTER_BUILDER_NAME;
  options.builderTpl = ROUTER_BUILDER_TEMPLATE;

  return {
    pluginId: PLUGIN_ID,
    async apply(currentNode: HvigorNode): Promise<void> {

      log(`nodeName: ${currentNode.getNodeName()}, nodePath: ${currentNode.getNodePath()}}`);
      options.moduleName = currentNode.getNodeName();
      options.modulePath = currentNode.getNodePath();
      options.scanFiles = getEtsFiles(currentNode.getNodePath() + '/src/main/ets');

      log(`Exec start`);
      pluginExec(options);
    }
  }
}

function getEtsFiles(dir: string): string[] {
  let files: string[] = [];

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

function generateRouterFile(currentNode: HvigorNode) {
  let fileList = getEtsFiles(currentNode.getNodePath() + '/src/main/ets');
  fileList.forEach((filePath) => {
    log(`filePath: ${filePath}`);
    let analyzer = new EtsAnalyzer(options, filePath);
    analyzer.start();
    if (analyzer.routerAnnotationExisted) {
      let fileName = path.basename(filePath);
      log(`解析路由[${options.moduleName}-${fileName}]: ${analyzer.analyzeResult.name}`);
    }
  })
}

function pluginExec(options: JZRouterCompileOptions) {
  const templateModel: TemplateModel = {
    viewList: []
  };
  const routerMap: RouterMap = {
    routerMap: []
  };
  options.scanFiles.forEach((filePath) => {
    log(`filePath: ${filePath}`);
    let analyzer = new EtsAnalyzer(options, filePath);
    analyzer.start();
    if (analyzer.routerAnnotationExisted) {
      let fileName = path.basename(filePath);

      log(`解析路由[${options.moduleName}-${fileName}]: ${analyzer.analyzeResult.name}`);

      // 获取文件相对路径
      const importPath = path.relative(`${options.modulePath}/${options.builderDir}`, filePath).replaceAll("\\", "/").replaceAll(".ets", "");

      templateModel.viewList.push({
        viewName: analyzer.analyzeResult.viewName,
        importPath: importPath,
        functionName: analyzer.analyzeResult.functionName,
        param:analyzer.analyzeResult.param===undefined?"":analyzer.analyzeResult.param
      });
      routerMap.routerMap.push({
        name: analyzer.analyzeResult.name,
        pageModule: options.moduleName,
        pageSourceFile: `${options.builderDir}/${options.builderFileName}`,
        registerFunction: `${analyzer.analyzeResult.functionName}Register`
      });
    }
  })
  // 生成路由方法文件
  generateBuilder(templateModel, options);
}


// 根据模板生成路由方法文件
function generateBuilder(templateModel: TemplateModel, options: Pluginoptions) {
  console.log(JSON.stringify(templateModel));
  const builderPath = path.resolve(__dirname, `../${options.builderTpl}`);
  const tpl = fs.readFileSync(builderPath, { encoding: "utf8" });
  const template = Handlebars.compile(tpl);
  const output = template({
    viewList: templateModel.viewList
  });

  const routerBuilderDir = `${options.modulePath}/${options.builderDir}`;
  if (!fs.existsSync(routerBuilderDir)) {
    fs.mkdirSync(routerBuilderDir, { recursive: true });
  }
  fs.writeFileSync(`${routerBuilderDir}/${options.builderFileName}`, output, { encoding: "utf8" });
  log(`生成路由方法文件: ${routerBuilderDir}/${options.builderFileName}`);
}