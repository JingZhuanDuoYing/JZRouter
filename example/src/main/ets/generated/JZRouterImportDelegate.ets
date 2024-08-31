// auto-generated
import { jzdyRouter } from "@jzdy/exampleHar";
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
    case jzdyRouter.LOGIN:
      return import('ets/pages/LoginPage');
    case "MainPage":
      return import('@jzdy/exampleHar/src/main/ets/components/MainPage');
    default:
      return Promise.reject(`${name} not found`);
  }
}

export default JZRouterImportDelegate
