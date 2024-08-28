import sysRouter from '@ohos.router'
import router from '@jzdy/router';
import { jzdyRouter } from './Constants';
import promptAction from '@ohos.promptAction';

@Entry({
  routeName: "MainPage"
})
@Component
export struct MainPage {

  build() {

    Column({ space: 8 }) {
      Text(`routeName: MainPage`).fontSize(30)

      Button("子模块跳转主模块命名路由（@ohos.router）")
        .onClick(() => {
          sysRouter.pushNamedRoute({
            name: jzdyRouter.LOGIN
          }, (err) => {
            if (err) {
              // 使用@ohos.router, 不导入共享包中的命名路由页面则无法跳转
              promptAction.showToast({ message: `${err.message}` })
            }
          })
        })
      Button("子模块跳转主模块命名路由（@jzdy/router）")
        .onClick(() => {
          router.pushNamedRoute({
            name: jzdyRouter.LOGIN
          }, (err) => {
            if (err) {
              promptAction.showToast({ message: `${err.message}` })
            }
          })
        })

      Blank()
      Text("example Har").fontSize(32)
    }
    .height('100%')
    .width('100%')
  }
}
