"use strict";

const Koa = require("koa");
const KoaBodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const {
  config,
  log,
  error,
  Lin
} = require("lin-cms-test");
const {
  cms
} = require("./api/cms");
const {
  v1
} = require("./api/v1");
const {
  Book
} = require("./models/book");
// 1. 必须最开始加载配置，因为其他很多扩展以来于配置
async function applyConfig (app) {
  config.getConfigFromFile("js/app/config/setting.js");
  config.getConfigFromFile("js/app/config/secure.js");
  config.initApp(app);
}

function applyCors (app) {
  // 跨域
  app.use(cors());
}

function applyBodyParse (app) {
  // 参数解析
  app.use(KoaBodyParser());
}

function registerRoutes (app) {
  app.use(cms.routes()).use(cms.allowedMethods());
  app.use(v1.routes()).use(v1.allowedMethods());
}
// 可选，是否创建数据库表，必须在lin初始化之后调用
async function synchronize (app) {
  await app.context.db.synchronize();
}
async function createApp () {
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

exports.createApp = createApp;