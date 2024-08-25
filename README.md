# JZRouter 鸿蒙动态路由插件

### 安装
1. 在项目根目录找到```hvigor```子目录，在`hvigor-config.json5`文件```dependencies```节点添加以下配置：

    ``` json
    "dependencies": {
        "hvigor-jz-router-plugin": "1.0.3"
    }
    ```

2. 在包含`UIAbility`的`hap`模块模块目录，执行以下命令：

    ``` bash
    ohpm install @jzdy/router
    ```
    安装成功后，可在`oh-package.json5`的`dependencies`节中看到`@jzdy/router`包，此时表示安装成功。

3. 在hap模块的```hvigorfile.ts```中配置插件并指定需要生成路由的子模块

    ```typescript
    import { JZRouterPlugin }  from "hvigor-jz-router-plugin";

    export default {
        system: hapTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
        plugins: [
          JZRouterPlugin({ scanModules: [
            "module1",
            "@jzdy/module2"
          ]})
        ]
    }
    ```

### 初始化
插件同步后在生成```ets/generated/JZRouterImporter.ets```文件，调用其中的初始化方法
```typescript
JZRouterImporter.init()
```

### 开始使用

您只需要将```import router from '@ohos/router'```替换为```import router from '@jzdy/router'```即可。


