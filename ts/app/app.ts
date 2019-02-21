import Koa from "koa";
import KoaBodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { config, log, error, Lin } from "lin-cms-test";
import { cms } from "./api/cms";
import { v1 } from "./api/v1";
import { Book } from "./models/book";

// 1. 必须最开始加载配置，因为其他很多扩展以来于配置
async function applyConfig(app: Koa) {
  if (process.env.NODE_ENV === "production") {
    config.getConfigFromFile("dist/app/config/setting.js");
    config.getConfigFromFile("dist/app/config/secure.js");
  } else {
    config.getConfigFromFile("ts/app/config/setting.ts");
    config.getConfigFromFile("ts/app/config/secure.ts");
  }
  config.initApp(app);
}

function applyCors(app: Koa) {
  // 跨域
  app.use(cors());
}

function applyBodyParse(app: Koa) {
  // 参数解析
  app.use(KoaBodyParser());
}

function registerRoutes(app: Koa) {
  app.use(cms.routes()).use(cms.allowedMethods());
  app.use(v1.routes()).use(v1.allowedMethods());
}

// 可选，是否创建数据库表，必须在lin初始化之后调用
async function synchronize(app: Koa) {
  await app.context.db.synchronize();
}

export async function createApp() {
  const app = new Koa();
  await applyConfig(app);
  applyCors(app);
  applyBodyParse(app);
  app.use(log);
  app.on("error", error);
  const lin = new Lin();
  // Book 为其它的模型
  await lin.initApp(app, true, true, null, null, null, Book);
  registerRoutes(app);
  await synchronize(app);
  return app;
}
