import request from "supertest";
import { createApp } from "../../../ts/app/app";
import Koa from "koa";

describe("test.test.ts", () => {
  let app: Koa;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(() => {
    app.context.db.close();
  });

  test("测试/cms/test/", async () => {
    console.log(app);
    const response = await request(app.callback()).get("/cms/test/");
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });

  test("测试/cms/test/json", async () => {
    const response = await request(app.callback()).get("/cms/test/json");
    expect(response.status).toBe(401);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty(
      "msg",
      "认证失败，请检查请求令牌是否正确"
    );
  });

  test("测试/cms/test/info", async () => {
    const response = await request(app.callback()).get("/cms/test/info");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "msg",
      "认证失败，请检查请求令牌是否正确"
    );
  });
});
