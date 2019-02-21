import { IRouterContext } from "koa-router";
import { toSafeInteger, isInteger, get } from "lodash";
import { ParametersException } from "lin-cms-test";

export function getSafeParamId(ctx: IRouterContext) {
  const id = toSafeInteger(get(ctx.params, "id"));
  if (!isInteger(id)) {
    throw new ParametersException({ msg: "路由参数错误" });
  }
  return id;
}
