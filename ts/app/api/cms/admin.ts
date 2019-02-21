import {
  Redprint,
  routeMetaInfo,
  paginate,
  adminRequired,
  ParametersException,
  Success,
  NotFound,
  Failed
} from "lin-cms-test";
import { get, set, isInteger, has, toSafeInteger } from "lodash";
import {
  ResetPasswordForm,
  UpdateUserInfoForm,
  NewGroupForm,
  UpdateGroupForm,
  DispatchAuthForm,
  DispatchAuthsForm,
  RemoveAuthsForm
} from "../../validators/forms";
import { AdminDao } from "../../dao/cms/admin";
import { getSafeParamId } from "../../libs/util";

const admin = new Redprint({
  prefix: "/admin"
});

const adminDao = new AdminDao();

admin.redGet(
  "getAuthority",
  "/authority",
  { auth: "查询所有可分配的权限", module: "管理员", mount: false },
  adminRequired,
  ctx => {
    const res = {};
    routeMetaInfo.forEach((v, k) => {
      const au = v["auth"];
      if (!has(res, `${v["module"]}.${au}`)) {
        set(res, `${v["module"]}.${au}`, [k]);
      } else {
        res[v["module"]][au].push(k);
      }
    });
    ctx.json(res);
  }
);

admin.redGet(
  "getAdminUsers",
  "/users",
  { auth: "查询所有用户", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const groupId = get(ctx.request.query, "group_id");
    const { start, count } = paginate(ctx);
    const { users, total } = await adminDao.getUsers(
      ctx,
      groupId,
      start,
      count
    );
    ctx.json({
      collection: users,
      // 超级管理员不算入总数
      total_nums: total
    });
  }
);

admin.redPut(
  "changeUserPassword",
  "/password/:id",
  { auth: "修改用户密码", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new ResetPasswordForm(ctx).validate();
    const id = toSafeInteger(get(ctx.params, "id"));
    if (!isInteger(id)) {
      throw new ParametersException({ msg: "路由参数错误" });
    }
    await adminDao.changeUserPassword(ctx, form, id);
    ctx.json(new Success({ msg: "密码修改成功" }));
  }
);

admin.redDelete(
  "deleteUser",
  "/:id",
  { auth: "删除用户", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const id = toSafeInteger(get(ctx.params, "id"));
    if (!isInteger(id)) {
      throw new ParametersException({ msg: "路由参数错误" });
    }
    await adminDao.deleteUser(ctx, id);
    ctx.json(new Success({ msg: "操作成功" }));
  }
);

admin.redPut(
  "updateUser",
  "/:id",
  { auth: "管理员更新用户信息", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new UpdateUserInfoForm(ctx).validate();
    const id = toSafeInteger(get(ctx.params, "id"));
    if (!isInteger(id)) {
      throw new ParametersException({ msg: "路由参数错误" });
    }
    await adminDao.updateUserInfo(ctx, form, id);
    ctx.json(new Success({ msg: "操作成功" }));
  }
);

admin.redGet(
  "getAdminGroups",
  "/groups",
  { auth: "查询所有权限组及其权限", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const { start, count } = paginate(ctx);
    const { groups, total } = await adminDao.getGroups(ctx, start, count);
    if (total < 1) {
      throw new NotFound({ msg: "未找到任何权限组" });
    }
    ctx.json({
      collection: groups,
      total_nums: total
    });
  }
);

admin.redGet(
  "getAllGroup",
  "/group/all",
  { auth: "查询所有权限组", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const groups = await ctx.manager.groupModel.find();
    if (!groups || groups.length < 1) {
      throw new NotFound({ msg: "未找到任何权限组" });
    }
    ctx.json(groups);
  }
);

admin.redGet(
  "getGroup",
  "/group/:id",
  { auth: "查询一个权限组及其权限", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const id = toSafeInteger(get(ctx.params, "id"));
    if (!isInteger(id)) {
      throw new ParametersException({ msg: "路由参数错误" });
    }
    const group = await adminDao.getGroup(ctx, id);
    ctx.json(group);
  }
);

admin.redPost(
  "createGroup",
  "/group",
  { auth: "新建权限组", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new NewGroupForm(ctx).validate();
    const ok = await adminDao.createGroup(ctx, form);
    if (ok) {
      ctx.json(new Failed({ msg: "新建分组失败" }));
    } else {
      ctx.json(new Success({ msg: "新建分组成功" }));
    }
  }
);

admin.redPut(
  "updateGroup",
  "/group/:id",
  { auth: "更新一个权限组", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    const form = new UpdateGroupForm(ctx).validate();
    await adminDao.updateGroup(ctx, form, id);
    ctx.json(new Success({ msg: "更新分组成功" }));
  }
);

admin.redDelete(
  "deleteGroup",
  "/group/:id",
  { auth: "删除一个权限组", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    await adminDao.deleteGroup(ctx, id);
    ctx.json(new Success({ msg: "删除分组成功" }));
  }
);

admin.redPost(
  "dispatchAuth",
  "/dispatch",
  { auth: "分配单个权限", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new DispatchAuthForm(ctx).validate();
    await adminDao.dispatchAuth(ctx, form);
    ctx.json(new Success({ msg: "添加权限成功" }));
  }
);

admin.redPost(
  "dispatchAuths",
  "/dispatch/patch",
  { auth: "分配多个权限", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new DispatchAuthsForm(ctx).validate();
    await adminDao.dispatchAuths(ctx, form);
    ctx.json(new Success({ msg: "添加权限成功" }));
  }
);

admin.redPost(
  "removeAuths",
  "/remove",
  { auth: "删除多个权限", module: "管理员", mount: false },
  adminRequired,
  async ctx => {
    const form = new RemoveAuthsForm(ctx).validate();
    await adminDao.removeAuths(ctx, form);
    ctx.json(new Success({ msg: "删除权限成功" }));
  }
);

export { admin };
