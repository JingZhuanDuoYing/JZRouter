import { hvigor, HvigorNode, HvigorPlugin } from '@ohos/hvigor';
import * as fs from 'fs';
import { JZRouterCompileOptions } from './types';
import * as path from 'path';
import { EtsAnalyzer } from './EtsAnalyzer';

// const APP_JSON_PATH = '/AppScope/app.json5';

const PLUGIN_ID = 'hvigor-jz-router-plugin'
const ROUTER_ANNOTATION_NAME = 'Entry';
const ROUTER_BUILDER_PATH = "src/main/ets/generated";
const ROUTER_BUILDER_NAME = "RouterBuilder.ets";
const ROUTER_MAP_PATH = "src/main/resources/rawfile/routerMap";

export function JZRouterPlugin(options: JZRouterCompileOptions = new JZRouterCompileOptions()): HvigorPlugin {
  options.annotation = ROUTER_ANNOTATION_NAME;
  options.routerMapDir = ROUTER_MAP_PATH;
  options.builderDir = ROUTER_BUILDER_PATH;
  options.builderFileName = ROUTER_BUILDER_NAME;

  return {
    pluginId: PLUGIN_ID,
    async apply(currentNode: HvigorNode): Promise<void> {

      log(`Exec start`);
      log(`nodeName: ${currentNode.getNodeName()}, nodePath: ${currentNode.getNodePath()}}`);
      options.moduleName = currentNode.getNodeName();

      // 每个模块生成一个generateRouter文件
      generateRouterFile(currentNode);
    }
  }

  function generateRouterFile(currentNode: HvigorNode) {
    let fileList = getEtsFiles(currentNode.getNodePath() + '/src/main/ets');
    fileList.forEach((filePath) => {
      log(`filePath: ${filePath}`);
      let analyzer = new EtsAnalyzer(options, filePath);
      analyzer.start();
      if (analyzer.routerAnnotationExisted) {
        log("解析路由: " + analyzer.analyzeResult.name);
      }
    })
  }

  function getEtsFiles(dir: string): string[] {
    if (options.scanFiles) {
      return options.scanFiles;
    }

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
      list
    };

    walk(dir)

    return files;
  }

  function log(message: string) {
    console.log(`[${PLUGIN_ID}]: ` + message);
  }
}

