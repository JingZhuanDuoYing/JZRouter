// auto-generated

import { router } from '@jzdy/router';

class JZRouterImporter {
  static init(): void {
    import("ets/generated/JZRouterImporter").then((m: Record<string, Function>) => {
      router.init(m)
    })
  }
}

{{#each viewList}}
export function {{functionName}}(): Promise<Record<string, Function>> {
   return import('{{importPath}}')
}

{{/each}}
export default JZRouterImporter