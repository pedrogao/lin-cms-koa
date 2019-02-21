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

test("测试/cms/user/refresh", async () => {
  const token = getToken("refresh_token");
  const response = await request(app.callback())
    .get("/cms/user/refresh")
    .auth(token, { type: "bearer" });
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
  expect(response.body).toHaveProperty("access_token");
});

test("测试/cms/user/auths", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .get("/cms/user/auths")
    .auth(token, { type: "bearer" });
  console.log(response.body);
  expect(response.status).toBe(200);
});
