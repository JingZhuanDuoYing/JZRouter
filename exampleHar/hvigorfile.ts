import { harTasks } from '@ohos/hvigor-ohos-plugin';
import { JZRouterPlugin }  from "hvigor-jz-router-plugin";

export default {
    system: harTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins: [
      // JZRouterPlugin()
    ]   /* Custom plugin to extend the functionality of Hvigor. */
}