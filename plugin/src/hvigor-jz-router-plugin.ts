import { HvigorNode, HvigorPlugin, hvigor } from '@ohos/hvigor';

export function JZRouterPlugin(): HvigorPlugin {
  return {
    pluginId: 'hvigor-jz-router-plugin',
    apply(node: HvigorNode) {

      console.log(`JZRouterPlugin: Generating routes...[${node.getNodeName()}]`);

      console.log(`JZRouterPlugin: Generating routes...`, node.extraOption);
    
      console.log(`JZRouterPlugin nodeName: ${node.getNodeName()}, nodePath: ${node.getNodePath()}}`);


    }
  }
}