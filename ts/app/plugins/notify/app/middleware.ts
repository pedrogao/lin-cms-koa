import { IRouterContext } from "koa-router";
import dayjs from "dayjs";
import { config, MessageBroker, parseTemplate } from "lin-cms-test";
import { Message } from "./model";
import { MessageIsPushed } from "./enums";

export const broker = new MessageBroker(config.getItem("notify.retry"));

export const MESSAGE_EVENTS = new Set();

export const notify = (template: string, event: string, extra?: {}) => {
  MESSAGE_EVENTS.add(event);
  return async (ctx: IRouterContext, next: () => Promise<any>) => {
    await next();
    pushMessage(template, event, ctx, extra);
  };
};

function pushMessage(
  template: string,
  event: string,
  ctx: IRouterContext,
  extra?: {}
) {
  const message = parseTemplate(
    template,
    ctx.currentUser!,
    ctx.response,
    ctx.request
  );
  const now = new Date();
  broker.addMessage(event, {
    message,
    time: dayjs(now).unix(),
    ...extra
  });
  const msg = new Message();
  msg.message = message;
  msg.event = event;
  msg._time = now;
  msg.pushed = MessageIsPushed.PUSHED;
  msg.userId = ctx.currentUser!.id;
  msg.userName = ctx.currentUser!.nickname;
  // tslint:disable-next-line: no-floating-promises
  msg.save();
}
