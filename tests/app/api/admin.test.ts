import request from "supertest";
import { createApp } from "../../../src/app/app";
import Koa from "koa";
import { getToken } from "./util";

let app: Koa;

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  app.context.db.close();
});

test("测试/cms/admin/authority，获取所有权限", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/admin/authority")
    .auth(token, { type: "bearer" });
  // console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/cms/admin/users，查询所有用户", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/admin/users?group_id=1")
    .auth(token, { type: "bearer" });
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("total_nums");
});

test("测试/cms/admin/password/3，修改用户密码用户", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/admin/password/3")
    .auth(token, { type: "bearer" })
    .send({
      new_password: "123456",
      confirm_password: "123456"
    });
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "密码修改成功");
});

test("测试/cms/admin/3，更新用户", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/admin/3")
    .auth(token, { type: "bearer" })
    .send({
      group_id: 1,
      email: "124578768@qq.com"
    });
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "操作成功");
});

test("测试/cms/admin/3，删除用户", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .delete("/cms/admin/3")
    .auth(token, { type: "bearer" });
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "操作成功");
});
