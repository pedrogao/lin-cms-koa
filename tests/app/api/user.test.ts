import request from "supertest";
import { createApp } from "../../../src/app/app";
import Koa from "koa";
import { saveTokens } from "./util";

let app: Koa;

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  app.context.db.close();
});

// test("测试/cms/user/register，输入密码不一致的情况", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/register")
//     .send({
//       nickname: "pedro",
//       groupId: 1,
//       password: "123456",
//       confirmPassword: "123455"
//     });
//   // console.log(response.body);
//   expect(response.status).toBe(400);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty(
//     "msg",
//     "两次输入的密码不一致，请输入相同的密码"
//   );
// });

// test("测试/cms/user/register，不输入email的情况，且用户名重复", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/register")
//     .send({
//       nickname: "pedro",
//       groupId: 1,
//       password: "123456",
//       confirmPassword: "123456"
//     });
//   // console.log(response.body);
//   expect(response.status).toBe(400);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty("msg", "用户名重复，请重新输入");
// });

// test("测试/cms/user/register，输入email，且email存在的情况", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/register")
//     .send({
//       nickname: "pedro2",
//       groupId: 1,
//       password: "123456",
//       confirmPassword: "123456",
//       email: "1312342604@qq.com"
//     });
//   // console.log(response.body);
//   expect(response.status).toBe(400);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty("msg", "注册邮箱重复，请重新输入");
// });

// test("测试/cms/user/register，输入email的错误情况", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/register")
//     .send({
//       nickname: "pedro1",
//       groupId: 1,
//       password: "123456",
//       confirmPassword: "123456",
//       email: "1312342604qq.com"
//     });
//   // console.log(response.body);
//   expect(response.status).toBe(400);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty(
//     "msg",
//     "电子邮箱不符合规范，请输入正确的邮箱"
//   );
// });

// test("测试/cms/user/login，输入密码错误", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/login")
//     .send({
//       nickname: "pedro1",
//       password: "1234567"
//     });
//   expect(response.status).toBe(401);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty("msg", "密码错误，请输入正确密码");
// });

// test("测试/cms/user/login，用户不存在", async () => {
//   const response = await request(app.callback())
//     .post("/cms/user/login")
//     .send({
//       nickname: "pedro2",
//       password: "123456"
//     });
//   expect(response.status).toBe(404);
//   expect(response.type).toMatch(/json/);
//   expect(response.body).toHaveProperty("msg", "用户不存在");
// });

test("测试/cms/user/login，正确登陆获取令牌", async () => {
  const response = await request(app.callback())
    .post("/cms/user/login")
    .send({
      nickname: "pedro",
      password: "147258"
    });
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
  saveTokens(response.body);
  expect(response.body).toHaveProperty("access_token");
});
