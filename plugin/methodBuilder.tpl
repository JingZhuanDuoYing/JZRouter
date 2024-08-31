// auto-generated
{{#each importList}}
import { {{importClause}} } from "{{importFrom}}";
{{/each}}
import router from '@jzdy/router';

class JZRouterImportDelegate {
  static init(): void {
    import("ets/generated/JZRouterImportDelegate").then((m: Record<string, Function>) => {
      router.init(m)
    })
  }
}

export function getGeneratedJZRouterImport(name: string): Promise<Record<string, ESObject>> {
  switch (name) {
    {{#each viewList}}
    {{#if isNameExpression}}
    case {{functionName}}:
    {{else}}
    case "{{functionName}}":
    {{/if}}
      return import('{{importPath}}');
    {{/each}}
    default:
      return Promise.reject(`${name} not found`);
  }
}

export default JZRouterImportDelegate
