import request from "supertest";
import { createApp } from "../../../ts/app/app";
import Koa from "koa";
import { getToken } from "./util";

let app: Koa;

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  setTimeout(() => {
    app.context.db.close();
  }, 500);
});

test("测试/cms/test/json，生成日志", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/test/json")
    .auth(token, { type: "bearer" });
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/cms/log/，查询所有日志", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/log/?start=2019-02-17 08:52:10&end=2019-02-17 08:52:30")
    .auth(token, { type: "bearer" });
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/cms/log/users，查询所有日志记录的用户", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/log/users")
    .auth(token, { type: "bearer" });
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});
