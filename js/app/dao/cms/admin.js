/* eslint-disable new-cap */
"use strict";

const {
  set,
  get,
  has
} = require("lodash");
const {
  UserSuper,
  NotFound,
  ParametersException,
  Forbidden,
  findMetaByAuth
} = require("lin-cms-test");
const {
  createQueryBuilder,
  getManager,
  getConnection
} = require("typeorm");

class AdminDao {
  async getUsers (ctx, groupId, start, count) {
    let condition = {
      super: UserSuper.COMMON
    };
    groupId && set(condition, "group_id", groupId);
    const [users, total] = await createQueryBuilder(ctx.manager.userModel, "user")
      .where(Object.assign({}, condition))
      .leftJoinAndMapOne("user.group", ctx.manager.groupModel, "group", "group.id = user.group_id")
      .skip(start)
      .take(count)
      .getManyAndCount();
    users.forEach(user => {
      set(user, "groupName", get(user, "group.name", ""));
    });
    return {
      users,
      total
    };
  }

  async changeUserPassword (ctx, form, id) {
    const user = await ctx.manager.userModel.findOne({
      id: id,
      deleteTime: null
    });
    if (!user) {
      throw new NotFound({
        msg: "用户不存在"
      });
    }
    user.resetPassword(form.newPassword);
    user.save();
  }

  async deleteUser (ctx, id) {
    const user = await ctx.manager.userModel.findOne({
      id: id,
      deleteTime: null
    });
    if (!user) {
      throw new NotFound({
        msg: "用户不存在"
      });
    }
    // 推荐调用软删除，即下面注释代码
    user.softDelete();
    // 直接从数据库中删除
    // await getConnection()
    //   .createQueryBuilder()
    //   .delete()
    //   .from(ctx.manager.userModel)
    //   .where("id = :id", { id: id })
    //   .execute();
  }

  async updateUserInfo (ctx, form, id) {
    const user = await ctx.manager.userModel.findOne({
      id: id,
      deleteTime: null
    });
    if (!user) {
      throw new NotFound({
        msg: "用户不存在"
      });
    }
    if (user.email !== form.email) {
      const exit = await ctx.manager.userModel.findOne({
        email: form.email,
        deleteTime: null
      });
      if (exit) {
        throw new ParametersException({
          msg: "邮箱已被注册，请重新输入邮箱"
        });
      }
    }
    user.groupId = form.groupId;
    user.email = form.email;
    user.save();
  }

  async getGroups (ctx, start, count) {
    const [groups, total] = await createQueryBuilder(ctx.manager.groupModel, "group")
      .leftJoinAndMapMany("group.auths", ctx.manager.authModel, "auth", "auth.group_id = group.id")
      .skip(start)
      .take(count)
      .getManyAndCount();
    groups.forEach(group => {
      this.formatAuths(group);
    });
    return {
      groups,
      total
    };
  }

  async getGroup (ctx, id) {
    const group = await createQueryBuilder(ctx.manager.groupModel, "group")
      .where("group.id = :id", {
        id
      })
      .leftJoinAndMapMany("group.auths", ctx.manager.authModel, "auth", "auth.group_id = group.id")
      .getOne();
    this.formatAuths(group);
    return group;
  }

  async createGroup (ctx, form) {
    const exit = await ctx.manager.groupModel.findOne({
      name: form.name
    });
    if (exit) {
      throw new Forbidden({
        msg: "分组已存在，不可创建同名分组"
      });
    }
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const group = new ctx.manager.groupModel();
        group.name = form.name;
        group.info = form.info;
        await transactionalEntityManager.save(group);
        form.auths.forEach(async (item) => {
          const au = new ctx.manager.authModel();
          const {
            auth,
            module
          } = findMetaByAuth(item);
          au.auth = auth;
          au.module = module;
          au.groupId = group.id;
          await transactionalEntityManager.save(au);
        });
      });
    } catch (error) {
      return false;
    }
    return true;
  }

  async updateGroup (ctx, form, id) {
    const exit = await ctx.manager.groupModel.findOne(id);
    if (!exit) {
      throw new NotFound({
        msg: "分组不存在，更新失败"
      });
    }
    exit.name = form.name;
    exit.info = form.info;
    exit.save();
  }

  async deleteGroup (ctx, id) {
    const exit = await ctx.manager.groupModel.findOne({
      id
    });
    if (!exit) {
      throw new NotFound({
        msg: "分组不存在，删除失败"
      });
    }
    const user = await ctx.manager.userModel.findOne({
      groupId: id
    });
    if (user) {
      throw new Forbidden({
        msg: "分组下存在用户，不可删除"
      });
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ctx.manager.groupModel)
      .where("id = :id", {
        id: id
      })
      .execute();
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ctx.manager.authModel)
      .where("group_id = :id", {
        id: id
      })
      .execute();
  }

  async dispatchAuth (ctx, form) {
    const group = await ctx.manager.groupModel.findOne({
      id: form.groupId
    });
    if (!group) {
      throw new NotFound({
        msg: "分组不存在"
      });
    }
    const one = await ctx.manager.authModel.findOne({
      groupId: form.groupId,
      auth: form.auth
    });
    if (one) {
      throw new Forbidden({
        msg: "已有权限，不可重复添加"
      });
    }
    const au = new ctx.manager.authModel();
    const {
      auth,
      module
    } = findMetaByAuth(form.auth);
    au.auth = auth;
    au.module = module;
    au.groupId = form.groupId;
    await au.save();
  }

  async dispatchAuths (ctx, form) {
    const group = await ctx.manager.groupModel.findOne({
      id: form.groupId
    });
    if (!group) {
      throw new NotFound({
        msg: "分组不存在"
      });
    }
    form.auths.forEach(async (item) => {
      const one = await ctx.manager.authModel.findOne({
        groupId: form.groupId,
        auth: item
      });
      if (!one) {
        const au = new ctx.manager.authModel();
        const {
          auth,
          module
        } = findMetaByAuth(item);
        au.auth = auth;
        au.module = module;
        au.groupId = form.groupId;
        await au.save();
      }
    });
  }

  async removeAuths (ctx, form) {
    const group = await ctx.manager.groupModel.findOne({
      id: form.groupId
    });
    if (!group) {
      throw new NotFound({
        msg: "分组不存在"
      });
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ctx.manager.authModel)
      .where("auth in (:auths)", {
        auths: form.auths
      })
      .andWhere("group_id = :id", {
        id: form.groupId
      })
      .execute();
  }

  formatAuths (group) {
    if (has(group, "auths")) {
      const aus = get(group, "auths");
      let tmp = {};
      aus.forEach(au => {
        if (!has(tmp, au["module"])) {
          tmp[au["module"]] = [{
            auth: au["auth"],
            module: au["module"]
          }];
        } else {
          tmp[au["module"]].push({
            auth: au["auth"],
            module: au["module"]
          });
        }
      });
      const aus1 = Object.keys(tmp).map(key => {
        let tm1 = Object.create(null);
        set(tm1, key, tmp[key]);
        return tm1;
      });
      set(group, "auths", aus1);
    }
  }
}

exports.AdminDao = AdminDao;