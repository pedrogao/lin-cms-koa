"use strict";

const {
  Redprint,
  getTokens,
  loginRequired,
  Success,
  refreshTokenRequired,
  Failed,
  jwt
} = require("lin-cms-test");

const {
  RegisterForm,
  LoginForm,
  UpdateInfoForm,
  ChangePasswordForm
} = require("../../validators/forms");

const {
  UserDao
} = require("../../dao/cms/user");

const user = new Redprint({
  prefix: "/user"
});

exports.user = user;

const userDao = new UserDao();

user.redPost("userRegister", "/register", {
  auth: "注册",
  module: "用户",
  mount: false
}, async (ctx) => {
  const form = new RegisterForm(ctx).validate();
  // const data = ctx.validate(registerForm);
  await userDao.createUser(ctx, form);
  ctx.json(new Success({
    msg: "用户创建成功"
  }));
});

user.redPost("userLogin", "/login", {
  auth: "登陆",
  module: "用户",
  mount: false
}, async (ctx) => {
  const form = new LoginForm(ctx).validate();
  let user = await ctx.manager.userModel.verify(form.nickname, form.password);
  const {
    accessToken,
    refreshToken
  } = getTokens(user);
  ctx.json({
    access_token: accessToken,
    refresh_token: refreshToken
  });
});

user.redPut("userUpdate", "/", {
  auth: "用户更新信息",
  module: "用户",
  mount: false
}, loginRequired, async (ctx) => {
  const form = new UpdateInfoForm(ctx).validate();
  await userDao.updateUser(ctx, form);
  ctx.json(new Success({
    msg: "操作成功"
  }));
});

user.redPut("userUpdatePassword", "/change_password", {
  auth: "修改密码",
  module: "用户",
  mount: false
}, loginRequired, async (ctx) => {
  const form = new ChangePasswordForm(ctx).validate();
  let user = ctx.currentUser;
  const ok = user.changePassword(form.oldPassword, form.newPassword);
  if (ok) {
    // tslint:disable-next-line: no-floating-promises
    user.save();
    ctx.json(new Success({
      msg: "密码修改成功"
    }));
  } else {
    ctx.json(new Failed({
      msg: "修改密码失败"
    }));
  }
});

user.redGet("userGetToken", "/refresh", {
  auth: "刷新令牌",
  module: "用户",
  mount: false
}, refreshTokenRequired, async (ctx) => {
  let user = ctx.currentUser;
  const accessToken = jwt.createAccessToken(user.id);
  ctx.json({
    access_token: accessToken
  });
});

user.redGet("userGetAuths", "/auths", {
  auth: "查询自己拥有的权限",
  module: "用户",
  mount: false
}, loginRequired, async (ctx) => {
  let user = await userDao.getAuths(ctx);
  ctx.json(user);
});