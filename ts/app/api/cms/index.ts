import { user } from "./user";
import { test } from "./test";
import { log } from "./log";
import { admin } from "./admin";
import { Redprint } from "lin-cms-test";

const cms = new Redprint({ prefix: "/cms" });

cms.use(user.routes()).use(user.allowedMethods());
cms.use(test.routes()).use(test.allowedMethods());
cms.use(log.routes()).use(log.allowedMethods());
cms.use(admin.routes()).use(admin.allowedMethods());

export { cms };
