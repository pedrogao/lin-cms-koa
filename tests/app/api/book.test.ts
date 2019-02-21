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

test("测试/v1/book/，新建图书", async () => {
  const token = getToken();
  const response = await request(app.callback())
    .post("/v1/book/")
    .send({
      title: "瓜皮是怎么炼成的",
      author: "pedro",
      image: "https://img3.doubanio.com/lpic/s1470003.jpg",
      summary:
        "从程序员的视角，看计算机系统！本书适用于那些想要写出更快、更可靠程序的程序员。通过掌握程序是如何映射到系统上，以及程序是如何执行的，读者能够更好的理解程序的行为为什么是这样的，以及效率低下是如何造成的。↵        粗略来看，计算机系统包括处理器和存储器硬件、编译器、操作系统和网络互连环境。而通过程序员的视角，读者可以清晰地明白学习计算机系统的内部工作原理会对他们今后作为计算机科学研究者和工程师"
    });
  console.log(response.body);
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
});

test("测试/v1/book/1，获取图书", async () => {
  const token = getToken();
  const response = await request(app.callback()).get("/v1/book/1");
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/v1/book/，获取所有图书", async () => {
  const token = getToken();
  const response = await request(app.callback()).get("/v1/book/");
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/v1/book/search，搜索图书", async () => {
  const response = await request(app.callback()).get("/v1/book/?q=C");
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.type).toMatch(/json/);
});

test("测试/v1/book/1，删除图书", async () => {
  const response = await request(app.callback()).delete("/v1/book/1");
  console.log(response.body);
  expect(response.status).toBe(201);
  expect(response.type).toMatch(/json/);
});
