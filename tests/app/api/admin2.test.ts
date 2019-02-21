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

test("测试/cms/admin/groups，查询所有权限组及其权限", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/admin/groups")
    .auth(token, { type: "bearer" });
  // console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});
