import { createApp } from "../../../ts/app/app";
import Koa from "koa";
import { User, UserSuper } from "lin-cms-test";

describe("book.test.ts", () => {
  let app: Koa;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(() => {
    setTimeout(() => {
      app.context.db.close();
    }, 500);
  });

  test("添加超级管理员", async () => {
    const user: User = new app.context.manager.userModel();
    user.nickname = "super";
    user.password = "123456";
    user.super = UserSuper.SUPER;
    await user.save();
    expect(user).not.toBe(undefined);
  });
});
