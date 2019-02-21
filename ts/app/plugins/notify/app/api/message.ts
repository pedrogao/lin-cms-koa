import {
  Redprint,
  loginRequired,
  paginate,
  NotFound,
  Success
} from "lin-cms-test";
import { getSafeParamId } from "../../../../libs/util";
import { IdsForm } from "../forms";
import { MessageDao } from "../dao/message";

const messageApi = new Redprint({
  prefix: "/message"
});

const messageDao = new MessageDao();

messageApi.redGet(
  "getMessages",
  "/",
  { auth: "获得推送的消息", module: "推送", mount: false },
  loginRequired,
  async ctx => {
    const { start, count } = paginate(ctx);
    const { messages, total } = await messageDao.getMessages(ctx, start, count);
    if (total < 1) {
      throw new NotFound({ msg: "未找到任何消息" });
    }
    ctx.json({
      collection: messages,
      total_nums: total
    });
  }
);

messageApi.redPut(
  "readMessage",
  "/one/:id",
  { auth: "标记一条消息为已读", module: "推送", mount: false },
  loginRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    await messageDao.readMessage(id);
    ctx.json(new Success({ msg: "操作成功" }));
  }
);

messageApi.redPut(
  "readMessages",
  "/some",
  { auth: "标记多条消息为已读", module: "推送", mount: false },
  loginRequired,
  async ctx => {
    const form = new IdsForm(ctx).validate();
    await messageDao.readMessages(form);
    ctx.json(new Success({ msg: "操作成功" }));
  }
);

messageApi.redDelete(
  "deleteMessage",
  "/:id",
  { auth: "删除一条消息", module: "推送", mount: false },
  loginRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    await messageDao.deleteMessage(id);
    ctx.json(new Success({ msg: "操作成功" }));
  }
);

messageApi.get("/test", async ctx => {
  ctx.json({ msg: "hello baby!" });
});

export { messageApi };
