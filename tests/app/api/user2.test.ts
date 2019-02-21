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

test("测试/cms/user/，用户更新自己的信息失败", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/user/")
    .auth(token, { type: "bearer" })
    .send({
      email: "1312342604@qq.com"
    });
  // console.log(response.body);
  expect(response.status).toBe(400);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "邮箱已被注册，请重新输入邮箱");
});

test("测试/cms/user/，用户更新自己的信息成功", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .put("/cms/user/")
    .auth(token, { type: "bearer" })
    .send({
      email: "pedrogao1996@gmail.com"
    });
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("msg", "操作成功");
});
