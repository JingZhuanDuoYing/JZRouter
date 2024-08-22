// auto-generated

import { router } from '@jzdy/router';

class JZRouterImporter {
  static init(): void {
    import("ets/generated/JZRouterImporter").then((m: Record<string, Function>) => {
      router.init(m)
    })
  }
}

export function import_myRouteName123456789(): Promise<Record<string, Function>> {
   return import('ets/pages/Index')
}

export function import_MainPage(): Promise<Record<string, Function>> {
   return import('exampleHar/src/main/ets/components/MainPage')
}

export default JZRouterImporter
