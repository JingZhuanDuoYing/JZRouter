import { hvigor, HvigorNode, HvigorPlugin } from '@ohos/hvigor';
import * as fs from 'fs';
import { JZRouterCompileOptions, RouterInfo, ModuleExecConfig } from './types';
import * as path from 'path';
import { EtsAnalyzer } from './EtsAnalyzer';
import Handlebars from 'handlebars';

const PLUGIN_ID = 'hvigor-jz-router-plugin'
const ROUTER_ANNOTATION_NAME = 'Entry';
const ROUTER_BUILDER_NAME = "jz_generated_route_map";
const ROUTER_MAP_PATH = "src/main/resources/rawfile";

export function JZRouterPlugin(options: JZRouterCompileOptions = new JZRouterCompileOptions()): HvigorPlugin {
  options.annotation = ROUTER_ANNOTATION_NAME;
  options.routerMapDir = ROUTER_MAP_PATH;
  options.builderFileName = ROUTER_BUILDER_NAME;

  return {
    pluginId: PLUGIN_ID,
    async apply(currentNode: HvigorNode): Promise<void> {

      log(`nodeName: ${currentNode.getNodeName()}, nodePath: ${currentNode.getNodePath()}}`);
      
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
          const depPath = path.resolve(options.modulePath, 'oh_modules', depModuleName, 'src/main/ets');
          let files = getEtsFiles(depPath);
          let depModule: ModuleExecConfig = {
            moduleName: depModuleName,
            modulePath: depPath,
            scanFiles: files,
          }
          options.modulesExecConfig?.push(depModule)
        })
      }

      log(`Exec start`);
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
  let routeInfos: RouterInfo[] = [];
  let routeMap: RouterMap = {
    generatedRouteMap: routeInfos
  }
  options.modulesExecConfig?.forEach((config) => {
    let moduleName = config.moduleName
    config.scanFiles.forEach((filePath) => {
      let analyzer = new EtsAnalyzer(options, filePath);
      analyzer.start();
      if (analyzer.routerAnnotationExisted) {
        let fileName = path.basename(filePath);

        log(`解析路由[${moduleName}-${fileName}]: ${JSON.stringify(analyzer.analyzeResult)}`);

        // 获取文件相对路径
        const importPath = path.relative(`${options.modulePath}/oh_modules`, path.dirname(filePath)).replaceAll("\\", "/");

        routeInfos.push({
          name: analyzer.analyzeResult.name,
          module: moduleName,
          value: importPath
        });
      }
    })
  });

  // 生成自定义路由表文件
  generateRouterMap(routeMap, options);
}

// 以json的格式生成路由表
function generateRouterMap(routerMap: StrArray, config: PluginConfig) {
  const jsonOutput = JSON.stringify(routerMap, null, 2);
  const routerMapDir = `${config.modulePath}/${config.routerMapDir}`;
  if (!fs.existsSync(routerMapDir)) {
    fs.mkdirSync(routerMapDir, { recursive: true });
  }
  fs.writeFileSync(`${routerMapDir}/${config.builderFileName}.json`, jsonOutput, { encoding: "utf8" });
  log(`生成路由表文件: ${routerMapDir}/${config.builderFileName}.json`);
}