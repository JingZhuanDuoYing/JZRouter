import { jzdyRouter } from '@jzdy/exampleHar';

@Entry({
  routeName: jzdyRouter.LOGIN
})
@Component
struct LoginPage {

  build() {
    Column({ space: 8 }) {
      Text(`routeName: ${jzdyRouter.LOGIN}`).fontSize(30)

      Blank()
      Text("example").fontSize(32)
    }
    .height('100%')
    .width('100%')
  }
}