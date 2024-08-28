// auto-generated
import { jzdyRouter } from "@jzdy/exampleHar";
import router from '@jzdy/router';

class JZRouterImporter {
  static init(): void {
    import("ets/generated/JZRouterImporter").then((m: Record<string, Function>) => {
      router.init(m)
    })
  }
}

export function getGeneratedJZRouterImport(name: string): Promise<Record<string, Function>> {
  switch (name) {
    case jzdyRouter.LOGIN:
      return import('ets/pages/LoginPage');
    case "MainPage":
      return import('@jzdy/exampleHar/src/main/ets/components/MainPage');
    default:
      return Promise.reject(`${name} not found`);
  }
}

export default JZRouterImporter
