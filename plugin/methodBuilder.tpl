// auto-generated
import { router } from '@jzdy/router';
import { common } from '@kit.AbilityKit';

class JZRouterImporter {
  static init(context: common.UIAbilityContext): void {
    import("ets/generated/JZRouterImporter").then((m: ESObject) => {
      router.init(context, m)
    })
  }
}

{{#each viewList}}
export function {{functionName}}(): Promise<ESObject> {
   return import('{{importPath}}')
}

{{/each}}
export default JZRouterImporter
