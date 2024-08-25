// auto-generated
import { exampleRouterName } from "@jzdy/exampleHar";
import { router } from '@jzdy/router';

class JZRouterImporter {
  static init(): void {
    import("ets/generated/JZRouterImporter").then((m: ESObject) => {
      router.init(m)
    })
  }
}

export function getGeneratedJZRouterImport(name: string): Promise<Record<string, Function>> {
  switch (name) {
    case exampleRouterName.ROUTER_NAME_TEST:
      return import('ets/pages/Index');
    case "MainPage":
      return import('@jzdy/exampleHar/src/main/ets/components/MainPage');
    default:
      return Promise.reject(`${name} not found`);
  }
}

export default JZRouterImporter
