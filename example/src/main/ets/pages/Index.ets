import router from '@jzdy/router';
import sysRouter from '@ohos.router';
import promptAction from '@ohos.promptAction';

@Entry
@Component
struct Index {

  build() {
    Column({ space: 8 }) {
      Button("@ohos.router跳转子模块命名路由")
        .onClick(() => {
          sysRouter.pushNamedRoute({
            name: "MainPage"
          }, (err) => {
            if (err) {
              // 使用@ohos.router, 不导入共享包中的命名路由页面则无法跳转
              promptAction.showToast({ message: `${err.message}` })
            }
          })
        })
      Button("@jzdy/router跳转子模块命名路由")
        .onClick(() => {
          router.pushNamedRoute({
            name: "MainPage"
          }, (err) => {
            if (err) {
              promptAction.showToast({ message: `${err.message}` })
            }
          })
        })

      Blank()
      Text("example").fontSize(32)
    }
    .height('100%')
    .width('100%')
  }
}