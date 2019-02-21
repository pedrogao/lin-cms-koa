"use strict";

const {
  Redprint,
  groupRequired,
  SSE,
  adminRequired,
  Success
} = require("lin-cms-test");
const dayjs = require("dayjs");
const {
  EventsForm
} = require("../forms");
const {
  broker,
  notify,
  MESSAGE_EVENTS
} = require("../middleware");
const {
  EventDao
} = require("../dao/event");

const sseApi = new Redprint({
  prefix: "/sse"
});
exports.sseApi = sseApi;

const eventDao = new EventDao();

sseApi.redGet("stream", "/", {
  auth: "消息推送",
  module: "推送",
  mount: true
}, groupRequired, async (ctx) => {
  // tslint:disable-next-line: no-empty
  ctx.req.setTimeout(Number.MAX_VALUE, () => {});
  ctx.type = "text/event-stream; charset=utf-8";
  ctx.set("Cache-Control", "no-cache");
  ctx.set("Connection", "keep-alive");
  const body = (ctx.body = new SSE());
  let interval = setInterval(() => {
    if (broker.exitMessage()) {
      body.write(broker.pop());
    } else {
      body.write(broker.heartbeat());
    }
  }, 2000);
  body.on("close", (...args) => {
    clearInterval(interval);
  });
  const socket = ctx.socket;
  socket.on("error", close);
  socket.on("close", close);

  function close () {
    socket.removeListener("error", close);
    socket.removeListener("close", close);
  }
});
sseApi.get("/test", async (ctx) => {
  // 不想记录到数据库，只想单纯的推送
  broker.addMessage("test", {
    message: "就是想测试一下你是否是一个瓜皮",
    time: dayjs(new Date()).unix()
  });
  ctx.json({
    msg: "添加消息成功！"
  });
});
sseApi.redGet("getEvents", "/events", {
  auth: "获得events",
  module: "推送",
  mount: true
}, groupRequired, notify("测试一条消息", "test"), async (ctx) => {
  const currentUser = ctx.currentUser;
  if (currentUser.isSuper) {
    ctx.json({
      events: Array.from(MESSAGE_EVENTS.values())
    });
    return;
  }
  const events = await eventDao.getEvents(currentUser.groupId);
  ctx.json({
    events
  });
});
sseApi.redPost("createEvents", "/events", {
  auth: "创建events",
  module: "推送",
  mount: false
}, adminRequired, async (ctx) => {
  const form = new EventsForm(ctx).validate();
  await eventDao.createEvents(form);
  ctx.json(new Success({
    msg: "创建成功"
  }));
});
sseApi.redPut("putEvents", "/events", {
  auth: "更新events",
  module: "推送",
  mount: false
}, adminRequired, async (ctx) => {
  const form = new EventsForm(ctx).validate();
  await eventDao.updateEvents(form);
  ctx.json(new Success({
    msg: "更新成功"
  }));
});