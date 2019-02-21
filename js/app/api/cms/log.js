"use strict";

const {
  Redprint,
  groupRequired,
  NotFound,
  ParametersException,
  paginate
} = require("lin-cms-test");
const {
  LogFindForm
} = require("../../validators/forms");
const {
  get
} = require("lodash");
const {
  LogDao
} = require("../../dao/cms/log");

const log = new Redprint({
  prefix: "/log"
});

exports.log = log;

const logDao = new LogDao();

log.redGet("getLogs", "/", {
  auth: "查询所有日志",
  module: "日志",
  mount: true
}, groupRequired, async (ctx) => {
  const form = new LogFindForm(ctx).validate();
  const {
    start,
    count
  } = paginate(ctx);
  const {
    logs,
    total
  } = await logDao.getLogs(form, start, count);
  if (total < 1) {
    throw new NotFound({
      msg: "没有找到相关日志"
    });
  }
  ctx.json({
    total_nums: total,
    collection: logs
  });
});

log.redGet("getUserLogs", "/search", {
  auth: "搜索日志",
  module: "日志",
  mount: true
}, groupRequired, async (ctx) => {
  const keyword = get(ctx.request.query, "keyword");
  if (!keyword || keyword === "") {
    throw new ParametersException({
      msg: "搜索关键字不可为空"
    });
  }
  const form = new LogFindForm(ctx).validate();
  const {
    start,
    count
  } = paginate(ctx);
  const {
    logs,
    total
  } = await logDao.searchLogs(form, start, count, keyword);
  if (total < 1) {
    throw new NotFound({
      msg: "没有找到相关日志"
    });
  }
  ctx.json({
    total_nums: total,
    collection: logs
  });
});

log.redGet("getUsers", "/users", {
  auth: "查询日志记录的用户",
  module: "日志",
  mount: true
}, groupRequired, async (ctx) => {
  const {
    start,
    count
  } = paginate(ctx);
  const arr = await logDao.getUserNames(start, count);
  ctx.json(arr);
});