"use strict";

const dayjs = require("dayjs");
const {
  config,
  parseTemplate,
  MessageBroker
} = require("lin-cms-test");
const {
  Message
} = require("./model");
const {
  MessageIsPushed
} = require("./enums");

exports.broker = new MessageBroker(config.getItem("notify.retry"));
exports.MESSAGE_EVENTS = new Set();
exports.notify = (template, event, extra) => {
  exports.MESSAGE_EVENTS.add(event);
  return async (ctx, next) => {
    await next();
    pushMessage(template, event, ctx, extra);
  };
};

function pushMessage (template, event, ctx, extra) {
  const message = parseTemplate(template, ctx.currentUser, ctx.response, ctx.request);
  const now = new Date();
  exports.broker.addMessage(event, Object.assign({
    message,
    time: dayjs(now).unix()
  }, extra));
  const msg = new Message();
  msg.message = message;
  msg.event = event;
  msg._time = now;
  msg.pushed = MessageIsPushed.PUSHED;
  msg.userId = ctx.currentUser.id;
  msg.userName = ctx.currentUser.nickname;
  // tslint:disable-next-line: no-floating-promises
  msg.save();
}