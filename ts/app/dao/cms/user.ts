import { IRouterContext } from "koa-router";
import { RegisterForm, UpdateInfoForm } from "../../validators/forms";
import {
  RepeatException,
  UserInterface,
  ParametersException
} from "lin-cms-test";
import { has, set } from "lodash";

export class UserDao {
  async createUser(ctx: IRouterContext, form: RegisterForm) {
    let user = await ctx.manager!.userModel.findOne({
      nickname: form.nickname
    });
    if (user) {
      throw new RepeatException({ msg: "用户名重复，请重新输入" });
    }
    if (form.email && form.email.trim() !== "") {
      // todo Not(null)
      user = await ctx.manager!.userModel.findOne({ email: form.email });
      if (user) {
        throw new RepeatException({ msg: "注册邮箱重复，请重新输入" });
      }
    }
    this.registerUser(ctx, form);
  }

  async updateUser(ctx: IRouterContext, form: UpdateInfoForm) {
    let user: UserInterface = ctx.currentUser!;
    if (user.email !== form.email) {
      const exit = await ctx.manager!.userModel.findOne({ email: form.email });
      if (exit) {
        throw new ParametersException({ msg: "邮箱已被注册，请重新输入邮箱" });
      }
    }
    user.email = form.email;
    // tslint:disable-next-line: no-floating-promises
    user.save();
  }

  async getAuths(ctx: IRouterContext) {
    let user: UserInterface = ctx.currentUser!;
    let auths = await ctx.manager!.authModel.find({ groupId: user.groupId });
    const aus = this.splitAuths(auths);
    set(user, "auths", aus);
    return user;
  }

  private splitAuths(auths: any) {
    let tmp = {};
    auths.forEach(au => {
      if (!has(tmp, au["module"])) {
        tmp[au["module"]] = [{ module: au["module"], auth: au["auth"] }];
      } else {
        tmp[au["module"]].push({ module: au["module"], auth: au["auth"] });
      }
    });
    const aus = Object.keys(tmp).map(key => {
      let tm1 = Object.create(null);
      set(tm1, key, tmp[key]);
      return tm1;
    });
    return aus;
  }

  private registerUser(ctx: IRouterContext, form: RegisterForm) {
    const user: UserInterface = new ctx.manager!.userModel();
    user.nickname = form.nickname;
    user.password = form.password;
    user.groupId = form.groupId;
    if (form.email && form.email.trim() !== "") {
      user.email = form.email;
    }
    // tslint:disable-next-line: no-floating-promises
    user.save();
  }
}
