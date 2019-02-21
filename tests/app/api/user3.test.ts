import request from "supertest";
import { createApp } from "../../../ts/app/app";
import Koa from "koa";
import { getToken } from "./util";

let app: Koa;

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  app.context.db.close();
});

test("测试/cms/user/change_password，用户更新自己的密码，输入密码错误", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/user/change_password")
    .auth(token, { type: "bearer" })
    .send({
      newPassword: "147258",
      oldPassword: "123456",
      confirmPassword: "147258"
    });
  expect(response.status).toBe(400);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "修改密码失败");
});

test("测试/cms/user/change_password，用户更新自己的密码，输入密码正确", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/user/change_password")
    .auth(token, { type: "bearer" })
    .send({
      newPassword: "123456",
      oldPassword: "147258",
      confirmPassword: "123456"
    });
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "密码修改成功");
});
