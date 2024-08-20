import { router } from '@kit.ArkUI';

const NAME = "myRouteName123456789"

@Entry({
  routeName: NAME
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
          import('exampleHar').then(() => {
            router.pushNamedRoute({
              name: "MainPage"
            }, (err) => {
              if (err) {
                console.error("router.pushUrl", err)
              }
            })
          })
        })
    }
    .height('100%')
    .width('100%')
  }
}