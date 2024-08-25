import { router } from '@jzdy/router';
import { exampleRouterName } from '@jzdy/exampleHar';

@Entry({
  routeName: exampleRouterName.ROUTER_NAME_TEST
})
@Component
export struct Index {
  @State message: string = 'Hello World';

  build() {
    Column() {
      Text(this.message)
        .id('HelloWorld')
        .fontSize(50)
        .fontWeight(FontWeight.Bold)

      Button("跳转子模块页面")
        .onClick(() => {
          router.pushNamedRoute({
            name: "MainPage"
          })
          // import('exampleHar/src/main/ets/components/MainPage').then(() => {
          //   router.pushNamedRoute({
          //     name: "MainPage"
          //   }, (err) => {
          //     if (err) {
          //       console.error("router.pushUrl", err)
          //     }
          //   })
          // })
        })
    }
    .height('100%')
    .width('100%')
  }
}