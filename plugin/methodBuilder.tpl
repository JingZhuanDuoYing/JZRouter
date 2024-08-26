// auto-generated
{{#each importList}}
import { {{importClause}} } from "{{importFrom}}";
{{/each}}
import router from '@jzdy/router';

class JZRouterImporter {
  static init(): void {
    import("ets/generated/JZRouterImporter").then((m: ESObject) => {
      router.init(m)
    })
  }
}

export function getGeneratedJZRouterImport(name: string): Promise<Record<string, Function>> {
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

export default JZRouterImporter
