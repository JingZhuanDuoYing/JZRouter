import common from '@ohos.app.ability.common';
import { RouteMapStorage } from './RouteMapStorage';

export namespace router {

  export function init(context: common.UIAbilityContext): void {
    RouteMapStorage.getInstance().init(context);
  }

}